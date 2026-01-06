import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"

const COOLDOWN_MS = 5 * 60_000 

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

export async function POST(req: Request) {
  try {
    const jar = await cookies()
    const last = jar.get("contact_last")?.value
    const now = Date.now()

    if (last && now - Number(last) < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - (now - Number(last))
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
      const res = NextResponse.json({ ok: true })
      res.cookies.set("contact_last", String(now), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24,
      })
      return res
    }

    if (isSpammy(`${name} ${message}`)) {
      const res = NextResponse.json({ ok: true })
      res.cookies.set("contact_last", String(now), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24,
      })
      return res
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

    const res = NextResponse.json({ ok: true })
    res.cookies.set("contact_last", String(now), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    )
  }
}
