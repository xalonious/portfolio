import fs from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"
import { getDatabasePath } from "@/lib/cms/config"
import { SSH_CONNECTION_RETENTION_MS } from "@/lib/achievements/ssh-config"

type DatabaseGlobal = typeof globalThis & {
  __portfolioDatabase?: DatabaseSync
}

const databaseGlobal = globalThis as DatabaseGlobal
let lastSSHCleanupAt = 0

export function cleanupSSHConnections(database: DatabaseSync, now = Date.now()): void {
  database.prepare("DELETE FROM ssh_achievement_connections WHERE connected_at < ?").run(now - SSH_CONNECTION_RETENTION_MS)
}

function openDatabase() {
  const databasePath = getDatabasePath()
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })

  const database = new DatabaseSync(databasePath)
  const schemaPath = path.join(process.cwd(), "database", "schema.sql")
  database.exec(fs.readFileSync(schemaPath, "utf8"))

  const projectColumns = database
    .prepare("PRAGMA table_info(projects)")
    .all() as unknown as Array<{ name: string }>

  if (projectColumns.some((column) => column.name === "live_url")) {
    database.exec("ALTER TABLE projects DROP COLUMN live_url")
  }

  return database
}

export function getDatabase() {
  if (!databaseGlobal.__portfolioDatabase) {
    databaseGlobal.__portfolioDatabase = openDatabase()
  }

  const now = Date.now()
  if (now - lastSSHCleanupAt >= 60 * 60 * 1000) {
    lastSSHCleanupAt = now
    try { cleanupSSHConnections(databaseGlobal.__portfolioDatabase, now) }
    catch { console.warn("[ssh-achievements] Connection cleanup unavailable; will retry on later activity.") }
  }

  return databaseGlobal.__portfolioDatabase
}

export function runTransaction<T>(callback: () => T) {
  const database = getDatabase()
  database.exec("BEGIN IMMEDIATE")

  try {
    const result = callback()
    database.exec("COMMIT")
    return result
  } catch (error) {
    database.exec("ROLLBACK")
    throw error
  }
}
