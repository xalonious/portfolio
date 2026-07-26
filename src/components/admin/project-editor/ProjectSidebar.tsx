"use client"

import { labelStyles } from "@/components/admin/project-editor/styles"
import type { ProjectRevision } from "@/lib/cms/project-repository"

export function ProjectSidebar({
  revisions,
  isPending,
  onRestoreRevision,
}: {
  revisions: ProjectRevision[]
  isPending: boolean
  onRestoreRevision: (revisionId: string) => void
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-sm border border-[--border] bg-[--card] p-5">
        <p className={labelStyles}>Publishing</p>
        <p className="mt-3 text-sm leading-6 text-[--muted-foreground]">
          Saving keeps changes private. Publishing updates the website, creates
          a revision, and exposes the project through the shared database view.
        </p>
      </section>

      {revisions.length > 0 && (
        <section className="rounded-sm border border-[--border] bg-[--card] p-5">
          <p className={labelStyles}>Published revisions</p>
          <div className="mt-4 space-y-3">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="border-b border-[--border] pb-3 last:border-0 last:pb-0"
              >
                <time
                  dateTime={revision.createdAt}
                  className="block text-xs text-[--muted-foreground]"
                >
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(revision.createdAt))}
                </time>
                <button
                  type="button"
                  onClick={() => onRestoreRevision(revision.id)}
                  disabled={isPending}
                  className="mt-2 text-xs font-medium text-[--primary] hover:underline"
                >
                  Restore to draft
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </aside>
  )
}
