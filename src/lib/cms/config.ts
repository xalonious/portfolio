import path from "node:path"

function fileUrlToPath(value: string) {
  const withoutPrefix = value.replace(/^file:/, "")
  return process.platform === "win32" && withoutPrefix.startsWith("/")
    ? withoutPrefix.slice(1)
    : withoutPrefix
}

export function getDatabasePath() {
  const configured =
    process.env.PORTFOLIO_DATABASE_PATH ??
    (process.env.DATABASE_URL?.startsWith("file:") ? process.env.DATABASE_URL : undefined)

  return configured
    ? path.resolve(
        /* turbopackIgnore: true*/ fileUrlToPath(configured),
      )
    : path.join(
        /* turbopackIgnore: true*/ process.cwd(),
        ".data",
        "portfolio.db",
      )
}

export function getMediaRoot() {
  return process.env.MEDIA_ROOT
    ? path.resolve(
        /* turbopackIgnore: true*/ process.env.MEDIA_ROOT,
      )
    : path.join(
        /* turbopackIgnore: true*/ process.cwd(),
        ".data",
        "uploads",
      )
}

export const MEDIA_PUBLIC_PATH = (
  process.env.MEDIA_PUBLIC_PATH ?? "/media"
).replace(/\/+$/, "")

export const MAX_UPLOAD_BYTES = Number(
  process.env.MEDIA_MAX_UPLOAD_BYTES ?? 15 * 1024 * 1024,
)
