"use client"

import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/project-editor/EditorControls"
import { ImagesEditor } from "@/components/admin/project-editor/ImagesEditor"
import { StructuredItemsEditor } from "@/components/admin/project-editor/StructuredItemsEditor"
import {
  blockTypes,
  createBlock,
  createSection,
  moveItem,
  normalizeLines,
  normalizeParagraphs,
  sectionTypes,
} from "@/components/admin/project-editor/caseStudyUtils"
import { secondaryButton } from "@/components/admin/project-editor/styles"
import { getFieldError } from "@/components/admin/project-editor/validation"
import type { MediaAsset } from "@/lib/cms/media"
import type {
  ProjectDocument,
  ProjectValidationIssue,
} from "@/lib/project-schema"
import type {
  CaseStudyContentBlock,
  CaseStudySection,
} from "@/lib/project-types"

export function CaseStudyEditor({
  caseStudy,
  validationIssues,
  uploadImage,
  onChange,
}: {
  caseStudy: NonNullable<ProjectDocument["caseStudy"]>
  validationIssues: ProjectValidationIssue[]
  uploadImage: (file: File) => Promise<MediaAsset>
  onChange: (caseStudy: NonNullable<ProjectDocument["caseStudy"]>) => void
}) {
  function updateSection(index: number, section: CaseStudySection) {
    const sections = [...caseStudy.sections]
    sections[index] = section
    onChange({ ...caseStudy, sections })
  }

  return (
    <div className="space-y-6 border-t border-[--border] pt-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Role"
          value={caseStudy.role ?? ""}
          error={getFieldError(validationIssues, ["caseStudy", "role"])}
          onChange={(role) => onChange({ ...caseStudy, role })}
        />
        <TextField
          label="Year"
          value={caseStudy.year ?? ""}
          error={getFieldError(validationIssues, ["caseStudy", "year"])}
          onChange={(year) => onChange({ ...caseStudy, year })}
        />
        <TextField
          label="Status"
          value={caseStudy.status ?? ""}
          error={getFieldError(validationIssues, ["caseStudy", "status"])}
          onChange={(status) => onChange({ ...caseStudy, status })}
        />
      </div>

      <div className="space-y-5">
        {caseStudy.sections.map((section, sectionIndex) => (
          <SectionEditor
            key={`${section.type}-${sectionIndex}`}
            section={section}
            index={sectionIndex}
            total={caseStudy.sections.length}
            validationIssues={validationIssues}
            uploadImage={uploadImage}
            onChange={(next) => updateSection(sectionIndex, next)}
            onMove={(direction) =>
              onChange({
                ...caseStudy,
                sections: moveItem(
                  caseStudy.sections,
                  sectionIndex,
                  sectionIndex + direction,
                ),
              })
            }
            onRemove={() =>
              onChange({
                ...caseStudy,
                sections: caseStudy.sections.filter(
                  (_, index) => index !== sectionIndex,
                ),
              })
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            ...caseStudy,
            sections: [...caseStudy.sections, createSection()],
          })
        }
        className={secondaryButton}
      >
        + Add section
      </button>
    </div>
  )
}

function SectionEditor({
  section,
  index,
  total,
  validationIssues,
  uploadImage,
  onChange,
  onMove,
  onRemove,
}: {
  section: CaseStudySection
  index: number
  total: number
  validationIssues: ProjectValidationIssue[]
  uploadImage: (file: File) => Promise<MediaAsset>
  onChange: (section: CaseStudySection) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}) {
  function updateBlock(blockIndex: number, block: CaseStudyContentBlock) {
    const content = [...section.content]
    content[blockIndex] = block
    onChange({ ...section, content })
  }

  return (
    <section className="rounded-sm border border-[--border] bg-[--background]/60 p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[--foreground]">
          Section {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className={secondaryButton}
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className={secondaryButton}
            aria-label="Move section down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className={secondaryButton}
          >
            Remove
          </button>
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Type"
          value={section.type}
          options={sectionTypes}
          error={getFieldError(validationIssues, [
            "caseStudy",
            "sections",
            index,
            "type",
          ])}
          onChange={(type) =>
            onChange({
              ...section,
              type: type as CaseStudySection["type"],
            })
          }
        />
        <TextField
          label="Eyebrow"
          value={section.eyebrow ?? ""}
          error={getFieldError(validationIssues, [
            "caseStudy",
            "sections",
            index,
            "eyebrow",
          ])}
          onChange={(eyebrow) => onChange({ ...section, eyebrow })}
        />
        <TextField
          label="Heading"
          value={section.title}
          error={getFieldError(validationIssues, [
            "caseStudy",
            "sections",
            index,
            "title",
          ])}
          onChange={(title) => onChange({ ...section, title })}
        />
      </div>

      <div className="mt-5 space-y-4 border-t border-[--border] pt-5">
        {section.content.map((block, blockIndex) => (
          <BlockEditor
            key={`${block.type}-${blockIndex}`}
            block={block}
            index={blockIndex}
            total={section.content.length}
            path={[
              "caseStudy",
              "sections",
              index,
              "content",
              blockIndex,
            ]}
            validationIssues={validationIssues}
            uploadImage={uploadImage}
            onChange={(next) => updateBlock(blockIndex, next)}
            onMove={(direction) =>
              onChange({
                ...section,
                content: moveItem(
                  section.content,
                  blockIndex,
                  blockIndex + direction,
                ),
              })
            }
            onRemove={() =>
              onChange({
                ...section,
                content: section.content.filter(
                  (_, index) => index !== blockIndex,
                ),
              })
            }
          />
        ))}

        <div className="flex flex-wrap gap-2">
          {blockTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                onChange({
                  ...section,
                  content: [...section.content, createBlock(type)],
                })
              }
              className={secondaryButton}
            >
              + {type}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlockEditor({
  block,
  index,
  total,
  path,
  validationIssues,
  uploadImage,
  onChange,
  onMove,
  onRemove,
}: {
  block: CaseStudyContentBlock
  index: number
  total: number
  path: Array<string | number>
  validationIssues: ProjectValidationIssue[]
  uploadImage: (file: File) => Promise<MediaAsset>
  onChange: (block: CaseStudyContentBlock) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-sm border border-[--border] bg-[--card] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold capitalize text-[--primary]">
          {block.type}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className={secondaryButton}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className={secondaryButton}
          >
            ↓
          </button>
          <button type="button" onClick={onRemove} className={secondaryButton}>
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4">
        {block.type === "paragraphs" && (
          <TextAreaField
            label="Paragraphs (separate with a blank line)"
            value={block.paragraphs.join("\n\n")}
            rows={8}
            error={getFieldError(validationIssues, [...path, "paragraphs"])}
            onChange={(value) =>
              onChange({ ...block, paragraphs: normalizeParagraphs(value) })
            }
          />
        )}

        {block.type === "highlights" && (
          <TextAreaField
            label="Highlights (one per line)"
            value={block.highlights.join("\n")}
            rows={5}
            error={getFieldError(validationIssues, [...path, "highlights"])}
            onChange={(value) =>
              onChange({ ...block, highlights: normalizeLines(value) })
            }
          />
        )}

        {(block.type === "steps" || block.type === "details") && (
          <StructuredItemsEditor
            block={block}
            path={path}
            validationIssues={validationIssues}
            onChange={onChange}
          />
        )}

        {block.type === "images" && (
          <ImagesEditor
            block={block}
            path={path}
            validationIssues={validationIssues}
            uploadImage={uploadImage}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  )
}
