// Keep this separate from the integrity-protected achievement save.
export const SSH_VISITOR_TOKEN_KEY = "whoisxander:ssh-visitor-token"
export const SSH_VISITOR_TOKEN_HEADER = "x-ssh-visitor-token"

export function isSSHVisitorToken(value: unknown): value is string {
  return typeof value === "string" && value.length === 8 && /^x_[0-9a-f]{6}$/.test(value)
}

export function createSSHVisitorTokenStore(
  getStorage: () => Pick<Storage, "getItem" | "setItem">,
  randomBytes: (bytes: Uint8Array) => Uint8Array = bytes => globalThis.crypto.getRandomValues(bytes),
): () => string | undefined {
  let fallback: string | undefined
  return () => {
    try {
      const saved = getStorage().getItem(SSH_VISITOR_TOKEN_KEY)
      if (isSSHVisitorToken(saved)) {
        fallback = saved
        return saved
      }
    } catch {}

    if (!fallback) {
      try {
        const bytes = randomBytes(new Uint8Array(3))
        fallback = `x_${Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("")}`
      } catch { return undefined }
    }
    try { getStorage().setItem(SSH_VISITOR_TOKEN_KEY, fallback) } catch {}
    return fallback
  }
}

const browserToken = createSSHVisitorTokenStore(() => window.localStorage)

export function getSSHVisitorToken(): string | undefined {
  return typeof window === "undefined" ? undefined : browserToken()
}
