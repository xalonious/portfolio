import { getAchievementRuntime } from "./achievements"
import { ACHIEVEMENT_STORAGE_KEY, ACHIEVEMENT_TAMPER_EVENT, decodeAchievementState } from "./achievements/storage"
import type { AchievementState } from "./achievements/types"
import { applyBaseTheme, applySealyOverride, getTheme } from "./theme"
import { readThemePreference, THEME_STORAGE_KEY, THEME_PREFERENCE_EVENT, LEGACY_SEALY_MODE_STORAGE_KEY, SEALY_COMPANION_STORAGE_KEY, SEALY_REVEAL_STORAGE_KEY } from "./sealy-mode-preferences"

export type SealyModeState = { eligible: boolean; active: boolean; companionEnabled: boolean }
const DEFAULT_STATE: SealyModeState = Object.freeze({ eligible: false, active: false, companionEnabled: true })
let state = DEFAULT_STATE
let initialized = false
const subscribers = new Set<() => void>()
const revealed = new Set<string>()
let checkingPreferences = false
let lastObservedTheme: string | null | undefined
let themeEditTimer: number | undefined

function read(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}
function write(key: string, value: string): boolean {
  try { window.localStorage.setItem(key, value); return true } catch { return false }
}
function isEligible(achievements: AchievementState): boolean {
  return Object.prototype.hasOwnProperty.call(achievements.unlocked, "touch-grass")
    && Number.isSafeInteger(achievements.unlocked["touch-grass"]) && achievements.unlocked["touch-grass"] >= 0
}
function commit(next: SealyModeState): void {
  applySealyOverride(next.active)
  if (state.eligible === next.eligible && state.active === next.active && state.companionEnabled === next.companionEnabled) return
  state = Object.freeze(next)
  subscribers.forEach(listener => listener())
}
function persistMode(): void {
  const raw = read(ACHIEVEMENT_STORAGE_KEY)
  const decoded = decodeAchievementState(raw)
  const receipt = decoded.status === "loaded" && isEligible(decoded.state) ? raw : null
  const preference = JSON.stringify({ version: 1, base: getTheme(), sealy: state.active, eligibility: receipt })
  if (read(THEME_STORAGE_KEY) !== preference) write(THEME_STORAGE_KEY, preference)
  lastObservedTheme = read(THEME_STORAGE_KEY)
}
function companionPreference(): boolean {
  const raw = read(SEALY_COMPANION_STORAGE_KEY)
  return raw !== "false"
}

function migrateLegacyPreference(): void {
  const legacy = read(LEGACY_SEALY_MODE_STORAGE_KEY)
  if (legacy === null) return
  const raw = read(THEME_STORAGE_KEY)
  if (raw === null || raw === "dark" || raw === "light") {
    let enabled = false
    let eligibility: string | null = null
    try {
      const value = JSON.parse(legacy)
      enabled = value?.version === 1 && value.enabled === true
      eligibility = typeof value?.eligibility === "string" ? value.eligibility : null
    } catch {}
    if (!write(THEME_STORAGE_KEY, JSON.stringify({ ...readThemePreference(raw), sealy: enabled, eligibility }))) return
  }
  try { window.localStorage.removeItem(LEGACY_SEALY_MODE_STORAGE_KEY) } catch {}
}

function refreshPreferences(): void {
  if (checkingPreferences) return
  checkingPreferences = true
  try {
    const preference = readThemePreference(read(THEME_STORAGE_KEY), getTheme())
    const runtime = getAchievementRuntime()
    const eligible = !!runtime && isEligible(runtime.engine.getSnapshot())
    const denied = preference.sealy && !eligible
    applyBaseTheme(preference.base)
    commit({ eligible, active: preference.sealy && eligible, companionEnabled: companionPreference() })
    persistMode()
    if (denied) runtime?.engine.emit(ACHIEVEMENT_TAMPER_EVENT)
  } finally { checkingPreferences = false }
}

export function initializeSealyMode(): void {
  if (initialized || typeof window === "undefined") return
  initialized = true
  migrateLegacyPreference()
  refreshPreferences()
}

export function syncSealyEligibility(achievements: AchievementState): void {
  initializeSealyMode()
  if (!checkingPreferences && read(THEME_STORAGE_KEY) !== lastObservedTheme) {
    refreshPreferences()
    return
  }
  const eligible = isEligible(achievements)
  commit({ ...state, eligible, active: state.active && eligible })
  persistMode()
}

export function setSealyModeActive(active: boolean): boolean {
  initializeSealyMode()
  const achievements = getAchievementRuntime()?.engine.getSnapshot()
  const eligible = !!achievements && isEligible(achievements)
  commit({ ...state, eligible, active: active && eligible })
  persistMode()
  return state.active === active
}

export function setSealyCompanionEnabled(enabled: boolean): void {
  initializeSealyMode()
  if (!state.eligible) return
  commit({ ...state, companionEnabled: enabled })
  write(SEALY_COMPANION_STORAGE_KEY, String(enabled))
}

export function claimSealyRewardReveal(): boolean {
  initializeSealyMode()
  const achievements = getAchievementRuntime()?.engine.getSnapshot()
  if (!achievements || !isEligible(achievements)) return false
  const earnedAt = String(achievements.unlocked["touch-grass"])
  if (revealed.has(earnedAt) || read(SEALY_REVEAL_STORAGE_KEY) === earnedAt) return false
  revealed.add(earnedAt)
  write(SEALY_REVEAL_STORAGE_KEY, earnedAt)
  return true
}

function onStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== THEME_STORAGE_KEY && event.key !== SEALY_COMPANION_STORAGE_KEY) return
  try { if (event.storageArea !== window.localStorage) return } catch { return }
  refreshPreferences()
}

function onVisibility(): void { if (document.visibilityState === "visible") refreshPreferences() }
function checkForThemeEdits(): void {
  if (read(THEME_STORAGE_KEY) !== lastObservedTheme) refreshPreferences()
}

export const getSealyModeSnapshot = () => state
export const getServerSealyModeSnapshot = () => DEFAULT_STATE
export function subscribeToSealyMode(listener: () => void): () => void {
  if (!subscribers.size) {
    window.addEventListener("storage", onStorage)
    window.addEventListener(THEME_PREFERENCE_EVENT, refreshPreferences)
    window.addEventListener("focus", refreshPreferences)
    window.addEventListener("pageshow", refreshPreferences)
    document.addEventListener("visibilitychange", onVisibility)
    themeEditTimer = window.setInterval(checkForThemeEdits, 1_000)
  }
  subscribers.add(listener)
  initializeSealyMode()
  return () => {
    subscribers.delete(listener)
    if (!subscribers.size) {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(THEME_PREFERENCE_EVENT, refreshPreferences)
      window.removeEventListener("focus", refreshPreferences)
      window.removeEventListener("pageshow", refreshPreferences)
      document.removeEventListener("visibilitychange", onVisibility)
      if (themeEditTimer !== undefined) window.clearInterval(themeEditTimer)
      themeEditTimer = undefined
    }
  }
}
