"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { TechRadar } from "@/components/TechRadar"
import { FeaturedProjects } from "@/components/FeaturedProjects"
import { ContactSection } from "@/components/ContactSection"
import { Story } from "@/components/Story"
import { ScrambleText } from "@/components/ScrambleText"
import { PrimaryButton, GhostButton } from "@/components/MagneticButton"
import { DiscordStatus } from "@/components/DiscordStatus"

export default function Portfolio() {
  return (
    <div className="min-h-screen text-[--foreground]" style={{ backgroundColor: "#1A1618" }}>

      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-28 pb-20 max-w-6xl mx-auto">



        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-end">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-6"
            >
              Full-Stack Developer & Designer
            </motion.p>

            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-tight text-[--foreground] mb-8">
              <ScrambleText
                text="Xander"
                delay={400}
                duration={900}
              />
            </h1>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="block h-[2px] w-16 bg-[--primary] mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-[--muted-foreground] max-w-lg leading-relaxed"
            >
              I build things for the web. Self-taught, full-stack,{" "}
              <em className="font-display italic text-[--foreground] not-italic">
                7 years in
              </em>
              {" "}and still hooked.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DiscordStatus />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <PrimaryButton
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View my work
              </PrimaryButton>
              <GhostButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get in touch
              </GhostButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex flex-col items-end gap-4"
          >
            <div className="w-52 rotate-[2deg] rounded-sm overflow-hidden border border-[--border] shadow-md">
              <div className="relative w-full h-64">
                <Image src="/headshot.png" alt="Xander" fill className="object-cover" />
              </div>
              <div className="bg-[--card] px-3 py-2 text-xs text-[--muted-foreground] font-medium">
                It me 👋
              </div>
            </div>
            <div className="w-40 -rotate-[3deg] rounded-sm overflow-hidden border border-[--border] shadow-md self-start ml-8">
              <div className="relative w-full h-36">
                <Image src="/cat.png" alt="My cat" fill className="object-cover" />
              </div>
              <div className="bg-[--card] px-3 py-2 text-xs text-[--muted-foreground] font-medium">
                CTO 🐱
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-6 text-xs text-[--muted-foreground] tracking-widest uppercase hidden sm:block"
        >
          Scroll ↓
        </motion.p>
      </section>

      <Story />

      <section id="stack" className="py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-2">Tools of the trade</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[--foreground]">Tech Stack</h2>
        </div>
        <TechRadar />
      </section>

      <section id="projects" className="py-20 sm:py-28 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-2">Selected work</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[--foreground]">Projects</h2>
            </div>
            <p className="text-sm text-[--muted-foreground] max-w-xs sm:text-right">
              A few things I&apos;ve built that I&apos;m actually proud of.
            </p>
          </div>

          <FeaturedProjects
            projects={[
              {
                title: "Streaming App",
                description:
                  "A self-hosted media streaming web app for discovering and playing movies and TV shows from user-configured sources.",
                repo: "https://github.com/xalonious/streaming-app",
                image: "/projects/streamingapp.png",
                tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind"],
              },
              {
                title: "xanderGPT",
                description:
                  "A ChatGPT-style web app powered by a local LLM via Ollama, with real-time streaming, persistent conversations & web search.",
                repo: "https://github.com/xalonious/xanderGPT",
                image: "/projects/xandergpt.png",
                tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
              },
              {
                title: "Serendipity Scheduling",
                description:
                  "A centralized scheduling web app and API for managing staff shifts and trainings for a Roblox roleplay group.",
                repo: "https://github.com/xalonious/serendipity-scheduling-app",
                image: "/projects/serendipity.png",
                tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
              },
            ]}
          />
        </div>
      </section>

      <ContactSection />
    </div>
  )
}