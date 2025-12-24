"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, LinkIcon, ExternalLink, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Banner } from "@/types/types" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BannersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [createPosition, setCreatePosition] = useState<Banner["position"]>("home_hero")
  const [newBanner, setNewBanner] = useState<Omit<Banner, '_id'>>({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    position: "home_hero",
    isActive: true,
  })
  const [editBanner, setEditBanner] = useState<Banner | null>(null)

  const positionMeta: { value: Banner["position"]; label: string; size: string }[] = [
    { value: "home_hero", label: "Home Page Hero", size: "1920x900 (16:9)" },
    { value: "home_featured", label: "Home Featured Tiles", size: "800x600 (4:3)" },
    { value: "products_top", label: "Products Page Hero", size: "1920x600 (16:5)" },
    { value: "about_page", label: "About Page Hero", size: "1920x600 (16:5)" },
    { value: "contact_page", label: "Contact Page Hero", size: "1920x600 (16:5)" },
  ]

  const handleBannerImageUpload = (file: File | null | undefined, isEdit = false) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (isEdit) {
        setEditBanner((prev) => (prev ? { ...prev, imageUrl: reader.result as string } : prev))
      } else {
        setNewBanner((prev) => ({ ...prev, imageUrl: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/banners")
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  useEffect(() => {
    setNewBanner((prev) => ({ ...prev, position: createPosition }))
  }, [createPosition])

  const handleCreateBanner = async () => {
    if (!newBanner.title || !newBanner.imageUrl) {
      toast({
        title: "Missing fields",
        description: "Title and image are required.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBanner),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Failed to create banner")
      }

      toast({
        title: "Success",
        description: "Banner created successfully",
      })

      // Reset form and refresh banners
      setNewBanner({
        title: "",
        subtitle: "",
        imageUrl: "",
        linkUrl: "",
        position: createPosition,
        isActive: true,
      })

      fetchBanners()
    } catch (error) {
      console.error("Error creating banner:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create banner",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBanner = async () => {
    if (!editBanner) {
      console.error("Error updating banner: editBanner is null")
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/banners/${editBanner._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editBanner.title,
          subtitle: editBanner.subtitle,
          imageUrl: editBanner.imageUrl,
          linkUrl: editBanner.linkUrl,
          position: editBanner.position,
          isActive: editBanner.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update banner")
      }

      toast({
        title: "Success",
        description: `Banner "${editBanner.title}" updated successfully`,
      })

      setEditBanner(null)
      fetchBanners()
    } catch (error) {
      console.error("Error updating banner:", error)
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete banner")
      }

      toast({
        title: "Success",
        description: "Banner deleted successfully",
      })

      fetchBanners()
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setCreatePosition("home_hero")
                setCreateOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>Create a new banner for your website.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    placeholder="Enter banner title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">
                    Position
                  </label>
                  <Select
                    value={newBanner.position}
                    onValueChange={(value) =>
                      setNewBanner({
                        ...newBanner,
                        position: value as "home_hero" | "home_featured" | "products_top" | "about_page" | "contact_page",
                      })
                    }
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_hero">Home Hero</SelectItem>
                      <SelectItem value="home_featured">Home Featured</SelectItem>
                      <SelectItem value="products_top">Products Top</SelectItem>
                      <SelectItem value="about_page">About Page</SelectItem>
                      <SelectItem value="contact_page">Contact Page</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: {positionMeta.find((item) => item.value === newBanner.position)?.size || "1920x600"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subtitle" className="text-sm font-medium">
                  Subtitle
                </label>
                <Textarea
                  id="subtitle"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  placeholder="Enter banner subtitle or description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={newBanner.imageUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerImageUpload(e.target.files?.[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1920x600px for hero banners, 800x600px for others
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="linkUrl" className="text-sm font-medium">
                  Link URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="linkUrl"
                    value={newBanner.linkUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                    placeholder="Enter link URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newBanner.isActive}
                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                      setNewBanner({
                        title: "",
                        subtitle: "",
                        imageUrl: "",
                        linkUrl: "",
                        position: createPosition,
                        isActive: true,
                      })
                    }
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBanner}>Create Banner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading banners...</div>
      ) : (
        <div className="space-y-10">
          {positionMeta.map((position) => {
            const sectionBanners = banners.filter((banner) => banner.position === position.value)
            return (
              <div key={position.value} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{position.label}</h2>
                    <p className="text-sm text-muted-foreground">Recommended size: {position.size}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreatePosition(position.value)
                      setNewBanner((prev) => ({ ...prev, position: position.value }))
                      setCreateOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {position.label}
                  </Button>
                </div>

                {sectionBanners.length === 0 ? (
                  <p className="text-muted-foreground">No banners for this section yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionBanners.map((banner) => (
                      <Card key={banner._id} className="overflow-hidden">
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {banner.imageUrl ? (
                            <img
                              src={banner.imageUrl || "/placeholder.svg"}
                              alt={banner.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                              onClick={() => setEditBanner(banner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 bg-destructive/80 backdrop-blur-sm"
                              onClick={() => handleDeleteBanner(banner._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {!banner.isActive && (
                            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
                              Inactive
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold truncate">{banner.title}</h3>
                              {banner.linkUrl && (
                                <a
                                  href={banner.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            {banner.subtitle && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Position: {banner.position.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Banner Dialog */}
      {editBanner && (
        <Dialog open={!!editBanner} onOpenChange={(open) => !open && setEditBanner(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Banner</DialogTitle>
              <DialogDescription>Update the banner details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={editBanner.title}
                    onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })}
                    placeholder="Enter banner title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-position" className="text-sm font-medium">
                    Position
                  </label>
                  <Select
                    value={editBanner.position}
                    onValueChange={(value) =>
                      setEditBanner({
                        ...editBanner,
                        position: value as "home_hero" | "home_featured" | "products_top" | "about_page" | "contact_page",
                      })
                    }
                  >
                    <SelectTrigger id="edit-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_hero">Home Hero</SelectItem>
                      <SelectItem value="home_featured">Home Featured</SelectItem>
                      <SelectItem value="products_top">Products Top</SelectItem>
                      <SelectItem value="about_page">About Page</SelectItem>
                      <SelectItem value="contact_page">Contact Page</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: {positionMeta.find((item) => item.value === editBanner.position)?.size || "1920x600"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-subtitle" className="text-sm font-medium">
                  Subtitle
                </label>
                <Textarea
                  id="edit-subtitle"
                  value={editBanner.subtitle}
                  onChange={(e) => setEditBanner({ ...editBanner, subtitle: e.target.value })}
                  placeholder="Enter banner subtitle or description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="edit-imageUrl"
                    value={editBanner.imageUrl}
                    onChange={(e) => setEditBanner({ ...editBanner, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerImageUpload(e.target.files?.[0], true)}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1920x600px for hero banners, 800x600px for others
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-linkUrl" className="text-sm font-medium">
                  Link URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="edit-linkUrl"
                    value={editBanner.linkUrl}
                    onChange={(e) => setEditBanner({ ...editBanner, linkUrl: e.target.value })}
                    placeholder="Enter link URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editBanner.isActive}
                  onCheckedChange={(checked) => setEditBanner({ ...editBanner, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditBanner(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBanner}>Update Banner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
