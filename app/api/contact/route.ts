import { NextResponse } from "next/server"
import { getMessages, createMessage } from "@/lib/db-service"

export async function GET() {
  try {
    const messages = await getMessages()
    const serialized = messages.map((message) => ({
      ...message,
      _id: message._id.toString(),
      createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : undefined,
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 })
    }

    const result = await createMessage(body)

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        messageId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

