"use client"

import { useState, useEffect, useCallback } from "react"
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
    homeHeroTitle: "Your Gateway To Global Snacks & Sips",
    homeHeroSubtitle: "Discover exquisite flavors from around the world, curated for the most discerning palates.",
    homeHeroImage: "/AmbrosiaOverseas.png",
    homeCtaTitle: "Ready to Explore Premium Flavors?",
    homeCtaSubtitle: "Browse our extensive collection of imported food products and discover new flavors today.",
    homeCtaButtonText: "View All Products",
    homeCtaButtonLink: "/products",
    homeWhyChoose: [
      {
        title: "Premium Quality",
        description: "We source only the highest quality products from reputable international brands.",
      },
      {
        title: "Global Selection",
        description: "Explore flavors from around the world, all in one place.",
      },
      {
        title: "Exclusive Products",
        description: "Access to rare and exclusive imported products not found elsewhere.",
      },
      {
        title: "Curated Experience",
        description: "Each product is carefully selected to ensure exceptional taste and quality.",
      },
    ],
    contactHeroTitle: "Contact Us",
    contactHeroSubtitle: "We'd love to hear from you. Reach out to us with any questions or inquiries.",
    contactHeroImage: "/placeholder.svg?height=400&width=1920",
    mapLatitude: 28.658979,
    mapLongitude: 77.211914,
    aboutHeroTitle: "About Ambrosia Overseas",
    aboutHeroSubtitle: "Bringing the finest imported food products to India since 2015.",
    aboutHeroImage: "/Classic.png?height=400&width=1920",
    aboutStoryParagraphs: [
      "Ambrosia Overseas was founded in 2024 with a simple mission: to bring the finest imported food products from around the world to Indian consumers. What started as a small passion project has now grown into one of India's leading retailers of gourmet and specialty food items.",
      "Our founder, Ayansh Jaiswal, traveled extensively and was always fascinated by the diverse flavors and food products available globally. He noticed a gap in the Indian market for authentic, high-quality imported foods and decided to bridge this gap by establishing Ambrosia Overseas.",
      "Today, we source products from over 20 countries, working directly with manufacturers and suppliers to ensure that only the best products reach our customers. Our extensive range includes beverages, snacks, cookies, breakfast cereals, protein bars, and more.",
    ],
    aboutMission: "To introduce Indian consumers to the finest global flavors and food products, curated with passion and delivered with excellence.",
    aboutWhyChoose: [
      {
        title: "Premium Quality",
        description: "We source only the highest quality products from reputable international brands.",
      },
      {
        title: "Global Selection",
        description: "Explore flavors from around the world, all in one place.",
      },
      {
        title: "Exclusive Products",
        description: "Access to rare and exclusive imported products not found elsewhere.",
      },
      {
        title: "Curated Experience",
        description: "Each product is carefully selected to ensure exceptional taste and quality.",
      },
    ],
    aboutProcessSteps: [
      {
        number: "01",
        title: "Sourcing",
        description:
          "We carefully select products from reputable manufacturers around the world, focusing on quality, authenticity, and uniqueness.",
      },
      {
        number: "02",
        title: "Quality Control",
        description:
          "Each product undergoes rigorous quality checks to ensure it meets our high standards before being added to our inventory.",
      },
      {
        number: "03",
        title: "Showcase",
        description:
          "We showcase our premium products through our website and physical displays, providing detailed information about each item.",
      },
    ],
    aboutCtaTitle: "Ready to Explore Premium Flavors?",
    aboutCtaSubtitle: "Browse our extensive collection of imported food products and discover new flavors today.",
    aboutCtaButtonText: "View All Products",
    aboutCtaButtonLink: "/products",
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings")
      const data = await response.json()

      if (data && Object.keys(data).length > 0) {
        const normalizedData = {
          ...data,
          socialLinks: data.socialLinks ?? {
            facebook: "",
            instagram: "",
            twitter: "",
          },
        }

        setSettings((prev) => ({
          ...prev,
          ...normalizedData,
          homeWhyChoose: Array.isArray(normalizedData.homeWhyChoose)
            ? normalizedData.homeWhyChoose
            : prev.homeWhyChoose,
          aboutStoryParagraphs: Array.isArray(normalizedData.aboutStoryParagraphs)
            ? normalizedData.aboutStoryParagraphs
            : prev.aboutStoryParagraphs,
          aboutWhyChoose: Array.isArray(normalizedData.aboutWhyChoose)
            ? normalizedData.aboutWhyChoose
            : prev.aboutWhyChoose,
          aboutProcessSteps: Array.isArray(normalizedData.aboutProcessSteps)
            ? normalizedData.aboutProcessSteps
            : prev.aboutProcessSteps,
        }))
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
  }, [toast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

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

  const handleHomeWhyChooseChange = (index: number, field: "title" | "description", value: string) => {
    setSettings((prev) => {
      const updated = [...prev.homeWhyChoose]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, homeWhyChoose: updated }
    })
  }

  const handleAboutStoryChange = (index: number, value: string) => {
    setSettings((prev) => {
      const updated = [...prev.aboutStoryParagraphs]
      updated[index] = value
      return { ...prev, aboutStoryParagraphs: updated }
    })
  }

  const handleAboutWhyChooseChange = (index: number, field: "title" | "description", value: string) => {
    setSettings((prev) => {
      const updated = [...prev.aboutWhyChoose]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, aboutWhyChoose: updated }
    })
  }

  const handleAboutProcessChange = (index: number, field: "number" | "title" | "description", value: string) => {
    setSettings((prev) => {
      const updated = [...prev.aboutProcessSteps]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, aboutProcessSteps: updated }
    })
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
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
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

        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Page</CardTitle>
              <CardDescription>Hero, CTA, and feature highlights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="homeHeroTitle">Hero Title</Label>
                <Input id="homeHeroTitle" name="homeHeroTitle" value={settings.homeHeroTitle} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeHeroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="homeHeroSubtitle"
                  name="homeHeroSubtitle"
                  value={settings.homeHeroSubtitle}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeHeroImage">Hero Image URL</Label>
                <Input id="homeHeroImage" name="homeHeroImage" value={settings.homeHeroImage} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeCtaTitle">CTA Title</Label>
                <Input id="homeCtaTitle" name="homeCtaTitle" value={settings.homeCtaTitle} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeCtaSubtitle">CTA Subtitle</Label>
                <Textarea
                  id="homeCtaSubtitle"
                  name="homeCtaSubtitle"
                  value={settings.homeCtaSubtitle}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeCtaButtonText">CTA Button Text</Label>
                  <Input
                    id="homeCtaButtonText"
                    name="homeCtaButtonText"
                    value={settings.homeCtaButtonText}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeCtaButtonLink">CTA Button Link</Label>
                  <Input
                    id="homeCtaButtonLink"
                    name="homeCtaButtonLink"
                    value={settings.homeCtaButtonLink}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Why Choose Us</Label>
                  <p className="text-xs text-muted-foreground">Update the four highlight cards.</p>
                </div>
                {settings.homeWhyChoose.map((item, index) => (
                  <div key={`home-why-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`homeWhyTitle-${index}`}>Title</Label>
                      <Input
                        id={`homeWhyTitle-${index}`}
                        value={item.title}
                        onChange={(e) => handleHomeWhyChooseChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`homeWhyDescription-${index}`}>Description</Label>
                      <Textarea
                        id={`homeWhyDescription-${index}`}
                        value={item.description}
                        onChange={(e) => handleHomeWhyChooseChange(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Page</CardTitle>
              <CardDescription>Hero, story, and process content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aboutHeroTitle">Hero Title</Label>
                <Input id="aboutHeroTitle" name="aboutHeroTitle" value={settings.aboutHeroTitle} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutHeroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="aboutHeroSubtitle"
                  name="aboutHeroSubtitle"
                  value={settings.aboutHeroSubtitle}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutHeroImage">Hero Image URL</Label>
                <Input id="aboutHeroImage" name="aboutHeroImage" value={settings.aboutHeroImage} onChange={handleChange} />
              </div>

              <div className="space-y-4">
                <Label>Story Paragraphs</Label>
                {settings.aboutStoryParagraphs.map((paragraph, index) => (
                  <Textarea
                    key={`about-story-${index}`}
                    value={paragraph}
                    onChange={(e) => handleAboutStoryChange(index, e.target.value)}
                    rows={3}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutMission">Mission Statement</Label>
                <Textarea
                  id="aboutMission"
                  name="aboutMission"
                  value={settings.aboutMission}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Label>Why Choose Us</Label>
                {settings.aboutWhyChoose.map((item, index) => (
                  <div key={`about-why-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`aboutWhyTitle-${index}`}>Title</Label>
                      <Input
                        id={`aboutWhyTitle-${index}`}
                        value={item.title}
                        onChange={(e) => handleAboutWhyChooseChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`aboutWhyDescription-${index}`}>Description</Label>
                      <Textarea
                        id={`aboutWhyDescription-${index}`}
                        value={item.description}
                        onChange={(e) => handleAboutWhyChooseChange(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label>Process Steps</Label>
                {settings.aboutProcessSteps.map((step, index) => (
                  <div key={`about-process-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`aboutProcessNumber-${index}`}>Number</Label>
                      <Input
                        id={`aboutProcessNumber-${index}`}
                        value={step.number}
                        onChange={(e) => handleAboutProcessChange(index, "number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`aboutProcessTitle-${index}`}>Title</Label>
                      <Input
                        id={`aboutProcessTitle-${index}`}
                        value={step.title}
                        onChange={(e) => handleAboutProcessChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`aboutProcessDescription-${index}`}>Description</Label>
                      <Textarea
                        id={`aboutProcessDescription-${index}`}
                        value={step.description}
                        onChange={(e) => handleAboutProcessChange(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutCtaTitle">CTA Title</Label>
                <Input id="aboutCtaTitle" name="aboutCtaTitle" value={settings.aboutCtaTitle} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutCtaSubtitle">CTA Subtitle</Label>
                <Textarea
                  id="aboutCtaSubtitle"
                  name="aboutCtaSubtitle"
                  value={settings.aboutCtaSubtitle}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutCtaButtonText">CTA Button Text</Label>
                  <Input
                    id="aboutCtaButtonText"
                    name="aboutCtaButtonText"
                    value={settings.aboutCtaButtonText}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutCtaButtonLink">CTA Button Link</Label>
                  <Input
                    id="aboutCtaButtonLink"
                    name="aboutCtaButtonLink"
                    value={settings.aboutCtaButtonLink}
                    onChange={handleChange}
                  />
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

              <div className="space-y-2">
                <Label htmlFor="contactHeroTitle">Contact Hero Title</Label>
                <Input
                  id="contactHeroTitle"
                  name="contactHeroTitle"
                  value={settings.contactHeroTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactHeroSubtitle">Contact Hero Subtitle</Label>
                <Textarea
                  id="contactHeroSubtitle"
                  name="contactHeroSubtitle"
                  value={settings.contactHeroSubtitle}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactHeroImage">Contact Hero Image URL</Label>
                <Input
                  id="contactHeroImage"
                  name="contactHeroImage"
                  value={settings.contactHeroImage}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mapLatitude">Map Latitude</Label>
                  <Input
                    id="mapLatitude"
                    name="mapLatitude"
                    value={settings.mapLatitude}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapLongitude">Map Longitude</Label>
                  <Input
                    id="mapLongitude"
                    name="mapLongitude"
                    value={settings.mapLongitude}
                    onChange={handleChange}
                  />
                </div>
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
