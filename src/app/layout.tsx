import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CustomCursor } from "@/components/CustomCursor"
import { Preloader } from "@/components/Preloader"
import { PageWrapper } from "@/components/PageWrapper"
import { LenisProvider } from "@/components/LenisProvider"
import { KonamiChat } from "@/components/KonamiChat"
import { Playfair_Display, DM_Sans } from "next/font/google"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-[#C47A8A33] selection:text-foreground cursor-none">
        <LenisProvider>
          <KonamiChat />
          <Preloader />
          <CustomCursor />
          <Header />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}