"use client"

import {
  NumberField,
  SelectField,
  TextField,
} from "@/components/admin/project-editor/EditorControls"
import { MediaUpload } from "@/components/admin/project-editor/MediaUpload"
import { moveItem } from "@/components/admin/project-editor/caseStudyUtils"
import { secondaryButton } from "@/components/admin/project-editor/styles"
import { getFieldError } from "@/components/admin/project-editor/validation"
import type { MediaAsset } from "@/lib/cms/media"
import type { ProjectValidationIssue } from "@/lib/project-schema"
import type { CaseStudyContentBlock } from "@/lib/project-types"

export function ImagesEditor({
  block,
  path,
  validationIssues,
  uploadImage,
  onChange,
}: {
  block: Extract<CaseStudyContentBlock, { type: "images" }>
  path: Array<string | number>
  validationIssues: ProjectValidationIssue[]
  uploadImage: (file: File) => Promise<MediaAsset>
  onChange: (block: CaseStudyContentBlock) => void
}) {
  function appendAsset(asset: MediaAsset) {
    onChange({
      ...block,
      images: [
        ...block.images,
        {
          src: asset.publicPath,
          alt: asset.originalName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          width: asset.width ?? 1200,
          height: asset.height ?? 675,
          layout: "wide",
          lightboxSize: "standard",
        },
      ],
    })
  }

  return (
    <div className="space-y-5">
      {block.images.map((image, imageIndex) => (
        <div
          key={`${image.src}-${imageIndex}`}
          className="space-y-4 border-b border-[--border] pb-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Image path"
              value={image.src}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "src",
              ])}
              onChange={(src) => {
                const images = [...block.images]
                images[imageIndex] = { ...image, src }
                onChange({ ...block, images })
              }}
            />
            <TextField
              label="Alternative text"
              value={image.alt}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "alt",
              ])}
              onChange={(alt) => {
                const images = [...block.images]
                images[imageIndex] = { ...image, alt }
                onChange({ ...block, images })
              }}
            />
          </div>
          <TextField
            label="Caption"
            value={image.caption ?? ""}
            error={getFieldError(validationIssues, [
              ...path,
              "images",
              imageIndex,
              "caption",
            ])}
            onChange={(caption) => {
              const images = [...block.images]
              images[imageIndex] = { ...image, caption }
              onChange({ ...block, images })
            }}
          />
          <div className="grid gap-4 sm:grid-cols-4">
            <NumberField
              label="Width"
              value={image.width}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "width",
              ])}
              onChange={(width) => {
                const images = [...block.images]
                images[imageIndex] = { ...image, width }
                onChange({ ...block, images })
              }}
            />
            <NumberField
              label="Height"
              value={image.height}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "height",
              ])}
              onChange={(height) => {
                const images = [...block.images]
                images[imageIndex] = { ...image, height }
                onChange({ ...block, images })
              }}
            />
            <SelectField
              label="Layout"
              value={image.layout ?? "wide"}
              options={["wide", "inset"]}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "layout",
              ])}
              onChange={(layout) => {
                const images = [...block.images]
                images[imageIndex] = {
                  ...image,
                  layout: layout as "wide" | "inset",
                }
                onChange({ ...block, images })
              }}
            />
            <SelectField
              label="Lightbox"
              value={image.lightboxSize ?? "standard"}
              options={["compact", "standard", "wide"]}
              error={getFieldError(validationIssues, [
                ...path,
                "images",
                imageIndex,
                "lightboxSize",
              ])}
              onChange={(lightboxSize) => {
                const images = [...block.images]
                images[imageIndex] = {
                  ...image,
                  lightboxSize: lightboxSize as
                    | "compact"
                    | "standard"
                    | "wide",
                }
                onChange({ ...block, images })
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={imageIndex === 0}
              onClick={() =>
                onChange({
                  ...block,
                  images: moveItem(block.images, imageIndex, imageIndex - 1),
                })
              }
              className={secondaryButton}
            >
              Move up
            </button>
            <button
              type="button"
              disabled={imageIndex === block.images.length - 1}
              onClick={() =>
                onChange({
                  ...block,
                  images: moveItem(block.images, imageIndex, imageIndex + 1),
                })
              }
              className={secondaryButton}
            >
              Move down
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  images: block.images.filter((_, index) => index !== imageIndex),
                })
              }
              className={secondaryButton}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <MediaUpload
        uploadImage={uploadImage}
        onUpload={appendAsset}
      />
    </div>
  )
}
