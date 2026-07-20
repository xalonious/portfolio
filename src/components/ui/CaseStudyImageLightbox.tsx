"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { CaseStudyImage } from "@/lib/projects"

type CaseStudyImageLightboxProps = {
  image: CaseStudyImage
  sizes: string
}

const lightboxWidths = {
  compact: {
    default: "w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[min(82vw,32rem)]",
    zoomed: "w-[160vw] max-w-none sm:w-full sm:max-w-[min(90vw,42rem)]",
    header: "sm:max-w-[min(90vw,42rem)]",
    defaultSizes: "(min-width: 640px) 32rem, 100vw",
    zoomedSizes: "(min-width: 640px) 42rem, 160vw",
  },
  standard: {
    default: "w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[min(82vw,64rem)]",
    zoomed: "w-[180vw] max-w-none sm:w-full sm:max-w-[min(92vw,80rem)]",
    header: "sm:max-w-[min(92vw,80rem)]",
    defaultSizes: "(min-width: 640px) 64rem, 100vw",
    zoomedSizes: "(min-width: 640px) 80rem, 180vw",
  },
  wide: {
    default: "w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[min(82vw,80rem)]",
    zoomed: "w-[200vw] max-w-none sm:w-full sm:max-w-[min(96vw,110rem)]",
    header: "sm:max-w-[min(96vw,110rem)]",
    defaultSizes: "(min-width: 640px) 80rem, 100vw",
    zoomedSizes: "(min-width: 640px) 110rem, 200vw",
  },
} as const

export function CaseStudyImageLightbox({ image, sizes }: CaseStudyImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const widthPreset = lightboxWidths[image.lightboxSize ?? "wide"]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return

    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Expand image: ${image.alt}`}
        className="group relative block w-full overflow-hidden rounded-sm border border-[--border] bg-[--card] p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[--primary]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="h-auto w-full rounded-[1px] object-contain transition duration-300 group-hover:brightness-75"
        />
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-sm border border-white/15 bg-black/75 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 3.5h-4v4M12.5 3.5h4v4M7.5 16.5h-4v-4M12.5 16.5h4v-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Expand
        </span>
      </button>

      {isOpen && (
        <dialog
          ref={dialogRef}
          aria-label={`Expanded image: ${image.alt}`}
          onClose={() => {
            setIsOpen(false)
            setIsZoomed(false)
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close()
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-transparent p-3 text-[--foreground] backdrop:bg-black/90 sm:p-6"
        >
          <div className="flex min-h-full w-full flex-col items-center gap-4">
            <div
              className={`sticky top-0 z-10 flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-end gap-2 bg-black/80 py-2 backdrop-blur-sm sm:justify-between sm:gap-4 ${widthPreset.header}`}
            >
              <p className="hidden truncate text-xs text-white/70 sm:block sm:text-sm">
                {image.caption ?? image.alt}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed((zoomed) => !zoomed)}
                  aria-pressed={isZoomed}
                  className="rounded-sm border border-white/20 bg-black/55 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
                >
                  {isZoomed ? "Zoom out" : "Zoom in"}
                </button>
                <a
                  href={image.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-white/20 bg-black/55 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
                >
                  Open original
                </a>
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  aria-label="Close expanded image"
                  className="grid h-9 w-9 place-items-center rounded-sm border border-white/20 bg-black/55 text-xl leading-none text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>

            <div
              className={`flex w-full overflow-x-auto pb-2 ${
                isZoomed ? "justify-start sm:justify-center" : "justify-center"
              }`}
            >
              <button
                type="button"
                onClick={() => setIsZoomed((zoomed) => !zoomed)}
                aria-label={isZoomed ? "Zoom image out" : "Zoom image in"}
                className={`block shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isZoomed ? widthPreset.zoomed : widthPreset.default
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={isZoomed ? widthPreset.zoomedSizes : widthPreset.defaultSizes}
                  className="h-auto w-full rounded-sm border border-white/15 bg-black object-contain shadow-2xl"
                />
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
