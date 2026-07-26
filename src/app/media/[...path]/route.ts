import fs from "node:fs/promises"
import {
  getMediaMimeType,
  resolveMediaPath,
} from "@/lib/cms/media"

type MediaRouteProps = {
  params: Promise<{ path: string[] }>
}

export async function GET(_request: Request, { params }: MediaRouteProps) {
  const { path } = await params
  const filePath = resolveMediaPath(path)

  if (!filePath) {
    return new Response(null, { status: 404 })
  }

  try {
    const file = await fs.readFile(filePath)

    return new Response(file, {
      headers: {
        "Content-Type": getMediaMimeType(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
