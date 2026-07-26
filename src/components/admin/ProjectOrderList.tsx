"use client"

import Link from "next/link"
import {
  useRef,
  useState,
  useTransition,
  type DragEvent,
} from "react"
import { reorderProjectsAction } from "@/app/admin/actions"

type ProjectOrderItem = {
  id: string
  title: string
  description: string
  status: "draft" | "published"
  updatedAt: string
}

function moveProject(
  projects: ProjectOrderItem[],
  projectId: string,
  targetId: string,
) {
  const fromIndex = projects.findIndex((project) => project.id === projectId)
  const toIndex = projects.findIndex((project) => project.id === targetId)

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return projects
  }

  const nextProjects = [...projects]
  const [movedProject] = nextProjects.splice(fromIndex, 1)
  nextProjects.splice(toIndex, 0, movedProject)
  return nextProjects
}

export function ProjectOrderList({
  initialProjects,
}: {
  initialProjects: ProjectOrderItem[]
}) {
  const [projects, setProjects] = useState(initialProjects)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const projectsRef = useRef(projects)
  const orderBeforeDragRef = useRef<ProjectOrderItem[] | null>(null)
  const droppedRef = useRef(false)
  const dragTargetRef = useRef<string | null>(null)

  function updateOrder(nextProjects: ProjectOrderItem[]) {
    projectsRef.current = nextProjects
    setProjects(nextProjects)
  }

  function persistOrder(
    nextProjects: ProjectOrderItem[],
    previousProjects: ProjectOrderItem[],
  ) {
    setMessage(null)

    startTransition(async () => {
      const result = await reorderProjectsAction(
        nextProjects.map((project) => project.id),
      )

      if (!result.ok) {
        updateOrder(previousProjects)
        setMessage(result.error)
        return
      }

      setMessage("Project order saved.")
    })
  }

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    projectId: string,
  ) {
    orderBeforeDragRef.current = projectsRef.current
    droppedRef.current = false
    dragTargetRef.current = projectId
    setDraggedId(projectId)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", projectId)
  }

  function handleDragEnter(targetId: string) {
    if (!draggedId) {
      return
    }

    if (draggedId === targetId) {
      dragTargetRef.current = targetId
      return
    }

    if (dragTargetRef.current === targetId) {
      return
    }

    dragTargetRef.current = targetId
    updateOrder(moveProject(projectsRef.current, draggedId, targetId))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    droppedRef.current = true

    const previousProjects = orderBeforeDragRef.current
    if (previousProjects) {
      persistOrder(projectsRef.current, previousProjects)
    }

    setDraggedId(null)
    orderBeforeDragRef.current = null
    dragTargetRef.current = null
  }

  function handleDragEnd() {
    if (!droppedRef.current && orderBeforeDragRef.current) {
      updateOrder(orderBeforeDragRef.current)
    }

    setDraggedId(null)
    orderBeforeDragRef.current = null
    dragTargetRef.current = null
  }

  function moveBy(projectId: string, offset: -1 | 1) {
    const previousProjects = projectsRef.current
    const fromIndex = previousProjects.findIndex(
      (project) => project.id === projectId,
    )
    const target = previousProjects[fromIndex + offset]

    if (!target) {
      return
    }

    const nextProjects = moveProject(previousProjects, projectId, target.id)
    updateOrder(nextProjects)
    persistOrder(nextProjects, previousProjects)
  }

  return (
    <div>
      <div className="border-b border-[--border] bg-[--background]/50 px-5 py-3">
        <p className="text-xs text-[--muted-foreground]">
          Drag projects into the order they should appear publicly. Changes save
          automatically.
        </p>
        {message && (
          <p
            className={`mt-2 text-xs ${
              message === "Project order saved."
                ? "text-emerald-400"
                : "text-red-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="divide-y divide-[--border]">
        {projects.map((project, index) => (
          <div
            key={project.id}
            onDragEnter={() => handleDragEnter(project.id)}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "move"
            }}
            onDrop={handleDrop}
            className={`grid gap-4 bg-[--card] px-4 py-4 transition sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] sm:items-center ${
              draggedId === project.id
                ? "bg-[--muted]/70 opacity-60"
                : "hover:bg-[--muted]/40"
            }`}
          >
            <button
              type="button"
              draggable={!isPending}
              onDragStart={(event) => handleDragStart(event, project.id)}
              onDragEnd={handleDragEnd}
              aria-label={`Drag ${project.title} to reorder`}
              className="hidden cursor-grab select-none rounded-sm border border-[--border] px-2 py-3 text-sm tracking-[0.16em] text-[--muted-foreground] transition hover:border-[--muted-foreground] hover:text-[--foreground] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40 sm:block"
            >
              {"\u283f"}
            </button>

            <Link
              href={`/admin/projects/${project.id}`}
              className="min-w-0"
            >
              <h2 className="font-display text-xl font-bold text-[--foreground]">
                {project.title}
              </h2>
              <p className="mt-1 line-clamp-1 text-sm text-[--muted-foreground]">
                {project.description}
              </p>
            </Link>

            <span
              className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                project.status === "published"
                  ? "border-emerald-700/60 text-emerald-400"
                  : "border-amber-700/60 text-amber-300"
              }`}
            >
              {project.status}
            </span>

            <time
              dateTime={project.updatedAt}
              className="text-xs text-[--muted-foreground]"
            >
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(project.updatedAt))}
            </time>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveBy(project.id, -1)}
                disabled={isPending || index === 0}
                aria-label={`Move ${project.title} up`}
                className="rounded-sm border border-[--border] px-2 py-1 text-sm text-[--muted-foreground] transition hover:text-[--foreground] disabled:opacity-25"
              >
                {"\u2191"}
              </button>
              <button
                type="button"
                onClick={() => moveBy(project.id, 1)}
                disabled={isPending || index === projects.length - 1}
                aria-label={`Move ${project.title} down`}
                className="rounded-sm border border-[--border] px-2 py-1 text-sm text-[--muted-foreground] transition hover:text-[--foreground] disabled:opacity-25"
              >
                {"\u2193"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
