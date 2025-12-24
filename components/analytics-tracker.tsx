"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    // Record page view when the component mounts or pathname changes
    const recordPageView = async () => {
      try {
        const segments = pathname.split("/").filter(Boolean)
        const productId = segments[0] === "products" && segments[1] ? segments[1] : null

        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
            productId,
            userId: session?.user?.id || null,
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
  }, [pathname, session?.user?.id])

  return null // This component doesn't render anything
}
