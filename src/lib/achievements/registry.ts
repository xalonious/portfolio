import { FiBookOpen, FiClock, FiCode, FiCompass, FiFeather, FiLayers, FiMessageCircle, FiMusic, FiShield, FiSun, FiTerminal, FiUserX, FiZap } from "react-icons/fi"
import { ACHIEVEMENT_TAMPER_EVENT } from "./storage"
import { SSH_ACHIEVEMENT_ID, SSH_CONNECTED_EVENT, SSH_WATCH_EVENT, SSH_WATCH_WINDOW_MS } from "./ssh-config"
import type { AchievementDefinition, CustomAchievementHandler } from "./types"

export function createAchievementRegistry(publishedCaseStudyIds: readonly string[] = []): readonly AchievementDefinition[] {
  return [
    {
      id: "inspecting-the-inspector",
      name: "Inspecting the Inspector",
      description: "Find the hidden message in the developer console.",
      hint: "Some secrets aren't visible on the page.",
      icon: FiTerminal,
      rarity: "rare",
      hidden: false,
      trigger: { type: "event", event: "developer_console_secret_found" },
    },
    {
      id: "story-time", name: "Story Time", description: "Read a case study from beginning to end.",
      hint: "Every project has a story to tell.",
      icon: FiBookOpen, rarity: "common", hidden: false,
      trigger: { type: "event", event: "case_study_read" },
    },
    {
      id: "lore-master", name: "Lore Master", description: "Read every published case study.",
      hint: "One story is never enough.",
      icon: FiLayers, rarity: "epic", hidden: false,
      trigger: { type: "collection", event: "case_study_read", ids: [...new Set(publishedCaseStudyIds)] },
    },
    {
      id: "lets-talk", name: "Let's Talk", description: "Send a message or follow a contact link.",
      hint: "Don't be a stranger.",
      icon: FiMessageCircle, rarity: "common", hidden: false,
      trigger: { type: "event", event: "contact_used" },
    },
    {
      id: "open-source-intelligence", name: "Open Source Intelligence", description: "Take a look at the portfolio's source code.",
      hint: "Curious how all of this works?",
      icon: FiCode, rarity: "uncommon", hidden: false,
      trigger: { type: "event", event: "portfolio_source_opened" },
    },
    {
      id: "lost", name: "Lost?", description: "Take a wrong turn and find the 404 page.",
      hint: "Sometimes getting lost is the right direction.",
      icon: FiCompass, rarity: "uncommon", hidden: false,
      trigger: { type: "event", event: "not_found_viewed" },
    },
    {
      id: "never-gonna-give-you-up", name: "Never Gonna Give You Up", description: "Find out what the lol link does.",
      hint: "A familiar tune awaits the curious.",
      icon: FiMusic, rarity: "common", hidden: false,
      trigger: { type: "event", event: "rickroll_opened" },
    },
    {
      id: "cheat-code-accepted", name: "Cheat Code Accepted", description: "Activate the Konami code Easter egg.",
      hint: "Old habits die hard.",
      icon: FiZap, rarity: "epic", hidden: false,
      trigger: { type: "event", event: "konami_activated" },
    },
    {
      id: "no-life", name: "No Life", description: "Spend 30 minutes with the portfolio open and visible.",
      hint: "You really have nowhere else to be?",
      icon: FiClock, rarity: "rare", hidden: false,
      trigger: { type: "duration", event: "website_visible_time", targetMs: 30 * 60 * 1000 },
    },
    {
      id: "let-there-be-light", name: "Let There Be Light", description: "Get flashbanged by light mode.",
      hint: "Sometimes a change of perspective makes everything brighter.",
      icon: FiSun, rarity: "common", hidden: false,
      trigger: { type: "event", event: "light_mode_selected" },
    },
    {
      id: "nice-try", name: "Nice Try.", description: "Sealy has denied your access.",
      hint: "Some doors are guarded for a reason.",
      icon: FiShield, rarity: "rare", hidden: false,
      trigger: { type: "event", event: "admin_access_denied" },
    },
    {
      id: SSH_ACHIEVEMENT_ID, name: "Terminally Online", description: "Connected to the SSH-based portfolio.",
      hint: "Not everything worth exploring lives in a browser.",
      icon: FiTerminal, rarity: "rare", hidden: false,
      trigger: { type: "custom", handler: "ssh-portfolio" },
    },
    {
      id: "cheater-cheater", name: "Cheater, Cheater!", description: "You really thought I wouldn't notice?",
      hint: "Some shortcuts leave a trace.",
      icon: FiUserX, rarity: "rare", hidden: false,
      trigger: { type: "event", event: ACHIEVEMENT_TAMPER_EVENT },
    },
    {
      id: "touch-grass", name: "Touch Grass.", description: "Unlock every other achievement. Then go outside.",
      hint: "Leave no stone unturned.",
      icon: FiFeather, rarity: "legendary", hidden: false,
      trigger: { type: "dependencies", all: true },
    },
  ]
}

export const achievementRegistry = createAchievementRegistry()

export function configurePublishedCaseStudies(ids: readonly string[]): void {
  const definition = achievementRegistry.find(item => item.id === "lore-master")!
  definition.trigger = { type: "collection", event: "case_study_read", ids: [...new Set(ids)] }
}

export const customAchievementHandlers: Readonly<Record<string, CustomAchievementHandler>> = {
  "ssh-portfolio": ({ input, progress }) => {
    if (input.type !== "event") return
    if (input.name === SSH_CONNECTED_EVENT) return { unlocked: true }
    if (input.name !== SSH_WATCH_EVENT) return
    const startedAt = input.payload.startedAt
    if (typeof startedAt !== "number" || !Number.isSafeInteger(startedAt) || startedAt <= 0) return
    const custom = progress.custom
    const existing = custom && typeof custom === "object" && !Array.isArray(custom) && "watchingSince" in custom ? custom.watchingSince : undefined
    if (typeof existing === "number" && existing > 0 && existing <= startedAt && startedAt - existing < SSH_WATCH_WINDOW_MS) return
    return { progress: { custom: { watchingSince: startedAt } } }
  },
}
