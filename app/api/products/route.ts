import { NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const origin = searchParams.get("origin")
    const featured = searchParams.get("featured")

    const filters: any = {}

    if (category) {
      filters.category = category
    }

    if (origin) {
      filters.origin = origin
    }

    if (featured === "true") {
      filters.featured = true
    }

    const products = await getProducts(filters)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createProduct(body)

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        productId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

