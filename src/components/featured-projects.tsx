"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"
import { Button } from "@/components/ui/button"

export type Project = {
  title: string
  description: string
  image: string
  tech: string[]
  repo?: string
}

const FEATURED: Project[] = [
  {
    title: "My Portfolio Website",
    description:
      "The site you're on — built with Next.js and Tailwind CSS. It showcases my projects, skills, and development journey.",
    repo: "https://github.com/xalonious/portfolio",
    image: "/projects/portfolio.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Barber App",
    description:
      "A school project — a simple barber booking app where users can schedule appointments. Built with React, Express, and TypeScript for a smooth UX.",
    repo: "https://github.com/xalonious/barber-app",
    image: "/projects/barber.png",
    tech: ["TypeScript", "React", "JavaScript", "Node.js", "Bootstrap", "Express"],
  },
  {
    title: "PassGuard",
    description:
      "A lightweight password manager built with Electron and SQLite (MySQL in repo). Securely stores credentials locally in an intuitive interface.",
    repo: "https://github.com/xalonious/password-manager",
    image: "/projects/passwordmanager.png",
    tech: ["JavaScript", "HTML", "CSS", "MySQL"],
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function FeaturedProjects({
  projects = FEATURED,
  heading = "Featured Projects",
  subheading = "A few things I’m proud of",
}: {
  projects?: Project[]
  heading?: string
  subheading?: string
}) {
  return (
    <section id="projects" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-6 sm:mb-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[--foreground]">
            {heading}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{subheading}</p>
        </div>
        <Button
          asChild
          className="hidden md:inline-flex bg-[--primary] text-[--background] hover:bg-[--secondary]"
        >
          <Link href="/projects">View all projects →</Link>
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </motion.div>

      <div className="mt-6 sm:mt-8 md:hidden">
        <Button asChild variant="secondary" className="w-full">
          <Link href="/projects">View all projects</Link>
        </Button>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 160, damping: 18 })
  const imgY = useSpring(useTransform(my, [0, 1], [-6, 6]), { stiffness: 220, damping: 22 })

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.article
      variants={item}
      className="group relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-xl border border-[--border]/40 bg-[--card] shadow-[0_4px_14px_-8px_rgba(0,0,0,0.5)] sm:max-w-none sm:rounded-2xl"
      style={{ transformStyle: "preserve-3d" as any }}
    >
      <div
        className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl"
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{
            rotateX: rx,
            rotateY: ry,
            transformPerspective: 1000,
          }}
          className="relative h-full w-full"
        >
          <motion.div
            style={{ y: imgY }}
            className="absolute inset-0 will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="pointer-events-none select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority={false}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 group-hover:ring-[--primary]/40" />
        </motion.div>
      </div>

      <div className="p-3 sm:p-4 text-[13px] sm:text-sm leading-relaxed">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight mb-1">
          {project.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-2">
          {project.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[--border]/50 bg-[--muted] px-2 py-[2px] text-[10px] sm:text-xs text-[--foreground]/90"
            >
              {t}
            </span>
          ))}
        </div>

        {project.repo && (
          <Button
            asChild
            size="sm"
            className="h-8 w-full sm:w-auto text-xs bg-[--primary] text-[--background] hover:bg-[--secondary]"
          >
            <Link href={project.repo} target="_blank" rel="noreferrer">
              View on GitHub
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  )
}
