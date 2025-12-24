"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/types"

export default function AdminProductView() {
  const params = useParams()
  const productId = typeof params?.id === "string" ? params.id : ""
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return
      const response = await fetch(`/api/products/${productId}?includeInactive=true`)
        if (!response.ok) return
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading product...</div>
  }

  if (!product) {
    return <div className="p-6 text-muted-foreground">Product not found.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.featured && <Badge variant="secondary">Featured</Badge>}
          {product.active === false && <Badge variant="outline">Inactive</Badge>}
        </div>
        <Button asChild className="ml-auto">
          <Link href={`/admin/products/${product._id}/edit`}>Edit</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{product.category || "Uncategorized"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Origin</p>
              <p className="font-medium">{product.origin || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">{typeof product.price === "number" ? `₹${product.price}` : "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock</p>
              <p className="font-medium">{typeof product.stock === "number" ? product.stock : "—"}</p>
            </div>
            {product.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{product.description}</p>
              </div>
            )}
            {product.tags && product.tags.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(product.images?.length || product.image) ? (
              <div className="grid grid-cols-2 gap-2">
                {[product.image, ...(product.images || [])]
                  .filter(Boolean)
                  .map((image, index) => (
                    <div key={`${image}-${index}`} className="relative h-24 w-full overflow-hidden rounded-md">
                      <Image src={image as string} alt={`Product image ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No images available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
