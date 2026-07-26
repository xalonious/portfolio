import Link from "next/link"
import { requireAdmin } from "@/lib/cms/auth"
import { listAdminProjects } from "@/lib/cms/project-repository"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const projects = listAdminProjects()

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-28 sm:pt-32">
      <header className="flex flex-col gap-6 border-b border-[--border] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[--primary]">
            Private workspace
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold text-[--foreground]">
            Portfolio CMS
          </h1>
          <p className="mt-3 text-[--muted-foreground]">
            Create, edit, preview, and publish portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-sm bg-[--primary] px-4 py-2.5 text-sm font-semibold text-[--primary-foreground]"
        >
          New project
        </Link>
      </header>

      <section className="mt-10 overflow-hidden rounded-sm border border-[--border]">
        {projects.length ? (
          <div className="divide-y divide-[--border]">
            {projects.map(({ document, status, updatedAt }) => (
              <Link
                key={document.id}
                href={`/admin/projects/${document.id}`}
                className="grid gap-4 bg-[--card] px-5 py-5 transition hover:bg-[--muted]/60 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
              >
                <div>
                  <h2 className="font-display text-xl font-bold text-[--foreground]">
                    {document.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-sm text-[--muted-foreground]">
                    {document.description}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    status === "published"
                      ? "border-emerald-700/60 text-emerald-400"
                      : "border-amber-700/60 text-amber-300"
                  }`}
                >
                  {status}
                </span>
                <time
                  dateTime={updatedAt}
                  className="text-xs text-[--muted-foreground]"
                >
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(updatedAt))}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <p className="bg-[--card] px-6 py-12 text-center text-[--muted-foreground]">
            No projects yet.
          </p>
        )}
      </section>
    </main>
  )
}
