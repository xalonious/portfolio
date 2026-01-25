"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

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
    tech: ["Typescript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
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
    title: "Barber App",
    description:
      "A school project—a simple booking app where users schedule appointments with barbers. Built with React and Express for a smooth UX.",
    repo: "https://github.com/xalonious/barber-app",
    image: "/projects/barber.png",
    tech: ["TypeScript", "React", "Node.js", "Bootstrap", "Express", "MySQL"],
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
    title: "Robux Spent Calculator",
    description:
      "An Electron desktop app that analyzes Roblox purchases, visualizes Robux spending over time, and estimates USD value.",
    repo: "https://github.com/xalonious/robux-spent",
    image: "/projects/robuxspent.png",
    tech: ["JavaScript", "Node.js", "Electron", "HTML", "CSS"],
  },
  {
    title: "Image tool",
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
      "CLI tool to encrypt your 2FA backup codes with a password—keep them safe from prying eyes.",
    repo: "https://github.com/xalonious/backup-code-encryptor",
    image: "/projects/encryption.png",
    tech: ["Python"],
  },
  {
    title: "Web Server File Uploader",
    description:
      "A minimal file uploader with progress tracking—great for quick transfers (e.g., to a Raspberry Pi) with a clean animated UI.",
    repo: "https://github.com/xalonious/web-server-file-uploader",
    image: "/projects/uploader.png",
    tech: ["JavaScript", "Node.js", "Express", "HTML", "CSS"],
  },
];


export default function ProjectsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(62, 228, 255, 0.15), transparent)`,
        }}
      />

      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <main className="relative px-6 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Projects
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              A collection of projects I've built over the years. Each one taught me something new.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/90"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/90">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            {project.title}
          </h3>
          
          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-sm font-medium text-cyan-300 hover:text-cyan-200"
            >
              <span>View on GitHub</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        </div>
      </div>
    </motion.div>
  )
}