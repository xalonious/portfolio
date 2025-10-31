"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { TechCarousel } from "@/components/TechCarousel"
import { FeaturedProjects } from "@/components/FeaturedProjects"
import { Header } from "@/components/Header"
import { ContactSection } from "@/components/ContactSection"
import { Story } from "@/components/Story" 

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  const technologies = [
    { name: "React", icon: "/tech/react.svg" },
    { name: "Next.js", icon: "/tech/nextjs.svg" },
    { name: "TypeScript", icon: "/tech/typescript.svg" },
    { name: "TailwindCSS", icon: "/tech/tailwindcss.svg" },
    { name: "Node.js", icon: "/tech/nodejs.svg" },
    { name: "Framer Motion", icon: "/tech/framer.svg" },
    { name: "Java", icon: "/tech/java.svg" },
    { name: "C#", icon: "/tech/csharp.svg" },
    { name: "JavaScript", icon: "/tech/javascript.svg" },
    { name: "GitHub", icon: "/tech/github.svg" },
    { name: "Linux", icon: "/tech/linux.svg" },
    { name: "Git", icon: "/tech/git.svg" },
    { name: "Python", icon: "/tech/python.svg" },
    { name: "CSS", icon: "/tech/css.svg" },
    { name: "HTML", icon: "/tech/html.svg" },
    { name: "Docker", icon: "/tech/docker.svg" },
    { name: "MongoDB", icon: "/tech/mongodb.svg" },
    { name: "Express", icon: "/tech/express.svg" },
    { name: "Bootstrap", icon: "/tech/bootstrap.svg" },
    { name: "MySQL", icon: "/tech/mysql.svg" },
    { name: ".NET", icon: "/tech/dotnet.svg" },
    { name: "SQLite", icon: "/tech/sqlite.svg" },
    { name: "Prisma", icon: "/tech/prisma.svg" },
    { name: "Nginx", icon: "/tech/nginx.svg" },
    { name: "Bash", icon: "/tech/bash.svg" },
    { name: "Figma", icon: "/tech/figma.svg" },
  ]

  const loopedTech = [...technologies, ...technologies, ...technologies]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <Header />

      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(62, 228, 255, 0.15), transparent)`,
        }}
      />

      <div className="fixed inset-0 pointer-events-none">
        {isMounted &&
          particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            />
          ))}
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-xl"
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-sm text-cyan-300 font-medium">Available for opportunities</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none"
                >
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                    XANDER
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <p className="text-lg sm:text-xl text-gray-400 font-light">Full-Stack Developer & Designer</p>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed"
              >
                Crafting <span className="text-cyan-400 font-semibold">exceptional digital experiences</span> with modern
                tech. <span className="text-purple-400 font-semibold">6+ years</span> of turning ideas into reality.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-base sm:text-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <span className="relative z-10">View My Work</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  Get In Touch
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-6 sm:gap-8 pt-8"
              >
                {[
                  { label: "Years Experience", value: "7+" },
                  { label: "Projects Completed", value: "10+" },
                  { label: "Technologies", value: "20+" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative flex flex-col items-center lg:items-end gap-6"
            >
              <motion.div
                whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-[280px] rotate-[-2.5deg] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-2xl"
              >
                <img src="/headshot.png" alt="Xander headshot" className="w-full h-64 object-cover rounded-xl" />
                <div className="px-3 pb-2 pt-3 text-sm text-gray-400">It me 👋</div>
              </motion.div>

              <motion.div
                whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-[220px] lg:-mr-8 rotate-[6deg] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-2xl"
              >
                <img src="/cat.png" alt="My cat" className="w-full h-48 object-cover rounded-xl" />
                <div className="px-3 pb-2 pt-3 text-sm text-gray-400">CTO (Chief Treat Officer)</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <Story />

      <section id="stack" className="relative py-20 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Tech Arsenal
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">Technologies I use</p>
          </div>
        </div>
        <TechCarousel items={loopedTech} />
      </section>

      <section id="projects" className="relative py-20 sm:py-32 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">A few things I'm proud of</p>
          </motion.div>

          <FeaturedProjects
            projects={[
              {
                title: "My Portfolio Website",
                description:
                  "The site you're on — built with Next.js and Tailwind CSS. It showcases my projects, skills, and development journey.",
                repo: "https://github.com/xalonious/portfolio",
                image: "/projects/portfolio.png",
                tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
              },
              {
                title: "Barber App",
                description:
                  "A school project — a simple barber booking app where users can schedule appointments. Built with React, Express, and TypeScript for a smooth UX.",
                repo: "https://github.com/xalonious/barber-app",
                image: "/projects/barber.png",
                tech: ["TypeScript", "React", "JavaScript", "Node.js", "Bootstrap", "Express"],
              },
              {
                title: "PassGuard",
                description:
                  "A lightweight password manager built with Electron and SQLite. Securely stores credentials locally in an intuitive interface.",
                repo: "https://github.com/xalonious/password-manager",
                image: "/projects/passwordmanager.png",
                tech: ["JavaScript", "Electron", "HTML", "CSS", "SQLite"],
              },
            ]}
          />
        </div>
      </section>

      <ContactSection />
    </div>
  )
}
