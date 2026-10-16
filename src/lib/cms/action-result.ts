import { z } from "zod"
import {
  projectValidationIssuesFromError,
  type ProjectValidationIssue,
} from "@/lib/project-schema"

export function actionFailure(error: unknown, fallback: string) {
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

  return { ok: false as const, error: message, issues }
}
