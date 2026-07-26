"use client"

import { useState } from "react"
import { Dropdown } from "@/components/admin/project-editor/EditorControls"
import {
  labelStyles,
  secondaryButton,
} from "@/components/admin/project-editor/styles"
import type { MediaAsset } from "@/lib/cms/media"

export function MediaPicker({
  media,
  uploadImage,
  onSelect,
}: {
  media: MediaAsset[]
  uploadImage: (file: File) => Promise<MediaAsset>
  onSelect: (asset: MediaAsset) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <span className={labelStyles}>Media library</span>
      <div className="mt-2 flex flex-col gap-2">
        <Dropdown
          value=""
          placeholder="Choose an existing image…"
          options={media.map((asset) => ({
            value: asset.id,
            label: asset.originalName,
          }))}
          onChange={(value) => {
            const asset = media.find((item) => item.id === value)
            if (asset) onSelect(asset)
          }}
        />
        <label className={`${secondaryButton} block text-center`}>
          {uploading ? "Uploading…" : "Upload new image"}
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
                onSelect(await uploadImage(file))
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
      </div>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  )
}
