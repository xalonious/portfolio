import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"


const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  company: z.string().optional().default(""),
  turnstileToken: z.string().trim().max(2048).optional(),
})

const isSpammy = (text: string) =>
  /\b(viagra|casino|loan|crypto)\b/i.test(text)

function clip(s: string, max = 1900) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s
}

function getClientIp(req: NextRequest) {
  const cfIp = req.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp.trim()

  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]?.trim() || "unknown"

  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

function tooManyRequests(resetAt: number, reason: string) {
  const retryAfter = Math.ceil(Math.max(0, resetAt - Date.now()) / 1000)
  const minutes = Math.ceil(retryAfter / 60)

  return NextResponse.json(
    {
      ok: false,
      error: `${reason} Please wait about ${minutes} minute${minutes !== 1 ? "s" : ""} before trying again.`,
      retryAfter,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

async function verifyTurnstile(token: string, secret: string) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) throw new Error(`Turnstile Siteverify returned ${response.status}`)

  const result = await response.json()
  return result?.success === true
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const attempts = rateLimit(`contact-attempt:${ip}`, 10)
    if (!attempts.success) {
      return tooManyRequests(attempts.resetAt, "Too many contact form attempts.")
    }

    const body = await req.json().catch(() => ({}))
    const parsed = ContactSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }))

      return NextResponse.json(
        { ok: false, error: "Invalid form data.", issues },
        { status: 400 }
      )
    }

    const { name, email, message, company, turnstileToken } = parsed.data

    if (company && company.trim() !== "") {
      return NextResponse.json({ ok: true })
    }

    if (isSpammy(`${name} ${message}`)) {
      return NextResponse.json({ ok: true })
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { ok: false, error: "Please complete verification and try again." },
        { status: 400 },
      )
    }

    const turnstileSecret = process.env.NODE_ENV === "development"
      ? "1x0000000000000000000000000000000AA"
      : process.env.TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      console.error("Missing TURNSTILE_SECRET_KEY for the contact form")
      return NextResponse.json(
        { ok: false, error: "The contact form is unavailable right now. You can still reach me by email." },
        { status: 503 },
      )
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return NextResponse.json(
        { ok: false, error: "Webhook not configured." },
        { status: 500 }
      )
    }

    let verified: boolean
    try {
      verified = await verifyTurnstile(turnstileToken, turnstileSecret)
    } catch (error) {
      console.error("Contact form Turnstile verification failed:", error)
      return NextResponse.json(
        { ok: false, error: "Verification is temporarily unavailable. Please try again." },
        { status: 503 },
      )
    }

    if (!verified) {
      return NextResponse.json(
        { ok: false, error: "Verification failed or expired. Please try again." },
        { status: 400 },
      )
    }

    const delivery = rateLimit(`contact:${ip}`)
    if (!delivery.success) {
      return tooManyRequests(delivery.resetAt, "You’ve already sent a message recently.")
    }

    const payload = {
      username: "Portfolio Contact",
      embeds: [
        {
          title: "📩 New portfolio message",
          color: 0xc0a060,
          timestamp: new Date().toISOString(),
          fields: [
            { name: "From", value: clip(name, 256), inline: true },
            { name: "Email", value: clip(email, 256), inline: true },
            { name: "Message", value: clip(message, 1900) },
          ],
          footer: { text: "whoisxander.dev" },
        },
      ],
    }

    const r = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const t = await r.text().catch(() => "")
      console.error("Discord webhook error:", r.status, t)

      return NextResponse.json(
        { ok: false, error: "Failed to deliver message." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    )
  }
}
