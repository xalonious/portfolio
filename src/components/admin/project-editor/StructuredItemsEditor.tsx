"use client"

import {
  TextAreaField,
  TextField,
} from "@/components/admin/project-editor/EditorControls"
import { moveItem } from "@/components/admin/project-editor/caseStudyUtils"
import { secondaryButton } from "@/components/admin/project-editor/styles"
import { getFieldError } from "@/components/admin/project-editor/validation"
import type { ProjectValidationIssue } from "@/lib/project-schema"
import type { CaseStudyContentBlock } from "@/lib/project-types"

export function StructuredItemsEditor({
  block,
  path,
  validationIssues,
  onChange,
}: {
  block: Extract<CaseStudyContentBlock, { type: "steps" | "details" }>
  path: Array<string | number>
  validationIssues: ProjectValidationIssue[]
  onChange: (block: CaseStudyContentBlock) => void
}) {
  return (
    <div className="space-y-4">
      {block.items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className="grid gap-3 border-b border-[--border] pb-4 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)_auto]"
        >
          <TextField
            label={block.type === "steps" ? `Step ${itemIndex + 1}` : "Label"}
            value={item.title}
            error={getFieldError(validationIssues, [
              ...path,
              "items",
              itemIndex,
              "title",
            ])}
            onChange={(title) => {
              const items = [...block.items]
              items[itemIndex] = { ...item, title }
              onChange({ ...block, items })
            }}
          />
          <TextAreaField
            label="Description"
            value={item.description}
            rows={3}
            error={getFieldError(validationIssues, [
              ...path,
              "items",
              itemIndex,
              "description",
            ])}
            onChange={(description) => {
              const items = [...block.items]
              items[itemIndex] = { ...item, description }
              onChange({ ...block, items })
            }}
          />
          <div className="flex items-end gap-1">
            <button
              type="button"
              disabled={itemIndex === 0}
              onClick={() =>
                onChange({
                  ...block,
                  items: moveItem(block.items, itemIndex, itemIndex - 1),
                })
              }
              className={secondaryButton}
            >
              ↑
            </button>
            <button
              type="button"
              disabled={itemIndex === block.items.length - 1}
              onClick={() =>
                onChange({
                  ...block,
                  items: moveItem(block.items, itemIndex, itemIndex + 1),
                })
              }
              className={secondaryButton}
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  items: block.items.filter((_, index) => index !== itemIndex),
                })
              }
              className={secondaryButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            ...block,
            items: [...block.items, { title: "", description: "" }],
          })
        }
        className={secondaryButton}
      >
        + Add {block.type === "steps" ? "step" : "detail"}
      </button>
    </div>
  )
}
