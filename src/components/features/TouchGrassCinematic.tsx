"use client"

import { useEffect, useRef, useState } from "react"
import { cinematicTiming, crawlPosition, crawlTravel, CRAWL_PARAGRAPHS, OPENING_PHRASE, SILENT_DURATION } from "@/lib/touch-grass-cinematic"
import type { CinematicResult, CinematicSession } from "./TouchGrassCinematicProvider"
import styles from "./TouchGrassCinematic.module.css"

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const envelope = (time: number, start: number, end: number, fade: number) => clamp((time - start) / fade) * clamp((end - time) / fade)

function Script() {
  return <><header><p>EPISODE XIV</p><h3>THE LAST ACHIEVEMENT</h3></header>{CRAWL_PARAGRAPHS.map((paragraph, index) => <p key={index}>{index === CRAWL_PARAGRAPHS.length - 1 ? <strong>{paragraph}</strong> : paragraph}</p>)}</>
}

export default function TouchGrassCinematic({ session, onComplete }: { session: CinematicSession; onComplete: (result: CinematicResult) => void }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const crawlRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<() => void>(() => {})
  const [soundStatus, setSoundStatus] = useState<"blocked" | "missing" | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const scene = sceneRef.current!
    const crawl = crawlRef.current!
    const audio = session.audio
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReduced(motion.matches)
    updateMotion()
    motion.addEventListener("change", updateMotion)
    let disposed = false
    let frame = 0
    let mode: "loading" | "audio" | "silent" = "loading"
    let duration = SILENT_DURATION
    let silentOffset = 0
    let silentStart = performance.now()
    let endedAt: number | null = null
    let travel = { start: 0, readingEnd: 0, end: 0 }
    const measure = () => {
      const height = scene.clientHeight
      const textHeight = crawl.offsetHeight
      const plane = crawl.parentElement!
      const stage = plane.parentElement!
      const lastLine = crawl.lastElementChild as HTMLElement
      scene.style.setProperty("--perspective", `${Math.max(600, height * 2.4)}px`)
      const planeStyle = getComputedStyle(plane)
      const stageStyle = getComputedStyle(stage)
      const planeTransform = new DOMMatrixReadOnly(planeStyle.transform)
      travel = crawlTravel(height, textHeight, lastLine.offsetTop + lastLine.offsetHeight / 2, {
        depth: parseFloat(stageStyle.perspective) || height * 2.4,
        perspectiveOriginY: parseFloat(stageStyle.perspectiveOrigin.split(" ")[1]) || 0,
        planeOriginY: parseFloat(planeStyle.transformOrigin.split(" ")[1]) || 0,
        cosine: planeTransform.m22,
        sine: planeTransform.m23,
      }, parseFloat(stageStyle.getPropertyValue("--reading-position")), parseFloat(stageStyle.getPropertyValue("--exit-position")))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(scene)
    observer.observe(crawl)
    measure()

    const hasDuration = () => Number.isFinite(audio.duration) && audio.duration > 0
    const time = () => mode === "silent" ? silentOffset + (performance.now() - silentStart) / 1000 : audio.currentTime
    const goSilent = (missing: boolean) => {
      if (disposed) return
      silentOffset = time()
      silentStart = performance.now()
      audio.pause()
      mode = "silent"
      if (hasDuration()) duration = audio.duration
      setSoundStatus(missing ? "missing" : "blocked")
    }
    const onError = () => goSilent(true)
    audio.addEventListener("error", onError)
    const loadDeadline = window.setTimeout(() => {
      if (mode === "loading" || !hasDuration()) goSilent(true)
    }, 8_000)
    void session.playback.then(playing => {
      if (disposed || session.closing || mode !== "loading") return
      if (playing) {
        audio.currentTime = 0
        void audio.play().then(() => {
          if (session.closing) { audio.pause(); return }
          if (!disposed) mode = "audio"
        }, () => { if (!session.closing) goSilent(!!audio.error) })
      }
      else goSilent(!!audio.error)
    })
    playRef.current = () => {
      if (disposed || session.closing || !hasDuration()) return
      audio.currentTime = Math.min(time(), audio.duration)
      void audio.play().then(() => {
        if (session.closing) { audio.pause(); return }
        if (disposed) return
        duration = audio.duration
        mode = "audio"
        endedAt = null
        setSoundStatus(null)
      }, () => { if (!disposed) setSoundStatus("blocked") })
    }

    const render = () => {
      if (disposed) return
      if (mode === "audio" && hasDuration()) duration = audio.duration
      if (mode !== "loading" && (mode === "silent" || hasDuration())) {
        let elapsed = time()
        if (mode === "audio" && audio.ended) {
          endedAt ??= performance.now()
          elapsed = duration + (performance.now() - endedAt) / 1000
        } else endedAt = null
        const timing = cinematicTiming(duration)
        const progress = clamp((elapsed - timing.crawlStart) / (timing.crawlEnd - timing.crawlStart))
        crawl.style.transform = `translate3d(0, ${crawlPosition(progress, travel)}px, 0)`
        scene.style.setProperty("--opening-opacity", String(envelope(elapsed, 0.6, timing.openingEnd, 1)))
        scene.style.setProperty("--title-opacity", String(envelope(elapsed, timing.openingEnd, timing.crawlStart, 0.8)))
        scene.style.setProperty("--title-scale", String(1.1 - clamp((elapsed - timing.openingEnd) / (timing.crawlStart - timing.openingEnd)) * 0.2))
        scene.style.setProperty("--crawl-opacity", String(elapsed >= timing.crawlStart ? 1 : 0))
        scene.style.setProperty("--stars-opacity", String(clamp((elapsed - timing.openingEnd) / 2) * 0.65))
        scene.style.setProperty("--scene-opacity", String(1 - clamp((elapsed - timing.fadeStart) / (timing.fadeEnd - timing.fadeStart))))
        try { audio.volume = 1 - clamp((elapsed - timing.fadeStart) / (duration - timing.fadeStart)) } catch {}
        if (elapsed >= duration + 1.25) { onComplete("finished"); return }
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      clearTimeout(loadDeadline)
      observer.disconnect()
      motion.removeEventListener("change", updateMotion)
      audio.removeEventListener("error", onError)
      playRef.current = () => {}
    }
  }, [session, onComplete])

  return (
    <>
      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.universe}>
          <div className={styles.stars} aria-hidden="true" />
          <p className={styles.opening} aria-hidden="true">{OPENING_PHRASE}</p>
          <div className={styles.title} aria-hidden="true"><p>EPISODE XIV</p><strong>THE LAST<br />ACHIEVEMENT</strong></div>
          <div className={styles.stage}>
            <div className={styles.plane}>
              <div ref={crawlRef} className={styles.crawl} aria-hidden={!reduced} tabIndex={reduced ? 0 : undefined} aria-label={reduced ? "Opening crawl script" : undefined}>
                <p className={styles.reducedOpening}>{OPENING_PHRASE}</p>
                <Script />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!reduced && <div className="sr-only"><p>{OPENING_PHRASE}</p><Script /></div>}
      {soundStatus && <div className={styles.soundNotice} role="status">
        {soundStatus === "missing" ? "Soundtrack unavailable. Playing silently." : <><span>Playing silently.</span> <button type="button" onClick={() => playRef.current()}>Play soundtrack</button></>}
      </div>}
    </>
  )
}
