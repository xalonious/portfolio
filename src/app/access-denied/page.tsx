import type { Metadata } from "next"
import Image from "next/image"
import { AccessDeniedAchievement } from "@/components/features/AccessDeniedAchievement"
import { TransitionLink } from "@/components/ui/TransitionLink"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "403 — Access denied",
  robots: { index: false, follow: false },
}

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { from } = await searchParams

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-background px-6 pb-8 pt-20 text-center text-foreground sm:min-h-screen sm:py-24">
      <AccessDeniedAchievement fromAdmin={from === "admin"} />
      <div className={`${styles.entrance} flex w-full max-w-sm flex-col items-center`}>
        <figure className="relative mb-5 aspect-[3/4] w-full max-w-[230px] -rotate-[2deg] overflow-hidden rounded-sm border border-border sm:mb-8 sm:max-w-[320px]">
          <Image
            src="/sealy-403.png"
            alt="Sealy, a Siamese cat, watching the camera from a bed"
            fill
            sizes="(max-width: 639px) 230px, 320px"
            className="object-cover object-[31%_center]"
            priority
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-card px-4 py-2 text-[11px] font-medium light:text-muted-foreground">
            Head of restricted-area security
          </figcaption>
        </figure>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] light:text-primary-ink">
          403 — Access denied
        </p>
        <h1 className="mb-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          Sealy is guarding this area.
        </h1>
        <p className="mb-6 text-sm leading-relaxed light:text-muted-foreground sm:mb-8">
          You do not have permission to continue.
        </p>
        <TransitionLink
          href="/"
          className="rounded-sm border border-border px-6 py-2.5 text-sm font-medium transition-colors duration-200 hover:border-primary hover:bg-accent/20 light:hover:bg-accent"
        >
          Retreat safely
        </TransitionLink>
      </div>
    </div>
  )
}
