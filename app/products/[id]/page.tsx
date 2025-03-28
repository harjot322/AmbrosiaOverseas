import Image from "next/image"
import Link from "next/link"
import { Globe, Star, ShoppingCart } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would normally fetch the product data based on the ID
  const product = {
    id: params.id,
    name: "Premium Energy Drink",
    description:
      "Experience the ultimate energy boost with our premium imported energy drink. Carefully crafted with high-quality ingredients, this beverage provides long-lasting energy without the crash. Perfect for active lifestyles, busy professionals, or anyone needing an extra boost throughout the day.",
    longDescription:
      "Our Premium Energy Drink is sourced directly from the finest manufacturers in the USA. The unique formula combines natural caffeine, B-vitamins, and essential amino acids to provide clean, sustained energy. Unlike many other energy drinks, ours contains no artificial colors and uses premium natural flavors.\n\nEach can contains 250ml of this exceptional beverage, packaged in a sleek, modern design that reflects its premium quality. The drink features a refreshing taste with notes of exotic fruits and a perfectly balanced sweetness level that's not overpowering.\n\nIdeal for pre-workout, busy workdays, or whenever you need a revitalizing boost, this energy drink stands out from the competition with its superior ingredients and exceptional taste profile.",
    image: "/placeholder.svg?height=600&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    origin: "USA",
    price: "₹350",
    category: "Beverages",
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
    relatedProducts: [
      {
        id: 5,
        name: "Exotic Fruit Juice",
        image: "/placeholder.svg?height=400&width=400",
        origin: "Thailand",
        price: "₹280",
        category: "Beverages",
      },
      {
        id: 9,
        name: "Premium Coffee Beans",
        image: "/placeholder.svg?height=400&width=400",
        origin: "Colombia",
        price: "₹750",
        category: "Beverages",
      },
      {
        id: 3,
        name: "Spicy Cheese Snacks",
        image: "/placeholder.svg?height=400&width=400",
        origin: "Mexico",
        price: "₹250",
        category: "Snacks",
      },
      {
        id: 4,
        name: "Protein Granola Bars",
        image: "/placeholder.svg?height=400&width=400",
        origin: "Australia",
        price: "₹550",
        category: "Protein",
      },
    ],
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border cursor-pointer hover:border-primary"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-primary">
                    <Star className="h-4 w-4 fill-primary" />
                    <Star className="h-4 w-4 fill-primary" />
                    <Star className="h-4 w-4 fill-primary" />
                    <Star className="h-4 w-4 fill-primary" />
                    <Star className="h-4 w-4 fill-primary" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold">{product.name}</h1>

                <div className="flex items-center gap-2 mt-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Imported from {product.origin}</span>
                </div>
              </div>

              <div className="text-2xl font-bold">{product.price}</div>

              <p className="text-muted-foreground">{product.description}</p>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-4">
                <Button className="w-full gold-gradient text-black font-semibold">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <Tabs defaultValue="description" className="pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <div className="space-y-4 text-muted-foreground">
                    {product.longDescription.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="nutrition" className="pt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 font-semibold">Nutritional Information</div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Serving Size</span>
                        <span>{product.nutritionalInfo.servingSize}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Calories</span>
                        <span>{product.nutritionalInfo.calories}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Protein</span>
                        <span>{product.nutritionalInfo.protein}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Carbohydrates</span>
                        <span>{product.nutritionalInfo.carbs}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Sugar</span>
                        <span>{product.nutritionalInfo.sugar}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Fat</span>
                        <span>{product.nutritionalInfo.fat}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ingredients" className="pt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 font-semibold">Ingredients</div>
                    <div className="p-4">
                      <p className="text-muted-foreground">{product.ingredients}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id}>
                  <Card className="product-card overflow-hidden border-border group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {relatedProduct.origin}
                      </div>
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{relatedProduct.category}</span>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{relatedProduct.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

