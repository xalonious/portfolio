import { achievementRegistry, getAchievementRuntime } from "./index"

type AchievementDevtools = Readonly<{
  list: () => { id: string; name: string; unlocked: boolean }[]
  unlock: (id: string) => boolean
  unlockAll: () => number
}>

declare global {
  interface Window {
    devAchievements?: AchievementDevtools
  }
}

let hintPrinted = false

export function installAchievementDevtools(): () => void {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return () => {}
  const previous = Object.getOwnPropertyDescriptor(window, "devAchievements")
  if (previous && !previous.configurable) return () => {}

  const api: AchievementDevtools = Object.freeze({
    list() {
      const engine = getAchievementRuntime()?.engine
      const entries = achievementRegistry.map(({ id, name }) => ({ id, name, unlocked: engine?.isUnlocked(id) ?? false }))
      console.table(entries)
      return entries
    },
    unlock(id: string) {
      if (!achievementRegistry.some(achievement => achievement.id === id)) {
        console.warn(`[devAchievements] Unknown achievement: ${id}. Run devAchievements.list() for IDs.`)
        return false
      }
      return getAchievementRuntime()?.engine.unlock(id) ?? false
    },
    unlockAll() {
      const engine = getAchievementRuntime()?.engine
      if (!engine) return 0
      const before = achievementRegistry.filter(achievement => engine.isUnlocked(achievement.id)).length
      for (const achievement of achievementRegistry) {
        if (achievement.id !== "touch-grass") engine.unlock(achievement.id)
      }
      return achievementRegistry.filter(achievement => engine.isUnlocked(achievement.id)).length - before
    },
  })
  Object.defineProperty(window, "devAchievements", { value: api, configurable: true, writable: true })
  if (!hintPrinted) {
    console.info("[development] devAchievements.list(), devAchievements.unlock('id'), devAchievements.unlockAll()")
    hintPrinted = true
  }
  return () => {
    if (window.devAchievements !== api) return
    if (previous) Object.defineProperty(window, "devAchievements", previous)
    else delete window.devAchievements
  }
}
