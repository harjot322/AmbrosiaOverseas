"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Loader2 } from "lucide-react"
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

import { Category, Subcategory } from "@/types/types"

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [newSubcategory, setNewSubcategory] = useState<Subcategory>({ id: 0, parentId: "", name: "", slug: "" })
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [editSubcategory, setEditSubcategory] = useState<Subcategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast({
        title: "Error",
        description: "Name and slug are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory.name,
          slug: newCategory.slug,
          subcategories: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      setNewCategory({ name: "", slug: "" })
      fetchCategories()

      toast({
        title: "Category Added",
        description: "The category has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

const handleAddSubcategory = async () => {
  if (!newSubcategory.name || !newSubcategory.slug || !newSubcategory.parentId) {
    toast({
      title: "Error",
      description: "Name, slug, and parent category are required.",
      variant: "destructive",
    })
    return
  }

  try {
    setIsSubmitting(true)
    const parentCategory = categories.find((c) => c._id === newSubcategory.parentId)
    if (!parentCategory) return

    const subcategoryIds = parentCategory.subcategories?.map((subcategory) => subcategory.id) || []
    const newId = subcategoryIds.length > 0 ? Math.max(...subcategoryIds) + 1 : 1
    const updatedCategory = {
      _id: parentCategory._id,
      name: parentCategory.name,
      slug: parentCategory.slug,
      subcategories: [
        ...(parentCategory.subcategories || []),
        {
          id: newId,
          name: newSubcategory.name,
          slug: newSubcategory.slug,
        },
      ],
    }

    const response = await fetch(`/api/categories/${parentCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    })

    if (!response.ok) {
      throw new Error("Failed to add subcategory")
    }

    setNewSubcategory({ id: 0, parentId: "", name: "", slug: "" })
    fetchCategories()

    toast({
      title: "Subcategory Added",
      description: "The subcategory has been added successfully.",
    })
  } catch (error) {
    console.error("Error adding subcategory:", error)
    toast({
      title: "Error",
      description: "Failed to add subcategory",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  const handleUpdateCategory = async () => {
    if (!editCategory) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/categories/${editCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: editCategory._id,
          name: editCategory.name,
          slug: editCategory.slug,
          subcategories: editCategory.subcategories || [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      setEditCategory(null)
      fetchCategories()

      toast({
        title: "Category Updated",
        description: "The category has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubcategory = async () => {
    if (!editSubcategory) return

    try {
      setIsSubmitting(true)
      const parentCategory = categories.find((c) => c._id === editSubcategory.parentId)
      if (!parentCategory) return

      const updatedCategory = {
        _id: parentCategory._id,
        name: parentCategory.name,
        slug: parentCategory.slug,
        subcategories: parentCategory.subcategories.map((subcategory) =>
          subcategory.id === editSubcategory.id
            ? { ...subcategory, name: editSubcategory.name, slug: editSubcategory.slug }
            : subcategory,
        ),
      }

      const response = await fetch(`/api/categories/${parentCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      })

      if (!response.ok) {
        throw new Error("Failed to update subcategory")
      }

      setEditSubcategory(null)
      fetchCategories()

      toast({
        title: "Subcategory Updated",
        description: "The subcategory has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating subcategory:", error)
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      fetchCategories()

      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: number) => {
    try {
      setIsSubmitting(true)
      const category = categories.find((c) => c._id === categoryId)
      if (!category) return

      const updatedCategory = {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
      }

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      })

      if (!response.ok) {
        throw new Error("Failed to delete subcategory")
      }

      fetchCategories()

      toast({
        title: "Subcategory Deleted",
        description: "The subcategory has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting subcategory:", error)
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
                <Button onClick={handleAddCategory} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
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
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, parentId: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
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
                      ? categories.find((c) => c._id === newSubcategory.parentId)?.slug
                      : "example"}
                    /{newSubcategory.slug || "example"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewSubcategory({ id: 0, parentId: "", name: "", slug: "" })}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubcategory} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Subcategory"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories found. Create your first category to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category._id}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleCategory(category._id)}
                    >
                      {expandedCategories.includes(category._id) ? (
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
                              onChange={(e) =>
                                setEditCategory({
                                  _id: category._id,
                                  name: e.target.value,
                                  slug: editCategory?.slug || category.slug,
                                  subcategories: editCategory?.subcategories || category.subcategories || [],
                                })
                              }
                              placeholder="Category name"
                              onFocus={() =>
                                setEditCategory({
                                  _id: category._id,
                                  name: category.name,
                                  slug: category.slug,
                                  subcategories: category.subcategories || [],
                                })
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
                              onChange={(e) =>
                                setEditCategory({
                                  _id: category._id,
                                  name: editCategory?.name || category.name,
                                  slug: e.target.value,
                                  subcategories: editCategory?.subcategories || category.subcategories || [],
                                })
                              }
                              placeholder="category-slug"
                              onFocus={() =>
                                setEditCategory({
                                  _id: category._id,
                                  name: category.name,
                                  slug: category.slug,
                                  subcategories: category.subcategories || [],
                                })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditCategory(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteCategory(category._id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedCategories.includes(category._id) && (
                <CardContent className="pl-10 pr-4 pb-4 pt-0">
                  {!category.subcategories || category.subcategories.length === 0 ? (
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
                                      onChange={(e) =>
                                        setEditSubcategory({
                                          id: subcategory.id,
                                          parentId: category._id,
                                          name: e.target.value,
                                          slug: editSubcategory?.slug || subcategory.slug,
                                        })
                                      }
                                      placeholder="Subcategory name"
                                      onFocus={() =>
                                        setEditSubcategory({
                                          id: subcategory.id,
                                          parentId: category._id,
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
                                      onChange={(e) =>
                                        setEditSubcategory({
                                          id: subcategory.id,
                                          parentId: category._id,
                                          name: editSubcategory?.name || subcategory.name,
                                          slug: e.target.value,
                                        })
                                      }
                                      placeholder="subcategory-slug"
                                      onFocus={() =>
                                        setEditSubcategory({
                                          id: subcategory.id,
                                          parentId: category._id,
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
                                  <Button onClick={handleUpdateSubcategory} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleDeleteSubcategory(category._id, subcategory.id)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}