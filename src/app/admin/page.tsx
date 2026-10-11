import Link from "next/link"
import { ProjectOrderList } from "@/components/admin/ProjectOrderList"
import { requireAdmin } from "@/lib/cms/auth"
import { listAdminProjects } from "@/lib/cms/project-repository"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const projects = listAdminProjects()

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-28 sm:pt-32">
      <header className="flex flex-col gap-6 border-b light:border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] light:text-primary-ink">
            Private workspace
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold light:text-foreground">
            Portfolio CMS
          </h1>
          <p className="mt-3 light:text-muted-foreground">
            Create, edit, preview, and publish portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-sm light:bg-primary px-4 py-2.5 text-sm font-semibold light:text-primary-foreground"
        >
          New project
        </Link>
      </header>

      <section className="mt-10 overflow-hidden rounded-sm border light:border-border">
        {projects.length ? (
          <ProjectOrderList
            initialProjects={projects.map(
              ({ document, status, updatedAt }) => ({
                id: document.id!,
                title: document.title,
                description: document.description,
                status,
                updatedAt,
              }),
            )}
          />
        ) : (
          <p className="light:bg-card px-6 py-12 text-center light:text-muted-foreground">
            No projects yet.
          </p>
        )}
      </section>
    </main>
  )
}
