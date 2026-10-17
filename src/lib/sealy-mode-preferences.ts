export const THEME_STORAGE_KEY = "whoisxander:theme"
export const THEME_PREFERENCE_EVENT = "whoisxander:theme-preference-changed"
export const LEGACY_SEALY_MODE_STORAGE_KEY = "whoisxander:sealy-mode"
export const SEALY_COMPANION_STORAGE_KEY = "whoisxander:sealy-companion"
export const SEALY_REVEAL_STORAGE_KEY = "whoisxander:sealy-reward-reveal"

export type ThemePreference = {
  version: 1
  base: "dark" | "light"
  sealy: boolean
}

export function readThemePreference(raw: string | null, fallbackBase: "dark" | "light" = "dark"): ThemePreference {
  if (raw === "light" || raw === "dark" || raw === null) {
    return { version: 1, base: raw === "light" ? "light" : "dark", sealy: false }
  }
  try {
    const value = raw === "sealy" ? "sealy" : JSON.parse(raw)
    return {
      version: 1,
      base: value?.base === "light" ? "light" : value?.base === "dark" ? "dark" : fallbackBase,
      sealy: value === "sealy" || value?.sealy === true,
    }
  } catch { return { version: 1, base: fallbackBase, sealy: false } }
}

export function canRestoreSealyTheme(preference: string | null, achievementSave: string | null, legacy = false): boolean {
  try {
    if (!achievementSave) return false
    const value = preference === "sealy" ? "sealy" : JSON.parse(preference ?? "null")
    const save = JSON.parse(achievementSave)
    return (value === "sealy" || (value?.version === 1 && (value.sealy === true || (legacy && value.enabled === true))))
      && save?.version === 2 && typeof save.checksum === "string" && /^[a-f0-9]{64}$/.test(save.checksum)
      && Number.isSafeInteger(save.unlocked?.["touch-grass"]) && save.unlocked["touch-grass"] >= 0
  } catch { return false }
}
