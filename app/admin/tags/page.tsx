"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import type { Tag } from "@/types/types"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export default function TagsPage() {
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState({ name: "", slug: "" })
  const [editTag, setEditTag] = useState<Tag | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTag = async () => {
    if (!newTag.name) {
      toast({
        title: "Error",
        description: "Name is required.",
        variant: "destructive",
      })
      return
    }

    const slug = newTag.slug.trim() || slugify(newTag.name)

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTag.name, slug }),
      })

      if (!response.ok) {
        throw new Error("Failed to create tag")
      }

      setNewTag({ name: "", slug: "" })
      await fetchTags()
      toast({
        title: "Tag Added",
        description: "The tag has been added successfully.",
      })
    } catch (error) {
      console.error("Error creating tag:", error)
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTag = async () => {
    if (!editTag) return

    try {
      const response = await fetch(`/api/tags/${editTag._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editTag.name, slug: editTag.slug }),
      })

      if (!response.ok) {
        throw new Error("Failed to update tag")
      }

      setEditTag(null)
      await fetchTags()
      toast({
        title: "Tag Updated",
        description: "The tag has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating tag:", error)
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete tag")
      }
      setTags((prev) => prev.filter((tag) => tag._id !== tagId))
      toast({
        title: "Tag Deleted",
        description: "The tag has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogDescription>Add a new product tag.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Tag Name
                </label>
                <Input
                  id="name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="e.g., Best Seller"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input
                  id="slug"
                  value={newTag.slug}
                  onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                  placeholder="e.g., best-seller"
                />
                <p className="text-xs text-muted-foreground">Used in URLs: /products/tag/{newTag.slug || "example"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTag({ name: "", slug: "" })}>
                Cancel
              </Button>
              <Button onClick={handleAddTag}>Add Tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <div key={tag._id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                {tag.name}
              </Badge>
              <span className="text-xs text-muted-foreground">/{tag.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditTag(tag)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogDescription>Update the tag details.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-sm font-medium">
                        Tag Name
                      </label>
                      <Input
                        id="edit-name"
                        value={editTag?.name || ""}
                        onChange={(e) => setEditTag((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                        placeholder="Tag name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="edit-slug" className="text-sm font-medium">
                        Slug
                      </label>
                      <Input
                        id="edit-slug"
                        value={editTag?.slug || ""}
                        onChange={(e) => setEditTag((prev) => (prev ? { ...prev, slug: e.target.value } : prev))}
                        placeholder="tag-slug"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditTag(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateTag}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDeleteTag(tag._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {filteredTags.length === 0 && (
          <div className="text-sm text-muted-foreground">No tags found.</div>
        )}
      </div>
    </div>
  )
}
