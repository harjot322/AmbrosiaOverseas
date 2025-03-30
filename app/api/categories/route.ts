import { NextResponse } from "next/server"
import { updateCategory, deleteCategory, getCategory, getCategories, createCategory } from "@/lib/db-service"
import { ObjectId } from "mongodb"

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
    const categoryData = {
      _id: new ObjectId(),
      name: body.name,
      slug: body.slug,
      subcategories: body.subcategories || [],
    }

    const result = await createCategory(categoryData)

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const category = await getCategory(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const updatedCategory = {
      _id: category._id,
      name: body.name || category.name,
      slug: body.slug || category.slug,
      subcategories: body.subcategories || category.subcategories,
    }

    const result = await updateCategory(params.id, updatedCategory)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteCategory(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}