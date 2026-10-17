"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { getAchievementRuntime } from "@/lib/achievements"
import { claimSealyRewardReveal, resetSealyRewards, setSealyModeActive, syncSealyEligibility } from "@/lib/sealy-mode"
import { TouchGrassCinematicProvider, useTouchGrassCinematic } from "./TouchGrassCinematicProvider"
import { useSealyMode } from "./useSealyMode"

const Neko = dynamic(() => import("@/components/ui/Neko"), { ssr: false })

function CatCompanion() {
  const { active, companionEnabled } = useSealyMode()
  const { isPlaying } = useTouchGrassCinematic()
  return active && companionEnabled && !isPlaying ? <Neko spriteSrc="/neko.gif" /> : null
}

function SealyRewardDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current!
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
      const target = previousFocus?.isConnected ? previousFocus : document.getElementById("achievement-panel-trigger")
      target?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialogRef} aria-labelledby="sealy-unlocked-title" aria-describedby="sealy-unlocked-description"
      className="fixed m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-sm border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-[var(--overlay)] backdrop:backdrop-blur-[3px] sm:p-8"
      data-lenis-prevent
      onCancel={event => { event.preventDefault(); onClose() }}
      onClose={event => { if (!event.currentTarget.open) onClose() }}>
      <p className="text-[9px] tracking-[0.12em] text-primary-ink uppercase">Exclusive reward</p>
      <h2 id="sealy-unlocked-title" className="mt-3 font-display text-3xl font-semibold">Sealy Mode Unlocked</h2>
      <div id="sealy-unlocked-description" className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>Against all odds, you&apos;ve completed every achievement.</p>
        <p>Sealy has reviewed your performance and, after considerable deliberation, approved your reward.</p>
        <p>It&apos;s a theme.</p>
        <p>He&apos;s very proud of himself.</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" autoFocus onClick={() => { if (setSealyModeActive(true)) onClose() }} className="min-h-11 rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">Activate Sealy Mode</button>
        <button type="button" onClick={onClose} className="min-h-11 rounded-sm border border-border px-4 py-2.5 text-xs hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">Maybe later</button>
      </div>
    </dialog>
  )
}

export function SealyModeProvider({ children }: { children: ReactNode }) {
  const { eligible } = useSealyMode()
  const [revealOpen, setRevealOpen] = useState(false)
  useEffect(() => {
    const runtime = getAchievementRuntime()
    if (!runtime) return
    const sync = () => syncSealyEligibility(runtime.engine.getSnapshot())
    sync()
    const unsubscribe = runtime.engine.subscribe(sync)
    const unsubscribeReset = runtime.engine.onReset(resetSealyRewards)
    return () => { unsubscribe(); unsubscribeReset() }
  }, [])
  const reveal = useCallback(() => {
    if (claimSealyRewardReveal()) setRevealOpen(true)
  }, [])
  const closeReveal = useCallback(() => setRevealOpen(false), [])
  useEffect(() => { if (!eligible) setRevealOpen(false) }, [eligible])

  return (
    <TouchGrassCinematicProvider onAchievementComplete={reveal}>
      {children}
      <CatCompanion />
      {eligible && revealOpen && <SealyRewardDialog onClose={closeReveal} />}
    </TouchGrassCinematicProvider>
  )
}
