"use client"

import { useEffect, useRef, useState } from "react"
import type { MediaAsset } from "@/lib/cms/media"
import { getProjectImageSources } from "@/lib/project-images"
import type { ProjectDocument } from "@/lib/project-schema"

export function usePendingProjectImages() {
  const pendingImages = useRef(new Map<string, File>())
  const mounted = useRef(true)
  const preparingCount = useRef(0)
  const [isPreparing, setIsPreparing] = useState(false)

  useEffect(() => {
    mounted.current = true
    const images = pendingImages.current
    return () => {
      mounted.current = false
      for (const source of images.keys()) URL.revokeObjectURL(source)
      images.clear()
    }
  }, [])

  function discardImages() {
    for (const source of pendingImages.current.keys()) {
      URL.revokeObjectURL(source)
    }
    pendingImages.current.clear()
  }

  async function stageImage(file: File): Promise<MediaAsset> {
    preparingCount.current++
    setIsPreparing(true)
    try {
      if (
        !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)
      ) {
        throw new Error("Choose a PNG, JPEG, WebP, or AVIF image.")
      }

      const bitmap = await createImageBitmap(file)
      const width = bitmap.width
      const height = bitmap.height
      bitmap.close()
      if (!mounted.current) throw new Error("The editor was closed.")

      const source = URL.createObjectURL(file)
      pendingImages.current.set(source, file)
      return {
        id: crypto.randomUUID(),
        storageKey: "",
        publicPath: source,
        originalName: file.name,
        mimeType: file.type,
        width,
        height,
        sizeBytes: file.size,
        createdAt: new Date().toISOString(),
      }
    } finally {
      preparingCount.current--
      if (mounted.current) setIsPreparing(preparingCount.current > 0)
    }
  }

  function createSaveForm(document: ProjectDocument, publish: boolean) {
    if (preparingCount.current) throw new Error("Wait for the image preview to finish.")

    const formData = new FormData()
    formData.set("document", JSON.stringify(document))
    formData.set("publish", String(publish))
    for (const source of getProjectImageSources(document)) {
      const file = pendingImages.current.get(source)
      if (file) formData.set(`image:${source}`, file)
    }
    return formData
  }

  return { stageImage, createSaveForm, discardImages, isPreparing }
}
