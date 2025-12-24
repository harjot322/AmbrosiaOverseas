"use client";
import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, Star, ShoppingCart } from "lucide-react"
import { useParams } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { addToCart } from "@/lib/cart"
import type { Product } from "@/types/types"

const formatPrice = (value?: number) => {
  if (typeof value !== "number") return "Price on request"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)
}

export default function ProductPage() {
  const params = useParams()
  const { toast } = useToast()
  const productId = typeof params?.id === "string" ? params.id : ""
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      if (!productId) {
        throw new Error("Missing product id")
      }
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data)
      setError("")
    } catch (err) {
      console.error("Error fetching product:", err)
      setError("Unable to load product details.")
    } finally {
      setLoading(false)
    }
  }, [productId])

  const fetchRelatedProducts = useCallback(async (category?: string, productId?: string) => {
    if (!category || !productId) {
      setRelatedProducts([])
      return
    }

    try {
      const response = await fetch(
        `/api/products?category=${encodeURIComponent(category)}&excludeId=${productId}&limit=4&sort=featured`,
      )
      const data = await response.json()
      setRelatedProducts(data)
    } catch (err) {
      console.error("Error fetching related products:", err)
      setRelatedProducts([])
    }
  }, [])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  useEffect(() => {
    if (product?._id) {
      fetchRelatedProducts(product.category, product._id)
    }
  }, [fetchRelatedProducts, product])

  const gallery = useMemo(() => {
    if (!product) return []
    const images = product.images?.length ? product.images : []
    if (product.image && !images.includes(product.image)) {
      return [product.image, ...images]
    }
    return images.length ? images : ["/placeholder.svg"]
  }, [product])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16 flex-1">
          <div className="container py-8 text-center text-muted-foreground">Loading product details...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product || error) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16 flex-1">
          <div className="container py-8 text-center text-muted-foreground">{error || "Product not found."}</div>
        </div>
        <Footer />
      </main>
    )
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
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-primary">
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image src={gallery[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>

              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {gallery.slice(0, 4).map((image, index) => (
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
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                    {product.category || "Uncategorized"}
                  </Badge>
                  <div className="flex items-center text-primary">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-primary" />
                      ))}
                  </div>
                </div>

                <h1 className="text-3xl font-bold">{product.name}</h1>

                {product.origin && (
                  <div className="flex items-center gap-2 mt-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Imported from {product.origin}</span>
                  </div>
                )}
              </div>

              <div className="text-2xl font-bold">{formatPrice(product.price)}</div>

              {product.description && <p className="text-muted-foreground">{product.description}</p>}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full gold-gradient text-black font-semibold"
                  onClick={() => {
                    if (!product) return
                    addToCart({
                      id: product._id,
                      name: product.name,
                      image: product.image || product.images?.[0] || "/placeholder.svg",
                      price: product.price ?? 0,
                      quantity: 1,
                      origin: product.origin || "Global",
                    })
                    toast({
                      title: "Added to cart",
                      description: `${product.name} is now in your cart.`,
                    })
                  }}
                >
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
                    {(product.longDescription || product.description || "").split("\n\n").map((paragraph, index) => (
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
                        <span>{product.nutritionalInfo?.servingSize || "—"}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Calories</span>
                        <span>{product.nutritionalInfo?.calories || "—"}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Protein</span>
                        <span>{product.nutritionalInfo?.protein || "—"}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Carbohydrates</span>
                        <span>{product.nutritionalInfo?.carbs || "—"}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Sugar</span>
                        <span>{product.nutritionalInfo?.sugar || "—"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Fat</span>
                        <span>{product.nutritionalInfo?.fat || "—"}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ingredients" className="pt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 font-semibold">Ingredients</div>
                    <div className="p-4">
                      <p className="text-muted-foreground">{product.ingredients || "Ingredients not provided."}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link href={`/products/${relatedProduct._id}`} key={relatedProduct._id}>
                    <Card className="product-card overflow-hidden border-border group h-full">
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {relatedProduct.origin || "Imported"}
                        </div>
                        <Image
                          src={relatedProduct.image || relatedProduct.images?.[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">{relatedProduct.category || ""}</span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{formatPrice(relatedProduct.price)}</span>
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
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
