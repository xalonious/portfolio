export type CaseStudySectionType =
  | "overview"
  | "context"
  | "role"
  | "architecture"
  | "features"
  | "challenge"
  | "decisions"
  | "learnings"
  | "improvements"

export type CaseStudyImage = {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
  layout?: "wide" | "inset"
  lightboxSize?: "compact" | "standard" | "wide"
}

export type CaseStudyStructuredItem = {
  title: string
  description: string
}

export type CaseStudyContentBlock =
  | {
      type: "paragraphs"
      paragraphs: string[]
    }
  | {
      type: "highlights"
      highlights: string[]
    }
  | {
      type: "steps"
      items: CaseStudyStructuredItem[]
    }
  | {
      type: "details"
      items: CaseStudyStructuredItem[]
    }
  | {
      type: "images"
      images: CaseStudyImage[]
    }

export type CaseStudySection = {
  type: CaseStudySectionType
  eyebrow?: string
  title: string
  content: CaseStudyContentBlock[]
}

export type CaseStudy = {
  role?: string
  year?: string
  status?: string
  sections: CaseStudySection[]
}

type ProjectBase = {
  title: string
  description: string
  image: string
  imageAlt?: string
  imageLayout?: "portrait" | "landscape"
  tech: string[]
  repo?: string
  featured?: boolean
}

export type ProjectWithCaseStudy = ProjectBase & {
  slug: string
  imageAlt: string
  caseStudy: CaseStudy
}

export type ProjectWithoutCaseStudy = ProjectBase & {
  slug?: never
  caseStudy?: never
}

export type Project = ProjectWithCaseStudy | ProjectWithoutCaseStudy

export function isProjectWithCaseStudy(
  project: Project,
): project is ProjectWithCaseStudy {
  return project.caseStudy !== undefined
}
