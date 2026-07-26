"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/cms/auth"
import {
  deleteProject,
  publishProject,
  reorderProjects,
  restoreProjectRevision,
  saveProjectDraft,
} from "@/lib/cms/project-repository"
import {
  projectValidationIssuesFromError,
  type ProjectValidationIssue,
} from "@/lib/project-schema"
import { z } from "zod"

function actionFailure(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) {
    const issues = projectValidationIssuesFromError(error)
    return {
      ok: false as const,
      error: `Please fix ${issues.length === 1 ? "the validation error" : `${issues.length} validation errors`} below.`,
      issues,
    }
  }

  const message = error instanceof Error ? error.message : fallback
  const issues: ProjectValidationIssue[] =
    message === "Another project already uses that slug."
      ? [{ path: ["slug"], message }]
      : []

  return {
    ok: false as const,
    error: message,
    issues,
  }
}

export async function saveProjectAction(input: unknown) {
  await requireAdmin()

  try {
    const document = saveProjectDraft(input)
    revalidatePath("/admin")
    revalidatePath(`/admin/projects/${document.id}`)
    return { ok: true as const, document }
  } catch (error) {
    return actionFailure(error, "Unable to save the draft.")
  }
}

export async function publishProjectAction(input: unknown) {
  await requireAdmin()

  try {
    const document = publishProject(input)
    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath(`/projects/${document.slug}`)
    revalidatePath("/admin")
    revalidatePath(`/admin/projects/${document.id}`)
    return { ok: true as const, document }
  } catch (error) {
    return actionFailure(error, "Unable to publish the project.")
  }
}

const projectOrderSchema = z.array(z.string().uuid()).min(1)

export async function reorderProjectsAction(input: unknown) {
  await requireAdmin()

  try {
    const projectIds = projectOrderSchema.parse(input)
    reorderProjects(projectIds)
    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save the project order.",
    }
  }
}

export async function restoreRevisionAction(
  projectId: string,
  revisionId: string,
) {
  await requireAdmin()

  try {
    const document = restoreProjectRevision(projectId, revisionId)
    revalidatePath(`/admin/projects/${projectId}`)
    return { ok: true as const, document }
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Unable to restore the revision.",
    }
  }
}

export async function deleteProjectAction(projectId: string) {
  await requireAdmin()
  deleteProject(projectId)
  revalidatePath("/")
  revalidatePath("/projects")
  revalidatePath("/admin")
  redirect("/admin")
}
