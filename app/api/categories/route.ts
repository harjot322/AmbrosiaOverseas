import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/lib/db-service"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createCategory(body)

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        categoryId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

