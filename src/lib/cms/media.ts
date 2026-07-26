import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { getDatabase } from "@/lib/cms/database"
import {
  MAX_UPLOAD_BYTES,
  MEDIA_PUBLIC_PATH,
  getMediaRoot,
} from "@/lib/cms/config"

export type MediaAsset = {
  id: string
  storageKey: string
  publicPath: string
  originalName: string
  mimeType: string
  width: number | null
  height: number | null
  sizeBytes: number
  createdAt: string
}

type MediaRow = {
  id: string
  storage_key: string
  public_path: string
  original_name: string
  mime_type: string
  width: number | null
  height: number | null
  size_bytes: number
  created_at: string
}

const mimeTypesByExtension: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
}

function rowToMediaAsset(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    storageKey: row.storage_key,
    publicPath: row.public_path,
    originalName: row.original_name,
    mimeType: row.mime_type,
    width: row.width,
    height: row.height,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  }
}

export function listMediaAssets() {
  const rows = getDatabase()
    .prepare(
      `SELECT id, storage_key, public_path, original_name, mime_type,
              width, height, size_bytes, created_at
       FROM media
       ORDER BY created_at DESC`,
    )
    .all() as unknown as MediaRow[]

  return rows.map(rowToMediaAsset)
}

export function getMediaAssetsByPublicPaths(publicPaths: Iterable<string>) {
  const statement = getDatabase().prepare(
    `SELECT id, storage_key, public_path, original_name, mime_type,
            width, height, size_bytes, created_at
     FROM media
     WHERE public_path = ?
     LIMIT 1`,
  )
  const assets = new Map<string, MediaAsset>()

  for (const publicPath of publicPaths) {
    const row = statement.get(publicPath) as MediaRow | undefined

    if (row) {
      assets.set(row.id, rowToMediaAsset(row))
    }
  }

  return [...assets.values()]
}

export async function saveUploadedImage(file: File) {
  if (!file.size || file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Images must be smaller than ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
    )
  }

  const input = Buffer.from(await file.arrayBuffer())
  const metadata = await sharp(input, { failOn: "error" }).metadata()
  const acceptedFormats = new Set(["jpeg", "png", "webp", "avif"])

  if (!metadata.format || !acceptedFormats.has(metadata.format)) {
    throw new Error("Upload a PNG, JPEG, WebP, or AVIF image.")
  }

  const processed = await sharp(input, { failOn: "error" })
    .rotate()
    .webp(
      metadata.format === "png"
        ? { lossless: true, effort: 4 }
        : { quality: 92, alphaQuality: 100, effort: 4 },
    )
    .toBuffer({ resolveWithObject: true })

  const now = new Date()
  const id = crypto.randomUUID()
  const storageKey = path.posix.join(
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${id}.webp`,
  )
  const mediaRoot = getMediaRoot()
  const destination = path.join(mediaRoot, ...storageKey.split("/"))
  const temporaryDestination = `${destination}.tmp-${crypto.randomUUID()}`

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(temporaryDestination, processed.data, { flag: "wx" })
  fs.renameSync(temporaryDestination, destination)

  const asset: MediaAsset = {
    id,
    storageKey,
    publicPath: `${MEDIA_PUBLIC_PATH}/${storageKey}`,
    originalName: path.basename(file.name || "upload"),
    mimeType: "image/webp",
    width: processed.info.width,
    height: processed.info.height,
    sizeBytes: processed.info.size,
    createdAt: now.toISOString(),
  }

  getDatabase()
    .prepare(
      `INSERT INTO media (
         id, storage_key, public_path, original_name, mime_type,
         width, height, size_bytes, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      asset.id,
      asset.storageKey,
      asset.publicPath,
      asset.originalName,
      asset.mimeType,
      asset.width,
      asset.height,
      asset.sizeBytes,
      asset.createdAt,
    )

  return asset
}

export function resolveMediaPath(segments: string[]) {
  const mediaRoot = getMediaRoot()
  const candidate = path.resolve(mediaRoot, ...segments)
  const relative = path.relative(mediaRoot, candidate)

  if (
    !segments.length ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    return null
  }

  return candidate
}

export function deleteMediaAssetFiles(assets: MediaAsset[]) {
  const failures: Array<{ asset: MediaAsset; error: unknown }> = []

  for (const asset of assets) {
    const filePath = resolveMediaPath(asset.storageKey.split("/"))

    if (!filePath) {
      failures.push({
        asset,
        error: new Error(`Invalid media storage key: ${asset.storageKey}`),
      })
      continue
    }

    try {
      fs.unlinkSync(filePath)
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue
      }

      failures.push({ asset, error })
    }
  }

  return failures
}

export function getMediaMimeType(filePath: string) {
  return (
    mimeTypesByExtension[path.extname(filePath).toLowerCase()] ??
    "application/octet-stream"
  )
}
