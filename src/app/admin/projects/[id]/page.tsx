import { notFound } from "next/navigation"
import { ProjectEditor } from "@/components/admin/ProjectEditor"
import { requireAdmin } from "@/lib/cms/auth"
import {
  getAdminProject,
  getProjectRevisions,
} from "@/lib/cms/project-repository"

type EditProjectPageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  await requireAdmin()
  const { id } = await params
  const project = getAdminProject(id)

  if (!project) {
    notFound()
  }

  return (
    <ProjectEditor
      initialDocument={project.document}
      initialStatus={project.status}
      revisions={getProjectRevisions(id)}
    />
  )
}
