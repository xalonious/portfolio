"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 1.7 }}
    >
      {children}
    </motion.main>
  )
}