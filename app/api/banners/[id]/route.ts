import { NextResponse } from "next/server"
import { updateBanner, deleteBanner } from "@/lib/db-service"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const result = await updateBanner(params.id, body)

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteBanner(params.id)

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

