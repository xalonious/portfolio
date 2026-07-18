"use client"

import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import { motion, type Variants, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { TransitionLink } from "@/components/ui/TransitionLink"
import type { Project } from "@/lib/projects"

type ProjectListProps = {
  projects: Project[]
  reveal?: "inView" | "mount"
  rowClassName?: string
  staggerChildren?: number
  delayChildren?: number
  titleAs?: "h2" | "h3"
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function ProjectList({
  projects,
  reveal = "inView",
  rowClassName = "py-8 sm:py-10",
  staggerChildren = 0.1,
  delayChildren = 0.05,
  titleAs = "h3",
}: ProjectListProps) {
  const shouldReduceMotion = useReducedMotion()
  const container: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion ? { duration: 0 } : { staggerChildren, delayChildren },
    },
  }

  const revealProps =
    reveal === "mount"
      ? { animate: "show" }
      : { whileInView: "show", viewport: { once: true, amount: 0.15 } }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      {...revealProps}
      className="divide-y divide-[--border] border-y border-[--border]"
    >
      {projects.map((project, index) => (
        <ProjectRow
          key={project.title}
          project={project}
          index={index}
          className={rowClassName}
          titleAs={titleAs}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </motion.div>
  )
}

function ProjectRow({
  project,
  index,
  className,
  titleAs,
  shouldReduceMotion,
}: {
  project: Project
  index: number
  className: string
  titleAs: "h2" | "h3"
  shouldReduceMotion: boolean | null
}) {
  const rowRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 120, damping: 18, mass: 0.8 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)
  const Heading = titleAs
  const externalHref = project.repo ?? project.live
  const externalLabel = project.repo ? "View repository" : "View live project"

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const row = rowRef.current
    if (!row) return
    const rect = row.getBoundingClientRect()
    rawX.set(e.clientX - rect.left + 24)
    rawY.set(e.clientY - rect.top - 160)
  }, [rawX, rawY])

  return (
    <motion.article
      ref={rowRef}
      variants={shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : item}
      onMouseEnter={() => { if (window.matchMedia("(pointer: fine)").matches) setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative grid sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-10 items-center ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute z-20 w-52 h-36 rounded-sm overflow-hidden border border-[--border] shadow-xl hidden sm:block"
        style={{ x, y, left: 0, top: 0 }}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered || shouldReduceMotion ? 1 : 0.88,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt ?? project.title}
          fill
          sizes="208px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[--primary]/10 to-transparent" />
      </motion.div>
      <span className="hidden sm:block font-mono text-xs text-[--primary] w-6 shrink-0 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 space-y-2">
        <div className="relative w-full h-40 rounded-sm overflow-hidden border border-[--border] mb-3 sm:hidden">
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes="(min-width: 640px) 0px, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
        <Heading className="font-display text-xl sm:text-2xl font-bold leading-tight transition-colors duration-200 text-[--foreground] group-hover:text-[--primary] group-focus-within:text-[--primary]">
          {project.title}
        </Heading>
        <p className="text-sm text-[--muted-foreground] leading-relaxed max-w-prose line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-sm border border-[--border] bg-[--card] text-[10px] font-medium text-[--muted-foreground] uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      {project.caseStudy ? (
        <TransitionLink
          href={`/projects/${project.slug}`}
          className="shrink-0 whitespace-nowrap text-sm font-medium text-[--muted-foreground] underline decoration-[--border] underline-offset-4 transition-colors duration-200 hover:text-[--primary] hover:decoration-[--primary] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[--primary]"
        >
          View project <span aria-hidden="true">→</span>
        </TransitionLink>
      ) : (
        externalHref && (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap text-sm font-medium text-[--muted-foreground] underline decoration-[--border] underline-offset-4 transition-colors duration-200 hover:text-[--primary] hover:decoration-[--primary] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[--primary]"
          >
            {externalLabel} <span aria-hidden="true">→</span>
          </a>
        )
      )}
    </motion.article>
  )
}
