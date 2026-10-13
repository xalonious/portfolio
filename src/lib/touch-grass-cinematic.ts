export const SILENT_DURATION = 240
export const OPENING_PHRASE = "A long time ago, on a website far, far away..."
export const CRAWL_PARAGRAPHS = [
  "It is a dark time for productivity.",
  "Across the galaxy, billions of people are working, studying, maintaining relationships, and occasionally venturing outdoors.",
  "But not you.",
  "Against all reasonable expectations, you have dedicated an alarming amount of your existence to exploring a random developer's portfolio.",
  "What began as innocent curiosity has spiraled into increasingly questionable life choices.",
  "You have studied ancient CASE STUDIES, uncovered forbidden messages in the DEVELOPER CONSOLE, and wandered deliberately into the wastelands of ERROR 404.",
  "You even attempted to infiltrate the ADMINISTRATIVE SECTOR, only to be denied by SEALY, a formidable feline whose authority is absolute and whose salary consists entirely of treats.",
  "Undeterred, you ventured into the mysterious SSH TERMINAL, unaware that an unreasonable amount of engineering had been dedicated to tracking your arrival.",
  "An ancient conflict between IPv4 and IPv6 nearly destroyed the entire operation, until the architects made a groundbreaking discovery.",
  "SSH ALREADY HAS USERNAMES.",
  "Several hours of engineering were subsequently rendered pointless.",
  "Yet even this was not enough to satisfy your hunger for imaginary trophies.",
  "You manipulated the sacred LOCAL STORAGE, activated ancient cheat codes, and clicked suspicious links with the determination of someone who has absolutely nothing better to do.",
  "Outside, the sun continued to shine. Birds sang. Grass grew.",
  "You noticed none of it.",
  "And now, having conquered every challenge, you stand victorious.",
  "Your reward?",
  "No money. No fame. Not even a certificate worth printing.",
  "You have successfully completed...",
  "A DEVELOPER PORTFOLIO.",
  "But one final judgment awaits.",
  "SEALY, Chief Technology Officer and Head of Security, has reviewed your accomplishments with mild concern.",
  "Your persistence is remarkable. Your priorities are questionable. Your screen time is frankly alarming.",
  "Nevertheless, one final reward has been reluctantly approved.",
  "Frankly, it's more than you deserve.",
  "Now, seriously.",
  "GO OUTSIDE.",
] as const

export function cinematicTiming(duration: number) {
  const openingEnd = Math.min(6.5, duration * 0.075)
  const crawlStart = openingEnd + Math.min(4.5, duration * 0.055)
  const endingPause = Math.min(duration * 0.15, Math.max(5, Math.min(10, duration * 0.06)))
  const crawlEnd = duration - endingPause
  const fadeStart = duration - Math.min(5, duration * 0.06)
  const fadeEnd = duration - Math.min(2, duration * 0.02)
  return { openingEnd, crawlStart, crawlEnd, fadeStart, fadeEnd }
}

export const CRAWL_READING_FRACTION = 0.85

export type CrawlProjection = {
  depth: number
  perspectiveOriginY: number
  planeOriginY: number
  cosine: number
  sine: number
}

export type CrawlTravel = { start: number; readingEnd: number; end: number }

function planeYAtScreenY(screenY: number, projection: CrawlProjection) {
  const { depth, perspectiveOriginY, planeOriginY, cosine, sine } = projection
  const denominator = depth * cosine + (screenY - perspectiveOriginY) * sine
  return planeOriginY + (screenY - planeOriginY) * depth / Math.max(0.001, denominator)
}

export function crawlTravel(
  viewportHeight: number,
  textHeight: number,
  lastLineCenter: number,
  projection: CrawlProjection,
  readingRatio: number,
  exitRatio: number,
): CrawlTravel {
  return {
    start: planeYAtScreenY(viewportHeight, projection),
    readingEnd: planeYAtScreenY(viewportHeight * readingRatio, projection) - lastLineCenter,
    end: planeYAtScreenY(viewportHeight * exitRatio, projection) - textHeight,
  }
}

function hermite(start: number, end: number, startSlope: number, endSlope: number, progress: number, duration: number) {
  const t2 = progress * progress
  const t3 = t2 * progress
  return (2 * t3 - 3 * t2 + 1) * start + (t3 - 2 * t2 + progress) * duration * startSlope
    + (-2 * t3 + 3 * t2) * end + (t3 - t2) * duration * endSlope
}

export function crawlPosition(progress: number, travel: CrawlTravel): number {
  const fraction = CRAWL_READING_FRACTION
  const readingSlope = (travel.readingEnd - travel.start) / fraction
  const exitSlope = (travel.end - travel.readingEnd) / (1 - fraction)
  const joinSlope = readingSlope * exitSlope > 0 ? 2 * readingSlope * exitSlope / (readingSlope + exitSlope) : 0
  const p = Math.max(0, Math.min(1, progress))
  return p <= fraction
    ? hermite(travel.start, travel.readingEnd, readingSlope, joinSlope, p / fraction, fraction)
    : hermite(travel.readingEnd, travel.end, joinSlope, exitSlope, (p - fraction) / (1 - fraction), 1 - fraction)
}
