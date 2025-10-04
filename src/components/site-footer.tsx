"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-[--border]/40 bg-[--card]/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row"
      >
        <p className="flex items-center gap-1 text-[--foreground]/80">
          Made with{" "}
          <Heart
            size={14}
            className="text-[--brass] animate-pulse"
            fill="var(--brass)"
          />{" "}
          by{" "}
          <Link
            href="/"
            className="font-medium text-[--brass] hover:underline underline-offset-4"
          >
            Xander
          </Link>
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/xalonious"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[--brass] transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="#contact"
            className="hover:text-[--brass] transition-colors"
          >
            Contact
          </Link>
        </div>
      </motion.div>
    </footer>
  )
}
