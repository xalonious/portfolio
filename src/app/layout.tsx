import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Preloader } from "@/components/ui/Preloader"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { LenisProvider } from "@/components/layout/LenisProvider"
import { KonamiChat } from "@/components/features/KonamiChat"
import { AchievementNotifications } from "@/components/features/AchievementNotifications"
import { AchievementPanelProvider } from "@/components/features/AchievementPanel"
import { SealyModeProvider } from "@/components/features/SealyModeProvider"
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { getPublishedCaseStudyIds } from "@/lib/cms/project-repository"
import { connection } from "next/server"
import { Playfair_Display, DM_Sans } from "next/font/google"
import { themeBootstrap } from "@/lib/theme"

export const metadata = {
  title: {
    default: "Xander's Portfolio",
    template: "%s · xalonious",
  },
  description:
    "Full-stack developer and designer based in Belgium. 7+ years building web apps with React, Next.js, Node.js and more.",
  metadataBase: new URL("https://whoisxander.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://whoisxander.dev",
    siteName: "xalonious",
    title: "Xander — Full-Stack Developer & Designer",
    description:
      "Full-stack developer and designer based in Belgium. 7+ years building web apps with React, Next.js, Node.js and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xander — Full-Stack Developer & Designer",
    description:
      "Full-stack developer and designer based in Belgium. 7+ years building web apps with React, Next.js, Node.js and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
},
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const publishedCaseStudyIds = getPublishedCaseStudyIds()
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} dark`}
      data-theme="dark"
      data-scroll-behavior="smooth"
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <SealyModeProvider>
          <AchievementPanelProvider>
            <AchievementNotifications publishedCaseStudyIds={publishedCaseStudyIds} />
            <LenisProvider>
              <ScrollProgress />
              <KonamiChat />
              <Preloader />
              <Header />
              <PageWrapper>{children}</PageWrapper>
              <Footer />
            </LenisProvider>
          </AchievementPanelProvider>
        </SealyModeProvider>
      </body>
    </html>
  )
}
