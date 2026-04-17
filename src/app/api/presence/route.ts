import { NextResponse } from "next/server"

const LANYARD_USER_ID = "531484240114876416"
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`

type DiscordStatus = "online" | "idle" | "dnd" | "offline"

interface LanyardActivity {
  type?: number
  name?: string
  application_id?: string
  details?: string
  state?: string
  assets?: {
    large_image?: string
  }
  timestamps?: {
    start?: number
    end?: number
  }
}

interface LanyardSpotify {
  song?: string
  artist?: string
  album?: string
  album_art_url?: string
  timestamps?: {
    start?: number
    end?: number
  }
}

interface LanyardResponse {
  success?: boolean
  data?: {
    discord_status?: DiscordStatus
    listening_to_spotify?: boolean
    spotify?: LanyardSpotify | null
    activities?: LanyardActivity[]
  }
}

function hasCompleteSpotifyData(
  spotify: LanyardSpotify | null | undefined
): spotify is {
  song: string
  artist: string
  album: string
  album_art_url: string
  timestamps: {
    start: number
    end: number
  }
} {
  return Boolean(
    spotify?.song &&
    spotify.artist &&
    spotify.album &&
    spotify.album_art_url &&
    spotify.timestamps?.start &&
    spotify.timestamps.end
  )
}

export async function GET() {
  try {
    const response = await fetch(LANYARD_URL, {
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      const text = await response.text().catch(() => "")
      console.error("Lanyard API error:", response.status, text)

      return NextResponse.json(
        { success: false, error: "Failed to fetch presence." },
        {
          status: 502,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    const lanyard = (await response.json()) as LanyardResponse

    if (!lanyard.success || !lanyard.data) {
      return NextResponse.json(
        { error: "Invalid presence response." },
        {
          status: 502,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    const activities = (lanyard.data.activities ?? [])
      .filter((activity) => activity.type !== 4 && activity.name)
      .map((activity) => ({
        type: activity.type as 0 | 1 | 2 | 3 | 5,
        name: activity.name as string,
        application_id: activity.application_id,
        details: activity.details,
        state: activity.state,
        assets: activity.assets?.large_image
          ? { large_image: activity.assets.large_image }
          : undefined,
        timestamps: activity.timestamps
          ? {
              start: activity.timestamps.start,
              end: activity.timestamps.end,
            }
          : undefined,
      }))

    const spotify = lanyard.data.spotify

    return NextResponse.json({
      discord_status: lanyard.data.discord_status ?? "offline",
      listening_to_spotify: Boolean(lanyard.data.listening_to_spotify && hasCompleteSpotifyData(spotify)),
      spotify: hasCompleteSpotifyData(spotify)
        ? {
            song: spotify.song,
            artist: spotify.artist,
            album: spotify.album,
            album_art_url: spotify.album_art_url,
            timestamps: {
              start: spotify.timestamps.start,
              end: spotify.timestamps.end,
            },
          }
        : null,
      activities,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error("Lanyard proxy error:", error)

    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  }
}
