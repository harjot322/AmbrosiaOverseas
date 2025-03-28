"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: "Premium Energy Drink",
    image: "/placeholder.svg?height=100&width=100",
    category: "Beverages",
    origin: "USA",
    price: 350,
    stock: 120,
    active: true,
    featured: true,
  },
  {
    id: 2,
    name: "Gourmet Chocolate Cookies",
    image: "/placeholder.svg?height=100&width=100",
    category: "Cookies",
    origin: "Belgium",
    price: 450,
    stock: 85,
    active: true,
    featured: false,
  },
  {
    id: 3,
    name: "Spicy Cheese Snacks",
    image: "/placeholder.svg?height=100&width=100",
    category: "Snacks",
    origin: "Mexico",
    price: 250,
    stock: 200,
    active: true,
    featured: true,
  },
  {
    id: 4,
    name: "Protein Granola Bars",
    image: "/placeholder.svg?height=100&width=100",
    category: "Protein",
    origin: "Australia",
    price: 550,
    stock: 65,
    active: true,
    featured: false,
  },
  {
    id: 5,
    name: "Exotic Fruit Juice",
    image: "/placeholder.svg?height=100&width=100",
    category: "Beverages",
    origin: "Thailand",
    price: 280,
    stock: 150,
    active: true,
    featured: true,
  },
  {
    id: 6,
    name: "Crunchy Breakfast Cereal",
    image: "/placeholder.svg?height=100&width=100",
    category: "Cereals",
    origin: "UK",
    price: 650,
    stock: 0,
    active: false,
    featured: false,
  },
  {
    id: 7,
    name: "Authentic Taco Shells",
    image: "/placeholder.svg?height=100&width=100",
    category: "Taco",
    origin: "Mexico",
    price: 320,
    stock: 95,
    active: true,
    featured: false,
  },
  {
    id: 8,
    name: "Chocolate Hazelnut Spread",
    image: "/placeholder.svg?height=100&width=100",
    category: "Spreads",
    origin: "Italy",
    price: 480,
    stock: 75,
    active: true,
    featured: true,
  },
]

export default function AdminProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleProductStatus = (id: number, field: "active" | "featured") => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, [field]: !product[field] } : product)),
    )

    toast({
      title: `Product ${field === "active" ? "Status" : "Featured Status"} Updated`,
      description: `The product has been ${field === "active" ? "activated/deactivated" : "featured/unfeatured"} successfully.`,
    })
  }

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))

    toast({
      title: "Product Deleted",
      description: "The product has been deleted successfully.",
    })
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.origin}</TableCell>
                  <TableCell className="text-right">₹{product.price}</TableCell>
                  <TableCell className="text-center">
                    {product.stock > 0 ? (
                      product.stock > 50 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          In Stock ({product.stock})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Low Stock ({product.stock})
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={product.active}
                      onCheckedChange={() => toggleProductStatus(product.id, "active")}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={product.featured}
                      onCheckedChange={() => toggleProductStatus(product.id, "featured")}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteProduct(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

