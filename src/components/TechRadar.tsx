"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface Tech {
  name: string
  icon: string
  category: "Frontend" | "Backend" | "Infrastructure" | "Tools"
  level: "Proficient" | "Familiar"
}

const TECHS: Tech[] = [
  { name: "React",       icon: "/tech/react.svg",       category: "Frontend",       level: "Proficient" },
  { name: "Next.js",     icon: "/tech/nextjs.svg",      category: "Frontend",       level: "Proficient" },
  { name: "TypeScript",  icon: "/tech/typescript.svg",  category: "Frontend",       level: "Proficient" },
  { name: "TailwindCSS", icon: "/tech/tailwindcss.svg", category: "Frontend",       level: "Proficient" },
  { name: "JavaScript",  icon: "/tech/javascript.svg",  category: "Frontend",       level: "Proficient" },
  { name: "CSS",         icon: "/tech/css.svg",         category: "Frontend",       level: "Proficient" },
  { name: "HTML",        icon: "/tech/html.svg",        category: "Frontend",       level: "Proficient" },
  { name: "Framer",      icon: "/tech/framer.svg",      category: "Frontend",       level: "Proficient" },
  { name: "Bootstrap",   icon: "/tech/bootstrap.svg",   category: "Frontend",       level: "Familiar"   },
  { name: "Electron",    icon: "/tech/electron.svg",    category: "Frontend",       level: "Familiar"   },
  { name: "Node.js",     icon: "/tech/nodejs.svg",      category: "Backend",        level: "Proficient" },
  { name: "Express",     icon: "/tech/express.svg",     category: "Backend",        level: "Proficient" },
  { name: "Java",        icon: "/tech/java.svg",        category: "Backend",        level: "Proficient" },
  { name: "C#",          icon: "/tech/csharp.svg",      category: "Backend",        level: "Familiar"   },
  { name: ".NET",        icon: "/tech/dotnet.svg",      category: "Backend",        level: "Familiar"   },
  { name: "Python",      icon: "/tech/python.svg",      category: "Backend",        level: "Familiar"   },
  { name: "Prisma",      icon: "/tech/prisma.svg",      category: "Backend",        level: "Proficient" },
  { name: "MySQL",       icon: "/tech/mysql.svg",       category: "Backend",        level: "Proficient" },
  { name: "MongoDB",     icon: "/tech/mongodb.svg",     category: "Backend",        level: "Proficient" },
  { name: "SQLite",      icon: "/tech/sqlite.svg",      category: "Backend",        level: "Familiar"   },
  { name: "Docker",      icon: "/tech/docker.svg",      category: "Infrastructure", level: "Proficient" },
  { name: "Nginx",       icon: "/tech/nginx.svg",       category: "Infrastructure", level: "Proficient" },
  { name: "Linux",       icon: "/tech/linux.svg",       category: "Infrastructure", level: "Proficient" },
  { name: "Bash",        icon: "/tech/bash.svg",        category: "Infrastructure", level: "Familiar"   },
  { name: "Git",         icon: "/tech/git.svg",         category: "Tools",          level: "Proficient" },
  { name: "GitHub",      icon: "/tech/github.svg",      category: "Tools",          level: "Proficient" },
  { name: "Figma",       icon: "/tech/figma.svg",       category: "Tools",          level: "Familiar"   },
]

const LEVEL_SIZE: Record<Tech["level"], number> = {
  Proficient: 76,
  Familiar:   54,
}

const CATEGORY_COLOR: Record<Tech["category"], string> = {
  Frontend:       "rgba(196, 122, 138, 0.14)",
  Backend:        "rgba(99,  179, 237, 0.11)",
  Infrastructure: "rgba(154, 205, 100, 0.11)",
  Tools:          "rgba(180, 180, 180, 0.09)",
}

const CATEGORY_BORDER: Record<Tech["category"], string> = {
  Frontend:       "rgba(196, 122, 138, 0.35)",
  Backend:        "rgba(99,  179, 237, 0.28)",
  Infrastructure: "rgba(154, 205, 100, 0.28)",
  Tools:          "rgba(180, 180, 180, 0.22)",
}

function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

interface Bubble {
  x: number; y: number; r: number
  floatX: number; floatY: number
  duration: number; delay: number
}

function generateBubbles(techs: Tech[], W: number, H: number): Bubble[] {
  const PAD = 12
  const MARGIN = 14
  const cols = Math.ceil(Math.sqrt(techs.length * (W / H)))
  const rows = Math.ceil(techs.length / cols)
  const cellW = W / cols
  const cellH = H / rows

  const bubbles: Bubble[] = techs.map((t, i) => {
    const r = LEVEL_SIZE[t.level] / 2
    const col = i % cols
    const row = Math.floor(i / cols)
    const cx = cellW * col + cellW * 0.15 + sr(i * 7) * cellW * 0.7
    const cy = cellH * row + cellH * 0.15 + sr(i * 13) * cellH * 0.7
    return {
      x: Math.max(MARGIN + r, Math.min(W - MARGIN - r, cx)),
      y: Math.max(MARGIN + r, Math.min(H - MARGIN - r, cy)),
      r,
      floatX: (sr(i * 3) - 0.5) * 7,
      floatY: (sr(i * 5) - 0.5) * 7,
      duration: 4 + sr(i * 11) * 3,
      delay: sr(i * 17) * 3,
    }
  })

  for (let pass = 0; pass < 200; pass++) {
    for (let a = 0; a < bubbles.length; a++) {
      for (let b = a + 1; b < bubbles.length; b++) {
        const ba = bubbles[a], bb = bubbles[b]
        const dx = bb.x - ba.x, dy = bb.y - ba.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
        const minDist = ba.r + bb.r + PAD
        if (dist < minDist) {
          const overlap = (minDist - dist) / 2
          const nx = dx / dist, ny = dy / dist
          ba.x -= nx * overlap; ba.y -= ny * overlap
          bb.x += nx * overlap; bb.y += ny * overlap
        }
      }
      const b = bubbles[a]
      b.x = Math.max(MARGIN + b.r, Math.min(W - MARGIN - b.r, b.x))
      b.y = Math.max(MARGIN + b.r, Math.min(H - MARGIN - b.r, b.y))
    }
  }
  return bubbles
}

const W = 1100
const H = 420

interface TooltipState { tech: Tech; xPct: number; yPct: number }

function BubbleNode({ tech, b, isFiltered, mousePos, onEnter, onLeave }: {
  tech: Tech; b: Bubble; isFiltered: boolean
  mousePos: React.MutableRefObject<{ x: number; y: number } | null>
  onEnter: () => void; onLeave: () => void
}) {
  const REPEL_RADIUS = 100
  const REPEL_STRENGTH = 42
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const sx = useSpring(offsetX, { stiffness: 80, damping: 14, mass: 0.6 })
  const sy = useSpring(offsetY, { stiffness: 80, damping: 14, mass: 0.6 })
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(performance.now())

  useEffect(() => {
    function tick() {
      const t = (performance.now() - startRef.current) / 1000
      const idleX = Math.sin(t / b.duration * Math.PI * 2 + b.delay) * b.floatX
      const idleY = Math.cos(t / (b.duration * 1.1) * Math.PI * 2 + b.delay + 0.3) * b.floatY
      let repelX = 0, repelY = 0
      if (mousePos.current && !isFiltered) {
        const dx = b.x - mousePos.current.x
        const dy = b.y - mousePos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > b.r && dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          repelX = (dx / dist) * force
          repelY = (dy / dist) * force
        }
      }
      offsetX.set(idleX + repelX)
      offsetY.set(idleY + repelY)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [b, isFiltered, mousePos, offsetX, offsetY])

  const iconSize = Math.round(b.r * 0.42)

  return (
    <motion.g
      style={{ x: sx, y: sy, cursor: isFiltered ? "default" : "pointer", opacity: isFiltered ? 0.15 : 1 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      whileHover={isFiltered ? {} : { scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <circle
        cx={b.x} cy={b.y} r={b.r}
        fill={isFiltered ? "var(--muted)" : CATEGORY_COLOR[tech.category]}
        stroke={isFiltered ? "var(--border)" : CATEGORY_BORDER[tech.category]}
        strokeWidth="1"
      />
      <foreignObject
        x={b.x - iconSize / 2}
        y={b.y - b.r * 0.52}
        width={iconSize}
        height={iconSize}
      >
        <Image
          src={tech.icon}
          alt={tech.name}
          width={iconSize}
          height={iconSize}
          style={{ width: `${iconSize}px`, height: `${iconSize}px`, objectFit: "contain", opacity: isFiltered ? 0.3 : 0.88 }}
        />
      </foreignObject>
      <text
        x={b.x}
        y={b.y + b.r * 0.38}
        textAnchor="middle"
        fontSize={b.r >= 35 ? "10" : "8.5"}
        fontFamily="var(--font-dm-sans), sans-serif"
        fill="var(--muted-foreground)"
        opacity={isFiltered ? 0.3 : 0.75}
      >
        {tech.name}
      </text>
    </motion.g>
  )
}

export function TechRadar() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [activeCategory, setActiveCategory] = useState<Tech["category"] | null>(null)
  const [mounted, setMounted] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const mousePos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => setMounted(true), [])

  const BUBBLES = useMemo(() => generateBubbles(TECHS, W, H), [])

  const handleSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    mousePos.current = {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top)  * (H / rect.height),
    }
  }, [])

  const handleSvgMouseLeave = useCallback(() => {
    mousePos.current = null
    setTooltip(null)
  }, [])

  const categories: Tech["category"][] = ["Frontend", "Backend", "Infrastructure", "Tools"]

  return (
    <div className="w-full">
      <div className="sm:hidden px-6 max-w-6xl mx-auto space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[--muted-foreground] mb-3">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {TECHS.filter((t) => t.category === cat).map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs font-medium"
                  style={{ borderColor: CATEGORY_BORDER[cat], backgroundColor: CATEGORY_COLOR[cat], color: "var(--foreground)" }}
                >
                  <Image src={tech.icon} alt={tech.name} width={14} height={14} style={{ width: "14px", height: "14px" }} className="object-contain opacity-80" />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block">
        <div className="flex flex-wrap gap-2 mb-8 px-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="px-3 py-1 rounded-sm text-xs font-medium border transition-all duration-200"
              style={{
                borderColor: activeCategory === cat ? CATEGORY_BORDER[cat] : "var(--border)",
                backgroundColor: activeCategory === cat ? CATEGORY_COLOR[cat] : "transparent",
                color: activeCategory === cat ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {cat}
            </button>
          ))}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3 py-1 rounded-sm text-xs font-medium border border-[--border] text-[--muted-foreground] hover:text-[--foreground] transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="relative w-full">
          {mounted && (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ height: "auto", display: "block" }}
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseLeave}
            >
              {TECHS.map((tech, i) => {
                const b = BUBBLES[i]
                const isFiltered = activeCategory !== null && activeCategory !== tech.category
                return (
                  <BubbleNode
                    key={tech.name}
                    tech={tech} b={b}
                    isFiltered={isFiltered}
                    mousePos={mousePos}
                    onEnter={() => {
                      if (isFiltered) return
                      setTooltip({ tech, xPct: (b.x / W) * 100, yPct: ((b.y - b.r - 8) / H) * 100 })
                    }}
                    onLeave={() => setTooltip(null)}
                  />
                )
              })}
            </svg>
          )}

          {tooltip && (
            <motion.div
              className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{ left: `${tooltip.xPct}%`, top: `${Math.max(tooltip.yPct, 2)}%` }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
            >
              <div className="rounded-sm px-2.5 py-1.5 text-xs shadow-lg whitespace-nowrap"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <span className="font-semibold text-[--foreground]">{tooltip.tech.name}</span>
                <span className="text-[--muted-foreground]"> · {tooltip.tech.category} · {tooltip.tech.level}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}