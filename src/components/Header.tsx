"use client"

import { useEffect, useState } from "react"

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
        "fixed inset-x-0 top-0 z-50 transition",
        "backdrop-blur-xl",
        scrolled ? "bg-black/20 border-b border-white/10" : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <a href="/" className="font-bold tracking-tight text-white/90 hover:text-white transition">
          xalonious<span className="text-cyan-300">.</span>
        </a>

        <nav className="flex items-center gap-1">
          <a
            href="/"
            className="px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Home
          </a>

          <a
            href="/projects"
            className="px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Projects
          </a>

          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            lol
          </a>
        </nav>
      </div>
    </header>
  )
}
