import { NextResponse } from "next/server"
import { Banner } from "@/types/types"
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/lib/db-service"
import { getCached, setCached, invalidateCacheByPrefix } from "@/lib/api-cache"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET() {
  try {
    const cacheKey = "/api/banners"
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    const banners: Banner[] = await getBanners().then((result) =>
      result.map((banner) => ({
        _id: banner._id.toString(),
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        position: banner.position,
        isActive: banner.isActive,
      }))
    );
    setCached(cacheKey, banners)
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
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

    const body: Banner = await request.json()

    // Validate input
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: "Title and image URL are required" }, { status: 400 })
    }

    const result = await createBanner(body)
    invalidateCacheByPrefix("/api/banners")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "create",
      resource: "banner",
      resourceId: String(result.insertedId),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        bannerId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const session = await getSession()
      if (!session || !isAdmin(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (!isSameOrigin(request)) {
        return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
      }

      const body = await request.json()
      const { id } = await params
      const result = await updateBanner(id, {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        position: body.position,
        isActive: body.isActive,
      })
      invalidateCacheByPrefix("/api/banners")
      invalidateCacheByPrefix("/api/bootstrap")
      await logAdminAction({
        session,
        request,
        action: "update",
        resource: "banner",
        resourceId: id,
      })
  
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Banner not found" }, { status: 404 })
      }
  
      return NextResponse.json({
        success: true,
        message: "Banner updated successfully",
      })
    } catch (error) {
      console.error("Error updating banner:", error)
      return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
    }
  }

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }

    const { id } = await params
    const result = await deleteBanner(id)
    invalidateCacheByPrefix("/api/banners")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "delete",
      resource: "banner",
      resourceId: id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
