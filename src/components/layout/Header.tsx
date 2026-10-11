"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { LuTrophy } from "react-icons/lu"
import { useAchievementPanel } from "@/components/features/AchievementPanel"
import { emitAchievementEvent } from "@/lib/achievements"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { isOpen, openPanel } = useAchievementPanel()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "light:bg-background/90 backdrop-blur-md border-b light:border-border"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        <TransitionLink
          href="/"
          className="font-display text-lg font-semibold tracking-tight light:text-foreground light:hover:text-primary-ink transition-colors duration-200"
        >
          xalonious
        </TransitionLink>

        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-6 text-xs min-[360px]:text-sm font-medium light:text-muted-foreground">
          <TransitionLink
            href="/"
            className="light:hover:text-foreground transition-colors duration-200"
          >
            Home
          </TransitionLink>
          <TransitionLink
            href="/projects"
            className="light:hover:text-foreground transition-colors duration-200"
          >
            Projects
          </TransitionLink>
          <Link
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onClick={() => emitAchievementEvent("rickroll_opened")}
            target="_blank"
            rel="noopener noreferrer"
            className="light:hover:text-foreground transition-colors duration-200"
          >
            lol
          </Link>
          <ThemeToggle />
          <button
            id="achievement-panel-trigger"
            type="button"
            onClick={openPanel}
            aria-label="Open achievements"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? "achievement-panel" : undefined}
            title="Achievements"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-card/60 text-primary-ink transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <LuTrophy size={18} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  )
}
