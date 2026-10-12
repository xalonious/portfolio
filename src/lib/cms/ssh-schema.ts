import type { DatabaseSync } from "node:sqlite"

export function migrateSSHConnections(database: DatabaseSync): void {
  database.exec("BEGIN IMMEDIATE")
  try {
    const columns = database.prepare("PRAGMA table_info(ssh_achievement_connections)").all()
    if (columns.some(column => column.name === "ip_hash")) {
      database.exec("DROP TABLE ssh_achievement_connections")
    }
    database.exec(`
      CREATE TABLE IF NOT EXISTS ssh_achievement_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_hash TEXT NOT NULL,
        connected_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_ssh_achievement_connections_token_time
        ON ssh_achievement_connections (token_hash, connected_at);
      CREATE INDEX IF NOT EXISTS idx_ssh_achievement_connections_time
        ON ssh_achievement_connections (connected_at);
    `)
    database.exec("COMMIT")
  } catch (error) {
    database.exec("ROLLBACK")
    throw error
  }
}
