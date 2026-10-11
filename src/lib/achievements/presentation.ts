import type { AchievementDefinition, AchievementRarity, AchievementState } from "./types"

export const achievementRarityColors: Record<AchievementRarity, string> = {
  common: "var(--muted-foreground)",
  uncommon: "var(--rarity-uncommon)",
  rare: "var(--rarity-rare)",
  epic: "var(--rarity-epic)",
  legendary: "var(--rarity-legendary)",
}

export function getAchievementDisplayProgress(
  achievement: AchievementDefinition,
  state: AchievementState,
  registry: readonly AchievementDefinition[],
): { value: number; target: number; label: string } | undefined {
  const trigger = achievement.trigger
  const saved = state.progress[achievement.id]
  let value: number
  let target: number

  switch (trigger.type) {
    case "counter":
      target = trigger.target
      value = Math.min(target, saved?.count ?? 0)
      break
    case "collection": {
      const required = [...new Set(trigger.ids)]
      target = required.length
      value = required.filter(id => saved?.ids?.includes(id)).length
      break
    }
    case "duration":
      target = 100
      value = Math.min(target, (saved?.durationMs ?? 0) / trigger.targetMs * 100)
      return { value, target, label: `${Math.floor(value)}%` }
    case "dependencies": {
      const required = [...new Set("all" in trigger ? registry.map(item => item.id) : trigger.ids)]
        .filter(id => id !== achievement.id)
      target = required.length
      value = required.filter(id => Object.prototype.hasOwnProperty.call(state.unlocked, id)).length
      break
    }
    default:
      return undefined
  }

  return target > 0 ? { value, target, label: `${value} / ${target}` } : undefined
}
