import { NextResponse } from "next/server"
import { updateOrigin, deleteOrigin } from "@/lib/db-service"
import { invalidateCacheByPrefix } from "@/lib/api-cache"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const result = await updateOrigin(id, body)
    invalidateCacheByPrefix("/api/origins")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "update",
      resource: "origin",
      resourceId: id,
    })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Origin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Origin updated successfully",
    })
  } catch (error) {
    console.error("Error updating origin:", error)
    return NextResponse.json({ error: "Failed to update origin" }, { status: 500 })
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
    const result = await deleteOrigin(id)
    invalidateCacheByPrefix("/api/origins")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "delete",
      resource: "origin",
      resourceId: id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Origin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Origin deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting origin:", error)
    return NextResponse.json({ error: "Failed to delete origin" }, { status: 500 })
  }
}
