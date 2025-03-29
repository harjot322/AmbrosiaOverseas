import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/db-service"

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const result = await updateSettings(body)

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

