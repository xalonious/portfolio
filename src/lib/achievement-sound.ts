export function createAchievementSound() {
  let context: AudioContext | undefined
  let disposed = false
  let playbackRequest = 0

  function getContext(): AudioContext {
    context ??= new AudioContext()
    return context
  }

  function prepare(event: Event): void {
    if (!event.isTrusted || disposed) return
    try {
      const audio = getContext()
      if (audio.state === "suspended") void audio.resume().catch(() => {})
    } catch {

    }
  }

  function playChime(audio: AudioContext): void {
    if (disposed || audio.state !== "running") return
    try {
      const start = audio.currentTime
      const frequencies = [523.25, 659.25, 783.99]
      frequencies.forEach((frequency, index) => {
        const oscillator = audio.createOscillator()
        const gain = audio.createGain()
        const noteStart = start + index * 0.07
        oscillator.type = "sine"
        oscillator.frequency.value = frequency
        gain.gain.setValueAtTime(0, noteStart)
        gain.gain.linearRampToValueAtTime(0.025, noteStart + 0.025)
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.38)
        oscillator.connect(gain)
        gain.connect(audio.destination)
        oscillator.onended = () => {
          oscillator.disconnect()
          gain.disconnect()
        }
        oscillator.start(noteStart)
        oscillator.stop(noteStart + 0.4)
      })
    } catch {

    }
  }

  return {
    listen(): () => void {
      window.addEventListener("pointerdown", prepare, { passive: true })
      window.addEventListener("keydown", prepare)
      return () => {
        window.removeEventListener("pointerdown", prepare)
        window.removeEventListener("keydown", prepare)
      }
    },
    play(): void {
      const request = ++playbackRequest
      if (disposed) return
      try {
        const audio = getContext()
        if (audio.state === "running") {
          playChime(audio)
        } else if (audio.state === "suspended") {
          const deadline = performance.now() + 500
          void audio.resume().then(() => {
            if (request === playbackRequest && performance.now() <= deadline) playChime(audio)
          }).catch(() => {})
        }
      } catch {
      }
    },
    dispose(): void {
      disposed = true
      playbackRequest++
      if (context && context.state !== "closed") void context.close().catch(() => {})
      context = undefined
    },
  }
}
