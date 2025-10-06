"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { TechCarousel } from "@/components/TechCarousel"
import { FeaturedProjects } from "@/components/FeaturedProjects"
import { Header } from "@/components/Header"
import { ContactSection } from "@/components/ContactSection"

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
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
    { name: "SQLite", icon: "/tech/sqlite.svg"},
    { name: "Prisma", icon: "/tech/prisma.svg"},
    { name: "Nginx", icon: "/tech/nginx.svg"}
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
        {isMounted && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
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
                tech. <span className="text-purple-400 font-semibold"> 6+ years</span> of turning ideas into reality.
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
                  { label: "Years Experience", value: "6+" },
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

      <section id="about" className="relative py-20 sm:py-32 px-6 scroll-mt-24 overflow-hidden">
        <div className="absolute inset-0">
          {isMounted && [...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="mb-20 text-center"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-10"
            >
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '3rem' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mb-8"
                />
                <h3 className="text-5xl font-black mb-8 leading-tight">
                  <span className="text-white">The Story</span>
                </h3>
              </div>

              <div className="space-y-8 text-xl leading-relaxed text-gray-300">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  I'm a <span className="text-white font-semibold">self-taught, full-stack developer</span> who went headfirst into coding and fell in love with the first lines of code I've written.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  I like to <span className="text-white font-semibold">Code, Design, Innovate and Experiment</span>. With a background in <span className="text-cyan-400 font-semibold">Javascript, Typescript, and Java</span>, I build full-stack applications with scalable and responsive technologies.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  I'm also a fan of the <span className="text-white font-semibold">open-source community</span> and I'm always looking for new ways to improve my skills.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '1000+', label: 'Coffee Consumed' },
                  { value: '100+', label: 'Rage Quits' },
                  { value: '20+', label: 'All-Nighters' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl group-hover:blur-2xl transition-all duration-700" />
                <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 p-8 font-mono text-sm">
                    {[
                      { text: '// Self-taught developer', delay: 0 },
                      { text: 'const passion = true;', delay: 0.2 },
                      { text: 'while (passion) {', delay: 0.4 },
                      { text: '  learn();', delay: 0.6 },
                      { text: '  build();', delay: 0.8 },
                      { text: '  innovate();', delay: 1.0 },
                      { text: '}', delay: 1.2 },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + line.delay }}
                        className={i === 0 ? 'text-gray-600 mb-4' : 'text-cyan-400 mb-2'}
                      >
                        {line.text}
                        {i === 6 && (
                          <motion.span
                            animate={{
                              opacity: [1, 0, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                            }}
                            className="inline-block w-2 h-5 bg-cyan-400 ml-0.5 align-text-bottom"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-3">
                {['TypeScript', 'React', 'Next.js', 'Node.js', 'Java'].map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + i * 0.05, type: 'spring' }}
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-default"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8"
            />
            <p className="text-2xl sm:text-3xl font-light text-gray-500 italic">
              "Building the future, one line at a time"
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.9 }}
              className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-8"
            />
          </motion.div>
        </div>
      </section>

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
                tech: ["JavaScript", "Electron", "HTML", "CSS", "SQLitee"],
              },
            ]}
          />
        </div>
      </section>

      <ContactSection />
    </div>
  )
}