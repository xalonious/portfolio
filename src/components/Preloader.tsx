"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [nameVisible, setNameVisible] = useState(false)

  const KNOWN_ROUTES = ["/", "/projects"]
  const isKnownRoute = KNOWN_ROUTES.includes(pathname)

  useEffect(() => {
    if (!isKnownRoute) return
    const nameTimer = setTimeout(() => setNameVisible(true), 100)
    const hideTimer = setTimeout(() => setVisible(false), 1600)
    return () => {
      clearTimeout(nameTimer)
      clearTimeout(hideTimer)
    }
  }, [isKnownRoute])

  if (!isKnownRoute) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: "#1A1618" }}
          exit={{
            y: "-100%",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
          }}
        >
          <motion.h1
            className="font-display font-black tracking-tight select-none text-5xl sm:text-7xl"
            style={{ color: "#F2ECF0" }}
            initial={{ opacity: 0, y: 16 }}
            animate={nameVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            xalonious
            <span style={{ color: "#C47A8A" }}>.</span>
          </motion.h1>
          <motion.span
            style={{
              display: "block",
              height: "1.5px",
              width: "4rem",
              backgroundColor: "#C47A8A",
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0 }}
            animate={nameVisible ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}