import { NextResponse } from "next/server"
import { updateCategory, deleteCategory, getCategory, ObjectId } from "@/lib/db-service"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const body = await request.json()
    const category = await getCategory(id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const updatedCategory = {
      _id: category._id,
      name: body.name || category.name,
      slug: body.slug || category.slug,
      subcategories: body.subcategories || category.subcategories,
    }

    const result = await updateCategory(id, updatedCategory)

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
    const { id } = await params
    const result = await deleteCategory(id)

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