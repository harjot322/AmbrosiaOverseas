import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db-service"
import { getCached, setCached, invalidateCacheByPrefix } from "@/lib/api-cache"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cacheKey = `/api/products/${id}`
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    const product = await getProductById(id)
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive")
    if (product?.active === false && includeInactive !== "true") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    setCached(cacheKey, product)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
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
    const result = await updateProduct(id, body)
    invalidateCacheByPrefix("/api/products")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "update",
      resource: "product",
      resourceId: id,
    })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
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
    const result = await deleteProduct(id)
    invalidateCacheByPrefix("/api/products")
    invalidateCacheByPrefix("/api/bootstrap")
    await logAdminAction({
      session,
      request,
      action: "delete",
      resource: "product",
      resourceId: id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
