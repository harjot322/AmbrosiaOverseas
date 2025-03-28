"use client"

import { useState } from "react"
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

// Sample tag data
const initialTags = [
  { id: 1, name: "Best Seller", slug: "best-seller" },
  { id: 2, name: "New Arrival", slug: "new-arrival" },
  { id: 3, name: "Limited Edition", slug: "limited-edition" },
  { id: 4, name: "Exclusive", slug: "exclusive" },
  { id: 5, name: "Only on Ambrosia", slug: "only-on-ambrosia" },
  { id: 6, name: "Imported from USA", slug: "imported-from-usa" },
  { id: 7, name: "Imported from Dubai", slug: "imported-from-dubai" },
  { id: 8, name: "Premium Quality", slug: "premium-quality" },
]

export default function TagsPage() {
  const { toast } = useToast()
  const [tags, setTags] = useState(initialTags)
  const [newTag, setNewTag] = useState({ name: "", slug: "" })
  const [editTag, setEditTag] = useState<{ id: number; name: string; slug: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTag = () => {
    if (!newTag.name || !newTag.slug) {
      toast({
        title: "Error",
        description: "Name and slug are required.",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...tags.map((t) => t.id)) + 1
    setTags((prev) => [
      ...prev,
      {
        id: newId,
        name: newTag.name,
        slug: newTag.slug,
      },
    ])

    setNewTag({ name: "", slug: "" })

    toast({
      title: "Tag Added",
      description: "The tag has been added successfully.",
    })
  }

  const handleUpdateTag = () => {
    if (!editTag) return

    setTags((prev) =>
      prev.map((tag) => (tag.id === editTag.id ? { ...tag, name: editTag.name, slug: editTag.slug } : tag)),
    )

    setEditTag(null)

    toast({
      title: "Tag Updated",
      description: "The tag has been updated successfully.",
    })
  }

  const handleDeleteTag = (tagId: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId))

    toast({
      title: "Tag Deleted",
      description: "The tag has been deleted successfully.",
    })
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
          <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                {tag.name}
              </Badge>
              <span className="text-xs text-muted-foreground">/{tag.slug}</span>
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
                        value={editTag?.name || tag.name}
                        onChange={(e) => setEditTag({ ...editTag!, name: e.target.value })}
                        placeholder="Tag name"
                        onFocus={() => setEditTag({ id: tag.id, name: tag.name, slug: tag.slug })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="edit-slug" className="text-sm font-medium">
                        Slug
                      </label>
                      <Input
                        id="edit-slug"
                        value={editTag?.slug || tag.slug}
                        onChange={(e) => setEditTag({ ...editTag!, slug: e.target.value })}
                        placeholder="tag-slug"
                        onFocus={() => setEditTag({ id: tag.id, name: tag.name, slug: tag.slug })}
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
                onClick={() => handleDeleteTag(tag.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

