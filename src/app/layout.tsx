import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Baskervville } from "next/font/google"

export const metadata = {
  title: "Xander's Portfolio",
  description: "Full-stack developer portfolio by Xander (xalonious)",
}

const baskervville = Baskervville({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={baskervville.className}>
      <body className="min-h-screen bg-[--background] text-[--foreground] antialiased selection:bg-[--brass]/30 selection:text-[--coal]">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
