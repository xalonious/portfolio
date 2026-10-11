import { createHmac, timingSafeEqual } from "node:crypto"
import { isIP } from "node:net"
import type { DatabaseSync } from "node:sqlite"
import { getDatabase } from "@/lib/cms/database"
import { SSH_CONNECTION_WINDOW_MS, SSH_WATCH_WINDOW_MS } from "@/lib/achievements/ssh-config"

export function normalizeSSHClientIP(value: string): string | undefined {
  const ip = value.trim().split("%", 1)[0]
  const version = isIP(ip)
  if (version === 4) return ip
  if (version !== 6) return undefined
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1)
  const mapped = /^::ffff:([a-f\d]+):([a-f\d]+)$/.exec(canonical)
  if (!mapped) return canonical
  const high = Number.parseInt(mapped[1], 16), low = Number.parseInt(mapped[2], 16)
  return `${high >>> 8}.${high & 255}.${low >>> 8}.${low & 255}`
}

export function hashSSHClientIP(ip: string, key: string): string {
  return createHmac("sha256", key).update(ip, "utf8").digest("hex")
}

export function getTrustedSSHClientIP(headers: Headers, proxySecret = process.env.SSH_ACHIEVEMENT_PROXY_SECRET): string | undefined {
  if (!proxySecret || Buffer.byteLength(proxySecret) < 32) return undefined
  const supplied = headers.get("x-portfolio-proxy-token") ?? ""
  const expected = Buffer.from(proxySecret), actual = Buffer.from(supplied)
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined
  return normalizeSSHClientIP(headers.get("x-portfolio-client-ip") ?? "")
}

export function hasRecentSSHConnection(database: Pick<DatabaseSync, "prepare">, ipHash: string, since: number, now = Date.now()): boolean {
  return Boolean(database.prepare(`
    SELECT 1 FROM ssh_achievement_connections
    WHERE ip_hash = ? AND connected_at > ? AND connected_at >= ? AND connected_at <= ?
    LIMIT 1
  `).get(ipHash, since, now - SSH_CONNECTION_WINDOW_MS, now))
}

export function getSSHConnectionStatus(headers: Headers, sinceValue: string | null, now = Date.now()): boolean {
  if (!sinceValue || !/^\d{1,16}$/.test(sinceValue)) return false
  const since = Number(sinceValue)
  if (!Number.isSafeInteger(since) || since <= 0 || since > now || now - since >= SSH_WATCH_WINDOW_MS) return false
  const key = process.env.SSH_ACHIEVEMENT_IP_HASH_KEY
  if (!key || Buffer.byteLength(key) < 32) return false
  const ip = getTrustedSSHClientIP(headers)
  if (!ip) return false
  return hasRecentSSHConnection(getDatabase(), hashSSHClientIP(ip, key), since, now)
}
