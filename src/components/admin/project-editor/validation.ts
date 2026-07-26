import type { ProjectValidationIssue } from "@/lib/project-schema"

export function validationPathKey(path: Array<string | number>) {
  return path.join(".")
}

export function getFieldError(
  issues: ProjectValidationIssue[],
  path: Array<string | number>,
) {
  const key = validationPathKey(path)
  return issues.find((issue) => {
    const issueKey = validationPathKey(issue.path)
    return issueKey === key || issueKey.startsWith(`${key}.`)
  })?.message
}

export function formatValidationPath(path: Array<string | number>) {
  const topLevelLabels: Record<string, string> = {
    title: "Title",
    slug: "Slug",
    description: "Description",
    image: "Project image",
    imageAlt: "Project image alternative text",
    imageLayout: "Project image layout",
    tech: "Technology",
    repo: "Repository URL",
    sortOrder: "Sort order",
    caseStudy: "Case study",
  }

  if (path[0] !== "caseStudy") {
    return topLevelLabels[String(path[0])] ?? "Project"
  }

  const labels = ["Case study"]
  const sectionIndex = path[2]
  const blockIndex = path[4]
  const itemType = path[5]
  const itemIndex = path[6]
  const field = path.at(-1)

  if (path[1] !== "sections") {
    labels.push(
      { role: "Role", year: "Year", status: "Status" }[String(path[1])] ??
        "Details",
    )
    return labels.join(" → ")
  }

  if (typeof sectionIndex === "number") {
    labels.push(`Section ${sectionIndex + 1}`)
  }
  if (typeof blockIndex === "number") {
    labels.push(`Block ${blockIndex + 1}`)
  }
  if (
    (itemType === "items" || itemType === "images") &&
    typeof itemIndex === "number"
  ) {
    labels.push(
      `${itemType === "images" ? "Image" : "Item"} ${itemIndex + 1}`,
    )
  }

  const fieldLabels: Record<string, string> = {
    title: "Heading",
    eyebrow: "Eyebrow",
    paragraphs: "Paragraphs",
    highlights: "Highlights",
    description: "Description",
    src: "Image path",
    alt: "Alternative text",
    caption: "Caption",
    width: "Width",
    height: "Height",
    layout: "Layout",
    lightboxSize: "Lightbox",
  }
  const fieldLabel = fieldLabels[String(field)]
  if (fieldLabel) labels.push(fieldLabel)

  return labels.join(" → ")
}
