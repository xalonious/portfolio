"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { emitAchievementEvent, getAchievementProgress, updatePublishedCaseStudies } from "@/lib/achievements"
import { CASE_STUDY_READING_FRACTION, CASE_STUDY_READING_MS, getReadingPosition, trackVisibleTime } from "@/lib/achievements/activity"

export function CaseStudyReadingTracker({
  id, publishedCaseStudyIds, className, children,
}: {
  id?: string
  publishedCaseStudyIds?: readonly string[]
  className: string
  children: ReactNode
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id || !publishedCaseStudyIds?.includes(id)) return
    updatePublishedCaseStudies(publishedCaseStudyIds)
    if (getAchievementProgress("lore-master").ids?.includes(id)) return

    let readingMs = 0
    let furthest = 0
    let completed = false
    function position() {
      const rect = contentRef.current?.getBoundingClientRect()
      return rect ? getReadingPosition(rect.top, rect.height, window.innerHeight) : undefined
    }
    function checkCompletion() {
      if (!completed && readingMs >= CASE_STUDY_READING_MS && furthest >= CASE_STUDY_READING_FRACTION) {
        completed = true
        emitAchievementEvent("case_study_read", { id })
      }
    }
    function onScroll() {
      if (document.visibilityState !== "visible") return
      const current = position()
      if (current?.visible) furthest = Math.max(furthest, current.fraction)
      checkCompletion()
    }
    onScroll()
    const stopClock = trackVisibleTime(milliseconds => {
      if (completed) return
      const current = position()
      if (current?.visible) {
        readingMs += milliseconds
        furthest = Math.max(furthest, current.fraction)
        checkCompletion()
      }
    }, 1_000)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      stopClock()
    }
  }, [id, publishedCaseStudyIds])

  return <div ref={contentRef} className={className}>{children}</div>
}
