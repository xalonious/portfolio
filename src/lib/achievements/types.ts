import type { IconType } from "react-icons"

export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"
export type JsonValue = null | boolean | number | string | readonly JsonValue[] | { readonly [key: string]: JsonValue }

export type AchievementTrigger =
  | { type: "event"; event: string }
  | { type: "route"; path: string }
  | { type: "counter"; event: string; target: number }
  | { type: "collection"; event: string; idKey?: string; ids: readonly string[] }
  | { type: "duration"; event: string; targetMs: number; millisecondsKey?: string }
  | { type: "custom"; handler: string; config?: JsonValue }
  | { type: "dependencies"; ids: readonly string[] }
  | { type: "dependencies"; all: true }

export type AchievementDefinition = {
  id: string
  name: string
  description: string
  hint?: string
  icon: IconType
  rarity: AchievementRarity
  hidden: boolean
  trigger: AchievementTrigger
}

export type AchievementProgress = {
  readonly count?: number
  readonly ids?: readonly string[]
  readonly durationMs?: number
  readonly custom?: JsonValue
}

export type AchievementState = {
  readonly version: 2
  readonly unlocked: Readonly<Record<string, number>>
  readonly progress: Readonly<Record<string, AchievementProgress>>
  readonly soundMuted: boolean
}

export type AchievementInput =
  | { type: "event"; name: string; payload: Readonly<Record<string, unknown>> }
  | { type: "route"; path: string }

export type CustomAchievementHandler = (context: {
  input: AchievementInput
  progress: AchievementProgress
  config: JsonValue | undefined
  isUnlocked: (id: string) => boolean
}) => { progress?: AchievementProgress; unlocked?: boolean } | undefined

export type AchievementUnlock = {
  achievement: AchievementDefinition
  unlockedAt: number
}
