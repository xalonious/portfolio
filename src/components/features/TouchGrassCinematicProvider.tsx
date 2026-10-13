"use client"

import { Component, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import dynamic from "next/dynamic"
import styles from "./TouchGrassCinematicProvider.module.css"

const Cinematic = dynamic(() => import("./TouchGrassCinematic"), { ssr: false })
const ENTER_MS = 700
const EXIT_MS = 650
export type CinematicSource = "achievement" | "replay"
export type CinematicResult = "finished" | "skipped" | "failed"
export type CinematicSession = {
  source: CinematicSource
  audio: HTMLAudioElement
  playback: Promise<boolean>
  returnFocus: HTMLElement | null
  closing: boolean
}

const Context = createContext<{ isPlaying: boolean; launch: (source: CinematicSource) => boolean } | null>(null)

export function useTouchGrassCinematic() {
  const value = useContext(Context)
  if (!value) throw new Error("TouchGrassCinematicProvider is missing")
  return value
}

class CinematicBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

function CinematicHost({ session, onComplete }: { session: CinematicSession; onComplete: (result: CinematicResult) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const audioLease = useRef(0)
  const [muted, setMuted] = useState(false)
  const [phase, setPhase] = useState<"entering" | "playing" | "leaving">("entering")
  const [started, setStarted] = useState(false)
  const resultRef = useRef<CinematicResult>("skipped")
  const requestClose = useCallback((result: CinematicResult) => {
    if (session.closing) return
    session.closing = true
    session.audio.pause()
    resultRef.current = result
    const dialog = dialogRef.current
    if (dialog) dialog.style.setProperty("--exit-opacity", getComputedStyle(dialog).opacity)
    setPhase("leaving")
  }, [session])
  const finishTransition = useCallback(() => {
    if (phase === "entering" && !session.closing) {
      setStarted(true)
      setPhase("playing")
    } else if (phase === "leaving") onComplete(resultRef.current)
  }, [phase, session, onComplete])

  useEffect(() => {
    if (phase === "playing") return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(finishTransition, reducedMotion ? 0 : (phase === "entering" ? ENTER_MS : EXIT_MS) + 50)
    return () => clearTimeout(timer)
  }, [phase, finishTransition])

  useEffect(() => {
    const leaseCounter = audioLease
    const lease = ++leaseCounter.current
    const dialog = dialogRef.current!
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      queueMicrotask(() => {
        if (leaseCounter.current !== lease) return
        session.audio.pause()
        session.audio.removeAttribute("src")
        session.audio.load()
      })
      dialog.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      const target = session.returnFocus?.isConnected ? session.returnFocus : document.getElementById("achievement-panel-trigger")
      target?.focus({ preventScroll: true })
    }
  }, [session])

  return (
    <dialog ref={dialogRef} aria-labelledby="touch-grass-title" aria-describedby="touch-grass-description"
      className={`${styles.dialog} fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-black p-0 text-white`}
      style={{ colorScheme: "dark", "--transition-duration": `${phase === "leaving" ? EXIT_MS : ENTER_MS}ms` } as CSSProperties}
      data-phase={phase} data-lenis-prevent
      onAnimationEnd={event => { if (event.target === event.currentTarget) finishTransition() }}
      onCancel={event => { event.preventDefault(); requestClose("skipped") }}
      onClose={event => { if (!event.currentTarget.open) requestClose("skipped") }}>
      <h2 id="touch-grass-title" className="sr-only">Episode XIV: The Last Achievement</h2>
      <p id="touch-grass-description" className="sr-only">Touch Grass. cinematic celebration. Escape or Skip cinematic returns to the portfolio.</p>
      <CinematicBoundary onFailure={() => requestClose("failed")}>
        {started && <Cinematic session={session} onComplete={requestClose} />}
      </CinematicBoundary>
      <div className="absolute right-0 bottom-0 left-0 z-20 flex justify-end gap-3 bg-gradient-to-t from-black to-transparent px-5 pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-xs text-white/65">
        <button type="button" className="min-h-11 rounded-sm px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-pressed={muted}
          onClick={() => { session.audio.muted = !muted; setMuted(!muted) }}>{muted ? "Unmute" : "Mute"}</button>
        <button type="button" autoFocus className="min-h-11 rounded-sm px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => requestClose("skipped")}>Skip cinematic</button>
      </div>
    </dialog>
  )
}

export function TouchGrassCinematicProvider({ children, onAchievementComplete }: {
  children: ReactNode
  onAchievementComplete?: (result: CinematicResult) => void
}) {
  const [session, setSession] = useState<CinematicSession | null>(null)
  const current = useRef<CinematicSession | null>(null)
  const [completion, setCompletion] = useState<{ result: CinematicResult } | null>(null)
  const launch = useCallback((source: CinematicSource) => {
    if (current.current) return false
    const audio = new Audio("/starwars.mp3")
    audio.preload = "auto"
    const playback = audio.play().then(() => { audio.pause(); return true }, () => false)
    const next = { source, audio, playback, closing: false, returnFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null }
    current.current = next
    setSession(next)
    return true
  }, [])
  const complete = useCallback((result: CinematicResult) => {
    const ended = current.current
    if (!ended) return
    current.current = null
    ended.closing = true
    ended.audio.pause()
    setSession(null)
    if (ended.source === "achievement") setCompletion({ result })
  }, [])
  useEffect(() => {
    if (completion) {
      setCompletion(null)
      onAchievementComplete?.(completion.result)
    }
  }, [completion, onAchievementComplete])
  const value = useMemo(() => ({ isPlaying: !!session, launch }), [session, launch])
  return (
    <Context.Provider value={value}>
      {children}
      {session && <CinematicHost session={session} onComplete={complete} />}
    </Context.Provider>
  )
}
