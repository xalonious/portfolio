"use client"

import { useEffect, type ReactNode } from "react"

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: any
    let rafId: number

    async function init() {
      const { default: Lenis } = await import("lenis")

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      })

      function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}