import crypto from "node:crypto"
import { MEDIA_PUBLIC_PATH } from "@/lib/cms/config"
import { getDatabase, runTransaction } from "@/lib/cms/database"
import {
  deleteMediaAssetFiles,
  getMediaAssetsByPublicPaths,
} from "@/lib/cms/media"
import {
  documentToPublicProject,
  projectDocumentSchema,
  type ProjectDocument,
} from "@/lib/project-schema"
import type { Project } from "@/lib/project-types"

type ProjectRow = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  image_alt: string
  image_layout: "portrait" | "landscape" | null
  tech_json: string
  repository_url: string | null
  featured: number
  sort_order: number
  case_study_json: string | null
  status: "draft" | "published"
  created_at: string
  updated_at: string
  published_at: string | null
}

type AdminProjectRow = ProjectRow & {
  document_json: string | null
}

export type AdminProject = {
  document: ProjectDocument
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export type ProjectRevision = {
  id: string
  document: ProjectDocument
  createdAt: string
}

function collectMediaPaths(value: unknown, paths: Set<string>) {
  if (typeof value === "string") {
    if (value.startsWith(`${MEDIA_PUBLIC_PATH}/`)) {
      paths.add(value)
    }
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMediaPaths(item, paths)
    }
    return
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectMediaPaths(item, paths)
    }
  }
}

function collectJsonMediaPaths(value: string | null, paths: Set<string>) {
  if (!value) {
    return
  }

  try {
    collectMediaPaths(JSON.parse(value), paths)
  } catch {
    // Invalid historical JSON should not prevent the rest of a project from
    // being deleted. Its media row will remain available for manual cleanup.
  }
}

function publishedRowToDocument(row: ProjectRow): ProjectDocument {
  return projectDocumentSchema.parse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    imageLayout: row.image_layout ?? undefined,
    tech: JSON.parse(row.tech_json),
    repo: row.repository_url ?? undefined,
    featured: Boolean(row.featured),
    sortOrder: row.sort_order,
    caseStudy: row.case_study_json
      ? JSON.parse(row.case_study_json)
      : null,
  })
}

function parseAdminRow(row: AdminProjectRow): AdminProject {
  const document = row.document_json
    ? projectDocumentSchema.parse(JSON.parse(row.document_json))
    : publishedRowToDocument(row)

  return {
    document,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  }
}

function assertSlugAvailable(slug: string, projectId?: string) {
  const row = getDatabase()
    .prepare(
      `SELECT p.id
       FROM projects p
       LEFT JOIN project_drafts d ON d.project_id = p.id
       WHERE (
         p.slug = ?
         OR json_extract(d.document_json, '$.slug') = ?
       )
       AND p.id != ?
       LIMIT 1`,
    )
    .get(slug, slug, projectId ?? "") as { id: string } | undefined

  if (row) {
    throw new Error("Another project already uses that slug.")
  }
}

export function getPublishedProjects(): Project[] {
  const rows = getDatabase()
    .prepare(
      `SELECT *
       FROM projects
       WHERE status = 'published'
       ORDER BY sort_order ASC, title ASC`,
    )
    .all() as unknown as ProjectRow[]

  return rows.map((row) => documentToPublicProject(publishedRowToDocument(row)))
}

export function getFeaturedPublishedProjects() {
  return getPublishedProjects().filter((project) => project.featured)
}

export function getPublishedProjectBySlug(slug: string) {
  const row = getDatabase()
    .prepare(
      `SELECT *
       FROM projects
       WHERE slug = ? AND status = 'published'
       LIMIT 1`,
    )
    .get(slug) as ProjectRow | undefined

  return row
    ? documentToPublicProject(publishedRowToDocument(row))
    : undefined
}

export function listAdminProjects() {
  const rows = getDatabase()
    .prepare(
      `SELECT p.*, d.document_json
       FROM projects p
       LEFT JOIN project_drafts d ON d.project_id = p.id
       ORDER BY p.sort_order ASC, p.title ASC`,
    )
    .all() as unknown as AdminProjectRow[]

  return rows.map(parseAdminRow)
}

export function reorderProjects(projectIds: string[]) {
  const database = getDatabase()
  const existingRows = database
    .prepare("SELECT id FROM projects")
    .all() as unknown as Array<{ id: string }>
  const existingIds = new Set(existingRows.map((row) => row.id))
  const requestedIds = new Set(projectIds)

  if (
    requestedIds.size !== projectIds.length ||
    projectIds.length !== existingIds.size ||
    projectIds.some((id) => !existingIds.has(id))
  ) {
    throw new Error("The project list changed. Refresh the page and try again.")
  }

  runTransaction(() => {
    const updateProject = database.prepare(
      "UPDATE projects SET sort_order = ? WHERE id = ?",
    )
    const updateDraft = database.prepare(
      `UPDATE project_drafts
       SET document_json = json_set(document_json, '$.sortOrder', ?)
       WHERE project_id = ?`,
    )

    projectIds.forEach((id, index) => {
      updateProject.run(index, id)
      updateDraft.run(index, id)
    })
  })
}

export function getAdminProject(id: string) {
  const row = getDatabase()
    .prepare(
      `SELECT p.*, d.document_json
       FROM projects p
       LEFT JOIN project_drafts d ON d.project_id = p.id
       WHERE p.id = ?
       LIMIT 1`,
    )
    .get(id) as AdminProjectRow | undefined

  return row ? parseAdminRow(row) : undefined
}

export function getProjectRevisions(projectId: string) {
  const rows = getDatabase()
    .prepare(
      `SELECT id, document_json, created_at
       FROM project_revisions
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
    )
    .all(projectId) as unknown as Array<{
    id: string
    document_json: string
    created_at: string
  }>

  return rows.map(
    (row): ProjectRevision => ({
      id: row.id,
      document: projectDocumentSchema.parse(JSON.parse(row.document_json)),
      createdAt: row.created_at,
    }),
  )
}

export function saveProjectDraft(input: unknown) {
  const parsed = projectDocumentSchema.parse(input)
  const id = parsed.id ?? crypto.randomUUID()
  const document = { ...parsed, id }
  const now = new Date().toISOString()
  const database = getDatabase()

  assertSlugAvailable(document.slug, id)

  runTransaction(() => {
    const existing = database
      .prepare("SELECT status FROM projects WHERE id = ?")
      .get(id) as { status: "draft" | "published" } | undefined

    if (!existing) {
      database
        .prepare(
          `INSERT INTO projects (
             id, slug, title, description, image, image_alt, image_layout,
             tech_json, repository_url, featured, sort_order,
             case_study_json, status, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
        )
        .run(
          id,
          document.slug,
          document.title,
          document.description,
          document.image,
          document.imageAlt,
          document.imageLayout ?? null,
          JSON.stringify(document.tech),
          document.repo ?? null,
          document.featured ? 1 : 0,
          document.sortOrder,
          document.caseStudy ? JSON.stringify(document.caseStudy) : null,
          now,
          now,
        )
    } else {
      database
        .prepare("UPDATE projects SET updated_at = ? WHERE id = ?")
        .run(now, id)
    }

    database
      .prepare(
        `INSERT INTO project_drafts (project_id, document_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(project_id) DO UPDATE SET
           document_json = excluded.document_json,
           updated_at = excluded.updated_at`,
      )
      .run(id, JSON.stringify(document), now)
  })

  return document
}

export function publishProject(input: unknown) {
  const document = saveProjectDraft(input)
  const now = new Date().toISOString()
  const database = getDatabase()

  assertSlugAvailable(document.slug, document.id)

  runTransaction(() => {
    database
      .prepare(
        `UPDATE projects SET
           slug = ?,
           title = ?,
           description = ?,
           image = ?,
           image_alt = ?,
           image_layout = ?,
           tech_json = ?,
           repository_url = ?,
           featured = ?,
           sort_order = ?,
           case_study_json = ?,
           status = 'published',
           updated_at = ?,
           published_at = ?
         WHERE id = ?`,
      )
      .run(
        document.slug,
        document.title,
        document.description,
        document.image,
        document.imageAlt,
        document.imageLayout ?? null,
        JSON.stringify(document.tech),
        document.repo ?? null,
        document.featured ? 1 : 0,
        document.sortOrder,
        document.caseStudy ? JSON.stringify(document.caseStudy) : null,
        now,
        now,
        document.id!,
      )

    database
      .prepare(
        `INSERT INTO project_revisions (id, project_id, document_json, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(
        crypto.randomUUID(),
        document.id!,
        JSON.stringify(document),
        now,
      )
  })

  return document
}

export function restoreProjectRevision(projectId: string, revisionId: string) {
  const row = getDatabase()
    .prepare(
      `SELECT document_json
       FROM project_revisions
       WHERE id = ? AND project_id = ?
       LIMIT 1`,
    )
    .get(revisionId, projectId) as { document_json: string } | undefined

  if (!row) {
    throw new Error("Revision not found.")
  }

  const document = projectDocumentSchema.parse(JSON.parse(row.document_json))
  return saveProjectDraft({ ...document, id: projectId })
}

export function deleteProject(projectId: string) {
  const database = getDatabase()
  const project = database
    .prepare(
      `SELECT image, case_study_json
       FROM projects
       WHERE id = ?
       LIMIT 1`,
    )
    .get(projectId) as
    | { image: string; case_study_json: string | null }
    | undefined

  if (!project) {
    return
  }

  const mediaPaths = new Set<string>()
  collectMediaPaths(project.image, mediaPaths)
  collectJsonMediaPaths(project.case_study_json, mediaPaths)

  const drafts = database
    .prepare(
      `SELECT document_json
       FROM project_drafts
       WHERE project_id = ?`,
    )
    .all(projectId) as unknown as Array<{ document_json: string }>
  const revisions = database
    .prepare(
      `SELECT document_json
       FROM project_revisions
       WHERE project_id = ?`,
    )
    .all(projectId) as unknown as Array<{ document_json: string }>

  for (const row of [...drafts, ...revisions]) {
    collectJsonMediaPaths(row.document_json, mediaPaths)
  }

  const mediaAssets = getMediaAssetsByPublicPaths(mediaPaths)

  runTransaction(() => {
    database.prepare("DELETE FROM projects WHERE id = ?").run(projectId)

    const deleteMedia = database.prepare("DELETE FROM media WHERE id = ?")
    for (const asset of mediaAssets) {
      deleteMedia.run(asset.id)
    }
  })

  const failures = deleteMediaAssetFiles(mediaAssets)
  for (const failure of failures) {
    console.error(
      `Failed to delete media file ${failure.asset.storageKey}:`,
      failure.error,
    )
  }
}
