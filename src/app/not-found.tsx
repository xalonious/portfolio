"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { TransitionLink } from "@/components/ui/TransitionLink"

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#1A1618" }}
    >
      <motion.div
        className="flex flex-col items-center max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="relative rounded-sm overflow-hidden border border-[--border] -rotate-[2deg] mb-8 w-full"
          style={{ aspectRatio: "3/4", maxWidth: 320 }}
        >
          <Image
            src="/sealy-404.jpg"
            alt="Sealy looking guilty"
            fill
            sizes="320px"
            className="object-cover object-top"
            priority
          />
          <div className="absolute bottom-0 inset-x-0 bg-[--card] px-4 py-2 text-[11px] font-medium text-[--muted-foreground]">
            CTO, probably responsible
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-3">
          404 — Page not found
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[--foreground] leading-tight mb-3">
          Sealy deleted this page.
        </h1>
        <p className="text-sm text-[--muted-foreground] leading-relaxed mb-8">
          He's been placed on a performance improvement plan.<br />Treats suspended pending investigation.
        </p>
        <div className="flex gap-3">
          <TransitionLink
            href="/"
            className="px-6 py-2.5 text-sm font-medium rounded-sm border border-[--primary] text-[--primary] hover:bg-[--primary] hover:text-[--background] transition-colors duration-200"
          >
            Go home
          </TransitionLink>
          <TransitionLink
            href="/projects"
            className="px-6 py-2.5 text-sm font-medium rounded-sm border border-[--border] text-[--muted-foreground] hover:border-[--primary] hover:text-[--foreground] transition-colors duration-200"
          >
            View projects
          </TransitionLink>
        </div>
      </motion.div>
    </div>
  )
}