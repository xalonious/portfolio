import { AchievementEngine, EMPTY_ACHIEVEMENT_PROGRESS } from "./engine"
import { AchievementNotificationQueue } from "./notifications"
import { achievementRegistry, configurePublishedCaseStudies, customAchievementHandlers } from "./registry"
import { ACHIEVEMENT_RECOVERY_KEY, ACHIEVEMENT_STORAGE_KEY, createAchievementStorage } from "./storage"

export { achievementRegistry } from "./registry"
export type { AchievementDefinition, AchievementProgress, AchievementRarity, AchievementState, CustomAchievementHandler } from "./types"

type AchievementRuntime = {
  engine: AchievementEngine
  notifications: AchievementNotificationQueue
}

let runtime: AchievementRuntime | undefined

export function getAchievementRuntime(): AchievementRuntime | undefined {
  if (typeof window === "undefined") return undefined
  if (!runtime) {
    const engine = new AchievementEngine(
      achievementRegistry,
      createAchievementStorage(() => window.localStorage),
      customAchievementHandlers,
    )
    runtime = { engine, notifications: new AchievementNotificationQueue(engine) }
    engine.onUnlock(({ achievement }) => {
      if (achievement.id === "cheater-cheater") {
        console.log(`[whoisxander.dev] Suspicious activity detected.

You really thought I wouldn't notice?

Achievement unlocked: Cheater, Cheater!`)
      }
    })
  }
  runtime.engine.refreshStorage()
  return runtime
}

export function listenForAchievementStorage(engine: AchievementEngine): () => void {
  if (typeof window === "undefined") return () => {}
  const check = () => { engine.refreshStorage() }
  const onStorage = (event: StorageEvent) => {
    try {
      if (event.storageArea !== window.localStorage) return
      if (event.key === null || event.key === ACHIEVEMENT_STORAGE_KEY || event.key === ACHIEVEMENT_RECOVERY_KEY) check()
    } catch {}
  }
  const onVisibility = () => { if (document.visibilityState === "visible") check() }
  window.addEventListener("storage", onStorage)
  window.addEventListener("focus", check)
  window.addEventListener("pageshow", check)
  document.addEventListener("visibilitychange", onVisibility)
  check()
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("focus", check)
    window.removeEventListener("pageshow", check)
    document.removeEventListener("visibilitychange", onVisibility)
  }
}

export function emitAchievementEvent(name: string, payload: Readonly<Record<string, unknown>> = {}): void {
  getAchievementRuntime()?.engine.emit(name, payload)
}

export function updatePublishedCaseStudies(ids: readonly string[]): void {
  if (typeof window === "undefined") return
  configurePublishedCaseStudies(ids)
  getAchievementRuntime()?.engine.emit("published_case_studies_updated")
}

export function isAchievementUnlocked(id: string): boolean {
  return getAchievementRuntime()?.engine.isUnlocked(id) ?? false
}

export function getAchievementProgress(id: string) {
  return getAchievementRuntime()?.engine.getProgress(id) ?? EMPTY_ACHIEVEMENT_PROGRESS
}

export function unlockAchievement(id: string): boolean {
  return getAchievementRuntime()?.engine.unlock(id) ?? false
}

