import { NextResponse } from "next/server"
import { getBannerById, updateBanner, deleteBanner } from "@/lib/db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const banner = await getBannerById(params.id)

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ ...banner, _id: banner._id.toString() })
  } catch (error) {
    console.error("Error fetching banner:", error)
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await getBannerById(params.id)

    if (!existing) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    const body = await request.json()
    const result = await updateBanner(params.id, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Banner updated successfully" })
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteBanner(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Banner deleted successfully" })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
