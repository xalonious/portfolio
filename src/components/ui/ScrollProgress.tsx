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
          background: "linear-gradient(90deg, #C47A8A 0%, #D4899A 50%, #C47A8A 100%)",
        }}
      />
    </div>
  )
}