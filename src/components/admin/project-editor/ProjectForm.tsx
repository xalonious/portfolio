"use client"

import { CaseStudyEditor } from "@/components/admin/project-editor/CaseStudyEditor"
import {
  EditorPanel,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/project-editor/EditorControls"
import { MediaUpload } from "@/components/admin/project-editor/MediaUpload"
import { getFieldError } from "@/components/admin/project-editor/validation"
import type { MediaAsset } from "@/lib/cms/media"
import {
  slugifyProjectTitle,
  type ProjectDocument,
  type ProjectValidationIssue,
} from "@/lib/project-schema"

export function ProjectForm({
  document,
  validationIssues,
  isPending,
  uploadImage,
  onChange,
  onDelete,
}: {
  document: ProjectDocument
  validationIssues: ProjectValidationIssue[]
  isPending: boolean
  uploadImage: (file: File) => Promise<MediaAsset>
  onChange: (patch: Partial<ProjectDocument>) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-8">
      <EditorPanel eyebrow="Project" title="Metadata">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Title"
            value={document.title}
            error={getFieldError(validationIssues, ["title"])}
            onChange={(title) => {
              const shouldGenerateSlug =
                !document.slug ||
                document.slug === slugifyProjectTitle(document.title)
              onChange({
                title,
                slug: shouldGenerateSlug
                  ? slugifyProjectTitle(title)
                  : document.slug,
              })
            }}
          />
          <TextField
            label="Slug"
            value={document.slug}
            error={getFieldError(validationIssues, ["slug"])}
            onChange={(slug) =>
              onChange({
                slug: slugifyProjectTitle(slug),
              })
            }
          />
        </div>

        <TextAreaField
          label="Description"
          value={document.description}
          rows={4}
          error={getFieldError(validationIssues, ["description"])}
          onChange={(description) => onChange({ description })}
        />

        <TextField
          label="Repository URL"
          value={document.repo ?? ""}
          error={getFieldError(validationIssues, ["repo"])}
          onChange={(repo) => onChange({ repo })}
        />

        <TextField
          label="Technology (comma separated)"
          value={document.tech.join(", ")}
          error={getFieldError(validationIssues, ["tech"])}
          onChange={(value) =>
            onChange({
              tech: value
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean),
            })
          }
        />

        <label className="flex items-center gap-3 text-sm text-[--foreground]">
          <input
            type="checkbox"
            checked={document.featured}
            onChange={(event) => onChange({ featured: event.target.checked })}
          />
          Feature this project on the homepage
        </label>
      </EditorPanel>

      <EditorPanel eyebrow="Media" title="Project image">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Image path"
            value={document.image}
            error={getFieldError(validationIssues, ["image"])}
            onChange={(image) => onChange({ image })}
          />
          <TextField
            label="Alternative text"
            value={document.imageAlt}
            error={getFieldError(validationIssues, ["imageAlt"])}
            onChange={(imageAlt) => onChange({ imageAlt })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Image layout"
            value={document.imageLayout ?? "landscape"}
            error={getFieldError(validationIssues, ["imageLayout"])}
            options={["landscape", "portrait"]}
            onChange={(value) =>
              onChange({
                imageLayout: value as "landscape" | "portrait",
              })
            }
          />
          <MediaUpload
            uploadImage={uploadImage}
            onUpload={(asset) =>
              onChange({
                image: asset.publicPath,
                imageAlt:
                  document.imageAlt ||
                  asset.originalName.replace(/\.[^.]+$/, ""),
              })
            }
          />
        </div>
      </EditorPanel>

      <EditorPanel eyebrow="Case study" title="Content">
        <label className="flex items-center gap-3 text-sm text-[--foreground]">
          <input
            type="checkbox"
            checked={Boolean(document.caseStudy)}
            onChange={(event) =>
              onChange({
                caseStudy: event.target.checked
                  ? {
                      role: "",
                      year: String(new Date().getFullYear()),
                      status: "",
                      sections: [],
                    }
                  : null,
              })
            }
          />
          Publish a dedicated case-study page
        </label>

        {document.caseStudy && (
          <CaseStudyEditor
            caseStudy={document.caseStudy}
            validationIssues={validationIssues}
            uploadImage={uploadImage}
            onChange={(caseStudy) => onChange({ caseStudy })}
          />
        )}
      </EditorPanel>

      {document.id && (
        <EditorPanel eyebrow="Danger zone" title="Project deletion">
          <p className="text-sm leading-6 text-[--muted-foreground]">
            This removes the project, its draft, and its revision history. Every
            image referenced by them is also permanently deleted. Uploaded media
            that was never attached to this project is retained.
          </p>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="mt-5 rounded-sm border border-red-800/70 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950/30"
          >
            Delete project
          </button>
        </EditorPanel>
      )}
    </div>
  )
}
