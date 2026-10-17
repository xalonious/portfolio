import { ACHIEVEMENT_TAMPER_EVENT, EMPTY_ACHIEVEMENT_STATE, freezeAchievementState, type AchievementStorage, type StorageLoadResult } from "./storage"
import type {
  AchievementDefinition, AchievementInput, AchievementProgress, AchievementState,
  AchievementUnlock, CustomAchievementHandler,
} from "./types"

export const EMPTY_ACHIEVEMENT_PROGRESS: AchievementProgress = Object.freeze({})
const owns = (record: object, key: string) => Object.prototype.hasOwnProperty.call(record, key)

export class AchievementEngine {
  private state: AchievementState
  private readonly definitions: Map<string, AchievementDefinition>
  private readonly listeners = new Set<() => void>()
  private readonly unlockListeners = new Set<(unlock: AchievementUnlock) => void>()
  private readonly resetListeners = new Set<() => void>()
  private lastPath: string | undefined
  private pendingIntegrityFailure = false
  private refreshingStorage = false

  constructor(
    readonly registry: readonly AchievementDefinition[],
    private readonly storage?: AchievementStorage,
    private readonly handlers: Readonly<Record<string, CustomAchievementHandler>> = {},
    private readonly now: () => number = Date.now,
  ) {
    this.definitions = new Map()
    for (const definition of registry) {
      if (!definition.id || this.definitions.has(definition.id)) throw new Error(`Duplicate or empty achievement ID: ${definition.id}`)
      const trigger = definition.trigger
      if (trigger.type === "counter" && (!Number.isSafeInteger(trigger.target) || trigger.target <= 0)) throw new Error(`Invalid counter target: ${definition.id}`)
      if (trigger.type === "duration" && (!Number.isFinite(trigger.targetMs) || trigger.targetMs <= 0)) throw new Error(`Invalid duration target: ${definition.id}`)
      this.definitions.set(definition.id, definition)
    }
    const saved = storage?.load()
    this.state = saved?.state ?? EMPTY_ACHIEVEMENT_STATE
    this.pendingIntegrityFailure = saved?.status === "tampered"
  }

  getSnapshot = (): AchievementState => this.state

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  onUnlock = (listener: (unlock: AchievementUnlock) => void): (() => void) => {
    this.unlockListeners.add(listener)
    return () => { this.unlockListeners.delete(listener) }
  }

  onReset = (listener: () => void): (() => void) => {
    this.resetListeners.add(listener)
    return () => { this.resetListeners.delete(listener) }
  }

  refreshStorage = (): void => {
    if (this.refreshingStorage) return
    this.refreshingStorage = true
    try {
      const changed = this.storage?.inspect?.()
      if (changed) this.applyStorageResult(changed)
      if (this.pendingIntegrityFailure) {
        this.pendingIntegrityFailure = false
        this.process({ type: "event", name: ACHIEVEMENT_TAMPER_EVENT, payload: {} })
      }
    } finally {
      this.refreshingStorage = false
    }
  }

  reloadFromStorage = (): void => {
    if (!this.storage) return
    this.applyStorageResult(this.storage.load())
    this.refreshStorage()
  }

  reset = (): boolean => {
    if (this.storage && !this.storage.reset()) return false
    this.pendingIntegrityFailure = false
    this.applyStorageResult({ state: EMPTY_ACHIEVEMENT_STATE, status: "missing", raw: null })
    return true
  }

  private applyStorageResult(result: StorageLoadResult): void {
    if (result.status === "unavailable") return
    this.state = result.state
    this.lastPath = undefined
    this.pendingIntegrityFailure ||= result.status === "tampered"
    if (result.status === "missing") {
      this.pendingIntegrityFailure = false
      for (const listener of this.resetListeners) {
        try { listener() } catch {}
      }
    }
    for (const listener of this.listeners) {
      try { listener() } catch {}
    }
  }

  isUnlocked = (id: string): boolean => owns(this.state.unlocked, id)

  getProgress = (id: string): AchievementProgress =>
    owns(this.state.progress, id) ? this.state.progress[id] : EMPTY_ACHIEVEMENT_PROGRESS

  emit = (name: string, payload: Readonly<Record<string, unknown>> = {}): void => {
    this.process({ type: "event", name, payload })
  }

  visitRoute = (path: string): void => {
    this.refreshStorage()
    if (path === this.lastPath) return
    this.lastPath = path
    this.process({ type: "route", path })
  }

  unlock = (id: string, retry = true): boolean => {
    this.refreshStorage()
    if (!this.definitions.has(id) || this.isUnlocked(id)) return false
    const unlocked = { ...this.state.unlocked, [id]: this.now() }
    const newlyUnlocked = [id]
    this.resolveDependencies(unlocked, newlyUnlocked)
    if (this.commit({ ...this.state, unlocked }, newlyUnlocked)) return true
    return retry ? this.unlock(id, false) : false
  }

  private process(input: AchievementInput, retry = true): void {
    this.refreshStorage()
    const progress: Record<string, AchievementProgress> = Object.assign(Object.create(null), this.state.progress)
    const unlocked: Record<string, number> = Object.assign(Object.create(null), this.state.unlocked)
    const newlyUnlocked: string[] = []
    let changed = false

    for (const definition of this.registry) {
      if (owns(unlocked, definition.id)) continue
      const trigger = definition.trigger
      const previous = this.getProgress(definition.id)
      let next = previous
      let complete = false

      if (trigger.type === "route") {
        complete = input.type === "route" && input.path === trigger.path
      } else if (trigger.type === "custom") {
        try {
          const handler = owns(this.handlers, trigger.handler) ? this.handlers[trigger.handler] : undefined
          const result = handler?.({ input, progress: previous, config: trigger.config, isUnlocked: id => owns(unlocked, id) })
          next = result?.progress ?? previous
          complete = result?.unlocked === true
        } catch { continue }
      } else if (trigger.type !== "dependencies" && input.type === "event" && input.name === trigger.event) {
        switch (trigger.type) {
          case "event":
            complete = true
            break
          case "counter": {
            const count = Math.min(trigger.target, (previous.count ?? 0) + 1)
            next = { count }
            complete = count >= trigger.target
            break
          }
          case "collection": {
            const id = input.payload[trigger.idKey ?? "id"]
            if (typeof id !== "string" || !trigger.ids.includes(id)) break
            const ids = [...new Set([...(previous.ids ?? []), id])]
            if (ids.length !== previous.ids?.length) next = { ids }
            break
          }
          case "duration": {
            const milliseconds = input.payload[trigger.millisecondsKey ?? "milliseconds"]
            if (typeof milliseconds !== "number" || !Number.isFinite(milliseconds) || milliseconds <= 0) break
            const durationMs = Math.min(trigger.targetMs, (previous.durationMs ?? 0) + milliseconds)
            next = { durationMs }
            complete = durationMs >= trigger.targetMs
            break
          }
        }
      }

      if (trigger.type === "collection") {
        complete = trigger.ids.length > 0 && trigger.ids.every(id => next.ids?.includes(id))
      }

      if (next !== previous) {
        progress[definition.id] = next
        changed = true
      }
      if (complete) {
        unlocked[definition.id] = this.now()
        newlyUnlocked.push(definition.id)
      }
    }

    this.resolveDependencies(unlocked, newlyUnlocked)
    if ((changed || newlyUnlocked.length) && !this.commit({ ...this.state, progress, unlocked }, newlyUnlocked) && retry) {
      this.process(input, false)
    }
  }

  private resolveDependencies(unlocked: Record<string, number>, newlyUnlocked: string[]): void {
    let changed: boolean
    do {
      changed = false
      for (const definition of this.registry) {
        if (definition.trigger.type !== "dependencies" || owns(unlocked, definition.id)) continue
        const ids = "all" in definition.trigger
          ? this.registry.map(item => item.id).filter(id => id !== definition.id)
          : definition.trigger.ids.filter(id => id !== definition.id)
        if (ids.length === 0 || !ids.every(id => owns(unlocked, id))) continue
        unlocked[definition.id] = this.now()
        newlyUnlocked.push(definition.id)
        changed = true
      }
    } while (changed)
  }

  private commit(state: AchievementState, newlyUnlocked: string[]): boolean {
    const changed = this.storage?.save(state)
    if (changed) {
      this.applyStorageResult(changed)
      this.refreshStorage()
      return false
    }
    this.state = freezeAchievementState(state)
    for (const id of newlyUnlocked) {
      const unlock = { achievement: this.definitions.get(id)!, unlockedAt: this.state.unlocked[id] }
      for (const listener of this.unlockListeners) {
        try { listener(unlock) } catch {}
      }
    }
    for (const listener of this.listeners) {
      try { listener() } catch {}
    }
    return true
  }
}
