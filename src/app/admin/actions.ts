"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/cms/auth"
import {
  deleteProject,
  reorderProjects,
  restoreProjectRevision,
} from "@/lib/cms/project-repository"
import { z } from "zod"

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
