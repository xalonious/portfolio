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

const PROJECTS: Project[] = [
  {
    title: "Rexx",
    description:
      "Rexx is a multi-purpose Discord bot I started back in 2020. It was my first major project. Development was discontinued when Discord switched to slash commands, and I decided not to rewrite the whole codebase.",
    repo: "https://github.com/xalonious/rexx",
    image: "/projects/rexx.png",
    tech: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    title: "Krestia",
    description:
      "A Discord ↔ Roblox ranking bot to remotely manage group ranks. It bridges the two platforms to make group management faster and easier.",
    repo: "https://github.com/xalonious/Krestia",
    image: "/projects/krestia.png",
    tech: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    title: "Teks Cafe Helper",
    description:
      "A Discord bot centered around an economy system with extra fun commands. Built to boost community engagement and add playful features.",
    repo: "https://github.com/xalonious/teks-cafe-helper",
    image: "/projects/tekscafe.png",
    tech: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    title: "My Portfolio Website",
    description:
      "The site you're on—built with Next.js and Tailwind CSS. It showcases my projects, skills, and journey as a developer.",
    repo: "https://github.com/xalonious/portfolio",
    image: "/projects/portfolio.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Shadcn UI", "Framer Motion"],
  },
  {
    title: "Barber App",
    description:
      "A school project—a simple booking app where users schedule appointments with barbers. Built with React and Express for a smooth UX.",
    repo: "https://github.com/xalonious/barber-app",
    image: "/projects/barber.png",
    tech: ["TypeScript", "React", "JavaScript", "Node.js", "Bootstrap", "Express"],
  },
  {
    title: "PassGuard",
    description:
      "A simple password manager built with Electron and SQLite (repo lists MySQL). Securely store and manage credentials locally.",
    repo: "https://github.com/xalonious/password-manager",
    image: "/projects/passwordmanager.png",
    tech: ["JavaScript", "HTML", "CSS", "MySQL"],
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
    title: "Web Server File Uploader",
    description:
      "A minimal file uploader with progress tracking—great for quick transfers (e.g., to a Raspberry Pi) with a clean animated UI.",
    repo: "https://github.com/xalonious/web-server-file-uploader",
    image: "/projects/uploader.png",
    tech: ["JavaScript", "Node.js", "Express", "HTML", "CSS"],
  },
  {
    title: "Backup Code Encryptor",
    description:
      "CLI tool to encrypt your 2FA backup codes with a password—keep them safe from prying eyes.",
    repo: "https://github.com/xalonious/backup-code-encryptor",
    image: "/projects/encryption.png",
    tech: ["Python"],
  },
  {
    title: "Image Converter",
    description:
      "A simple image converter to quickly change formats. Handy for batch tweaks and asset prep.",
    repo: "https://github.com/xalonious/image_converter",
    image: "/projects/imageconverter.png",
    tech: ["Python"],
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

export default function ProjectsPage() {
  return (
    <main className="relative overflow-hidden">
      <HeaderGlow />

      <section className="relative mx-auto w-full max-w-6xl px-6 pt-24 pb-6 md:pt-28">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here are some of the projects I've worked on. Click on the links to view the code on GitHub.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </motion.div>
      </section>
    </main>
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

function HeaderGlow() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-52 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl
        [background:radial-gradient(closest-side,var(--primary)/16%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#fff_0.5px,transparent_0.5px)] [background-size:8px_8px]"
      />
    </>
  )
}
