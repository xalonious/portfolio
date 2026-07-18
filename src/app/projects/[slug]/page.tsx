import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy"
import { getProjectBySlug, getProjectsWithCaseStudies } from "@/lib/projects"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getProjectsWithCaseStudies().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return {
    title: {
      absolute: project.title,
    },
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectCaseStudy project={project} />
}
