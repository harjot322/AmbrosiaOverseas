import { NextResponse } from "next/server"
import { updateTag, deleteTag } from "@/lib/db-service"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const result = await updateTag(params.id, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Tag updated successfully",
    })
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteTag(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
  }
}

