"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
] as const

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[--border]/50 bg-[--card]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[--foreground]"
          aria-label="Go home"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[--brass]" />
          <span>xalonious</span>
        </Link>

        <nav className="relative">
          <ul className="flex items-center gap-1 rounded-full border border-[--border]/60 bg-[--muted] px-1 py-1">
            {LINKS.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && pathname?.startsWith(l.href))

              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    className="relative block rounded-full px-3 py-1.5 text-sm text-[--foreground]/90 transition hover:text-[--foreground]"
                  >
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                          className="absolute inset-0 -z-10 rounded-full"
                          style={{
                            background:
                              "linear-gradient(140deg,var(--primary)/22%,var(--brass)/22%)",
                            boxShadow:
                              "inset 0 0 0 1px color-mix(in oklab,var(--border) 70%, transparent)",
                          }}
                        />
                      )}
                    </AnimatePresence>
                    {l.label}
                  </Link>
                </li>
              )
            })}

            <li className="relative">
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noreferrer"
                className="block rounded-full px-3 py-1.5 text-sm text-[--foreground]/90 transition hover:text-[--foreground]"
                aria-label="Totally serious button"
              >
                lol
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
