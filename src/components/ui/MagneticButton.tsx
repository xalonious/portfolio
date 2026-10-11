"use client"

import { useRef, useState, type ReactNode, type CSSProperties } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  strength?: number
  radius?: number
  as?: "button" | "a"
  href?: string
  target?: string
  rel?: string
}

export function MagneticButton({
  children,
  className = "",
  style,
  onClick,
  type = "button",
  disabled,
  strength = 0.35,
  radius = 80,
  as: Tag = "button",
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < radius) {
      setPos({ x: dx * strength, y: dy * strength })
    }
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 })
  }

  const motionStyle: CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: pos.x === 0 && pos.y === 0
      ? "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
      : "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
    ...style,
  }

  if (Tag === "button") {
    const buttonProps = {
      ref,
      className,
      style: motionStyle,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
      type,
      disabled,
    }
    return <button {...buttonProps}>{children}</button>
  }

  const anchorProps = {
    ref: ref as React.RefObject<HTMLAnchorElement>,
    className,
    style: motionStyle,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    href,
    target,
    rel,
  }
  return <a {...anchorProps}>{children}</a>
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <MagneticButton
      onClick={onClick}
      className={`
        group relative overflow-hidden
        px-8 py-3.5
        text-sm font-semibold tracking-[0.06em]
        rounded-sm
        transition-all duration-200
        ${className}
      `.trim()}
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--button-foreground)",
        boxShadow: "var(--button-shadow)",
      }}
    >
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          -translate-x-full skew-x-[-20deg]
          bg-white/15
          transition-transform duration-500
          group-hover:translate-x-[200%]
        "
      />
      <span className="relative">{children}</span>
    </MagneticButton>
  )
}

export function GhostButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <MagneticButton
      onClick={onClick}
      className={`
        group relative overflow-hidden
        px-8 py-3.5
        text-sm font-medium tracking-[0.06em]
        rounded-sm
        transition-all duration-200
        light:hover:border-foreground
        ${className}
      `.trim()}
      style={{
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        backgroundColor: "transparent",
      }}
    >
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          -translate-x-full
          transition-transform duration-300 ease-out
          group-hover:translate-x-0
        "
        style={{ backgroundColor: "var(--hover-background)" }}
      />
      <span className="relative">{children}</span>
    </MagneticButton>
  )
}