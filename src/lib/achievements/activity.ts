export function trackVisibleTime(onElapsed: (milliseconds: number) => void, intervalMs = 10_000): () => void {
  if (typeof document === "undefined" || typeof window === "undefined") return () => {}
  let suspended = false
  let stopped = false
  let startedAt: number | undefined = document.visibilityState === "visible" ? performance.now() : undefined

  function checkpoint() {
    const now = performance.now()
    const elapsed = startedAt === undefined ? 0 : Math.max(0, now - startedAt)
    startedAt = !stopped && !suspended && document.visibilityState === "visible" ? now : undefined
    if (elapsed > 0) onElapsed(elapsed)
  }

  const onPageHide = () => { suspended = true; checkpoint() }
  const onPageShow = () => { suspended = false; checkpoint() }
  const timer = window.setInterval(checkpoint, intervalMs)
  document.addEventListener("visibilitychange", checkpoint)
  window.addEventListener("pagehide", onPageHide)
  window.addEventListener("pageshow", onPageShow)

  return () => {
    if (stopped) return
    stopped = true
    window.clearInterval(timer)
    document.removeEventListener("visibilitychange", checkpoint)
    window.removeEventListener("pagehide", onPageHide)
    window.removeEventListener("pageshow", onPageShow)
    checkpoint()
  }
}

export const CASE_STUDY_READING_MS = 30_000
export const CASE_STUDY_READING_FRACTION = 0.9

export function getReadingPosition(top: number, height: number, viewportHeight: number) {
  return {
    visible: height > 0 && top < viewportHeight && top + height > 0,
    fraction: height > 0 ? Math.max(0, Math.min(1, (viewportHeight - top) / height)) : 0,
  }
}
