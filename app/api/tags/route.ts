import { NextResponse } from "next/server"
import { getTags, createTag } from "@/lib/db-service"
import { getCached, setCached, invalidateCacheByPrefix } from "@/lib/api-cache"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET() {
  try {
    const cacheKey = "/api/tags"
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    const tags = await getTags()
    setCached(cacheKey, tags)
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
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
    const result = await createTag(body)
    invalidateCacheByPrefix("/api/tags")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "create",
      resource: "tag",
      resourceId: String(result.insertedId),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Tag created successfully",
        tagId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}
