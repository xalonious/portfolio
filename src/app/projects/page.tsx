"use client"

import { motion } from "framer-motion"
import { ProjectList } from "@/components/sections/ProjectList"
import { projects } from "@/lib/projects"

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
        <ProjectList
          projects={projects}
          reveal="mount"
          rowClassName="py-7 sm:py-9"
          staggerChildren={0.07}
          delayChildren={0.1}
          titleAs="h2"
        />
      </main>
    </div>
  )
}
