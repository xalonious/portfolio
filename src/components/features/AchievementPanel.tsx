"use client"

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  useSyncExternalStore, type ReactNode,
} from "react"
import { FiCheck, FiLock, FiX } from "react-icons/fi"
import { achievementRegistry, getAchievementRuntime } from "@/lib/achievements"
import type { AchievementEngine } from "@/lib/achievements/engine"
import type { AchievementDefinition, AchievementState } from "@/lib/achievements/types"
import { achievementRarityColors, getAchievementDisplayProgress } from "@/lib/achievements/presentation"
import { EMPTY_ACHIEVEMENT_STATE } from "@/lib/achievements/storage"
import { useTouchGrassCinematic } from "./TouchGrassCinematicProvider"
import { SealyModeReward } from "./SealyModeReward"

const AchievementPanelContext = createContext<{ isOpen: boolean; openPanel: () => void; closePanel: () => void } | undefined>(undefined)
const getServerSnapshot = () => EMPTY_ACHIEVEMENT_STATE
const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
const progressClassName = "block h-[3px] w-full overflow-hidden rounded-full border-0 bg-border accent-primary [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary"

export function useAchievementPanel() {
  const context = useContext(AchievementPanelContext)
  if (!context) throw new Error("AchievementPanelProvider is missing")
  return context
}

function AchievementRow({ achievement, state }: { achievement: AchievementDefinition; state: AchievementState }) {
  const unlocked = Object.prototype.hasOwnProperty.call(state.unlocked, achievement.id)
  const Icon = unlocked ? achievement.icon : FiLock
  const color = unlocked ? achievementRarityColors[achievement.rarity] : "var(--muted-foreground)"
  const progress = !unlocked && !achievement.hidden ? getAchievementDisplayProgress(achievement, state, achievementRegistry) : undefined
  const date = unlocked ? new Date(state.unlocked[achievement.id]) : undefined
  const validDate = date && Number.isFinite(date.getTime()) ? date : undefined

  return (
    <li className={`flex items-start gap-3.5 rounded-sm border p-4 ${unlocked ? "border-primary/35 bg-card" : "border-border bg-card/60"}`}>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-border bg-background" style={{ color }} aria-hidden="true"><Icon size={22} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h4 className={`text-[13px] font-semibold leading-relaxed wrap-anywhere ${unlocked ? "" : "text-foreground/60 light:text-muted-foreground"}`}>
            {unlocked ? achievement.name : <><span aria-hidden="true">???</span><span className="sr-only">Locked achievement</span></>}
          </h4>
          {unlocked && <span className="text-[9px] capitalize" style={{ color }}>{achievement.rarity}</span>}
        </div>
        <p className={`mt-1.5 text-xs leading-relaxed ${unlocked ? "text-foreground/70 light:text-muted-foreground" : "text-foreground/55 light:text-muted-foreground"}`}>{unlocked ? achievement.description : achievement.hint ?? "Keep exploring to discover this one."}</p>
        {unlocked ? (
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-primary-ink">
            <FiCheck aria-hidden="true" />
            {validDate ? <time dateTime={validDate.toISOString()}>Unlocked {dateFormatter.format(validDate)}</time> : "Unlocked"}
          </p>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-foreground/55 light:text-muted-foreground"><FiLock aria-hidden="true" />Locked</p>
        )}
        {progress && (
          <div className="mt-2.5">
            <span className="mb-1.5 block text-[10px] text-foreground/70 light:text-muted-foreground">{progress.label}</span>
            <progress className={progressClassName} aria-label="Locked achievement progress" value={progress.value} max={progress.target} />
          </div>
        )}
      </div>
    </li>
  )
}

function AchievementPanelDialog({ engine, onClose }: { engine: AchievementEngine; onClose: () => void }) {
  const { launch } = useTouchGrassCinematic()
  const replay = () => {
    dialogRef.current?.close()
    onClose()
    launch("replay")
  }
  const state = useSyncExternalStore(engine.subscribe, engine.getSnapshot, getServerSnapshot)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const unlockedAchievements = achievementRegistry.filter(achievement => Object.prototype.hasOwnProperty.call(state.unlocked, achievement.id))
  const lockedAchievements = achievementRegistry.filter(achievement => !achievement.hidden && !Object.prototype.hasOwnProperty.call(state.unlocked, achievement.id))
  const earned = unlockedAchievements.length
  const total = achievementRegistry.length
  const completed = Object.prototype.hasOwnProperty.call(state.unlocked, "touch-grass")

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      const focusTarget = previousFocus?.isConnected ? previousFocus : document.getElementById("achievement-panel-trigger")
      focusTarget?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      id="achievement-panel"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(27rem,100vw)] max-w-none overflow-hidden border-0 border-l border-border bg-background p-0 text-foreground shadow-2xl light:shadow-primary/10 animate-[achievement-drawer-in_220ms_cubic-bezier(0.22,1,0.36,1)] backdrop:bg-[var(--overlay)] backdrop:backdrop-blur-[3px] max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:h-[min(36rem,85dvh)] max-sm:w-full max-sm:rounded-t-2xl max-sm:border-t max-sm:border-l-0 max-sm:animate-[achievement-sheet-in_220ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none"
      aria-labelledby="achievement-panel-title"
      aria-describedby="achievement-panel-summary"
      onClose={event => { if (!event.currentTarget.open) onClose() }}
      onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close() }}
      data-lenis-prevent
    >
      <div className="flex h-full flex-col">
        <div className="mx-auto mt-3 hidden h-[3px] w-8 shrink-0 rounded-full bg-border max-sm:block" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-6 max-sm:px-5 max-sm:pt-5">
          <div>
            <p className="text-[9px] tracking-[0.12em] text-primary-ink uppercase">A little curiosity goes a long way</p>
            <h2 id="achievement-panel-title" className="mt-2.5 font-display text-3xl leading-tight font-semibold max-sm:text-[26px]">Achievements<span className="text-primary-ink">.</span></h2>
            {completed && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">You&apos;ve unlocked all achievements. Now please, go touch some grass.</p>}
          </div>
          <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-card text-foreground hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary" aria-label="Close achievements" onClick={onClose} autoFocus><FiX size={20} /></button>
        </div>
        <div className="mx-6 mb-6 max-sm:mx-5">
          <p id="achievement-panel-summary" className="mb-3.5 text-xs" aria-live="polite"><strong className="text-[22px] font-medium">{earned}</strong><span className="text-foreground/65 light:text-muted-foreground"> / {total} unlocked</span></p>
          <progress className={progressClassName} aria-label="Achievements unlocked" value={earned} max={total || 1} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] max-sm:px-5" data-lenis-prevent>
          {total ? (
            <div className="space-y-6">
              {completed && <SealyModeReward onReplay={replay} />}
              <section aria-labelledby="unlocked-achievements-title">
                <h3 id="unlocked-achievements-title" className="mb-3 text-xs font-medium text-foreground">Unlocked <span className="text-foreground/50 light:text-muted-foreground">({earned})</span></h3>
                {earned ? (
                  <ul className="m-0 flex list-none flex-col gap-3 p-0" aria-label="Unlocked achievements">
                    {unlockedAchievements.map(achievement => <AchievementRow key={achievement.id} achievement={achievement} state={state} />)}
                  </ul>
                ) : <p className="text-xs leading-relaxed text-foreground/55 light:text-muted-foreground">The first discovery is still ahead.</p>}
              </section>
              <section aria-labelledby="locked-achievements-title">
                <h3 id="locked-achievements-title" className="mb-3 text-xs font-medium text-foreground">Locked <span className="text-foreground/50 light:text-muted-foreground">({lockedAchievements.length})</span></h3>
                {lockedAchievements.length ? (
                  <ul className="m-0 flex list-none flex-col gap-3 p-0" aria-label="Locked achievements">
                    {lockedAchievements.map(achievement => <AchievementRow key={achievement.id} achievement={achievement} state={state} />)}
                  </ul>
                ) : <p className="text-xs leading-relaxed text-foreground/55 light:text-muted-foreground">Every mystery solved.</p>}
              </section>
            </div>
          ) : <p className="text-sm text-foreground/70 light:text-muted-foreground">More achievements are on the way.</p>}
        </div>
      </div>
    </dialog>
  )
}

export function AchievementPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [runtime, setRuntime] = useState<ReturnType<typeof getAchievementRuntime>>()
  const openPanel = useCallback(() => {
    getAchievementRuntime()
    setIsOpen(true)
  }, [])
  const closePanel = useCallback(() => setIsOpen(false), [])
  const context = useMemo(() => ({ isOpen, openPanel, closePanel }), [isOpen, openPanel, closePanel])

  useEffect(() => { setRuntime(getAchievementRuntime()) }, [])

  return (
    <AchievementPanelContext.Provider value={context}>
      {children}
      {isOpen && runtime && <AchievementPanelDialog engine={runtime.engine} onClose={closePanel} />}
    </AchievementPanelContext.Provider>
  )
}
