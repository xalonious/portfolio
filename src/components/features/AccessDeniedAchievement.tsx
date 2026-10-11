"use client"

import { useEffect, useRef } from "react"
import { emitAchievementEvent, isAchievementUnlocked } from "@/lib/achievements"

export function AccessDeniedAchievement({ fromAdmin }: { fromAdmin: boolean }) {
  const emitted = useRef(false)

  useEffect(() => {
    if (!fromAdmin || emitted.current) return
    emitted.current = true
    try {
      if (!isAchievementUnlocked("nice-try")) emitAchievementEvent("admin_access_denied")
    } catch {

    }
  }, [fromAdmin])

  return null
}
