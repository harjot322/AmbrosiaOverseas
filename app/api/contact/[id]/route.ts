import { NextResponse } from "next/server"
import { getMessageById, markMessageAsRead, deleteMessage } from "@/lib/db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const message = await getMessageById(params.id)

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await markMessageAsRead(params.id)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Message marked as read",
    })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteMessage(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

