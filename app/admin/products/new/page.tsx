"use client";
import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, X, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Category, Tag } from "@/types/types"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

interface FormData {
  name: string
  description: string
  category: string
  subcategory: string
  origin: string
  price: string
  stock: string
  active: boolean
  featured: boolean
  tags: string[]
  nutritionalInfo: {
    servingSize: string
    calories: string
    protein: string
    carbs: string
    sugar: string
    fat: string
  }
  ingredients: string
  longDescription?: string
}

export default function NewProduct() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    origin: "",
    price: "",
    stock: "",
    active: true,
    featured: false,
    tags: [],
    nutritionalInfo: {
      servingSize: "",
      calories: "",
      protein: "",
      carbs: "",
      sugar: "",
      fat: "",
    },
    ingredients: "",
    longDescription: "",
  })

  const [tagInput, setTagInput] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [originSelect, setOriginSelect] = useState("")
  const [originSaving, setOriginSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [originOptions, setOriginOptions] = useState<string[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [newSubcategorySlug, setNewSubcategorySlug] = useState("")

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  const fetchOrigins = useCallback(async () => {
    try {
      const response = await fetch("/api/origins")
      const data = await response.json()
      const originNames = (data || []).map((origin: { name?: string }) => origin?.name).filter(Boolean)
      setOriginOptions(originNames)
    } catch (error) {
      console.error("Error fetching origins:", error)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchOrigins()
    fetchTags()
  }, [fetchCategories, fetchOrigins, fetchTags])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : null),
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNutritionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [name]: value,
      },
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addImage = () => {
    const value = imageUrlInput.trim()
    if (!value) {
      return
    }
    setImages((prev) => [...prev, value])
    setImageUrlInput("")
  }

  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
        image: images[0] || "",
      }

      const response = await fetch("/api/products?includeInactive=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Product Created",
          description: "The product has been created successfully.",
        })
        router.push("/admin/products")
      } else {
        throw new Error("Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrigin = async () => {
    const originName = formData.origin.trim()
    if (!originName) {
      toast({
        title: "Origin required",
        description: "Please enter a country of origin.",
        variant: "destructive",
      })
      return
    }

    const existing = originOptions.find(
      (origin) => origin.toLowerCase() === originName.toLowerCase(),
    )
    if (existing) {
      setOriginSelect(existing)
      handleSelectChange("origin", existing)
      toast({
        title: "Already exists",
        description: "That country already exists in origins.",
      })
      return
    }

    setOriginSaving(true)
    try {
      const response = await fetch("/api/origins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: originName, slug: slugify(originName) }),
      })

      if (!response.ok) {
        throw new Error("Failed to add origin")
      }

      setOriginOptions((prev) => [...prev, originName])
      setOriginSelect(originName)
      handleSelectChange("origin", originName)
      toast({
        title: "Origin added",
        description: "The country has been added to origins.",
      })
    } catch (error) {
      console.error("Error adding origin:", error)
      toast({
        title: "Error",
        description: "Failed to add origin.",
        variant: "destructive",
      })
    } finally {
      setOriginSaving(false)
    }
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim()
    const slug = newCategorySlug.trim() || slugify(name)
    if (!name || !slug) return

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug, subcategories: [] }),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      setNewCategoryName("")
      setNewCategorySlug("")
      handleSelectChange("category", slug)
      await fetchCategories()
      toast({ title: "Category created", description: `"${name}" is now available.` })
    } catch (error) {
      console.error("Error creating category:", error)
      toast({ title: "Error", description: "Failed to create category.", variant: "destructive" })
    }
  }

  const handleCreateSubcategory = async () => {
    const name = newSubcategoryName.trim()
    const slug = newSubcategorySlug.trim() || slugify(name)
    if (!name || !slug || !selectedCategory?._id) return

    try {
      const updatedSubcategories = [...(selectedCategory.subcategories || []), { id: Date.now(), parentId: selectedCategory._id, name, slug }]
      const response = await fetch(`/api/categories/${selectedCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subcategories: updatedSubcategories }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subcategory")
      }

      setNewSubcategoryName("")
      setNewSubcategorySlug("")
      handleSelectChange("subcategory", slug)
      await fetchCategories()
      toast({ title: "Subcategory created", description: `"${name}" added to ${selectedCategory.name}.` })
    } catch (error) {
      console.error("Error creating subcategory:", error)
      toast({ title: "Error", description: "Failed to create subcategory.", variant: "destructive" })
    }
  }

  const selectedCategory = categories.find((category) => category.slug === formData.category)
  const subcategories = selectedCategory?.subcategories || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition & Ingredients</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Input
                    placeholder="New category slug"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleCreateCategory}>
                  Create Category
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleSelectChange("subcategory", value)}
                  disabled={subcategories.length === 0}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder={subcategories.length === 0 ? "No subcategories" : "Select subcategory"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.slug} value={subcategory.slug}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="New subcategory name"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    disabled={!selectedCategory?._id}
                  />
                  <Input
                    placeholder="New subcategory slug"
                    value={newSubcategorySlug}
                    onChange={(e) => setNewSubcategorySlug(e.target.value)}
                    disabled={!selectedCategory?._id}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleCreateSubcategory} disabled={!selectedCategory?._id}>
                  Create Subcategory
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">
                  Country of Origin <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={originSelect}
                  onValueChange={(value) => {
                    setOriginSelect(value)
                    if (value !== "other") {
                      handleSelectChange("origin", value)
                    } else {
                      handleSelectChange("origin", "")
                    }
                  }}
                  required
                >
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {originOptions.length === 0 ? (
                      <SelectItem value="other">Other</SelectItem>
                    ) : (
                      <>
                        {originOptions.map((origin) => (
                          <SelectItem key={origin} value={origin}>
                            {origin}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {originSelect === "other" && (
                  <div className="space-y-2">
                    <Input
                      value={formData.origin}
                      onChange={(e) => handleSelectChange("origin", e.target.value)}
                      placeholder="Enter country of origin"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCreateOrigin}
                      disabled={originSaving}
                    >
                      {originSaving ? "Adding..." : "Add to origins"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  placeholder="Enter detailed product description"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Active Status</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Enable to make this product visible on the website.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Product</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Enable to display this product in featured sections.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Product Images</h2>
                <Button type="button" onClick={addImage} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="image-url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" variant="secondary" onClick={addImage}>
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Add one image URL at a time.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Images</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
                <p className="text-xs text-muted-foreground">Uploaded images are saved as data URLs.</p>
              </div>

              {images.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No images added yet. Click &quot;Add Image&quot; to upload product images.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative aspect-square">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs text-muted-foreground text-center">
                          {index === 0 ? "Main Image" : `Image ${index + 1}`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Product Tags</h2>

              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag (e.g., Best Seller, New Arrival)"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {formData.tags.length === 0 && <p className="text-sm text-muted-foreground">No tags added yet.</p>}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag._id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) =>
                          prev.tags.includes(tag.name) ? prev : { ...prev, tags: [...prev.tags, tag.name] },
                        )
                      }
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Nutritional Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="servingSize">Serving Size</Label>
                      <Input
                        id="servingSize"
                        name="servingSize"
                        value={formData.nutritionalInfo.servingSize}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 100g, 250ml"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        name="calories"
                        value={formData.nutritionalInfo.calories}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 120"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="protein">Protein</Label>
                      <Input
                        id="protein"
                        name="protein"
                        value={formData.nutritionalInfo.protein}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 5g"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carbs">Carbohydrates</Label>
                      <Input
                        id="carbs"
                        name="carbs"
                        value={formData.nutritionalInfo.carbs}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 25g"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sugar">Sugar</Label>
                      <Input
                        id="sugar"
                        name="sugar"
                        value={formData.nutritionalInfo.sugar}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 10g"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fat">Fat</Label>
                      <Input
                        id="fat"
                        name="fat"
                        value={formData.nutritionalInfo.fat}
                        onChange={handleNutritionalInfoChange}
                        placeholder="e.g., 2g"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Ingredients</h2>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients List</Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="List ingredients separated by commas"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="gold-gradient text-black font-semibold" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Product
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
