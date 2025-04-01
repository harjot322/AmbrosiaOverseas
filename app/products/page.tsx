"use client";
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Grid3X3, LayoutList } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 bg-black text-white">
          <Image src="/placeholder.svg?height=400&width=1920" alt="Products" fill className="object-cover opacity-60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="gold-text">Premium</span> Products
            </h1>
            <p className="max-w-2xl text-gray-300">
              Explore our extensive collection of imported food products from around the world.
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  Reset All
                </Button>
              </div>

              <div className="filter-section border rounded-lg p-4">
                <Accordion type="single" collapsible defaultValue="categories">
                  <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="font-medium">Categories</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-beverages" />
                            <label
                              htmlFor="category-beverages"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Beverages
                            </label>
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subcategory-soft-drinks" />
                              <label
                                htmlFor="subcategory-soft-drinks"
                                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Soft Drinks
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subcategory-energy-drinks" />
                              <label
                                htmlFor="subcategory-energy-drinks"
                                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Energy Drinks
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subcategory-coffee" />
                              <label
                                htmlFor="subcategory-coffee"
                                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Coffee
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-snacks" />
                            <label
                              htmlFor="category-snacks"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Snacks
                            </label>
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subcategory-chips" />
                              <label
                                htmlFor="subcategory-chips"
                                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Chips
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subcategory-crackers" />
                              <label
                                htmlFor="subcategory-crackers"
                                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Crackers
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-cookies" />
                            <label
                              htmlFor="category-cookies"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Cookies & Muffins
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-cereals" />
                            <label
                              htmlFor="category-cereals"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Breakfast Cereals
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-protein" />
                            <label
                              htmlFor="category-protein"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Protein Bars
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-taco" />
                            <label
                              htmlFor="category-taco"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Taco Shells
                            </label>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="filter-section border rounded-lg p-4">
                <Accordion type="single" collapsible defaultValue="origin">
                  <AccordionItem value="origin" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="font-medium">Country of Origin</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {["USA", "UK", "Dubai", "Thailand", "Australia", "New Zealand"].map((country) => (
                          <div key={country} className="flex items-center space-x-2">
                            <Checkbox id={`country-${country}`} />
                            <label
                              htmlFor={`country-${country}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="filter-section border rounded-lg p-4">
                <Accordion type="single" collapsible defaultValue="price">
                  <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="font-medium">Price Range</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Min</label>
                            <Input type="number" placeholder="₹0" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Max</label>
                            <Input type="number" placeholder="₹5000" />
                          </div>
                        </div>
                        <Button className="w-full">Apply</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="filter-section border rounded-lg p-4">
                <Accordion type="single" collapsible defaultValue="tags">
                  <AccordionItem value="tags" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="font-medium">Tags</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {["Best Seller", "New Arrival", "Limited Edition", "Exclusive", "Only on Ambrosia"].map(
                          (tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <Checkbox id={`tag-${tag}`} />
                              <label
                                htmlFor={`tag-${tag}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag}
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full px-3 py-1 border-primary/50">
                    Beverages
                    <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 border-primary/50">
                    USA
                    <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>

                  <Select defaultValue="featured">
                    <SelectTrigger className="w-full sm:w-[180px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              <Suspense fallback={<ProductsGridSkeleton />}>
                <ProductsGrid />
              </Suspense>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    ...
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    12
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function ProductsGrid() {
  const products = [
    {
      id: 1,
      name: "Premium Energy Drink",
      image: "/placeholder.svg?height=400&width=400",
      origin: "USA",
      price: "₹350",
      category: "Beverages",
      tags: ["Best Seller", "Imported from USA"],
    },
    {
      id: 2,
      name: "Gourmet Chocolate Cookies",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Belgium",
      price: "₹450",
      category: "Cookies",
      tags: ["New Arrival", "Imported from Belgium"],
    },
    {
      id: 3,
      name: "Spicy Cheese Snacks",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Mexico",
      price: "₹250",
      category: "Snacks",
      tags: ["Limited Edition", "Imported from Mexico"],
    },
    {
      id: 4,
      name: "Protein Granola Bars",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Australia",
      price: "₹550",
      category: "Protein",
      tags: ["Best Seller", "Imported from Australia"],
    },
    {
      id: 5,
      name: "Exotic Fruit Juice",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Thailand",
      price: "₹280",
      category: "Beverages",
      tags: ["Exclusive", "Imported from Thailand"],
    },
    {
      id: 6,
      name: "Crunchy Breakfast Cereal",
      image: "/placeholder.svg?height=400&width=400",
      origin: "UK",
      price: "₹650",
      category: "Cereals",
      tags: ["Only on Ambrosia", "Imported from UK"],
    },
    {
      id: 7,
      name: "Authentic Taco Shells",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Mexico",
      price: "₹320",
      category: "Taco",
      tags: ["Best Seller", "Imported from Mexico"],
    },
    {
      id: 8,
      name: "Chocolate Hazelnut Spread",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Italy",
      price: "₹480",
      category: "Spreads",
      tags: ["New Arrival", "Imported from Italy"],
    },
    {
      id: 9,
      name: "Premium Coffee Beans",
      image: "/placeholder.svg?height=400&width=400",
      origin: "Colombia",
      price: "₹750",
      category: "Beverages",
      tags: ["Limited Edition", "Imported from Colombia"],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <Card className="product-card overflow-hidden border-border group h-full">
            <div className="relative h-64 overflow-hidden">
              <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {product.origin}
              </div>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">{product.price}</span>
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
  )
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden border-border">
            <div className="relative h-64 overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <div className="flex gap-1 mb-3">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

