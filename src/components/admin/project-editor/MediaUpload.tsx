"use client"

import { useState } from "react"
import {
  labelStyles,
  secondaryButton,
} from "@/components/admin/project-editor/styles"
import type { MediaAsset } from "@/lib/cms/media"

export function MediaUpload({
  uploadImage,
  onUpload,
}: {
  uploadImage: (file: File) => Promise<MediaAsset>
  onUpload: (asset: MediaAsset) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <span className={labelStyles}>Upload image</span>
      <label className={`${secondaryButton} mt-2 block text-center`}>
        {uploading ? "Uploading\u2026" : "Choose image"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          disabled={uploading}
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (!file) return

            setUploading(true)
            setError(null)
            try {
              onUpload(await uploadImage(file))
            } catch (uploadError) {
              setError(
                uploadError instanceof Error
                  ? uploadError.message
                  : "Upload failed.",
              )
            } finally {
              setUploading(false)
            }
          }}
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  )
}
