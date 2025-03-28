import { NextResponse } from "next/server"

// Sample product data
const products = [
  {
    id: 1,
    name: "Premium Energy Drink",
    description: "Experience the ultimate energy boost with our premium imported energy drink.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Beverages",
    origin: "USA",
    price: 350,
    stock: 120,
    active: true,
    featured: true,
    tags: ["Best Seller", "Imported from USA", "Premium Quality"],
    nutritionalInfo: {
      servingSize: "250ml",
      calories: "120",
      protein: "0g",
      carbs: "30g",
      sugar: "28g",
      fat: "0g",
    },
    ingredients:
      "Carbonated Water, Sucrose, Glucose, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Caffeine, Inositol, Niacinamide, Pantothenic Acid, Pyridoxine HCL, Vitamin B12",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
  },
  {
    id: 2,
    name: "Gourmet Chocolate Cookies",
    description: "Indulge in the rich, decadent flavor of our imported Belgian chocolate cookies.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Cookies",
    origin: "Belgium",
    price: 450,
    stock: 85,
    active: true,
    featured: false,
    tags: ["New Arrival", "Imported from Belgium", "Gourmet"],
    nutritionalInfo: {
      servingSize: "30g (2 cookies)",
      calories: "150",
      protein: "2g",
      carbs: "22g",
      sugar: "12g",
      fat: "7g",
    },
    ingredients:
      "Belgian Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soya Lecithin, Natural Vanilla Flavor), Wheat Flour, Butter, Sugar, Eggs, Salt",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-07-05T11:20:00Z",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const origin = searchParams.get("origin")
  const featured = searchParams.get("featured")

  let filteredProducts = [...products]

  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  if (origin) {
    filteredProducts = filteredProducts.filter((product) => product.origin.toLowerCase() === origin.toLowerCase())
  }

  if (featured === "true") {
    filteredProducts = filteredProducts.filter((product) => product.featured)
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would validate the input and save to database
    const newProduct = {
      id: products.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // For demo purposes, we'll just return the new product
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

