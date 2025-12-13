import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/lib/db-service"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const categories = await getCategories()
    const serialized = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const categoryData = {
      _id: new ObjectId(),
      name: body.name,
      slug: body.slug,
      subcategories: body.subcategories || [],
    }

    const result = await createCategory(categoryData)

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      categoryId: result.insertedId.toString(),
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}