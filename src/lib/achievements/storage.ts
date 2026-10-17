import type { AchievementProgress, AchievementState, JsonValue } from "./types"
import { achievementChecksum } from "./integrity"

export const ACHIEVEMENT_STORAGE_KEY = "whoisxander:achievements"
export const ACHIEVEMENT_STORAGE_VERSION = 2
export const ACHIEVEMENT_TAMPER_EVENT = "achievement_save_tampered"

export const EMPTY_ACHIEVEMENT_STATE: AchievementState = Object.freeze({
  version: ACHIEVEMENT_STORAGE_VERSION,
  unlocked: Object.freeze({}),
  progress: Object.freeze({}),
  soundMuted: false,
})

export type StorageLoadResult = {
  state: AchievementState
  status: "missing" | "loaded" | "malformed" | "integrity-mismatch" | "tampered" | "unsupported-version" | "unavailable"
  raw: string | null
}

export type AchievementStorage = {
  load: () => StorageLoadResult
  inspect?: () => StorageLoadResult | undefined
  save: (state: AchievementState) => StorageLoadResult | undefined | void
  reset: () => boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every(key => keys.includes(key))
}

function isNonnegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true
  if (typeof value === "number") return Number.isFinite(value)
  if (Array.isArray(value)) return value.every(isJsonValue)
  return isRecord(value) && Object.values(value).every(isJsonValue)
}

function isProgress(value: unknown): value is AchievementProgress {
  if (!isRecord(value) || !hasOnlyKeys(value, ["count", "durationMs", "ids", "custom"])) return false
  if (value.count !== undefined && (!isNonnegativeNumber(value.count) || !Number.isSafeInteger(value.count))) return false
  if (value.durationMs !== undefined && !isNonnegativeNumber(value.durationMs)) return false
  if (value.ids !== undefined && (!Array.isArray(value.ids) || !value.ids.every(id => typeof id === "string") || new Set(value.ids).size !== value.ids.length)) return false
  return value.custom === undefined || isJsonValue(value.custom)
}

function isState(value: Record<string, unknown>): boolean {
  if (!hasOnlyKeys(value, ["version", "unlocked", "progress", "soundMuted"])) return false
  const latestTimestamp = Date.now() + 24 * 60 * 60 * 1000
  if (!isRecord(value.unlocked) || !Object.entries(value.unlocked).every(([id, time]) => id.length > 0 && isNonnegativeNumber(time) && Number.isSafeInteger(time) && time <= latestTimestamp)) return false
  if (!isRecord(value.progress) || !Object.entries(value.progress).every(([id, saved]) => id.length > 0 && isProgress(saved))) return false
  return typeof value.soundMuted === "boolean"
}

export function freezeAchievementState(state: AchievementState): AchievementState {
  function freeze(value: unknown): void {
    if (typeof value !== "object" || value === null || Object.isFrozen(value)) return
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  freeze(state)
  return state
}

export function encodeAchievementState(state: AchievementState): string {
  const payload = JSON.parse(JSON.stringify(state)) as AchievementState
  return JSON.stringify({ ...payload, checksum: achievementChecksum(payload) })
}

export function decodeAchievementState(raw: string | null): StorageLoadResult {
  if (raw === null) return { state: EMPTY_ACHIEVEMENT_STATE, status: "missing", raw }
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || !Number.isInteger(value.version)) throw new Error("Invalid schema")
    if (value.version === 1) throw new Error("Unsigned legacy save")
    if (value.version !== ACHIEVEMENT_STORAGE_VERSION) {
      return { state: EMPTY_ACHIEVEMENT_STATE, status: "unsupported-version", raw }
    }
    const { checksum, ...payload } = value
    if (typeof checksum !== "string" || !/^[a-f0-9]{64}$/.test(checksum)) throw new Error("Missing integrity information")
    if (checksum !== achievementChecksum(payload)) {
      return { state: EMPTY_ACHIEVEMENT_STATE, status: "integrity-mismatch", raw }
    }
    if (!isState(payload)) throw new Error("Invalid progress")
    return {
      state: freezeAchievementState(payload as AchievementState),
      status: "loaded",
      raw,
    }
  } catch {
    return { state: EMPTY_ACHIEVEMENT_STATE, status: "malformed", raw }
  }
}

export function createAchievementStorage(getStorage: () => Pick<Storage, "getItem" | "setItem">): AchievementStorage {
  let lastObservedRaw: string | null | undefined
  let trusted: AchievementState | undefined
  let writable = true

  function writeTrusted(state: AchievementState): void {
    const payload = JSON.parse(JSON.stringify(state)) as AchievementState
    const raw = encodeAchievementState(payload)
    trusted = freezeAchievementState(payload)
    try {
      const storage = getStorage()
      storage.setItem(ACHIEVEMENT_STORAGE_KEY, raw)
      lastObservedRaw = raw
    } catch {
    }
  }

  function read(force = false): StorageLoadResult | undefined {
    let raw: string | null
    try { raw = getStorage().getItem(ACHIEVEMENT_STORAGE_KEY) }
    catch { return { state: EMPTY_ACHIEVEMENT_STATE, status: "unavailable", raw: null } }
    if (raw === lastObservedRaw) {
      if (!force) return undefined
      return trusted ? { state: trusted, status: raw === null ? "missing" : "loaded", raw } : decodeAchievementState(raw)
    }
    if (trusted) {
      lastObservedRaw = raw
      const state = trusted
      writeTrusted(state)
      return { state, status: "tampered", raw }
    }
    lastObservedRaw = raw
    const result = decodeAchievementState(raw)
    writable = result.status !== "unsupported-version"

    if (result.status === "missing") {
      trusted = EMPTY_ACHIEVEMENT_STATE
    } else if (result.status === "loaded") {
      trusted = result.state
    } else if (result.status === "malformed" || result.status === "integrity-mismatch") {
      writeTrusted(EMPTY_ACHIEVEMENT_STATE)
      return { state: EMPTY_ACHIEVEMENT_STATE, status: "tampered", raw }
    }
    return result
  }

  return {
    load: () => read(true)!,
    inspect: () => read(),
    reset() {
      const raw = encodeAchievementState(EMPTY_ACHIEVEMENT_STATE)
      try { getStorage().setItem(ACHIEVEMENT_STORAGE_KEY, raw) }
      catch { return false }
      trusted = EMPTY_ACHIEVEMENT_STATE
      lastObservedRaw = raw
      writable = true
      return true
    },
    save(state) {
      const changed = read()
      if (changed && changed.status !== "unavailable") return changed
      if (writable) writeTrusted(state)
    },
  }
}
