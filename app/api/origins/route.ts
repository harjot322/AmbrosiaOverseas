import { NextResponse } from "next/server"
import { getOrigins, createOrigin } from "@/lib/db-service"
import { getCached, setCached, invalidateCacheByPrefix } from "@/lib/api-cache"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET() {
  try {
    const cacheKey = "/api/origins"
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    const origins = await getOrigins()
    setCached(cacheKey, origins)
    return NextResponse.json(origins)
  } catch (error) {
    console.error("Error fetching origins:", error)
    return NextResponse.json({ error: "Failed to fetch origins" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }

    const body = await request.json()
    const result = await createOrigin(body)
    invalidateCacheByPrefix("/api/origins")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "create",
      resource: "origin",
      resourceId: String(result.insertedId),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Origin created successfully",
        originId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating origin:", error)
    return NextResponse.json({ error: "Failed to create origin" }, { status: 500 })
  }
}
