import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("ambrosia")
    const messagesCollection = db.collection("contactMessages")

    // Create message
    const result = await messagesCollection.insertOne({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      read: false,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        messageId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Contact message error:", error)
    return NextResponse.json({ error: "An error occurred while sending your message" }, { status: 500 })
  }
}

