"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useViewTransition() {
  const router = useRouter()

  const navigate = useCallback(
    (href: string) => {
      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        document.startViewTransition(() => {
          router.push(href)
        })
      } else {
        router.push(href)
      }
    },
    [router]
  )

  return navigate
}