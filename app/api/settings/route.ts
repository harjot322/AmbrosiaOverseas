import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Update settings in the database
export async function PUT(request: Request) {
  try {
    const { section, data } = await request.json()
    const client = await clientPromise
    const db = client.db("ambrosia")
    const settingsCollection = db.collection("settings")

    // Update only the social media section
    await settingsCollection.updateOne(
      { _id: new ObjectId("app_settings") },
      { $set: { [section]: data } },
      { upsert: true }
    )

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

// Get current settings
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ambrosia")
    const settingsCollection = db.collection("settings")

    const settings = await settingsCollection.findOne({ _id: new ObjectId("app_settings") })

    return NextResponse.json({ success: true, data: settings || {} })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
