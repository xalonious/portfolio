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
})

const isSpammy = (text: string) =>
  /\b(viagra|casino|loan|crypto|http:\/\/|https:\/\/)\b/i.test(text)

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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const now = Date.now()

    const rl = rateLimit(`contact:${ip}`)

    if (!rl.success) {
      const remainingMs = Math.max(0, rl.resetAt - now)
      const retryAfterSec = Math.ceil(remainingMs / 1000)
      const retryAfterMin = Math.ceil(retryAfterSec / 60)

      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: `You’ve already sent a message recently. Please wait about ${retryAfterMin} minute${retryAfterMin !== 1 ? "s" : ""} before trying again.`,
          retryAfter: retryAfterSec,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSec),
          },
        }
      )
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

    const { name, email, message, company } = parsed.data

    if (company && company.trim() !== "") {
      return NextResponse.json({ ok: true })
    }

    if (isSpammy(`${name} ${message}`)) {
      return NextResponse.json({ ok: true })
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return NextResponse.json(
        { ok: false, error: "Webhook not configured." },
        { status: 500 }
      )
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