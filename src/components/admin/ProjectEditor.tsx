"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import {
  deleteProjectAction,
  restoreRevisionAction,
} from "@/app/admin/actions"
import { ProjectForm } from "@/components/admin/project-editor/ProjectForm"
import { ProjectSidebar } from "@/components/admin/project-editor/ProjectSidebar"
import { secondaryButton } from "@/components/admin/project-editor/styles"
import { usePendingProjectImages } from "@/components/admin/project-editor/usePendingProjectImages"
import {
  formatValidationPath,
  validationPathKey,
} from "@/components/admin/project-editor/validation"
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy"
import type { ProjectRevision } from "@/lib/cms/project-repository"
import {
  documentToPublicProject,
  getProjectValidationIssues,
  type ProjectDocument,
  type ProjectValidationIssue,
} from "@/lib/project-schema"
import type { ProjectWithCaseStudy } from "@/lib/project-types"

type ProjectEditorProps = {
  initialDocument: ProjectDocument
  initialStatus: "draft" | "published"
  revisions: ProjectRevision[]
}

function validationMessage(issues: ProjectValidationIssue[]) {
  return `Please fix ${
    issues.length === 1
      ? "the validation error"
      : `${issues.length} validation errors`
  } below.`
}

export function ProjectEditor({
  initialDocument,
  initialStatus,
  revisions,
}: ProjectEditorProps) {
  const router = useRouter()
  const [document, setDocument] = useState(initialDocument)
  const [status, setStatus] = useState(initialStatus)
  const [view, setView] = useState<"edit" | "preview">("edit")
  const [message, setMessage] = useState<string | null>(null)
  const [validationIssues, setValidationIssues] = useState<
    ProjectValidationIssue[]
  >([])
  const validationSummaryRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const { stageImage, createSaveForm, discardImages, isPreparing } =
    usePendingProjectImages()
  const isBusy = isPending || isPreparing

  function updateDocument(patch: Partial<ProjectDocument>) {
    const nextDocument = { ...document, ...patch }
    setDocument(nextDocument)

    if (validationIssues.length) {
      const changedFields = new Set(Object.keys(patch))
      const retainedServerIssues = validationIssues.filter(
        (issue) =>
          issue.message === "Another project already uses that slug." &&
          !changedFields.has(String(issue.path[0])),
      )
      const nextIssues = [
        ...getProjectValidationIssues(nextDocument),
        ...retainedServerIssues,
      ]
      setValidationIssues(nextIssues)
      setMessage(nextIssues.length ? validationMessage(nextIssues) : null)
    }
  }

  function showValidationIssues(issues: ProjectValidationIssue[]) {
    setValidationIssues(issues)
    setMessage(validationMessage(issues))
    setView("edit")
    requestAnimationFrame(() => {
      validationSummaryRef.current?.focus()
      validationSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    })
  }

  function save(publish: boolean) {
    if (isBusy) return
    setMessage(null)
    const localIssues = getProjectValidationIssues(document)

    if (localIssues.length) {
      showValidationIssues(localIssues)
      return
    }

    setValidationIssues([])

    startTransition(async () => {
      try {
        const response = await fetch("/admin/api/projects", {
          method: "POST",
          body: createSaveForm(document, publish),
        })
        const result = (await response.json()) as
          | { ok: true; document: ProjectDocument }
          | { ok: false; error: string; issues: ProjectValidationIssue[] }

        if (!result.ok) {
          if (result.issues.length) {
            showValidationIssues(result.issues)
          } else {
            setMessage(result.error)
          }
          return
        }

        const wasNew = !document.id
        setDocument(result.document)
        discardImages()
        setValidationIssues([])
        setStatus(publish ? "published" : status)
        setMessage(publish ? "Published successfully." : "Draft saved.")

        if (wasNew && result.document.id) {
          router.replace(`/admin/projects/${result.document.id}`)
        } else {
          router.refresh()
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Unable to save the project.",
        )
      }
    })
  }

  function removeProject() {
    if (
      !document.id ||
      !window.confirm(
        "Permanently delete this project, its revision history, and all associated media?",
      )
    ) {
      return
    }

    startTransition(async () => {
      await deleteProjectAction(document.id!)
    })
  }

  function restoreRevision(revisionId: string) {
    if (
      !document.id ||
      !window.confirm("Restore this revision into the current draft?")
    ) {
      return
    }

    startTransition(async () => {
      const result = await restoreRevisionAction(document.id!, revisionId)
      if (!result.ok) {
        setMessage(result.error)
        return
      }

      setDocument(result.document)
      discardImages()
      setValidationIssues([])
      setMessage("Revision restored into the draft. Publish when ready.")
      setView("edit")
      router.refresh()
    })
  }

  const previewProject = document.caseStudy
    ? (documentToPublicProject(document) as ProjectWithCaseStudy)
    : null

  return (
    <main className="min-h-screen pb-24 pt-28 sm:pt-32">
      <header className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 border-b light:border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm light:text-muted-foreground transition light:hover:text-foreground"
            >
              ← All projects
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold light:text-foreground">
                {document.title || "New project"}
              </h1>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                  status === "published"
                    ? "border-emerald-700/60 text-emerald-400 light:text-[var(--success)]"
                    : "border-amber-700/60 text-amber-300 light:text-[var(--rarity-legendary)]"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-sm border light:border-border p-1">
              {(["edit", "preview"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={isBusy}
                  onClick={() => setView(option)}
                  className={`rounded-sm px-3 py-1.5 text-xs font-medium capitalize ${
                    view === option
                      ? "light:bg-muted light:text-foreground"
                      : "light:text-muted-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => save(false)}
              disabled={isBusy}
              className={secondaryButton}
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              disabled={isBusy}
              className="rounded-sm light:bg-primary px-4 py-2 text-xs font-semibold light:text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
            >
              {isPending ? "Working…" : "Publish"}
            </button>
          </div>
        </div>

        {message && (
          <div
            ref={validationSummaryRef}
            tabIndex={-1}
            className={`mt-4 rounded-sm border px-4 py-3 text-sm ${
              message.includes("success") ||
              message.includes("saved") ||
              message.includes("restored")
                ? "border-emerald-800/60 bg-emerald-950/20 text-emerald-300 light:text-[var(--success)]"
                : "border-red-800/60 bg-red-950/20 text-red-300 light:text-destructive"
            }`}
          >
            <p>{message}</p>
            {validationIssues.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {validationIssues.map((issue, index) => (
                  <li key={`${validationPathKey(issue.path)}-${index}`}>
                    <span className="font-semibold">
                      {formatValidationPath(issue.path)}:
                    </span>{" "}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </header>

      {view === "preview" ? (
        previewProject ? (
          <div className="mt-6 border-y light:border-border">
            <ProjectCaseStudy project={previewProject} />
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-xl px-6 text-center light:text-muted-foreground">
            Enable the case study to preview the full page.
          </div>
        )
      ) : (
        <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <fieldset disabled={isBusy} className="min-w-0">
            <ProjectForm
              document={document}
              validationIssues={validationIssues}
              isPending={isBusy}
              uploadImage={stageImage}
              onChange={updateDocument}
              onDelete={removeProject}
            />
          </fieldset>
          <ProjectSidebar
            revisions={revisions}
            isPending={isBusy}
            onRestoreRevision={restoreRevision}
          />
        </div>
      )}
    </main>
  )
}
