import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ambrosia Overseas - Premium Imported Foods",
  description: "Discover luxury imported food products from around the world",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AnalyticsTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

