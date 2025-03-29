import { NextResponse } from "next/server"
import { getAnalytics, recordPageView, getStats } from "@/lib/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "last_month"
    const type = searchParams.get("type") || "views"

    if (type === "stats") {
      const stats = await getStats(period)
      return NextResponse.json(stats)
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
    const body = await request.json()

    // Validate input
    if (!body.page) {
      return NextResponse.json({ error: "Page path is required" }, { status: 400 })
    }

    await recordPageView(body)

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

