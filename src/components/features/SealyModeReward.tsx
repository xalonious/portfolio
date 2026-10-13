"use client"

import { setSealyCompanionEnabled, setSealyModeActive } from "@/lib/sealy-mode"
import { useSealyMode } from "./useSealyMode"

const swatches = ["background", "surface", "cream", "blue", "sand", "elevated"]

export function SealyModeReward({ onReplay }: { onReplay: () => void }) {
  const { eligible, active, companionEnabled } = useSealyMode()
  if (!eligible) return null
  return (
    <section aria-labelledby="sealy-reward-title" className="rounded-sm border border-primary/40 bg-card p-4">
      <p className="text-[9px] tracking-[0.12em] text-primary-ink uppercase">Exclusive reward</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 id="sealy-reward-title" className="font-display text-xl font-semibold">Sealy Mode</h3>
        <span className="text-[10px] text-primary-ink">{active ? "Active" : "Available"}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">You&apos;ve completed every achievement. Sealy has reluctantly granted you permission to redecorate.</p>
      <div className="mt-4 flex items-center gap-2">
        <div role="img" aria-label="Chocolate Point palette: chocolate brown, warm cream, icy blue and sand" className="flex overflow-hidden rounded-sm border border-border">
          {swatches.map(color => <span key={color} aria-hidden="true" className="h-6 w-6" style={{ backgroundColor: `var(--sealy-${color})` }} />)}
        </div>
        <span className="text-[10px] text-muted-foreground">Chocolate Point</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" aria-pressed={active} onClick={() => setSealyModeActive(!active)} className="min-h-11 rounded-sm bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">{active ? "Disable Sealy Mode" : "Activate Sealy Mode"}</button>
        <button type="button" onClick={onReplay} className="min-h-11 rounded-sm border border-border px-3 py-2 text-xs text-primary-ink hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">Replay finale</button>
      </div>
      {active && (
        <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 border-t border-border pt-4 text-xs">
          <span>Cat companion <span className="ml-1 text-muted-foreground">{companionEnabled ? "Enabled" : "Disabled"}</span></span>
          <input type="checkbox" role="switch" aria-label="Cat companion" checked={companionEnabled} onChange={event => setSealyCompanionEnabled(event.target.checked)} className="h-4 w-4 shrink-0 accent-primary" />
        </label>
      )}
    </section>
  )
}
