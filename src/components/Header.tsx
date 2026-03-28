"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TransitionLink } from "@/components/TransitionLink"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

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
          ? "bg-[--background]/90 backdrop-blur-md border-b border-[--border]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto h-14 px-6 flex items-center justify-between">
        <TransitionLink
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-[--foreground] hover:text-[--primary] transition-colors duration-200"
        >
          xalonious
        </TransitionLink>

        <nav className="flex items-center gap-6 text-sm font-medium text-[--muted-foreground]">
          <TransitionLink
            href="/"
            className="hover:text-[--foreground] transition-colors duration-200"
          >
            Home
          </TransitionLink>
          <TransitionLink
            href="/projects"
            className="hover:text-[--foreground] transition-colors duration-200"
          >
            Projects
          </TransitionLink>
          <Link
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[--foreground] transition-colors duration-200"
          >
            lol
          </Link>
        </nav>
      </div>
    </header>
  )
}