"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type Tech = { name: string; icon: string }

export function TechCarousel({ items }: { items: Tech[] }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  const D1 = isMobile ? 300 : 240  
  const D2 = isMobile ? 360 : 300  

  const looped = [...items, ...items, ...items]

  return (
    <section className="relative isolate w-full overflow-hidden py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
        [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
        [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          key={`row1-${D1}`}
          className="flex min-w-max gap-6 pl-[max(6vw,2rem)] pr-[max(6vw,2rem)] whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: D1, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        >
          {looped.map((t, i) => (
            <TechCard key={`r1-${i}-${t.name}`} name={t.name} icon={t.icon} />
          ))}
        </motion.div>

        <motion.div
          key={`row2-${D2}`}
          className="mt-6 flex min-w-max gap-6 pl-[max(6vw,2rem)] pr-[max(6vw,2rem)] whitespace-nowrap will-change-transform"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: D2, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        >
          {looped.map((t, i) => (
            <TechCard key={`r2-${i}-${t.name}`} name={t.name} icon={t.icon} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TechCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div
      className="shrink-0 flex h-20 w-44 flex-col items-center justify-center gap-2 rounded-xl
                 border border-[--border]/50 bg-[--muted]
                 shadow-sm transition-all hover:-translate-y-[2px] hover:border-[--primary]/60 hover:shadow-md"
    >
      <img src={icon} alt={name} width={32} height={32} className="h-8 w-8 object-contain opacity-90" loading="lazy" />
      <span className="text-sm font-medium text-[--foreground]">{name}</span>
    </div>
  )
}
