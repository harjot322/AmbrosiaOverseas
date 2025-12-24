import { NextResponse } from "next/server"
import { getAnalytics, recordPageView, getStats, getProductViewUsers } from "@/lib/db-service"
import { getSession, isAdmin } from "@/lib/auth"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "last_month"
    const type = searchParams.get("type") || "views"
    const productId = searchParams.get("productId")
    const hours = searchParams.get("hours")

    if (type === "stats") {
      const stats = await getStats(period)
      return NextResponse.json(stats)
    } else if (type === "product-view-users") {
      if (!productId) {
        return NextResponse.json({ error: "productId is required" }, { status: 400 })
      }
      const users = await getProductViewUsers(productId, hours ? Number(hours) : 24)
      return NextResponse.json(users)
    } else {
      const analytics = await getAnalytics(period)
      return NextResponse.json(analytics)
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    const ip = getClientIp(request)
    const limit = rateLimit(`analytics:${ip}`, 120, 5 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    const body = await request.json()

    // Validate input
    if (!body.page) {
      return NextResponse.json({ error: "Page path is required" }, { status: 400 })
    }

    const { userId: _ignoredUserId, ...rest } = body
    await recordPageView({
      ...rest,
      userId: session?.user?.id || null,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Page view recorded",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error recording page view:", error)
    return NextResponse.json({ error: "Failed to record page view" }, { status: 500 })
  }
}
