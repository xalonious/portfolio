"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FaSpotify } from "react-icons/fa"

type DiscordStatus = "online" | "idle" | "dnd" | "offline"

interface ActivityAssets {
  large_image?: string
}

interface Activity {
  type: 0 | 1 | 2 | 3 | 4 | 5
  name: string
  application_id?: string
  details?: string
  state?: string
  assets?: ActivityAssets
  timestamps?: { start?: number; end?: number }
  appIcon?: string | null
}

interface SpotifyData {
  song: string
  artist: string
  album: string
  album_art_url: string
  timestamps: { start: number; end: number }
}

interface LanyardData {
  discord_status: DiscordStatus
  listening_to_spotify: boolean
  spotify: SpotifyData | null
  activities: Activity[]
}

const LANYARD_URL = "/api/presence"
const POLL_INTERVAL = 30_000

const STATUS_CONFIG: Record<DiscordStatus, { label: string; color: string; dot: string }> = {
  online:  { label: "Available", color: "text-emerald-400",          dot: "bg-emerald-400" },
  dnd:     { label: "Available", color: "text-emerald-400",          dot: "bg-emerald-400" },
  idle:    { label: "Inactive",  color: "text-[--muted-foreground]", dot: "bg-[--muted-foreground]" },
  offline: { label: "Offline",   color: "text-[--muted-foreground]", dot: "bg-[--muted-foreground]" },
}

const BUSY_STATUS = { label: "Busy", color: "text-red-400", dot: "bg-red-400" }

const appIconCache: Record<string, string | null> = {}

async function fetchAppIcon(applicationId: string): Promise<string | null> {
  if (applicationId in appIconCache) return appIconCache[applicationId]
  try {
    const res = await fetch(`https://discord.com/api/v10/applications/${applicationId}/rpc`)
    if (!res.ok) { appIconCache[applicationId] = null; return null }
    const json = await res.json()
    if (!json.icon) { appIconCache[applicationId] = null; return null }
    const url = `https://cdn.discordapp.com/app-icons/${applicationId}/${json.icon}.png`
    appIconCache[applicationId] = url
    return url
  } catch {
    appIconCache[applicationId] = null
    return null
  }
}

function resolveAssetUrl(activity: Activity): string | null {
  const img = activity.assets?.large_image
  if (!img) return null
  if (img.startsWith("https://") || img.startsWith("http://")) return img
  if (img.startsWith("spotify:")) return null
  if (img.startsWith("mp:")) return `https://media.discordapp.net/${img.slice(3)}`
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`
  }
  return null
}

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function SpotifyProgress({ start, end }: { start: number; end: number }) {
  const [now, setNow] = useState(() => Math.min(Date.now(), end))

  useEffect(() => {
    setNow(Math.min(Date.now(), end))

    const id = setInterval(() => {
      setNow((current) => {
        if (current >= end) return current
        return Math.min(Date.now(), end)
      })
    }, 1000)

    return () => clearInterval(id)
  }, [end, start])

  const total = Math.max(end - start, 0)
  const elapsed = Math.min(Math.max(now - start, 0), total)
  const progress = total === 0 ? 100 : Math.min(100, (elapsed / total) * 100)
  const remaining = Math.max(end - now, 0)

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] font-mono text-[--muted-foreground] tabular-nums w-8 text-right">
        {formatTime(elapsed)}
      </span>
      <div className="flex-1 h-[2px] bg-[--border] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, backgroundColor: "#1DB954" }}
        />
      </div>
      <span className="text-[10px] font-mono text-[--muted-foreground] tabular-nums w-8">
        -{formatTime(remaining)}
      </span>
    </div>
  )
}

function useElapsed(startMs: number | undefined): string {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    if (!startMs) return
    function tick() {
      const totalSec = Math.floor((Date.now() - startMs!) / 1000)
      const h = Math.floor(totalSec / 3600)
      const m = Math.floor((totalSec % 3600) / 60)
      const s = totalSec % 60
      setElapsed(
        h > 0
          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${m}:${String(s).padStart(2, "0")}`
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startMs])

  return elapsed
}

export function DiscordStatus() {
  const [data, setData] = useState<LanyardData | null>(null)
  const [time, setTime] = useState("")
  const [tzAbbr, setTzAbbr] = useState("CET")

  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-BE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Brussels",
          hour12: false,
        })
      )
      const abbr = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Brussels",
        timeZoneName: "short",
      }).split(" ").pop() ?? "CET"
      setTzAbbr(abbr)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(LANYARD_URL)
        const json = await res.json()
        const resolved = await Promise.all(
          ((json.activities ?? []) as Activity[]).map(async (a) => {
            if (!a.assets?.large_image && a.application_id) {
              return { ...a, appIcon: await fetchAppIcon(a.application_id) }
            }
            return a
          })
        )
        setData({
          discord_status: json.discord_status,
          listening_to_spotify: json.listening_to_spotify,
          spotify: json.spotify,
          activities: resolved,
        })
      } catch {}
    }
    fetchStatus()
    const id = setInterval(fetchStatus, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  const elapsed = useElapsed(
    data?.activities.find((a) => a.type === 0)?.timestamps?.start
  )

  if (!data) return null

  const game = data.activities.find((a) => a.type === 0)
  const status = game ? BUSY_STATUS : STATUS_CONFIG[data.discord_status]
  const shouldPulse = !game && (data.discord_status === "online" || data.discord_status === "dnd")
  const gameImageUrl = game ? (resolveAssetUrl(game) ?? game.appIcon ?? null) : null

  return (
    <div className="flex flex-col gap-3 mt-8">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {shouldPulse && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${status.dot}`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dot}`} />
          </span>
          <span className={`text-xs font-medium uppercase tracking-[0.15em] ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-[--border] select-none">·</span>
        <span className="text-xs font-mono text-[--muted-foreground] tabular-nums">
          {time} <span className="opacity-50">{tzAbbr}</span>
        </span>
      </div>

      {game && (
        <div className="flex items-center gap-3 rounded-sm border border-[--border] bg-[--card] p-3 max-w-xs">
          {gameImageUrl && (
            <div className="relative w-10 h-10 shrink-0 rounded-sm overflow-hidden border border-[--border]" style={{ backgroundColor: "#18181b" }}>
              <Image
                src={gameImageUrl}
                alt={game.name}
                fill
                sizes="40px"
                className="object-contain p-1"
                unoptimized
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[--muted-foreground] mb-0.5">Playing</p>
            <p className="text-xs font-semibold text-[--foreground] truncate">{game.name}</p>
            {game.details && (
              <p className="text-[10px] text-[--muted-foreground] truncate">{game.details}</p>
            )}
            {game.state && (
              <p className="text-[10px] text-[--muted-foreground] truncate opacity-70">{game.state}</p>
            )}
            {elapsed && (
              <p className="text-[10px] font-mono text-[--primary] mt-0.5 tabular-nums">{elapsed}</p>
            )}
          </div>
        </div>
      )}

      {data.listening_to_spotify && data.spotify && (
        <div className="rounded-sm border border-[--border] bg-[--card] p-3 max-w-xs">
          <div className="flex items-center gap-1.5 mb-2.5">
            <FaSpotify style={{ color: "#1DB954", width: 11, height: 11, flexShrink: 0 }} aria-hidden />
            <span className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: "#1DB954" }}>
              Listening to Spotify
            </span>
            <span className="flex items-end gap-[2px] ml-0.5" style={{ height: 10 }}>
              {[1, 2, 3].map(i => (
                <span key={i} className="w-[2px] rounded-full block" style={{
                  backgroundColor: "#1DB954",
                  height: "100%",
                  animation: `eq${i} ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                }} />
              ))}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 rounded-sm overflow-hidden border border-[--border]">
              <Image
                src={data.spotify.album_art_url}
                alt={data.spotify.album}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[--foreground] truncate leading-tight">
                {data.spotify.song}
              </p>
              <p className="text-[10px] text-[--muted-foreground] truncate mt-0.5">
                {data.spotify.artist}
              </p>
              <SpotifyProgress
                start={data.spotify.timestamps.start}
                end={data.spotify.timestamps.end}
              />
            </div>
          </div>
          <style>{`
            @keyframes eq1 { from { height: 30% } to { height: 100% } }
            @keyframes eq2 { from { height: 70% } to { height: 30% } }
            @keyframes eq3 { from { height: 20% } to { height: 90% } }
          `}</style>
        </div>
      )}
    </div>
  )
}
