"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, LinkIcon, ExternalLink, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
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
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    position: "home_hero",
    isActive: true,
  })
  const [editBanner, setEditBanner] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
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
  }

  const handleCreateBanner = async () => {
    try {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBanner),
      })

      if (!response.ok) {
        throw new Error("Failed to create banner")
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
        position: "home_hero",
        isActive: true,
      })

      fetchBanners()
    } catch (error) {
      console.error("Error creating banner:", error)
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBanner = async () => {
    try {
      const response = await fetch(`/api/banners/${editBanner._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editBanner),
      })

      if (!response.ok) {
        throw new Error("Failed to update banner")
      }

      toast({
        title: "Success",
        description: "Banner updated successfully",
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

  const handleDeleteBanner = async (id) => {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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
                    onValueChange={(value) => setNewBanner({ ...newBanner, position: value })}
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_hero">Home Hero</SelectItem>
                      <SelectItem value="home_featured">Home Featured</SelectItem>
                      <SelectItem value="products_top">Products Top</SelectItem>
                      <SelectItem value="about_page">About Page</SelectItem>
                    </SelectContent>
                  </Select>
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
                    position: "home_hero",
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
      ) : banners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No banners found. Create your first banner to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
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
                  {banner.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>}
                  <div className="text-xs text-muted-foreground">
                    Position: {banner.position.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    onValueChange={(value) => setEditBanner({ ...editBanner, position: value })}
                  >
                    <SelectTrigger id="edit-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_hero">Home Hero</SelectItem>
                      <SelectItem value="home_featured">Home Featured</SelectItem>
                      <SelectItem value="products_top">Products Top</SelectItem>
                      <SelectItem value="about_page">About Page</SelectItem>
                    </SelectContent>
                  </Select>
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

