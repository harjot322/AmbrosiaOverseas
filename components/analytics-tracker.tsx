"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Record page view when the component mounts or pathname changes
    const recordPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            language: navigator.language,
          }),
        })
      } catch (error) {
        console.error("Error recording page view:", error)
      }
    }

    recordPageView()
  }, [pathname])

  return null // This component doesn't render anything
}

