import type {
  CaseStudyContentBlock,
  CaseStudySection,
} from "@/lib/project-types"

export const sectionTypes: CaseStudySection["type"][] = [
  "overview",
  "context",
  "role",
  "architecture",
  "features",
  "challenge",
  "decisions",
  "learnings",
  "improvements",
]

export const blockTypes: CaseStudyContentBlock["type"][] = [
  "paragraphs",
  "highlights",
  "steps",
  "details",
  "images",
]

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function createBlock(
  type: CaseStudyContentBlock["type"],
): CaseStudyContentBlock {
  switch (type) {
    case "paragraphs":
      return { type, paragraphs: [] }
    case "highlights":
      return { type, highlights: [] }
    case "steps":
    case "details":
      return { type, items: [] }
    case "images":
      return { type, images: [] }
  }
}

export function createSection(): CaseStudySection {
  return {
    type: "overview",
    eyebrow: "Overview",
    title: "",
    content: [],
  }
}

export function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function normalizeParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
