"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Grid3X3, LayoutList, Search, ShoppingCart } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

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
import { useToast } from "@/hooks/use-toast"
import { addToCart } from "@/lib/cart"
import type { Banner, Category, Product, Tag } from "@/types/types"

const formatPrice = (value?: number) => {
  if (typeof value !== "number") return "Price on request"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)
}

const parseList = (value: string | null) =>
  value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [origins, setOrigins] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [heroBanner, setHeroBanner] = useState<Banner | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => parseList(searchParams.get("category")))
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>(() => parseList(searchParams.get("origin")))
  const [selectedTags, setSelectedTags] = useState<string[]>(() => parseList(searchParams.get("tag")))
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(() =>
    parseList(searchParams.get("subcategory")),
  )
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "featured")
  const [priceMin, setPriceMin] = useState(searchParams.get("minPrice") || "")
  const [priceMax, setPriceMax] = useState(searchParams.get("maxPrice") || "")
  const [priceMinInput, setPriceMinInput] = useState(priceMin)
  const [priceMaxInput, setPriceMaxInput] = useState(priceMax)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [totalProducts, setTotalProducts] = useState(0)

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCategories.length) params.set("category", selectedCategories.join(","))
    if (selectedSubcategories.length) params.set("subcategory", selectedSubcategories.join(","))
    if (selectedOrigins.length) params.set("origin", selectedOrigins.join(","))
    if (selectedTags.length) params.set("tag", selectedTags.join(","))
    if (priceMin) params.set("minPrice", priceMin)
    if (priceMax) params.set("maxPrice", priceMax)
    if (searchQuery) params.set("search", searchQuery)
    if (sort) params.set("sort", sort)
    params.set("limit", String(pageSize))
    params.set("skip", String((page - 1) * pageSize))
    params.set("includeTotal", "true")
    return params.toString()
  }, [page, pageSize, priceMax, priceMin, searchQuery, selectedCategories, selectedOrigins, selectedSubcategories, selectedTags, sort])

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true)
      const queryString = buildQueryString()
      const response = await fetch(`/api/products${queryString ? `?${queryString}` : ""}`)
      const data = await response.json()
      if (data && Array.isArray(data.items)) {
        setProducts(data.items)
        setTotalProducts(data.total || 0)
      } else {
        setProducts(data)
        setTotalProducts(Array.isArray(data) ? data.length : 0)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }, [buildQueryString])

  const fetchFilters = useCallback(async () => {
    try {
      const response = await fetch("/api/bootstrap?section=products")
      if (!response.ok) return
      const data = await response.json()
      setCategories(data?.categories || [])
      setTags(data?.tags || [])
      const originNames = (data?.origins || []).map((origin: { name?: string }) => origin?.name).filter(Boolean)
      setOrigins(originNames)
      const activeBanners = (data?.banners || []).filter((banner: Banner) => banner.isActive)
      setHeroBanner(activeBanners.find((banner: Banner) => banner.position === "products_top") || null)
    } catch (error) {
      console.error("Error fetching filters:", error)
    }
  }, [])

  useEffect(() => {
    fetchFilters()
  }, [fetchFilters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    setSearchQuery(currentSearch)
    setSearchInput(currentSearch)
  }, [searchParams])

  useEffect(() => {
    const queryString = buildQueryString()
    router.replace(`/products${queryString ? `?${queryString}` : ""}`, { scroll: false })
  }, [buildQueryString, router])

  useEffect(() => {
    setPage(1)
  }, [selectedCategories, selectedOrigins, selectedSubcategories, selectedTags, priceMin, priceMax, sort, searchQuery])

  const toggleItem = (value: string, current: string[], setCurrent: (values: string[]) => void) => {
    setCurrent(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedOrigins([])
    setSelectedTags([])
    setSelectedSubcategories([])
    setPriceMin("")
    setPriceMax("")
    setPriceMinInput("")
    setPriceMaxInput("")
    setSort("featured")
  }

  const applyPriceRange = () => {
    setPriceMin(priceMinInput)
    setPriceMax(priceMaxInput)
  }

  const activeFilters = useMemo(() => {
    const filters: { label: string; onRemove: () => void }[] = []
    selectedCategories.forEach((category) =>
      filters.push({
        label: category,
        onRemove: () => setSelectedCategories((prev) => prev.filter((item) => item !== category)),
      }),
    )
    selectedSubcategories.forEach((subcategory) =>
      filters.push({
        label: subcategory,
        onRemove: () => setSelectedSubcategories((prev) => prev.filter((item) => item !== subcategory)),
      }),
    )
    selectedOrigins.forEach((origin) =>
      filters.push({
        label: origin,
        onRemove: () => setSelectedOrigins((prev) => prev.filter((item) => item !== origin)),
      }),
    )
    selectedTags.forEach((tag) =>
      filters.push({
        label: tag,
        onRemove: () => setSelectedTags((prev) => prev.filter((item) => item !== tag)),
      }),
    )
    return filters
  }, [selectedCategories, selectedOrigins, selectedSubcategories, selectedTags])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 bg-black text-white">
          <Image
            src={heroBanner?.imageUrl || "/placeholder.svg?height=400&width=1920"}
            alt={heroBanner?.title || "Products"}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {heroBanner?.title || (
                <>
                  Our <span className="gold-text">Premium</span> Products
                </>
              )}
            </h1>
            <p className="max-w-2xl text-gray-300">
              {heroBanner?.subtitle || "Explore our extensive collection of imported food products from around the world."}
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
                <Button variant="ghost" size="sm" className="text-primary" onClick={clearFilters}>
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
                        {categories.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No categories available.</p>
                        ) : (
                          categories.map((category) => (
                            <div key={category._id} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category.slug}`}
                                  checked={selectedCategories.includes(category.slug)}
                                  onCheckedChange={() =>
                                    toggleItem(category.slug, selectedCategories, setSelectedCategories)
                                  }
                                />
                                <label
                                  htmlFor={`category-${category.slug}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category.name}
                                </label>
                              </div>
                              {category.subcategories?.length > 0 && (
                                <div className="pl-6 space-y-1">
                                  {category.subcategories.map((subcategory) => (
                                    <div key={subcategory.slug} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`subcategory-${subcategory.slug}`}
                                        checked={selectedSubcategories.includes(subcategory.slug)}
                                        onCheckedChange={() =>
                                          toggleItem(subcategory.slug, selectedSubcategories, setSelectedSubcategories)
                                        }
                                      />
                                      <label
                                        htmlFor={`subcategory-${subcategory.slug}`}
                                        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {subcategory.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
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
                        {origins.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No origins available.</p>
                        ) : (
                          origins.map((country) => (
                            <div key={country} className="flex items-center space-x-2">
                              <Checkbox
                                id={`country-${country}`}
                                checked={selectedOrigins.includes(country)}
                                onCheckedChange={() => toggleItem(country, selectedOrigins, setSelectedOrigins)}
                              />
                              <label
                                htmlFor={`country-${country}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {country}
                              </label>
                            </div>
                          ))
                        )}
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
                            <Input type="number" placeholder="₹0" value={priceMinInput} onChange={(e) => setPriceMinInput(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Max</label>
                            <Input type="number" placeholder="₹5000" value={priceMaxInput} onChange={(e) => setPriceMaxInput(e.target.value)} />
                          </div>
                        </div>
                        <Button className="w-full" onClick={applyPriceRange}>Apply</Button>
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
                        {tags.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No tags available.</p>
                        ) : (
                          tags.map((tag) => (
                            <div key={tag._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`tag-${tag.slug}`}
                                checked={selectedTags.includes(tag.name)}
                                onCheckedChange={() => toggleItem(tag.name, selectedTags, setSelectedTags)}
                              />
                              <label
                                htmlFor={`tag-${tag.slug}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag.name}
                              </label>
                            </div>
                          ))
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
                <div className="flex items-center gap-2 flex-wrap">
                  {activeFilters.length === 0 ? (
                    <Badge variant="outline" className="rounded-full px-3 py-1 border-muted-foreground/40">
                      All Products
                    </Badge>
                  ) : (
                    activeFilters.map((filter) => (
                      <Badge key={filter.label} variant="outline" className="rounded-full px-3 py-1 border-primary/50">
                        {filter.label}
                        <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={filter.onRemove}>
                          ×
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <form
                    className="relative w-full sm:w-[240px]"
                    onSubmit={(event) => {
                      event.preventDefault()
                      setSearchQuery(searchInput.trim())
                    }}
                  >
                    <Input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search products..."
                      className="pr-9"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      aria-label="Search products"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>

                  <Select value={sort} onValueChange={setSort}>
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
                <ProductsGrid
                  products={products}
                  loading={loadingProducts}
                  viewMode={viewMode}
                  onAddToCart={(product) => {
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
                />
              </Suspense>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  {Array.from({ length: Math.max(1, Math.min(5, Math.ceil(totalProducts / pageSize))) }).map(
                    (_, index) => {
                      const pageNumber = index + 1
                      return (
                        <Button
                          key={pageNumber}
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0 ${page === pageNumber ? "bg-primary text-primary-foreground" : ""}`}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      )
                    },
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= Math.ceil(totalProducts / pageSize)}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
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

function ProductsGrid({
  products,
  loading,
  viewMode,
  onAddToCart,
}: {
  products: Product[]
  loading: boolean
  viewMode: "grid" | "list"
  onAddToCart: (product: Product) => void
}) {
  if (loading) {
    return <ProductsGridSkeleton />
  }

  if (products.length === 0) {
    return <div className="text-center text-muted-foreground">No products found.</div>
  }

  const gridClass = viewMode === "list" ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <Link href={`/products/${product._id}`} key={product._id}>
          <Card className="product-card overflow-hidden border-border group h-full">
            <div className="relative h-64 overflow-hidden">
              <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {product.origin || "Imported"}
              </div>
              <Image
                src={product.image || product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{product.category || "Uncategorized"}</span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-bold">{formatPrice(product.price)}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onAddToCart(product)
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
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
