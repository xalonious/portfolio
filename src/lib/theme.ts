import { emitAchievementEvent } from "@/lib/achievements"
import { ACHIEVEMENT_STORAGE_KEY } from "@/lib/achievements/storage"
import { canRestoreSealyReceipt, readThemePreference, THEME_STORAGE_KEY, THEME_PREFERENCE_EVENT, LEGACY_SEALY_MODE_STORAGE_KEY } from "./sealy-mode-preferences"

export type Theme = "dark" | "light"
export { THEME_STORAGE_KEY } from "./sealy-mode-preferences"

export const themeBootstrap = `(()=>{let theme="dark",sealy=false;try{const raw=localStorage.getItem("${THEME_STORAGE_KEY}"),preference=(${readThemePreference.toString()})(raw),save=localStorage.getItem("${ACHIEVEMENT_STORAGE_KEY}");theme=preference.base;const restore=${canRestoreSealyReceipt.toString()};sealy=restore(raw,save);if(raw===null||raw==="dark"||raw==="light")sealy=restore(localStorage.getItem("${LEGACY_SEALY_MODE_STORAGE_KEY}"),save,true)}catch{}const root=document.documentElement;root.dataset.baseTheme=theme;root.dataset.theme=sealy?"sealy":theme;root.classList.toggle("dark",root.dataset.theme!=="light")})()`

const subscribers = new Set<() => void>()
export const getServerTheme = (): Theme => "dark"
export const getTheme = (): Theme => typeof document !== "undefined" && (document.documentElement.dataset.baseTheme ?? document.documentElement.dataset.theme) === "light" ? "light" : "dark"

export function applyBaseTheme(theme: Theme): void {
  const root = document.documentElement
  const sealy = root.dataset.theme === "sealy"
  root.dataset.baseTheme = theme
  root.dataset.theme = sealy ? "sealy" : theme
  root.classList.toggle("dark", root.dataset.theme !== "light")
  subscribers.forEach(listener => listener())
}

export function applySealyOverride(active: boolean): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const base = getTheme()
  root.dataset.baseTheme = base
  root.dataset.theme = active ? "sealy" : base
  root.classList.toggle("dark", root.dataset.theme !== "light")
  subscribers.forEach(listener => listener())
}

function onStorage(event: StorageEvent): void {
  if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
  try { if (event.storageArea !== window.localStorage) return } catch { return }
  applyBaseTheme(readThemePreference(event.newValue).base)
}

export function subscribeToTheme(listener: () => void): () => void {
  if (!subscribers.size) window.addEventListener("storage", onStorage)
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
    if (!subscribers.size) window.removeEventListener("storage", onStorage)
  }
}

export function toggleTheme(): void {
  if (typeof document === "undefined") return
  const previous = getTheme()
  const next = previous === "dark" ? "light" : "dark"
  applyBaseTheme(next)
  try {
    const preference = readThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY), previous)
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ ...preference, base: next }))
    window.dispatchEvent(new Event(THEME_PREFERENCE_EVENT))
  } catch {}
  if (previous === "dark" && next === "light") emitAchievementEvent("light_mode_selected")
}
