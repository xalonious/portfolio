"use client"

import { useSyncExternalStore } from "react"
import { FiMoon, FiSun } from "react-icons/fi"
import { getServerTheme, getTheme, subscribeToTheme, toggleTheme } from "@/lib/theme"

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme)
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`
  return (
    <button type="button" onClick={toggleTheme} aria-label={label} title={label}
      className="grid h-9 w-8 shrink-0 place-items-center rounded-sm text-foreground transition-colors hover:bg-[var(--hover-background)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary sm:w-9">
      {/* CSS selects the saved theme's icon even before React hydrates. */}
      <FiSun size={18} className="theme-sun" aria-hidden="true" />
      <FiMoon size={18} className="theme-moon" aria-hidden="true" />
    </button>
  )
}
