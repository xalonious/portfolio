"use client"

import { useEffect, useRef, useState } from "react"

interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  chars?: string
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"

export function ScrambleText({
  text,
  className,
  delay = 300,
  duration = 800,
  chars = DEFAULT_CHARS,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const startTime = Date.now()
      const totalChars = text.length

      function tick() {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const resolved = Math.floor(progress * totalChars)

        const next = text
          .split("")
          .map((char, i) => {
            if (i < resolved) return char
            if (char === " " || char === "." || char === "," || char === "'") return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")

        setDisplay(next)

        if (progress < 1) {
          frameRef.current = setTimeout(tick, 40)
        } else {
          setDisplay(text)
        }
      }

      tick()
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [text, delay, duration, chars])

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  )
}