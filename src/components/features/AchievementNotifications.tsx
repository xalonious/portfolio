"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { getAchievementRuntime, listenForAchievementStorage, updatePublishedCaseStudies } from "@/lib/achievements"
import { trackVisibleTime } from "@/lib/achievements/activity"
import { watchSSHPortfolio } from "@/lib/achievements/ssh"
import { SSH_ACHIEVEMENT_ID } from "@/lib/achievements/ssh-config"
import { installAchievementConsole } from "@/lib/achievements/console"
import { createAchievementSound } from "@/lib/achievement-sound"
import type { AchievementEngine } from "@/lib/achievements/engine"
import type { AchievementNotificationQueue } from "@/lib/achievements/notifications"
import { achievementRarityColors } from "@/lib/achievements/presentation"
import { useAchievementPanel } from "./AchievementPanel"
import styles from "./AchievementNotifications.module.css"

const NOTIFICATION_MS = 4_500

function NotificationHost({ engine, queue }: { engine: AchievementEngine; queue: AchievementNotificationQueue }) {
  const { openPanel } = useAchievementPanel()
  const notifications = useSyncExternalStore(queue.subscribe, queue.getSnapshot, queue.getServerSnapshot)
  const active = notifications[0]
  const sound = useRef<ReturnType<typeof createAchievementSound> | null>(null)
  const lastPlayed = useRef<(typeof notifications)[number] | null>(null)

  useEffect(() => {
    const player = createAchievementSound()
    sound.current = player
    const stopListening = player.listen()
    return () => {
      stopListening()
      player.dispose()
      sound.current = null
    }
  }, [engine])

  useEffect(() => {
    if (!active) return
    const id = active.achievement.id
    if (lastPlayed.current !== active) {
      sound.current?.play()
      lastPlayed.current = active
    }
    const timer = setTimeout(() => queue.complete(id), NOTIFICATION_MS)
    return () => clearTimeout(timer)
  }, [active, queue])

  const achievement = active?.achievement
  const Icon = achievement?.icon

  return (
    <div className={styles.viewport} role="status" aria-live="polite" aria-atomic="true">
      {achievement && Icon && (
        <button
          key={achievement.id}
          type="button"
          onClick={openPanel}
          aria-label={`${achievement.name} unlocked. Open achievements`}
          aria-haspopup="dialog"
          className={styles.notification}
          style={{ borderLeftColor: achievementRarityColors[achievement.rarity] }}
        >
          <span className={styles.icon} style={{ color: achievementRarityColors[achievement.rarity] }} aria-hidden="true">
            <Icon size={23} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`${styles.label} block`}>Achievement Unlocked</span>
            <span className="mt-1 block font-display text-base font-semibold leading-snug text-foreground">{achievement.name}</span>
            <span className={`${styles.description} block`}>{achievement.description}</span>
          </span>
          <span className="sr-only">{achievement.rarity}</span>
        </button>
      )}
    </div>
  )
}

function WebsiteTimeTracker({ engine }: { engine: AchievementEngine }) {
  const unlocked = useSyncExternalStore(engine.subscribe, () => engine.isUnlocked("no-life"), () => false)
  useEffect(() => {
    if (unlocked) return
    const stopClock = trackVisibleTime(milliseconds => {
      if (engine.isUnlocked("no-life")) return
      engine.emit("website_visible_time", { milliseconds })
      if (engine.isUnlocked("no-life")) stopClock()
    })
    return stopClock
  }, [engine, unlocked])
  return null
}

function SSHConnectionTracker({ engine }: { engine: AchievementEngine }) {
  const unlocked = useSyncExternalStore(engine.subscribe, () => engine.isUnlocked(SSH_ACHIEVEMENT_ID), () => false)
  useEffect(() => {
    if (!unlocked) return watchSSHPortfolio(engine)
  }, [engine, unlocked])
  return null
}

export function AchievementNotifications({ publishedCaseStudyIds }: { publishedCaseStudyIds: readonly string[] }) {
  const pathname = usePathname()
  const [runtime, setRuntime] = useState<ReturnType<typeof getAchievementRuntime>>()

  useEffect(() => {
    updatePublishedCaseStudies(publishedCaseStudyIds)
    const current = getAchievementRuntime()
    setRuntime(current)
    const removeConsole = installAchievementConsole()
    const stopWatchingStorage = current ? listenForAchievementStorage(current.engine) : () => {}
    return () => {
      removeConsole()
      stopWatchingStorage()
    }
  }, [publishedCaseStudyIds])

  useEffect(() => {
    runtime?.engine.visitRoute(pathname)
  }, [pathname, runtime])

  return runtime ? <><WebsiteTimeTracker engine={runtime.engine} /><SSHConnectionTracker engine={runtime.engine} /><NotificationHost engine={runtime.engine} queue={runtime.notifications} /></> : null
}
