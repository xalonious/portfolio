"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Script from "next/script"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/MagneticButton"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { emitAchievementEvent } from "@/lib/achievements"

interface ApiResponse {
  ok?: boolean
  error?: string
  retryAfter?: number
  issues?: Array<{ path: string; message: string }>
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string
        appearance: "interaction-only"
        size: "normal" | "compact"
        retry: "never"
        "response-field": false
        callback: (token: string) => void
        "error-callback": () => void
        "timeout-callback": () => void
        "unsupported-callback": () => void
      }) => string
      remove: (widgetId: string) => void
    }
  }
}

const COOLDOWN_SEC = 5 * 60
const STORAGE_KEY = "contact:lastSent"
const TURNSTILE_SITE_KEY = process.env.NODE_ENV === "development"
  ? "1x00000000000000000000AA"
  : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const contactLinkClass = "flex items-center gap-3 px-4 py-3 rounded-sm border light:border-border light:bg-card hover:border-primary transition-colors duration-200 group"
const contactLinkLabelClass = "text-xs light:text-muted-foreground uppercase tracking-wider"
const contactLinkValueClass = "text-sm font-medium light:text-foreground light:group-hover:text-primary-ink transition-colors duration-200"

async function getTurnstileToken(container: HTMLElement, siteKey: string) {
  const turnstile = window.turnstile
  if (!turnstile) return null

  let widgetId: string | undefined
  let timeoutId: number | undefined

  try {
    return await new Promise<string | null>((resolve) => {
      const fail = () => resolve(null)
      timeoutId = window.setTimeout(fail, 120_000)
      widgetId = turnstile.render(container, {
        sitekey: siteKey,
        appearance: "interaction-only",
        size: container.clientWidth < 300 ? "compact" : "normal",
        retry: "never",
        "response-field": false,
        callback: resolve,
        "error-callback": fail,
        "timeout-callback": fail,
        "unsupported-callback": fail,
      })
    })
  } catch {
    return null
  } finally {
    window.clearTimeout(timeoutId)
    if (widgetId) turnstile.remove(widgetId)
  }
}

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submissionStatus, setSubmissionStatus] = useState<"verifying" | "sending" | null>(null)
  const [cooldownLeft, setCooldownLeft] = useState(0)
  const turnstileContainer = useRef<HTMLDivElement>(null)
  const onCooldown = cooldownLeft > 0

  useEffect(() => {
    const last = Number(localStorage.getItem(STORAGE_KEY) || 0)
    const now = Date.now()
    const diff = Math.max(0, Math.floor((last + COOLDOWN_SEC * 1000 - now) / 1000))
    setCooldownLeft(diff)
  }, [])

  useEffect(() => {
    if (!onCooldown) return

    const id = setInterval(() => {
      const last = Number(localStorage.getItem(STORAGE_KEY) || 0)
      setCooldownLeft(Math.max(0, Math.ceil((last + COOLDOWN_SEC * 1000 - Date.now()) / 1000)))
    }, 1000)

    return () => clearInterval(id)
  }, [onCooldown])

  const cooldownLabel = useMemo(() => {
    if (cooldownLeft <= 0) return ""
    const m = Math.floor(cooldownLeft / 60)
    const s = cooldownLeft % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [cooldownLeft])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submissionStatus) return

    setError(null)
    setFieldErrors({})
    setSent(false)

    if (onCooldown) {
      setError(`Please wait ${cooldownLabel} before sending another message.`)
      return
    }

    const { name, email, message } = formData
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields.")
      return
    }

    if (!TURNSTILE_SITE_KEY || !turnstileContainer.current) {
      setError("The contact form is unavailable right now. You can still reach me by email.")
      return
    }

    const company = String(new FormData(e.currentTarget).get("company") ?? "")
    setSubmissionStatus("verifying")
    try {
      const turnstileToken = await getTurnstileToken(turnstileContainer.current, TURNSTILE_SITE_KEY)
      if (!turnstileToken) {
        setError("Verification couldn’t finish. Please try again or refresh the page.")
        return
      }

      setSubmissionStatus("sending")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company,
          turnstileToken,
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
        emitAchievementEvent("contact_used")
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
      setSubmissionStatus(null)
    }
  }

  const inputClass = (field: string) =>
    [
      "w-full px-4 py-3 rounded-sm border light:bg-muted light:text-foreground text-sm",
      "light:placeholder:text-muted-foreground focus:outline-none light:focus-visible:outline-2 light:focus-visible:outline-offset-2 light:focus-visible:outline-primary focus:ring-1 transition-all duration-150",
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
        : "light:border-border focus:border-primary focus:ring-primary/20",
    ].join(" ")

  return (
    <section id="contact" className="py-20 sm:py-28 px-6 scroll-mt-24 border-t light:border-border">
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
              <p className="text-xs uppercase tracking-[0.2em] light:text-primary-ink font-medium mb-2">Contact</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold light:text-foreground">
                Let&apos;s work<br />
                <em className="italic font-display">together.</em>
              </h2>
            </div>

            <p className="light:text-muted-foreground leading-relaxed max-w-sm">
              Have a project in mind, a question, or just want to say hello? Fill in the form and I&apos;ll get back to you.
            </p>

            <div className="pt-2 space-y-3 hidden lg:block">
              <p className="text-xs uppercase tracking-[0.2em] light:text-muted-foreground">Or find me at</p>

              <a
                href="https://github.com/xalonious"
                onClick={() => emitAchievementEvent("contact_used")}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClass}
              >
                <FaGithub className="w-4 h-4 shrink-0 light:text-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>GitHub</p>
                  <p className={contactLinkValueClass}>github.com/xalonious</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/xander-lauwens-b42898241/"
                onClick={() => emitAchievementEvent("contact_used")}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClass}
              >
                <FaLinkedin className="w-4 h-4 shrink-0" style={{ color: "#0A66C2" }} aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>LinkedIn</p>
                  <p className={contactLinkValueClass}>Xander Lauwens</p>
                </div>
              </a>
              <a
                href="mailto:contact@whoisxander.dev"
                onClick={() => emitAchievementEvent("contact_used")}
                className={contactLinkClass}
              >
                <MdEmail className="w-4 h-4 shrink-0 light:text-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>Email</p>
                  <p className={contactLinkValueClass}>contact@whoisxander.dev</p>
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
                  <label className="block text-xs font-medium light:text-muted-foreground uppercase tracking-wider mb-1.5">
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
                    <p className="mt-1.5 text-xs text-red-500 light:text-destructive">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium light:text-muted-foreground uppercase tracking-wider mb-1.5">
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
                    <p className="mt-1.5 text-xs text-red-500 light:text-destructive">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium light:text-muted-foreground uppercase tracking-wider mb-1.5">
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
                  <p className="mt-1.5 text-xs text-red-500 light:text-destructive">{fieldErrors.message}</p>
                )}
              </div>

              <div>
                {TURNSTILE_SITE_KEY && (
                  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" />
                )}
                <div ref={turnstileContainer} />
                <span className="sr-only" role="status">
                  {submissionStatus === "verifying" && "Verifying…"}
                </span>

                <MagneticButton
                  type="submit"
                  disabled={submissionStatus !== null || onCooldown}
                  className={`
                    group relative overflow-hidden w-full py-3.5 rounded-sm
                    light:bg-primary light:text-primary-foreground
                    text-sm font-semibold tracking-wide
                    transition-colors duration-200
                    light:hover:bg-foreground
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `.trim()}
                  style={{ display: "block" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
                  />
                  <span className="relative">
                    {submissionStatus === "verifying"
                      ? "Verifying…"
                      : submissionStatus === "sending"
                      ? "Sending…"
                      : onCooldown
                      ? `Wait ${cooldownLabel}`
                      : "Send message"}
                  </span>
                </MagneticButton>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 light:text-destructive"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              {sent && !error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm light:text-foreground font-medium"
                  role="status"
                >
                  Message sent — I&apos;ll be in touch soon.
                </motion.p>
              )}
            </form>

            <div className="pt-6 space-y-3 lg:hidden">
              <p className="text-xs uppercase tracking-[0.2em] light:text-muted-foreground">Or find me at</p>
              <a
                href="https://github.com/xalonious"
                onClick={() => emitAchievementEvent("contact_used")}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClass}
              >
                <FaGithub className="w-4 h-4 shrink-0 light:text-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>GitHub</p>
                  <p className={contactLinkValueClass}>github.com/xalonious</p>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/xander-lauwens-b42898241/"
                onClick={() => emitAchievementEvent("contact_used")}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClass}
              >
                <FaLinkedin className="w-4 h-4 shrink-0" style={{ color: "#0A66C2" }} aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>LinkedIn</p>
                  <p className={contactLinkValueClass}>Xander Lauwens</p>
                </div>
              </a>
              <a
                href="mailto:contact@whoisxander.dev"
                onClick={() => emitAchievementEvent("contact_used")}
                className={contactLinkClass}
              >
                <MdEmail className="w-4 h-4 shrink-0 light:text-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className={contactLinkLabelClass}>Email</p>
                  <p className={contactLinkValueClass}>contact@whoisxander.dev</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
