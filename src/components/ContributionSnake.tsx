"use client"

import Image from "next/image"

const SNAKE_URL =
  "https://raw.githubusercontent.com/xalonious/portfolio/output/snake-dark.svg"

export function ContributionSnake() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground]">
        Contribution activity
      </p>
      <div className="rounded-sm border border-[--border] bg-[--card] p-4 overflow-hidden">
        <Image
          src={SNAKE_URL}
          alt="GitHub contribution snake"
          width={1024}
          height={256}
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}