"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

const KNOWN_ROUTES = ["/", "/projects"]

export function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isKnownRoute = KNOWN_ROUTES.includes(pathname)

  return (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: isKnownRoute ? 1.7 : 0 }}
    >
      {children}
    </motion.main>
  )
}