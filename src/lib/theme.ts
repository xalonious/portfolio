import { emitAchievementEvent } from "@/lib/achievements"

export type Theme = "dark" | "light"
export const THEME_STORAGE_KEY = "whoisxander:theme"

export const themeBootstrap = `(()=>{let theme="dark";try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")theme="light"}catch{}const root=document.documentElement;root.dataset.theme=theme;root.classList.toggle("dark",theme==="dark")})()`

const subscribers = new Set<() => void>()
export const getServerTheme = (): Theme => "dark"
export const getTheme = (): Theme => typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark"

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.toggle("dark", theme === "dark")
  subscribers.forEach(listener => listener())
}

function onStorage(event: StorageEvent): void {
  if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
  try { if (event.storageArea !== window.localStorage) return } catch { return }
  applyTheme(event.newValue === "light" ? "light" : "dark")
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
  applyTheme(next)
  try { window.localStorage.setItem(THEME_STORAGE_KEY, next) } catch {}
  if (previous === "dark" && next === "light") emitAchievementEvent("light_mode_selected")
}
