"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    // Record page view when the component mounts or pathname changes
    const recordPageView = () => {
      try {
        const segments = pathname.split("/").filter(Boolean)
        const productId = segments[0] === "products" && segments[1] ? segments[1] : null

        const payload = JSON.stringify({
          page: pathname,
          productId,
          userId: session?.user?.id || null,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          language: navigator.language,
        })

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" })
          navigator.sendBeacon("/api/analytics", blob)
        } else {
          void fetch("/api/analytics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payload,
            keepalive: true,
          })
        }
      } catch (error) {
        console.error("Error recording page view:", error)
      }
    }

    recordPageView()
  }, [pathname, session?.user?.id])

  return null // This component doesn't render anything
}
