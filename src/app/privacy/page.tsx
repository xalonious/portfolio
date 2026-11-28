import type { Metadata } from "next"
import Image from "next/image"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How whoisxander.dev handles contact enquiries, site security, and browser storage.",
}

const linkClass = "font-medium text-primary-ink underline underline-offset-4 hover:text-foreground"

function PolicySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-3 text-base leading-relaxed text-foreground/85">
      <h2 className="font-display text-2xl font-semibold text-foreground">{heading}</h2>
      {children}
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
      <header className="mb-10 space-y-4 sm:mb-12">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Privacy policy
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-foreground/85">
          What happens to your data when you visit whoisxander.dev or send me a message.
        </p>
        <p className="text-sm text-foreground/70">
          Updated <time dateTime="2026-11-28">28 November 2026</time>
        </p>
      </header>

      <div className="space-y-9 sm:space-y-10">
        <PolicySection heading="Who runs this site">
          <p>
            Hi, I’m Xander Lauwens. I’m based in Belgium, and I’m responsible for the personal data
            this site collects. If you have a privacy question or request, email me at{" "}
            <a className={linkClass} href="mailto:contact@whoisxander.dev">contact@whoisxander.dev</a>.
          </p>
        </PolicySection>

        <PolicySection heading="When you get in touch">
          <p>
            To send a message through the form, you’ll need to give me your name and email address.
            I receive those details and your message in Discord. If you email me directly, I get
            your address and whatever you include in the email.
          </p>
          <p>
            I use those details to reply and follow up. For general messages, I rely on my
            legitimate interest in answering people who get in touch. If you ask me for a quote
            or proposal, I use the details I need to put it together before we agree to work together.
          </p>
        </PolicySection>

        <PolicySection heading="Security and browser storage">
          <p>
            My server receives connection details such as your IP address to serve pages and limit
            repeat form submissions. The homepage loads Cloudflare Turnstile. When you hit Send,
            Turnstile checks browser and connection signals for signs of automation, and my server
            verifies the resulting token with Cloudflare. I rely on my legitimate interest in
            keeping the site available and preventing spam.{" "}
            <a className={linkClass} href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">
              Turnstile privacy information
            </a>
          </p>
          <p>
            Your browser remembers your theme and achievement progress. It also saves when you
            last sent a message so the form can show the cooldown. For one connection-related
            achievement, your browser sends this site a random identifier to check your progress.
            You can clear these saved details in your browser’s site settings.
          </p>
        </PolicySection>

        <PolicySection heading="Where your data goes">
          <p>
            The site’s hosting infrastructure handles page requests, and email providers handle
            any messages we exchange by email. The site can also show artwork and live activity
            from GitHub, Discord, and Spotify. When your browser fetches those assets, it shares
            connection details with the service providing them.
          </p>
          <p>
            Cloudflare and Discord may process personal data outside the European Economic Area,
            including in the United States. Their terms describe safeguards such as the EU–U.S.
            Data Privacy Framework and standard contractual clauses where applicable. You can email
            me for more information or a copy of the applicable safeguards.{" "}
            <a className={linkClass} href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noopener noreferrer">
              Cloudflare’s data processing terms
            </a>
            {" · "}
            <a className={linkClass} href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
              Discord’s privacy policy
            </a>
          </p>
        </PolicySection>

        <PolicySection heading="How long I keep messages">
          <p>
            I review enquiries once a month. I delete routine messages, including copies in Discord,
            once the enquiry has been closed for at least 90 days. I keep relevant records longer
            if I need them for an ongoing project or a legal obligation.
          </p>
        </PolicySection>

        <PolicySection heading="Your privacy rights">
          <p>
            You can ask me for a copy of your personal data, ask me to correct or delete it, or ask
            me to limit how I use it. You can also object when I rely on legitimate interests and
            request data portability where it applies. To make a request, email me at{" "}
            <a className={linkClass} href="mailto:contact@whoisxander.dev">contact@whoisxander.dev</a>.
            You can also complain to the data protection authority where you live or work,
            including the{" "}
            <a
              className={linkClass}
              href="https://www.dataprotectionauthority.be/citizen/actions/lodge-a-complaint"
              target="_blank"
              rel="noopener noreferrer"
            >
              Belgian Data Protection Authority
            </a>.
          </p>
        </PolicySection>
      </div>

      <figure className="mt-12 flex items-center gap-5 border-t border-border pt-8 sm:mt-14 sm:gap-6">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-sm border border-border sm:size-28">
          <Image
            src="/pixel.jpg"
            alt="Pixel looking straight at the camera with a tiny bit of tongue showing"
            fill
            sizes="(min-width: 640px) 196px, 168px"
            className="origin-[52%_45%] scale-[1.75] object-cover object-top"
          />
        </div>
        <figcaption>
          <p className="font-display text-xl font-semibold">Pixel</p>
          <p className="mt-0.5 text-sm font-medium text-primary-ink">Chief Legal Officer</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            <q>I read the whole thing. My fee is two treats.</q>
          </p>
        </figcaption>
      </figure>
    </article>
  )
}
