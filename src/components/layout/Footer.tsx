"use client"

import Link from "next/link"
import { emitAchievementEvent } from "@/lib/achievements"
import { useSealyMode } from "@/components/features/useSealyMode"

const footerHoverClass = "hover:text-primary-ink transition-colors duration-200"

export function Footer() {
  const { active: sealyActive } = useSealyMode()
  return (
    <footer className="border-t light:border-border light:bg-card">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <div className="space-y-1">
          <p className="text-sm light:text-muted-foreground">
            {sealyActive ? <>Made by <Link href="/" className={`font-medium ${footerHoverClass}`}>Xander</Link>. Supervised by Sealy.</> : <>
            Made with{" "}
            <span className="light:text-primary-ink" aria-label="love">♥</span>
            {" "}by{" "}
            <Link href="/" className={`light:text-foreground font-medium ${footerHoverClass}`}>
              Xander
            </Link>
            </>}
          </p>
          <p className="text-xs light:text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm light:text-muted-foreground sm:gap-x-6">
          <Link
            href="https://github.com/xalonious"
            onClick={() => emitAchievementEvent("contact_used")}
            target="_blank"
            rel="noreferrer"
            className={footerHoverClass}
          >
            GitHub
          </Link>
          <Link
            href="https://github.com/xalonious/portfolio"
            onClick={() => emitAchievementEvent("portfolio_source_opened")}
            target="_blank"
            rel="noreferrer"
            className={footerHoverClass}
          >
            Source
          </Link>
          <Link href="/privacy" className={footerHoverClass}>
            Privacy policy
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={footerHoverClass}
          >
            Back to top
          </button>
        </nav>

      </div>
    </footer>
  )
}
