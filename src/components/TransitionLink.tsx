"use client"

import { useViewTransition } from "@/hooks/useViewTransition"
import type { ReactNode, MouseEvent } from "react"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

export function TransitionLink({
  href,
  children,
  className,
  target,
  rel,
}: TransitionLinkProps) {
  const navigate = useViewTransition()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (
      target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      href.startsWith("http") ||
      href.startsWith("mailto") ||
      href.startsWith("#")
    ) {
      return
    }

    e.preventDefault()
    navigate(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  )
}