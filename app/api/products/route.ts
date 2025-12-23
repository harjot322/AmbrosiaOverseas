import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb, getProducts, createProduct } from "@/lib/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const origin = searchParams.get("origin")
    const subcategory = searchParams.get("subcategory")
    const tag = searchParams.get("tag")
    const featured = searchParams.get("featured")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")
    const limit = searchParams.get("limit")
    const skip = searchParams.get("skip")
    const excludeId = searchParams.get("excludeId")
    const distinct = searchParams.get("distinct")

    const filters: any = {}

    if (category) {
      const categories = category.split(",").map((value) => value.trim()).filter(Boolean)
      if (categories.length > 0) {
        filters.category = categories.length === 1 ? categories[0] : { $in: categories }
      }
    }

    if (origin) {
      const origins = origin.split(",").map((value) => value.trim()).filter(Boolean)
      if (origins.length > 0) {
        filters.origin = origins.length === 1 ? origins[0] : { $in: origins }
      }
    }

    if (subcategory) {
      const subcategories = subcategory.split(",").map((value) => value.trim()).filter(Boolean)
      if (subcategories.length > 0) {
        filters.subcategory = subcategories.length === 1 ? subcategories[0] : { $in: subcategories }
      }
    }

    if (tag) {
      const tags = tag.split(",").map((value) => value.trim()).filter(Boolean)
      if (tags.length > 0) {
        filters.tags = { $in: tags }
      }
    }

    if (featured === "true") {
      filters.featured = true
    }

    if (excludeId) {
      try {
        filters._id = { $ne: new ObjectId(excludeId) }
      } catch (error) {
        console.warn("Invalid excludeId provided:", excludeId)
      }
    }

    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) {
        filters.price.$gte = Number(minPrice)
      }
      if (maxPrice) {
        filters.price.$lte = Number(maxPrice)
      }
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (distinct) {
      const db = await getDb()
      const values = await db.collection("products").distinct(distinct, filters)
      return NextResponse.json(values)
    }

    let sortOption: Record<string, 1 | -1> | undefined
    if (sort === "newest") {
      sortOption = { createdAt: -1 }
    } else if (sort === "price-low") {
      sortOption = { price: 1 }
    } else if (sort === "price-high") {
      sortOption = { price: -1 }
    } else if (sort === "featured") {
      sortOption = { featured: -1, createdAt: -1 }
    }

    const products = await getProducts(filters, {
      sort: sortOption,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    })
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
