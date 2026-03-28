"use client"

import { motion } from "framer-motion"
import { ContributionSnake } from "@/components/ContributionSnake"

export function Story() {
  return (
    <section id="about" className="py-20 sm:py-28 px-6 scroll-mt-24 border-t border-[--border]">
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-2"
        >
          Background
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-4xl sm:text-5xl font-bold text-[--foreground] mb-14"
        >
          The story so far
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 text-[--muted-foreground] text-lg leading-relaxed"
          >
            <p>
              I&apos;m a <span className="text-[--foreground] font-medium">self-taught full-stack developer</span> who
              went headfirst into coding and never really came back up for air.
            </p>
            <p>
              My background is in{" "}
              <span className="text-[--foreground] font-medium">JavaScript, TypeScript, and Java</span> — I
              build full-stack applications with a focus on clean architecture and interfaces
              that actually feel good to use.
            </p>
            <p>
              I care about the{" "}
              <span className="text-[--foreground] font-medium">open-source community</span> and I&apos;m
              always experimenting with something new. Currently available for the right opportunity.
            </p>

            <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[--border]">
              {[
                { value: "1000+", label: "Coffees" },
                { value: "100+",  label: "Rage quits" },
                { value: "20+",   label: "All-nighters" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-[--foreground]">{stat.value}</p>
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-10"
          >

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground] mb-5">What I do</p>
              <ul className="space-y-0 divide-y divide-[--border]">
                {[
                  { index: "01", label: "Full-Stack Web Development" },
                  { index: "02", label: "UI & UX Design" },
                  { index: "03", label: "API Design & Architecture" },
                  { index: "04", label: "Self-Hosted Infrastructure" },
                  { index: "05", label: "Open Source" },
                ].map((item) => (
                  <li key={item.index} className="flex items-center gap-4 py-3.5">
                    <span className="text-[10px] text-[--primary] font-mono w-5 shrink-0">{item.index}</span>
                    <span className="text-[--foreground] text-sm font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground] mb-5">Primary stack</p>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Node.js", "Tailwind", "Prisma", "MySQL"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-sm border border-[--border] bg-[--card] text-xs text-[--foreground] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14"
        >
          <ContributionSnake />
        </motion.div>

      </div>
    </section>
  )
}