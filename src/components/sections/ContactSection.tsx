"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/MagneticButton"
import { FaGithub, FaDiscord } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

interface ApiResponse {
  ok?: boolean
  error?: string
  retryAfter?: number
  issues?: Array<{ path: string; message: string }>
}

const COOLDOWN_SEC = 5 * 60
const STORAGE_KEY = "contact:lastSent"

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState(0)

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
  }, [])

  const cooldownLabel = useMemo(() => {
    if (cooldownLeft <= 0) return ""
    const m = Math.floor(cooldownLeft / 60)
    const s = cooldownLeft % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [cooldownLeft])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSent(false)

    if (cooldownLeft > 0) {
      setError(`Please wait ${cooldownLabel} before sending another message.`)
      return
    }

    const { name, email, message } = formData
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company: "",
        }),
      })

      let json: ApiResponse | null = null
      try { json = await res.json() as ApiResponse } catch {}

      if (res.status === 429) {
        const retryAfterSec =
          Number(res.headers.get("Retry-After")) || (json?.retryAfter ? Number(json.retryAfter) : 0)
        setError(json?.error || "You've sent a message recently. Please wait before trying again.")
        if (retryAfterSec > 0) {
          setCooldownLeft(retryAfterSec)
          const now = Date.now()
          localStorage.setItem(STORAGE_KEY, String(now - (COOLDOWN_SEC - retryAfterSec) * 1000))
        }
        return
      }

      if (res.status === 400 && json?.issues?.length) {
        const fe: Record<string, string> = {}
        for (const i of json.issues) {
          if (i?.path && i?.message) fe[i.path] = i.message
        }
        setFieldErrors(fe)
        setError(json?.error || "Please correct the highlighted fields.")
        return
      }

      if (!res.ok) {
        setError(json?.error || `Server error (${res.status}). Please try again.`)
        return
      }

      if (json?.ok) {
        setSent(true)
        setFormData({ name: "", email: "", message: "" })
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

  const inputClass = (field: string) =>
    [
      "w-full px-4 py-3 rounded-sm border bg-[--muted] text-[--foreground] text-sm",
      "placeholder:text-[--muted-foreground] focus:outline-none focus:ring-1 transition-all duration-150",
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
        : "border-[--border] focus:border-[--primary] focus:ring-[--primary]/20",
    ].join(" ")

  return (
    <section id="contact" className="py-20 sm:py-28 px-6 scroll-mt-24 border-t border-[--border]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[--primary] font-medium mb-2">Contact</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[--foreground]">
                Let&apos;s work<br />
                <em className="italic font-display">together.</em>
              </h2>
            </div>

            <p className="text-[--muted-foreground] leading-relaxed max-w-sm">
              Have a project in mind, a question, or just want to say hello? Fill in the form and I&apos;ll get back to you.
            </p>

            <div className="pt-2 space-y-3 hidden lg:block">
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground]">Or find me at</p>

              <a
                href="https://github.com/xalonious"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <FaGithub className="w-4 h-4 shrink-0 text-[--foreground]" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">GitHub</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">github.com/xalonious</p>
                </div>
              </a>

              <a
                href="https://discordid.netlify.app/?id=531484240114876416"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <FaDiscord className="w-4 h-4 shrink-0" style={{ color: "#5865F2" }} aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">Discord</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">xander~!</p>
                </div>
              </a>
              <a
                href="mailto:contact@whoisxander.dev"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <MdEmail className="w-4 h-4 shrink-0 text-[--foreground]" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">contact@whoisxander.dev</p>
                </div>
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[--muted-foreground] uppercase tracking-wider mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    aria-invalid={!!fieldErrors.name}
                    className={inputClass("name")}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[--muted-foreground] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    aria-invalid={!!fieldErrors.email}
                    className={inputClass("email")}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[--muted-foreground] uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={6}
                  name="message"
                  placeholder="What's on your mind?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.message}
                  className={`${inputClass("message")} resize-none`}
                />
                {fieldErrors.message && (
                  <p className="mt-1.5 text-xs text-red-500">{fieldErrors.message}</p>
                )}
              </div>

              <MagneticButton
                type="submit"
                disabled={loading || cooldownLeft > 0}
                className={`
                  group relative overflow-hidden w-full py-3.5 rounded-sm
                  bg-[--primary] text-[--primary-foreground]
                  text-sm font-semibold tracking-wide
                  transition-colors duration-200
                  hover:bg-[--foreground]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `.trim()}
                style={{ display: "block" }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
                />
                <span className="relative">
                  {loading
                    ? "Sending…"
                    : cooldownLeft > 0
                    ? `Wait ${cooldownLabel}`
                    : "Send message"}
                </span>
              </MagneticButton>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              {sent && !error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[--foreground] font-medium"
                  role="status"
                >
                  Message sent — I&apos;ll be in touch soon.
                </motion.p>
              )}
            </form>

            <div className="pt-6 space-y-3 lg:hidden">
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground]">Or find me at</p>
              <a
                href="https://github.com/xalonious"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <FaGithub className="w-4 h-4 shrink-0 text-[--foreground]" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">GitHub</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">github.com/xalonious</p>
                </div>
              </a>
              <a
                href="https://discordid.netlify.app/?id=531484240114876416"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <FaDiscord className="w-4 h-4 shrink-0" style={{ color: "#5865F2" }} aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">Discord</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">xander~!</p>
                </div>
              </a>
              <a
                href="mailto:contact@whoisxander.dev"
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[--border] bg-[--card] hover:border-[--primary] transition-colors duration-200 group"
              >
                <MdEmail className="w-4 h-4 shrink-0 text-[--foreground]" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-[--muted-foreground] uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-[--foreground] group-hover:text-[--primary] transition-colors duration-200">contact@whoisxander.dev</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}