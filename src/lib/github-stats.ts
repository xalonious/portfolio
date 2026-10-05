import { z } from "zod"

const count = z.number().int().nonnegative()
const profileSchema = z.object({ public_repos: count })
const summarySchema = z.object({
  repositories: z.object({ totalCount: count }),
  contributionsCollection: z.object({ contributionYears: z.array(count) }),
})
const commitYearsSchema = z.record(
  z.string(),
  z.object({ totalCommitContributions: count }),
)

export interface GitHubStats {
  projects: number | null
  commits: number | null
}

async function graphql(username: string, token: string, fields: string): Promise<unknown> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "xalonious-portfolio",
    },
    body: JSON.stringify({
      query: `query PortfolioStats($login: String!) { user(login: $login) { ${fields} } }`,
      variables: { login: username },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) throw new Error(`GitHub GraphQL request failed (${response.status})`)
  const result = await response.json()
  if (result.errors?.length || !result.data?.user) {
    throw new Error("GitHub GraphQL returned incomplete statistics")
  }
  return result.data.user
}

export async function getPublicRepositoryCount(username: string): Promise<number> {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "xalonious-portfolio",
      "X-GitHub-Api-Version": "2026-03-10",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`GitHub profile request failed (${response.status})`)
  return profileSchema.parse(await response.json()).public_repos
}

export async function getAuthenticatedGitHubStats(
  username: string,
  token: string,
  currentYear: number,
): Promise<{ projects: number; commits: number }> {
  const summary = summarySchema.parse(await graphql(username, token, `
    repositories(first: 1, ownerAffiliations: [OWNER]) { totalCount }
    contributionsCollection { contributionYears }
  `))

  const years = [...new Set([...summary.contributionsCollection.contributionYears, currentYear])]
    .filter((year) => year <= currentYear)
  const fields = years.map((year) => `
    year${year}: contributionsCollection(
      from: "${year}-01-01T00:00:00Z",
      to: "${year}-12-31T23:59:59Z"
    ) { totalCommitContributions }
  `).join("\n")
  const contributions = commitYearsSchema.parse(await graphql(username, token, fields))
  const commits = years.reduce((total, year) => {
    const contribution = contributions[`year${year}`]
    if (!contribution) throw new Error("GitHub omitted a contribution year")
    return total + contribution.totalCommitContributions
  }, 0)

  return { projects: summary.repositories.totalCount, commits }
}
