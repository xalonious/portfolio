import { ProjectEditor } from "@/components/admin/ProjectEditor"
import { requireAdmin } from "@/lib/cms/auth"
import { listAdminProjects } from "@/lib/cms/project-repository"
import { createEmptyProjectDocument } from "@/lib/project-schema"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  await requireAdmin()
  const projects = listAdminProjects()

  return (
    <ProjectEditor
      initialDocument={createEmptyProjectDocument(projects.length)}
      initialStatus="draft"
      revisions={[]}
    />
  )
}
