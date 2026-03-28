"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [tabindex]"
      )
      setHovering(!!isClickable)
    }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    window.addEventListener("mouseover", onMouseOver)

    function animate() {
      const speed = 0.12
      ring.current.x += (mouse.current.x - ring.current.x) * speed
      ring.current.y += (mouse.current.y - ring.current.y) * speed

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      window.removeEventListener("mouseover", onMouseOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#C47A8A",
          opacity: visible ? 1 : 0,
          transition: "opacity 200ms ease, width 200ms ease, height 200ms ease",
          willChange: "transform",
        }}
      />

      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          borderRadius: "50%",
          border: "1.5px solid #C47A8A",
          opacity: visible ? 0.5 : 0,
          transition: "opacity 200ms ease, width 200ms ease, height 200ms ease",
          willChange: "transform",
        }}
      />
    </>
  )
}