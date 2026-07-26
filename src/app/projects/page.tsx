import { ProjectsIndex } from "@/components/pages/ProjectsIndex"
import { getPublishedProjects } from "@/lib/cms/project-repository"

export const dynamic = "force-dynamic"

export default function ProjectsPage() {
  return <ProjectsIndex projects={getPublishedProjects()} />
}
