import { createHash } from "node:crypto"
import type { DatabaseSync } from "node:sqlite"
import { getDatabase } from "@/lib/cms/database"
import { SSH_CONNECTION_WINDOW_MS, SSH_WATCH_WINDOW_MS } from "@/lib/achievements/ssh-config"
import { isSSHVisitorToken, SSH_VISITOR_TOKEN_HEADER } from "@/lib/achievements/ssh-token"

export function hashSSHVisitorToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex")
}

export function hasRecentSSHConnection(database: Pick<DatabaseSync, "prepare">, tokenHash: string, since: number, now = Date.now()): boolean {
  return Boolean(database.prepare(`
    SELECT 1 FROM ssh_achievement_connections
    WHERE token_hash = ? AND connected_at > ? AND connected_at >= ? AND connected_at <= ?
    LIMIT 1
  `).get(tokenHash, since, now - SSH_CONNECTION_WINDOW_MS, now))
}

export function getSSHConnectionStatus(headers: Headers, sinceValue: string | null, now = Date.now(), database = getDatabase): boolean {
  const token = headers.get(SSH_VISITOR_TOKEN_HEADER)
  if (!isSSHVisitorToken(token)) return false
  if (!sinceValue || !/^\d{1,16}$/.test(sinceValue)) return false
  const since = Number(sinceValue)
  if (!Number.isSafeInteger(since) || since <= 0 || since > now || now - since >= SSH_WATCH_WINDOW_MS) return false
  return hasRecentSSHConnection(database(), hashSSHVisitorToken(token), since, now)
}
