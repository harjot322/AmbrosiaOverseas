"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Sample category data
const initialCategories = [
  {
    id: 1,
    name: "Beverages",
    slug: "beverages",
    subcategories: [
      { id: 101, name: "Soft Drinks", slug: "soft-drinks" },
      { id: 102, name: "Energy Drinks", slug: "energy-drinks" },
      { id: 103, name: "Coffee", slug: "coffee" },
    ],
  },
  {
    id: 2,
    name: "Snacks",
    slug: "snacks",
    subcategories: [
      { id: 201, name: "Chips", slug: "chips" },
      { id: 202, name: "Crackers", slug: "crackers" },
    ],
  },
  {
    id: 3,
    name: "Cookies & Muffins",
    slug: "cookies",
    subcategories: [],
  },
  {
    id: 4,
    name: "Breakfast Cereals",
    slug: "cereals",
    subcategories: [],
  },
  {
    id: 5,
    name: "Protein Bars",
    slug: "protein",
    subcategories: [],
  },
]

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState(initialCategories)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "", parentId: 0 })
  const [editCategory, setEditCategory] = useState<{ id: number; name: string; slug: string } | null>(null)
  const [editSubcategory, setEditSubcategory] = useState<{
    id: number
    parentId: number
    name: string
    slug: string
  } | null>(null)

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) {
      toast({
        title: "Error",
        description: "Name and slug are required.",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...categories.map((c) => c.id)) + 1
    setCategories((prev) => [
      ...prev,
      {
        id: newId,
        name: newCategory.name,
        slug: newCategory.slug,
        subcategories: [],
      },
    ])

    setNewCategory({ name: "", slug: "" })

    toast({
      title: "Category Added",
      description: "The category has been added successfully.",
    })
  }

  const handleAddSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.slug || !newSubcategory.parentId) {
      toast({
        title: "Error",
        description: "Name, slug, and parent category are required.",
        variant: "destructive",
      })
      return
    }

    const parentCategory = categories.find((c) => c.id === newSubcategory.parentId)
    if (!parentCategory) return

    const newId =
      parentCategory.subcategories.length > 0
        ? Math.max(...parentCategory.subcategories.map((s) => s.id)) + 1
        : parentCategory.id * 100 + 1

    setCategories((prev) =>
      prev.map((category) =>
        category.id === newSubcategory.parentId
          ? {
              ...category,
              subcategories: [
                ...category.subcategories,
                {
                  id: newId,
                  name: newSubcategory.name,
                  slug: newSubcategory.slug,
                },
              ],
            }
          : category,
      ),
    )

    setNewSubcategory({ name: "", slug: "", parentId: 0 })

    toast({
      title: "Subcategory Added",
      description: "The subcategory has been added successfully.",
    })
  }

  const handleUpdateCategory = () => {
    if (!editCategory) return

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editCategory.id ? { ...category, name: editCategory.name, slug: editCategory.slug } : category,
      ),
    )

    setEditCategory(null)

    toast({
      title: "Category Updated",
      description: "The category has been updated successfully.",
    })
  }

  const handleUpdateSubcategory = () => {
    if (!editSubcategory) return

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editSubcategory.parentId
          ? {
              ...category,
              subcategories: category.subcategories.map((subcategory) =>
                subcategory.id === editSubcategory.id
                  ? { ...subcategory, name: editSubcategory.name, slug: editSubcategory.slug }
                  : subcategory,
              ),
            }
          : category,
      ),
    )

    setEditSubcategory(null)

    toast({
      title: "Subcategory Updated",
      description: "The subcategory has been updated successfully.",
    })
  }

  const handleDeleteCategory = (categoryId: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId))

    toast({
      title: "Category Deleted",
      description: "The category has been deleted successfully.",
    })
  }

  const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
            }
          : category,
      ),
    )

    toast({
      title: "Subcategory Deleted",
      description: "The subcategory has been deleted successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>Add a new product category.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Category Name
                  </label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Beverages"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Slug
                  </label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="e.g., beverages"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs: /products/category/{newCategory.slug || "example"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCategory({ name: "", slug: "" })}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Subcategory</DialogTitle>
                <DialogDescription>Add a new subcategory to an existing category.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="parent-category" className="text-sm font-medium">
                    Parent Category
                  </label>
                  <select
                    id="parent-category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newSubcategory.parentId}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, parentId: Number(e.target.value) })}
                  >
                    <option value={0}>Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subcategory-name" className="text-sm font-medium">
                    Subcategory Name
                  </label>
                  <Input
                    id="subcategory-name"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    placeholder="e.g., Energy Drinks"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subcategory-slug" className="text-sm font-medium">
                    Slug
                  </label>
                  <Input
                    id="subcategory-slug"
                    value={newSubcategory.slug}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, slug: e.target.value })}
                    placeholder="e.g., energy-drinks"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs: /products/category/
                    {newSubcategory.parentId
                      ? categories.find((c) => c.id === newSubcategory.parentId)?.slug
                      : "example"}
                    /{newSubcategory.slug || "example"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewSubcategory({ name: "", slug: "", parentId: 0 })}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleCategory(category.id)}>
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <span className="text-xs text-muted-foreground">/{category.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update the category details.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="edit-name" className="text-sm font-medium">
                            Category Name
                          </label>
                          <Input
                            id="edit-name"
                            value={editCategory?.name || category.name}
                            onChange={(e) => setEditCategory({ ...editCategory!, name: e.target.value })}
                            placeholder="Category name"
                            onFocus={() =>
                              setEditCategory({ id: category.id, name: category.name, slug: category.slug })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-slug" className="text-sm font-medium">
                            Slug
                          </label>
                          <Input
                            id="edit-slug"
                            value={editCategory?.slug || category.slug}
                            onChange={(e) => setEditCategory({ ...editCategory!, slug: e.target.value })}
                            placeholder="category-slug"
                            onFocus={() =>
                              setEditCategory({ id: category.id, name: category.name, slug: category.slug })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditCategory(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateCategory}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedCategories.includes(category.id) && (
              <CardContent className="pl-10 pr-4 pb-4 pt-0">
                {category.subcategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subcategories</p>
                ) : (
                  <div className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{subcategory.name}</span>
                          <span className="text-xs text-muted-foreground">
                            /{category.slug}/{subcategory.slug}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Subcategory</DialogTitle>
                                <DialogDescription>Update the subcategory details.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label htmlFor="edit-subcategory-name" className="text-sm font-medium">
                                    Subcategory Name
                                  </label>
                                  <Input
                                    id="edit-subcategory-name"
                                    value={editSubcategory?.name || subcategory.name}
                                    onChange={(e) => setEditSubcategory({ ...editSubcategory!, name: e.target.value })}
                                    placeholder="Subcategory name"
                                    onFocus={() =>
                                      setEditSubcategory({
                                        id: subcategory.id,
                                        parentId: category.id,
                                        name: subcategory.name,
                                        slug: subcategory.slug,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="edit-subcategory-slug" className="text-sm font-medium">
                                    Slug
                                  </label>
                                  <Input
                                    id="edit-subcategory-slug"
                                    value={editSubcategory?.slug || subcategory.slug}
                                    onChange={(e) => setEditSubcategory({ ...editSubcategory!, slug: e.target.value })}
                                    placeholder="subcategory-slug"
                                    onFocus={() =>
                                      setEditSubcategory({
                                        id: subcategory.id,
                                        parentId: category.id,
                                        name: subcategory.name,
                                        slug: subcategory.slug,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditSubcategory(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateSubcategory}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

