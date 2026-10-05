const CODING_START_YEAR = 2018
const ANNIVERSARY_MONTH = 10
const ANNIVERSARY_DAY = 23

const brusselsDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Brussels",
  year: "numeric",
  month: "numeric",
  day: "numeric",
})

export function getCodingYears(now = new Date()): number {
  const parts = brusselsDate.formatToParts(now)
  const year = Number(parts.find((part) => part.type === "year")?.value)
  const month = Number(parts.find((part) => part.type === "month")?.value)
  const day = Number(parts.find((part) => part.type === "day")?.value)
  const beforeAnniversary = month < ANNIVERSARY_MONTH ||
    (month === ANNIVERSARY_MONTH && day < ANNIVERSARY_DAY)

  return Math.max(0, year - CODING_START_YEAR - Number(beforeAnniversary))
}
