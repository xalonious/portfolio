import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy"
import { getPublishedProjectBySlug } from "@/lib/cms/project-repository"
import { isProjectWithCaseStudy } from "@/lib/project-types"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getPublishedProjectBySlug(slug)

  if (!project || !isProjectWithCaseStudy(project)) {
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
  const project = getPublishedProjectBySlug(slug)

  if (!project || !isProjectWithCaseStudy(project)) {
    notFound()
  }

  return <ProjectCaseStudy project={project} />
}
