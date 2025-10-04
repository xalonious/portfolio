"use client"

import Image from "next/image"
import { useEffect, useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from "react"
import { motion, Variants, type MotionProps } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TechCarousel } from "@/components/tech-carousel"
import { FeaturedProjects } from "@/components/featured-projects"

/* ─────────────────────────────────────────────
   Motion helpers
   ───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}
const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
}
const staggerIn: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const pop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default function Page() {
  return (
    <main className="relative overflow-hidden">
      <BGDecor />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* LEFT */}
          <div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="space-y-6">
              <motion.div variants={fadeUp}>
                <HeroBadge>Full-Stack Developer • Belgium</HeroBadge>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                <span className="text-[--foreground]">Xander</span>{" "}
                <span className="text-[--foreground]">aka</span>{" "}
                <span className="text-[--primary]">xalonious</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base leading-7 text-muted-foreground md:max-w-[52ch]">
                I’m a <b>19-year-old software developer</b> in Belgium. Over <b>6 years</b> in,
                building with <b>JavaScript</b>, <b>TypeScript</b>, <b>Java</b>, and <b>C#</b>.
              </motion.p>

              <motion.div variants={fadeUp} className="space-y-4 text-muted-foreground md:max-w-[58ch]">
                <p>
                  I’m a <b>self-taught</b> developer who dove head-first into code and never looked back. I love to{" "}
                  <i>design, innovate, and experiment</i> — especially around web apps and UX.
                </p>
                <p>
                  I build <b>full-stack</b> experiences with modern, scalable tech and contribute to{" "}
                  <b>open-source</b> whenever I can.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="bg-[--primary] text-[--background] hover:bg-[--secondary] transition-colors"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Contact Me
                </Button>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Dot /> 6+ yrs experience
                  </span>
                  <span className="hidden md:inline-flex items-center gap-2">
                    <Dot /> Self-taught
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[--primary]/20 blur-3xl" />
            <motion.div variants={float} initial="initial" animate="animate" className="relative flex flex-col items-end gap-6">
              <TiltCard className="w-[280px] rotate-[-2.5deg]">
                <Image src="/headshot.png" alt="Xander headshot" width={560} height={560} className="h-64 w-full rounded-lg object-cover" />
                <div className="px-3 pb-3 pt-2 text-sm text-muted-foreground">It me 👋</div>
              </TiltCard>

              <TiltCard className="w-[220px] -mr-8 rotate-[6deg]">
                <Image src="/cat.png" alt="My cat" width={440} height={440} className="h-48 w-full rounded-lg object-cover" />
                <div className="px-3 pb-3 pt-2 text-sm text-muted-foreground">CTO (Chief Treat Officer)</div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* TECH CAROUSEL */}
      <section id="stack" className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <TechCarousel />
      </section>

      <Divider />

      {/* FEATURED PROJECTS */}
      <FeaturedProjects />

      <Divider />

      {/* CONTACT SECTION */}
      <ContactSection />
    </main>
  )
}

/* ─────────────────────────────────────────────
   Contact Section (with 5-minute cooldown)
   ───────────────────────────────────────────── */
function ContactSection() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}) // NEW: per-field errors
  const [loading, setLoading] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState(0) // seconds remaining

  const COOLDOWN_SEC = 5 * 60
  const STORAGE_KEY = "contact:lastSent"

  // initialize & tick countdown
  useEffect(() => {
    const last = Number(localStorage.getItem(STORAGE_KEY) || 0)
    const now = Date.now()
    const diff = Math.max(0, Math.floor((last + COOLDOWN_SEC * 1000 - now) / 1000))
    setCooldownLeft(diff)

    if (diff > 0) {
      const id = setInterval(() => {
        setCooldownLeft((s) => {
          if (s <= 1) { clearInterval(id); return 0 }
          return s - 1
        })
      }, 1000)
      return () => clearInterval(id)
    }
  }, []) // run once

  const cooldownLabel = useMemo(() => {
    if (cooldownLeft <= 0) return ""
    const m = Math.floor(cooldownLeft / 60)
    const s = cooldownLeft % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [cooldownLeft])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setFieldErrors({}) // clear per-field errors

    if (cooldownLeft > 0) {
      setError(`Please wait ${cooldownLabel} before sending another message.`)
      return
    }

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)?.value?.trim(),
      // honeypot
      company: (form.elements.namedItem("company") as HTMLInputElement)?.value?.trim() || "",
    }

    if (!data.name || !data.email || !data.message) {
      setError("Please fill out all fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      // Parse JSON even on non-2xx to read server messages
      let json: any = null
      try { json = await res.json() } catch {}

      // --- Handle cooldown explicitly (429) ---
      if (res.status === 429) {
        const retryAfterSec =
          Number(res.headers.get("Retry-After")) ||
          (json?.retryAfter ? Number(json.retryAfter) : 0)

        setError(json?.error || "You’ve sent a message recently. Please wait before trying again.")
        if (retryAfterSec > 0) {
          setCooldownLeft(retryAfterSec)
          // Align local storage timestamp with server cookie cooldown
          const now = Date.now()
          localStorage.setItem(STORAGE_KEY, String(now - (COOLDOWN_SEC - retryAfterSec) * 1000))
        }
        return
      }

      // --- Zod validation errors (400) ---
      if (res.status === 400 && json?.issues?.length) {
        const fe: Record<string, string> = {}
        for (const i of json.issues) {
          if (i?.path && i?.message) fe[i.path] = i.message
        }
        setFieldErrors(fe)
        setError(json?.error || "Please correct the highlighted fields.")
        return
      }

      // --- Other non-OK responses ---
      if (!res.ok) {
        setError(json?.error || `Server error (${res.status}). Please try again.`)
        return
      }

      // --- Success ---
      if (json?.ok) {
        setSent(true)
        form.reset()

        // Start local cooldown (server sets HttpOnly cookie too)
        const now = Date.now()
        localStorage.setItem(STORAGE_KEY, String(now))
        setCooldownLeft(COOLDOWN_SEC)
      } else {
        setError(json?.error || "Something went wrong.")
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-6 pb-28">
      {/* aurora backdrop */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-10 -bottom-10 -z-10 rounded-[40px] opacity-60"
        style={{
          background:
            "radial-gradient(40% 60% at 15% 20%, var(--primary)/14%, transparent 60%), radial-gradient(40% 60% at 85% 70%, var(--secondary)/18%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div variants={staggerIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <motion.div variants={pop}>
          <Card className="relative overflow-hidden border-border/40 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.45)]">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <motion.h3 variants={pop} className="text-2xl font-semibold text-[--foreground]">
                Get in Touch
              </motion.h3>
              <motion.p variants={pop} className="mt-2 text-sm text-muted-foreground">
                Got a project or an idea? Let’s build something great.
              </motion.p>

              <motion.form variants={staggerIn} onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                {/* Honeypot (hidden) */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />

                <motion.div variants={pop} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <InputWithIcon
                      name="name"
                      placeholder="Your Name"
                      icon={<UserIcon />}
                      required
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <InputWithIcon
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      icon={<MailIcon />}
                      required
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={pop}>
                  <Textarea
                    name="message"
                    rows={5}
                    placeholder="Your Message"
                    required
                    className="resize-none"
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                  />
                  {fieldErrors.message && (
                    <p id="message-error" className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
                  )}
                </motion.div>

                <motion.div variants={pop}>
                  <ShimmerButton type="submit" className="w-full" disabled={loading || cooldownLeft > 0}>
                    {loading ? "Sending..." : cooldownLeft > 0 ? `Please wait ${cooldownLabel}` : "Send Message"}
                  </ShimmerButton>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    role="alert"
                  >
                    ❌ {error}
                  </motion.div>
                )}
                {sent && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                    role="status"
                  >
                    ✅ Your message has been sent! I’ll get back to you as soon as I can.
                  </motion.div>
                )}
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Reusable Components (icons fixed)
   ───────────────────────────────────────────── */
function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex whitespace-nowrap rounded-full p-[1px] bg-[linear-gradient(90deg,var(--primary)_0%,var(--secondary)_50%,var(--accent)_100%)] [background-size:200%_100%] [animation:gradientShift_8s_linear_infinite]">
      <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--muted)_80%,transparent)] border border-white/5 backdrop-blur-[2px] px-3 py-1.5 text-[12px] sm:text-xs font-medium tracking-wide text-[--foreground]/90">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--secondary))]" />
        {children}
      </span>
    </span>
  )
}

function InputWithIcon({
  icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80"
      >
        {icon}
      </span>
      {/* IMPORTANT: pl-10 is now respected because Input merges className */}
      <Input {...props} className={`pl-10 ${className}`} />
    </div>
  )
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-md border border-border/50 bg-[--canvas] py-2 px-4 text-[--foreground] outline-none transition",
        "focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/50",
        "dark:bg-[--muted]",
        className, // <- merge, don’t overwrite
      ].join(" ")}
    />
  )
}

function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-md border border-border/50 bg-[--canvas] py-2 px-4 text-[--foreground] outline-none transition",
        "focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/50",
        "dark:bg-[--muted]",
        className,
      ].join(" ")}
    />
  )
}

function ShimmerButton({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & { children: ReactNode }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 py-2 text-sm font-medium text-[--coal] transition focus:outline-none ${className}`}
      style={{ background: "var(--primary)" }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.45),transparent)] opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />
      {children}
    </motion.button>
  )
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[--primary]" />
}

function Divider() {
  return (
    <div className="mx-auto flex max-w-6xl items-center px-6">
      <Separator className="my-6 h-[1.5px] w-full bg-gradient-to-r from-transparent via-[--primary] to-transparent" />
    </div>
  )
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ rotateX: 6, rotateY: -6, translateZ: 6 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`group relative rounded-xl border border-border/60 bg-[--card] p-2 shadow-lg will-change-transform ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 group-hover:ring-[--primary]/50" />
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Icons + Background
   ───────────────────────────────────────────── */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 19a7 7 0 1 0-14 0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BGDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full [background:radial-gradient(closest-side,var(--primary)/20%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#fff_0.5px,transparent_0.5px)] [background-size:8px_8px]"
      />
    </>
  )
}
