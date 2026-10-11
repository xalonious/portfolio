"use client"

import { motion, useSpring, useScroll } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.18,
  })

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[10003] h-[1.5px]">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--primary) 0%, var(--primary-highlight) 50%, var(--primary) 100%)",
        }}
      />
    </div>
  )
}