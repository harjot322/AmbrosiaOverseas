import { NextResponse } from "next/server"
import { getConfig, updateConfig } from "@/lib/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "general"

    const config = await getConfig(type)
    return NextResponse.json(config || {})
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "general"

    const body = await request.json()
    const result = await updateConfig(type, body)

    return NextResponse.json({
      success: true,
      message: "Config updated successfully",
    })
  } catch (error) {
    console.error("Error updating config:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}

