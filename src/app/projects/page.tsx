"use client"

import { useRef, useState, useCallback } from "react"
import { motion, type Variants, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export type Project = {
  title: string
  description: string
  image: string
  tech: string[]
  repo?: string
}

const PROJECTS: Project[] = [
  {
    title: "Serendipity Scheduling App",
    description:
      "A centralized scheduling web app and API for managing staff shifts and trainings for a Roblox roleplay group.",
    repo: "https://github.com/xalonious/serendipity-scheduling-app",
    image: "/projects/serendipity.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
  },
  {
    title: "Serendipity Assistant",
    description:
      "A general purpose Discord bot featuring moderation tools, fun/community commands, and automation utilities.",
    repo: "https://github.com/xalonious/serendipity-assistant",
    image: "/projects/serendipity-assistant.png",
    tech: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    title: "Streaming App",
    description:
      "A self-hosted media streaming web app for discovering and playing movies and TV shows from user-configured sources.",
    repo: "https://github.com/xalonious/streaming-app",
    image: "/projects/streamingapp.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind"],
  },
  {
    title: "xanderGPT",
    description:
      "A ChatGPT-style web app powered by a local LLM via Ollama, featuring real-time streaming responses, persistent conversations & web search.",
    repo: "https://github.com/xalonious/xanderGPT",
    image: "/projects/xandergpt.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
  },
  {
    title: "Barber App",
    description:
      "A school project — a simple booking app where users schedule appointments with barbers. Built with React and Express for a smooth UX.",
    repo: "https://github.com/xalonious/barber-app",
    image: "/projects/barber.png",
    tech: ["TypeScript", "React", "Node.js", "Bootstrap", "Express", "MySQL"],
  },
  {
    title: "My Portfolio Website",
    description:
      "The site you're on — built with Next.js and Tailwind CSS. Showcases my projects, skills, and journey as a developer.",
    repo: "https://github.com/xalonious/portfolio",
    image: "/projects/portfolio.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Shadcn UI", "Framer Motion"],
  },
  {
    title: "Robux Spent Calculator",
    description:
      "An Electron desktop app that tracks Robux inflow, outflow, and current balance, with charts and spending insights.",
    repo: "https://github.com/xalonious/robux-spent",
    image: "/projects/robuxspent.png",
    tech: ["JavaScript", "Node.js", "Electron", "HTML", "CSS"],
  },
  {
    title: "BongoClicker",
    description:
      "A Windows autoclicker for bongocat. Fires every key on the keyboard in rapid succession while the cat jams along.",
    repo: "https://github.com/xalonious/bongoclicker",
    image: "/projects/bongoclicker.png",
    tech: ["Python", "Tkinter"],
  },
  {
    title: "Image Tool",
    description:
      "A simple CLI tool to convert and compress images with sensible defaults.",
    repo: "https://github.com/xalonious/image_tool",
    image: "/projects/imageconverter.png",
    tech: ["Python"],
  },
  {
    title: "AutoClicker",
    description:
      "A lightweight C# autoclicker to automate mouse clicks for repetitive tasks.",
    repo: "https://github.com/xalonious/autoclicker",
    image: "/projects/autoclicker.png",
    tech: ["C#", ".NET"],
  },
  {
    title: "PassGuard",
    description:
      "A simple password manager built with Electron and SQLite. Securely store and manage credentials locally.",
    repo: "https://github.com/xalonious/password-manager",
    image: "/projects/passwordmanager.png",
    tech: ["JavaScript", "Electron", "HTML", "CSS", "SQLite"],
  },
  {
    title: "Backup Code Encryptor",
    description:
      "CLI tool to encrypt your 2FA backup codes with a password — keep them safe from prying eyes.",
    repo: "https://github.com/xalonious/backup-code-encryptor",
    image: "/projects/encryption.png",
    tech: ["Python"],
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1618" }}>
      <main className="px-6 pt-28 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-2">
            All work
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-[--foreground] mb-4">
            Projects
          </h1>
          <p className="text-[--muted-foreground] text-lg max-w-xl leading-relaxed">
            Everything I&apos;ve built over the years. Each one taught me something new.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="divide-y divide-[--border] border-y border-[--border]"
        >
          {PROJECTS.map((project, index) => (
            <ProjectRow key={project.title} project={project} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  )
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
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
      onMouseEnter={() => { if (window.matchMedia("(pointer: fine)").matches) setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative grid sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-10 items-center py-7 sm:py-9"
    >
      <motion.div
        className="pointer-events-none absolute z-20 w-52 h-36 rounded-sm overflow-hidden border border-[--border] shadow-xl hidden sm:block"
        style={{ x, y, left: 0, top: 0 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88 }}
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
            sizes="(min-width: 640px) 0px, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight transition-colors duration-200 text-[--foreground] group-hover:text-[--primary]">
          {project.title}
        </h2>
        <p className="text-sm text-[--muted-foreground] leading-relaxed line-clamp-2 max-w-prose">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
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
      {project.repo && (
        <Link
          href={project.repo}
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