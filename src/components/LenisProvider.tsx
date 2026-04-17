"use client"

import { useEffect, type ReactNode } from "react"

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: any
    let rafId: number

    const onKonamiToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>
      if (customEvent.detail?.active) {
        lenis?.stop()
      } else {
        lenis?.start()
      }
    }

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

    window.addEventListener("konami-chat-toggle", onKonamiToggle as EventListener)
    init()

    return () => {
      window.removeEventListener("konami-chat-toggle", onKonamiToggle as EventListener)
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}
