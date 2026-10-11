"use client"

import Link from "next/link"
import { emitAchievementEvent } from "@/lib/achievements"

export function Footer() {
  return (
    <footer className="border-t light:border-border light:bg-card">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <div className="space-y-1">
          <p className="text-sm light:text-muted-foreground">
            Made with{" "}
            <span className="light:text-primary-ink" aria-label="love">♥</span>
            {" "}by{" "}
            <Link href="/" className="light:text-foreground font-medium light:hover:text-primary-ink transition-colors duration-200">
              Xander
            </Link>
          </p>
          <p className="text-xs light:text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>

        <nav className="flex items-center gap-6 text-sm light:text-muted-foreground">
          <Link
            href="https://github.com/xalonious"
            onClick={() => emitAchievementEvent("contact_used")}
            target="_blank"
            rel="noreferrer"
            className="light:hover:text-primary-ink transition-colors duration-200"
          >
            GitHub
          </Link>
          <Link
            href="https://github.com/xalonious/portfolio"
            onClick={() => emitAchievementEvent("portfolio_source_opened")}
            target="_blank"
            rel="noreferrer"
            className="light:hover:text-primary-ink transition-colors duration-200"
          >
            Source
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="light:hover:text-primary-ink transition-colors duration-200"
          >
            Back to top
          </button>
        </nav>

      </div>
    </footer>
  )
}
