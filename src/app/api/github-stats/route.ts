import { createHash } from "node:crypto"
import { unstable_cache } from "next/cache"
import { NextResponse } from "next/server"
import {
  getAuthenticatedGitHubStats,
  getPublicRepositoryCount,
  type GitHubStats,
} from "@/lib/github-stats"

const DAY_SECONDS = 24 * 60 * 60
const publicRepositories = unstable_cache(
  getPublicRepositoryCount,
  ["github-public-repositories-v1"],
  { revalidate: DAY_SECONDS },
)

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "xalonious"
  const token = process.env.GITHUB_TOKEN
  let stats: GitHubStats = { projects: null, commits: null }

  if (token) {
    const authenticatedStats = unstable_cache(
      (login: string, year: number) => getAuthenticatedGitHubStats(login, token, year),
      ["github-portfolio-statistics-v1", createHash("sha256").update(token).digest("hex")],
      { revalidate: DAY_SECONDS },
    )
    try {
      stats = await authenticatedStats(username, new Date().getUTCFullYear())
    } catch {
      console.error("GitHub statistics unavailable; falling back to public repository count.")
    }
  }

  if (stats.projects === null) {
    try {
      stats.projects = await publicRepositories(username)
    } catch {
      console.error("GitHub public repository count unavailable.")
    }
  }

  return NextResponse.json(stats, {
    status: stats.projects === null && stats.commits === null ? 502 : 200,
    headers: { "Cache-Control": "no-store" },
  })
}
