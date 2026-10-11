"use client"

import Image from "next/image"

const SNAKE_URL =
  "https://raw.githubusercontent.com/xalonious/portfolio/snake/snake-dark.svg"

export function ContributionSnake() {
  return (
    <div className="space-y-3 hidden sm:block">
      <p className="text-xs uppercase tracking-[0.2em] light:text-muted-foreground">
        Contribution activity
      </p>
      <div className="rounded-sm border light:border-border light:bg-card p-4 overflow-hidden">
        <Image
          src={SNAKE_URL}
          alt="GitHub contribution snake"
          width={1200}
          height={120}
          className="hidden w-full h-auto dark:block"
          priority
        />
        <Image src={SNAKE_URL.replace("snake-dark.svg", "snake.svg")} alt="GitHub contribution snake" width={1200} height={120} className="hidden w-full h-auto light:block" />
      </div>
    </div>
  )
}