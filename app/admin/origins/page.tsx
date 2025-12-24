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
import type { Origin } from "@/types/types"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export default function OriginsPage() {
  const { toast } = useToast()
  const [origins, setOrigins] = useState<Origin[]>([])
  const [newOrigin, setNewOrigin] = useState({ name: "", slug: "" })
  const [editOrigin, setEditOrigin] = useState<Origin | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchOrigins = useCallback(async () => {
    try {
      const response = await fetch("/api/origins")
      const data = await response.json()
      setOrigins(data)
    } catch (error) {
      console.error("Error fetching origins:", error)
      toast({
        title: "Error",
        description: "Failed to fetch origins",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchOrigins()
  }, [fetchOrigins])

  const filteredOrigins = origins.filter(
    (origin) =>
      origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddOrigin = async () => {
    if (!newOrigin.name) {
      toast({
        title: "Error",
        description: "Country name is required.",
        variant: "destructive",
      })
      return
    }

    const slug = newOrigin.slug.trim() || slugify(newOrigin.name)

    try {
      const response = await fetch("/api/origins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newOrigin.name, slug }),
      })

      if (!response.ok) {
        throw new Error("Failed to create origin")
      }

      setNewOrigin({ name: "", slug: "" })
      await fetchOrigins()
      toast({
        title: "Origin Added",
        description: "The country has been added successfully.",
      })
    } catch (error) {
      console.error("Error creating origin:", error)
      toast({
        title: "Error",
        description: "Failed to create origin",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrigin = async () => {
    if (!editOrigin) return

    try {
      const response = await fetch(`/api/origins/${editOrigin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editOrigin.name, slug: editOrigin.slug }),
      })

      if (!response.ok) {
        throw new Error("Failed to update origin")
      }

      setEditOrigin(null)
      await fetchOrigins()
      toast({
        title: "Origin Updated",
        description: "The country has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating origin:", error)
      toast({
        title: "Error",
        description: "Failed to update origin",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrigin = async (originId: string) => {
    try {
      const response = await fetch(`/api/origins/${originId}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete origin")
      }
      setOrigins((prev) => prev.filter((origin) => origin._id !== originId))
      toast({
        title: "Origin Deleted",
        description: "The country has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting origin:", error)
      toast({
        title: "Error",
        description: "Failed to delete origin",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Origins</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Country</DialogTitle>
              <DialogDescription>Add a new country of origin.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Country Name
                </label>
                <Input
                  id="name"
                  value={newOrigin.name}
                  onChange={(e) => setNewOrigin({ ...newOrigin, name: e.target.value })}
                  placeholder="e.g., USA"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input
                  id="slug"
                  value={newOrigin.slug}
                  onChange={(e) => setNewOrigin({ ...newOrigin, slug: e.target.value })}
                  placeholder="e.g., usa"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOrigin({ name: "", slug: "" })}>
                Cancel
              </Button>
              <Button onClick={handleAddOrigin}>Add Country</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search origins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrigins.map((origin) => (
          <div key={origin._id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                {origin.name}
              </Badge>
              <span className="text-xs text-muted-foreground">/{origin.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditOrigin(origin)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Country</DialogTitle>
                    <DialogDescription>Update the country details.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-sm font-medium">
                        Country Name
                      </label>
                      <Input
                        id="edit-name"
                        value={editOrigin?.name || ""}
                        onChange={(e) =>
                          setEditOrigin((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                        }
                        placeholder="e.g., Canada"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="edit-slug" className="text-sm font-medium">
                        Slug
                      </label>
                      <Input
                        id="edit-slug"
                        value={editOrigin?.slug || ""}
                        onChange={(e) =>
                          setEditOrigin((prev) => (prev ? { ...prev, slug: e.target.value } : prev))
                        }
                        placeholder="e.g., canada"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditOrigin(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateOrigin}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteOrigin(origin._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
