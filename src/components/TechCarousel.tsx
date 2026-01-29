"use client"

import { useMemo } from "react"
import Marquee from "react-fast-marquee"

type Tech = { name: string; icon: string }

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], seed: number) {
  const a = [...arr]
  const rand = mulberry32(seed)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TechCarousel({ items }: { items: Tech[] }) {
  const row1 = items
  const row2 = useMemo(() => (items.length ? seededShuffle(items, 1337) : []), [items])

  return (
    <section className="relative isolate w-full overflow-hidden py-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
        [-webkit-mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]
        [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]"
      />

      <div className="relative w-full">
        <Marquee speed={60} gradient={false} pauseOnHover autoFill>
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
            {row1.map((t) => (
              <TechCard key={`r1-${t.name}`} name={t.name} icon={t.icon} />
            ))}
          </div>
        </Marquee>

        <div className="mt-4 sm:mt-6">
          <Marquee speed={52} direction="right" gradient={false} pauseOnHover autoFill>
            <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
              {row2.map((t) => (
                <TechCard key={`r2-${t.name}`} name={t.name} icon={t.icon} />
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  )
}

function TechCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="shrink-0 flex h-16 w-36 sm:h-20 sm:w-44 flex-col items-center justify-center gap-2 rounded-xl border border-[--border]/50 bg-[--muted] shadow-sm transition-all hover:-translate-y-[2px] hover:border-[--primary]/60 hover:shadow-md">
      <img
        src={icon}
        alt={name}
        width={32}
        height={32}
        className="h-7 w-7 sm:h-8 sm:w-8 object-contain opacity-90"
        loading="lazy"
      />
      <span className="text-xs sm:text-sm font-medium text-[--foreground]">{name}</span>
    </div>
  )
}
