import { z } from "zod"
import type {
  CaseStudy,
  CaseStudyContentBlock,
  CaseStudyImage,
  CaseStudySection,
  Project,
} from "@/lib/project-types"

const requiredText = (label: string, maximum: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maximum, `${label} must be ${maximum} characters or fewer.`)

const optionalText = (maximum: number, label = "This field") =>
  z
    .string()
    .trim()
    .max(maximum, `${label} must be ${maximum} characters or fewer.`)
    .optional()
    .transform((value) => value || undefined)

export const caseStudyImageSchema: z.ZodType<CaseStudyImage> = z.object({
  src: requiredText("Image", 2048),
  alt: requiredText("Image alternative text", 500),
  caption: optionalText(1000, "Image caption"),
  width: z
    .number()
    .int("Image width must be a whole number.")
    .positive("Image width must be greater than zero.")
    .max(20000, "Image width cannot exceed 20,000 pixels."),
  height: z
    .number()
    .int("Image height must be a whole number.")
    .positive("Image height must be greater than zero.")
    .max(20000, "Image height cannot exceed 20,000 pixels."),
  layout: z.enum(["wide", "inset"]).optional(),
  lightboxSize: z.enum(["compact", "standard", "wide"]).optional(),
})

const structuredItemSchema = z.object({
  title: requiredText("Item title", 200),
  description: requiredText("Item description", 3000),
})

export const caseStudyContentBlockSchema: z.ZodType<CaseStudyContentBlock> =
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("paragraphs"),
      paragraphs: z
        .array(requiredText("Paragraph", 10000))
        .max(30, "Use no more than 30 paragraphs in one block."),
    }),
    z.object({
      type: z.literal("highlights"),
      highlights: z
        .array(requiredText("Highlight", 3000))
        .max(30, "Use no more than 30 highlights in one block."),
    }),
    z.object({
      type: z.literal("steps"),
      items: z
        .array(structuredItemSchema)
        .max(12, "Use no more than 12 steps in one block."),
    }),
    z.object({
      type: z.literal("details"),
      items: z
        .array(structuredItemSchema)
        .max(30, "Use no more than 30 details in one block."),
    }),
    z.object({
      type: z.literal("images"),
      images: z
        .array(caseStudyImageSchema)
        .max(12, "Use no more than 12 images in one block."),
    }),
  ])

export const caseStudySectionSchema: z.ZodType<CaseStudySection> = z.object({
  type: z.enum([
    "overview",
    "context",
    "role",
    "architecture",
    "features",
    "challenge",
    "decisions",
    "learnings",
    "improvements",
  ]),
  eyebrow: optionalText(100, "Section eyebrow"),
  title: requiredText("Section heading", 300),
  content: z
    .array(caseStudyContentBlockSchema)
    .max(30, "Use no more than 30 content blocks in one section."),
})

export const caseStudySchema: z.ZodType<CaseStudy> = z.object({
  role: optionalText(200, "Role"),
  year: optionalText(50, "Year"),
  status: optionalText(200, "Status"),
  sections: z
    .array(caseStudySectionSchema)
    .max(30, "Use no more than 30 case-study sections."),
})

export const projectDocumentSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120, "Slug must be 120 characters or fewer.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  title: requiredText("Title", 200),
  description: requiredText("Description", 2000),
  image: requiredText("Project image", 2048),
  imageAlt: requiredText("Project image alternative text", 500),
  imageLayout: z.enum(["portrait", "landscape"]).optional(),
  tech: z
    .array(requiredText("Technology", 80))
    .max(30, "Use no more than 30 technologies."),
  repo: optionalText(2048, "Repository URL"),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
  caseStudy: caseStudySchema.nullable(),
})

export type ProjectDocument = z.infer<typeof projectDocumentSchema>

export type ProjectValidationIssue = {
  path: Array<string | number>
  message: string
}

export function projectValidationIssuesFromError(
  error: z.ZodError,
): ProjectValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map((segment) =>
      typeof segment === "number" ? segment : String(segment),
    ),
    message: issue.message,
  }))
}

export function getProjectValidationIssues(input: unknown) {
  const result = projectDocumentSchema.safeParse(input)
  return result.success
    ? []
    : projectValidationIssuesFromError(result.error)
}

export function slugifyProjectTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function documentToPublicProject(document: ProjectDocument): Project {
  const base = {
    title: document.title,
    description: document.description,
    image: document.image,
    imageAlt: document.imageAlt,
    imageLayout: document.imageLayout,
    tech: document.tech,
    repo: document.repo,
    featured: document.featured,
  }

  if (document.caseStudy) {
    return {
      ...base,
      slug: document.slug,
      imageAlt: document.imageAlt,
      caseStudy: document.caseStudy,
    }
  }

  return base
}

export function createEmptyProjectDocument(sortOrder = 0): ProjectDocument {
  return {
    slug: "",
    title: "",
    description: "",
    image: "",
    imageAlt: "",
    tech: [],
    repo: undefined,
    featured: false,
    sortOrder,
    caseStudy: {
      role: "",
      year: String(new Date().getFullYear()),
      status: "In development",
      sections: [],
    },
  }
}
