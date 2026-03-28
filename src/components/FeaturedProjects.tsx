"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState, useCallback } from "react"
import { motion, type Variants, useMotionValue, useSpring } from "framer-motion"

export type Project = {
  title: string
  description?: string
  desc?: string
  image: string
  tech: string[]
  repo?: string
  href?: string
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="divide-y divide-[--border] border-y border-[--border]"
    >
      {projects.map((p, i) => (
        <ProjectRow key={p.title} project={p} index={i} />
      ))}
    </motion.div>
  )
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const description = project.description ?? project.desc ?? ""
  const link = project.repo ?? project.href
  const rowRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 120, damping: 18, mass: 0.8 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

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
      variants={item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative grid sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-10 items-center py-8 sm:py-10"
    >
      <motion.div
        className="pointer-events-none absolute z-20 w-52 h-36 rounded-sm overflow-hidden border border-[--border] shadow-xl"
        style={{ x, y, left: 0, top: 0 }}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.88,
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.image}
          alt={project.title}
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
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight transition-colors duration-200 text-[--foreground] group-hover:text-[--primary]">
          {project.title}
        </h3>
        <p className="text-sm text-[--muted-foreground] leading-relaxed max-w-prose line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-sm border border-[--border] bg-[--card] text-[10px] font-medium text-[--muted-foreground] uppercase tracking-wide"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-sm font-medium text-[--muted-foreground] underline underline-offset-4 decoration-[--border] hover:text-[--primary] hover:decoration-[--primary] transition-colors duration-200 whitespace-nowrap"
        >
          View →
        </Link>
      )}
    </motion.article>
  )
}