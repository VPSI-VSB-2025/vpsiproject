import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/custom/navbar-section"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Providers from "@/providers"
import FooterSection from "@/components/custom/footer-section"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Clerk Next.js Quickstart",
  description: "Generated by create next app",
}
const links = [
  { name: "Úvod", href: "#home" },
  { name: "Služby", href: "#service" },
  { name: "Kalendář", href: "#calendar" },
  { name: "Kontakt", href: "#contact" },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <html lang='en' className='scroll-smooth'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar links={links} />
          {children}
          <FooterSection links={links} />
          <Toaster richColors />
        </body>
      </html>
    </Providers>
  )
}
