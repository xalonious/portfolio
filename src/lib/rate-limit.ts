type Entry = {
  count: number
  resetAt: number
}

const WINDOW_MS = 5 * 60 * 1000 
const MAX_REQUESTS = 1

const store = new Map<string, Entry>()

export function rateLimit(key: string) {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    const fresh: Entry = {
      count: 1,
      resetAt: now + WINDOW_MS,
    }

    store.set(key, fresh)

    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: fresh.resetAt,
    }
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    }
  }

  existing.count += 1
  store.set(key, existing)

  return {
    success: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
  }
}

setInterval(() => {
  const now = Date.now()

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}, 60 * 1000).unref()