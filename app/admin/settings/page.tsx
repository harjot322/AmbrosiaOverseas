"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([])
  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")

  // Fetch current social media links
  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch("/api/settings")
      const result = await response.json()
      if (result?.data?.socialMedia) {
        setSocialLinks(result.data.socialMedia)
      }
    }
    fetchSettings()
  }, [])

  // Add a new social media link
  const handleAddLink = async () => {
    if (!newPlatform || !newUrl) {
      toast({ title: "Error", description: "Platform and URL are required.", variant: "destructive" })
      return
    }

    const updatedLinks = [...socialLinks, { platform: newPlatform, url: newUrl }]
    setSocialLinks(updatedLinks)
    setNewPlatform("")
    setNewUrl("")
    await updateSettings(updatedLinks)
  }

  // Delete a social media link
  const handleDeleteLink = async (platform: string) => {
    const updatedLinks = socialLinks.filter((link) => link.platform !== platform)
    setSocialLinks(updatedLinks)
    await updateSettings(updatedLinks)
  }

  // Update settings via API
  const updateSettings = async (links: { platform: string; url: string }[]) => {
    const response = await fetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ section: "socialMedia", data: links }),
    })

    if (response.ok) {
      toast({ title: "Success", description: "Social media links updated successfully." })
    } else {
      toast({ title: "Error", description: "Failed to update links.", variant: "destructive" })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Social Media Management */}
      <div>
        <h2 className="text-xl font-semibold">Social Media Links</h2>
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-4">
              <p className="w-32">{link.platform}</p>
              <Input value={link.url} readOnly />
              <Button variant="destructive" onClick={() => handleDeleteLink(link.platform)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Link */}
        <div className="mt-6 flex gap-4">
          <Input
            placeholder="Platform (e.g., Facebook)"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
          />
          <Input
            placeholder="URL (e.g., https://facebook.com/yourpage)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button onClick={handleAddLink}>
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>
      </div>
    </div>
  )
}
