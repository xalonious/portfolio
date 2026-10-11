import type { AchievementEngine } from "./engine"
import type { AchievementUnlock } from "./types"

const EMPTY_QUEUE: readonly AchievementUnlock[] = Object.freeze([])

export class AchievementNotificationQueue {
  private items: readonly AchievementUnlock[] = EMPTY_QUEUE
  private readonly listeners = new Set<() => void>()
  private readonly unsubscribe: () => void
  private readonly unsubscribeReset: () => void

  constructor(engine: AchievementEngine) {
    this.unsubscribe = engine.onUnlock(unlock => {
      this.items = [...this.items, unlock]
      this.notify()
    })
    this.unsubscribeReset = engine.onReset(() => {
      this.items = EMPTY_QUEUE
      this.notify()
    })
  }

  getSnapshot = (): readonly AchievementUnlock[] => this.items
  getServerSnapshot = (): readonly AchievementUnlock[] => EMPTY_QUEUE

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  complete = (id: string): void => {
    if (this.items[0]?.achievement.id !== id) return
    this.items = this.items.slice(1)
    this.notify()
  }

  dispose = (): void => {
    this.unsubscribe()
    this.unsubscribeReset()
    this.listeners.clear()
    this.items = EMPTY_QUEUE
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try { listener() } catch {}
    }
  }
}
