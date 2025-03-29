import { NextResponse } from "next/server"
import { getTags, createTag } from "@/lib/db-service"

export async function GET() {
  try {
    const tags = await getTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createTag(body)

    return NextResponse.json(
      {
        success: true,
        message: "Tag created successfully",
        tagId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}

