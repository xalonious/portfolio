import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  const COOLDOWN_SEC = 5 * 60
  const STORAGE_KEY = "contact:lastSent"

  useEffect(() => {
    const last = Number(localStorage.getItem(STORAGE_KEY) || 0)
    const now = Date.now()
    const diff = Math.max(0, Math.floor((last + COOLDOWN_SEC * 1000 - now) / 1000))
    setCooldownLeft(diff)

    if (diff > 0) {
      const id = setInterval(() => {
        setCooldownLeft((s) => {
          if (s <= 1) {
            clearInterval(id)
            return 0
          }
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

      let json: any = null
      try {
        json = await res.json()
      } catch {}

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

  return (
    <section id="contact" className="relative py-20 sm:py-32 px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                 Get In Touch
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">Have a project in mind? Let's make it happen.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm sm:text-base ${
                    fieldErrors.name
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  }`}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="mt-2 text-xs text-red-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm sm:text-base ${
                    fieldErrors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  }`}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="mt-2 text-xs text-red-400">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <textarea
                rows={6}
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "message-error" : undefined}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-sm sm:text-base ${
                  fieldErrors.message
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                }`}
              />
              {fieldErrors.message && (
                <p id="message-error" className="mt-2 text-xs text-red-400">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || cooldownLeft > 0}
              className="group relative w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-base sm:text-lg overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <span className="relative z-10">
                {loading
                  ? "Sending..."
                  : cooldownLeft > 0
                  ? `Please wait ${cooldownLabel}`
                  : "Send Message"}
              </span>
              {!loading && cooldownLeft === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                ❌ {error}
              </motion.div>
            )}

            {sent && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                role="status"
              >
                ✅ Your message has been sent! I'll get back to you as soon as I can.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}