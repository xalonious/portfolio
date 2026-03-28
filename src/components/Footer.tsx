"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--card]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <div className="space-y-1">
          <p className="text-sm text-[--muted-foreground]">
            Made with{" "}
            <span className="text-[--primary]" aria-label="love">♥</span>
            {" "}by{" "}
            <Link href="/" className="text-[--foreground] font-medium hover:text-[--primary] transition-colors duration-200">
              Xander
            </Link>
          </p>
          <p className="text-xs text-[--muted-foreground]">© {new Date().getFullYear()}</p>
        </div>

        <nav className="flex items-center gap-6 text-sm text-[--muted-foreground]">
          <Link
            href="https://github.com/xalonious"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[--primary] transition-colors duration-200"
          >
            GitHub
          </Link>
          <Link
            href="#contact"
            className="hover:text-[--primary] transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

      </div>
    </footer>
  )
}