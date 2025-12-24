"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type ProfileForm = {
  name: string
  email: string
  phone: string
}

export default function AccountSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [router, status])

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        setLoading(status !== "loading")
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/users/${session.user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setFormData({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Unable to load profile",
          description: "Please refresh and try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session?.user?.id, status, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      })
      return
    }

    const digitsOnly = formData.phone.replace(/\D/g, "")
    if (formData.phone && (digitsOnly.length < 10 || digitsOnly.length > 15)) {
      toast({
        title: "Invalid phone",
        description: "Phone number must be 10-15 digits.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      if (update) {
        await update({ name: formData.name.trim() })
      }

      toast({
        title: "Profile updated",
        description: "Your account settings have been saved.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Account Settings</h1>
                <p className="text-muted-foreground mt-2">
                  Update your profile details and manage your session.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={handleSave}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={loading ? "Loading..." : "Your name"}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={loading ? "Loading..." : "+91 00000 00000"}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={saving || loading}>
                        {saving ? "Saving..." : "Save changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Logout
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
