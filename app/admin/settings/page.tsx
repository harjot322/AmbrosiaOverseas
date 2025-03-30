"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { TaxSettings } from "@/components/admin/tax-settings"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [settings, setSettings] = useState({
    siteName: "Ambrosia Overseas",
    siteDescription: "Premium imported food products from around the world",
    contactEmail: "ambrosiaoverseas.an@gmail.com",
    contactPhone: "+91 8287587442",
    address: "Ambrosia Overseas, 4420 Gali Bahu Ji, Sadar Bazar Delhi-110006",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    logo: "/logo.png",
    favicon: "/favicon.ico",
    enableRegistration: true,
    enableGuestCheckout: false,
    metaTags: "",
    analyticsCode: "",
    customCss: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings")
      const data = await response.json()

      if (data && Object.keys(data).length > 0) {
        // Ensure socialLinks exists
        if (!data.socialLinks) {
          data.socialLinks = {
            facebook: "",
            instagram: "",
            twitter: "",
          }
        }

        setSettings({
          ...settings,
          ...data,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value, }));
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value, }, }));
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked, }));
  }

  if (initialLoad) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" name="logo" value={settings.logo} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input id="favicon" name="favicon" value={settings.favicon} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableRegistration">Enable User Registration</Label>
                    <Switch
                      id="enableRegistration"
                      checked={settings.enableRegistration}
                      onCheckedChange={(checked) => handleSwitchChange("enableRegistration", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow users to register on your website.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your business contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={settings.address} onChange={handleChange} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={settings.socialLinks.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/yourbusiness"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <TaxSettings />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Additional settings for developers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTags">Meta Tags</Label>
                <Textarea
                  id="metaTags"
                  name="metaTags"
                  value={settings.metaTags}
                  onChange={handleChange}
                  rows={3}
                  placeholder="<meta name='description' content='Your description here'>"
                />
                <p className="text-xs text-muted-foreground">Add custom meta tags for SEO purposes.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analyticsCode">Analytics Code</Label>
                <Textarea
                  id="analyticsCode"
                  name="analyticsCode"
                  value={settings.analyticsCode}
                  onChange={handleChange}
                  rows={3}
                  placeholder="<!-- Google Analytics or other tracking code -->"
                />
                <p className="text-xs text-muted-foreground">Add tracking code for analytics services.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  name="customCss"
                  value={settings.customCss}
                  onChange={handleChange}
                  rows={5}
                  placeholder=".custom-class { color: #d4af37; }"
                />
                <p className="text-xs text-muted-foreground">Add custom CSS to override default styles.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

