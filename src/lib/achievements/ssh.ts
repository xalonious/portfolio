import type { AchievementEngine } from "./engine"
import type { AchievementProgress } from "./types"
import { SSH_ACHIEVEMENT_ID, SSH_CONNECTED_EVENT, SSH_WATCH_EVENT } from "./ssh-config"

function watchingSince(progress: AchievementProgress): number | undefined {
  const custom = progress.custom
  if (!custom || typeof custom !== "object" || Array.isArray(custom) || !("watchingSince" in custom)) return undefined
  return typeof custom.watchingSince === "number" ? custom.watchingSince : undefined
}

export function watchSSHPortfolio(engine: AchievementEngine, request: typeof fetch = fetch, now: () => number = Date.now): () => void {
  if (typeof window === "undefined" || typeof document === "undefined" || engine.isUnlocked(SSH_ACHIEVEMENT_ID)) return () => {}
  let stopped = false
  let active: AbortController | undefined
  let timeout: ReturnType<typeof setTimeout> | undefined
  let lastCheckedAt = -Infinity
  let unsubscribe = () => {}

  function stop() {
    if (stopped) return
    stopped = true
    window.removeEventListener("focus", check)
    document.removeEventListener("visibilitychange", onVisibility)
    unsubscribe()
    active?.abort()
    if (timeout !== undefined) clearTimeout(timeout)
  }

  async function check() {
    if (stopped || document.visibilityState !== "visible" || active) return
    engine.refreshStorage()
    if (engine.isUnlocked(SSH_ACHIEVEMENT_ID)) { stop(); return }
    const currentTime = now()
    if (currentTime - lastCheckedAt < 1000) return
    lastCheckedAt = currentTime
    engine.emit(SSH_WATCH_EVENT, { startedAt: currentTime })
    const since = watchingSince(engine.getProgress(SSH_ACHIEVEMENT_ID))
    if (since === undefined) return
    const controller = new AbortController()
    active = controller
    timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const response = await request(`/api/achievements/ssh-status?since=${since}`, {
        cache: "no-store", credentials: "same-origin", signal: controller.signal,
      })
      if (!response.ok) return
      const result: unknown = await response.json()
      if (stopped || controller.signal.aborted) return
      engine.refreshStorage()
      if (watchingSince(engine.getProgress(SSH_ACHIEVEMENT_ID)) !== since) return
      if (result && typeof result === "object" && "connected" in result && result.connected === true) {
        engine.emit(SSH_CONNECTED_EVENT)
      }
    } catch {
    } finally {
      if (timeout !== undefined) clearTimeout(timeout)
      timeout = undefined
      active = undefined
    }
  }

  const onVisibility = () => { if (document.visibilityState === "visible") void check() }
  unsubscribe = engine.subscribe(() => { if (engine.isUnlocked(SSH_ACHIEVEMENT_ID)) stop() })
  window.addEventListener("focus", check)
  document.addEventListener("visibilitychange", onVisibility)
  void check()
  return stop
}
