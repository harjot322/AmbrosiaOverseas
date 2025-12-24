"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Mail, Phone, MapPin, Send } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
// Import the OpenStreetMap component
import { OpenStreetMap } from "@/components/open-street-map"
const customMarkerIcon = "/custom-marker.png"
export default function ContactPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    contactEmail: "ambrosiaoverseas.an@gmail.com",
    contactPhone: "+91 8287587442",
    address: "Ambrosia Overseas, 4420 Gali Bahu Ji, Sadar Bazar Delhi-110006",
    contactHeroTitle: "Contact Us",
    contactHeroSubtitle: "We'd love to hear from you. Reach out to us with any questions or inquiries.",
    contactHeroImage: "/placeholder.svg?height=400&width=1920",
    mapLatitude: 28.658979,
    mapLongitude: 77.211914,
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const mapLatitude = Number(settings.mapLatitude) || 28.658979
  const mapLongitude = Number(settings.mapLongitude) || 77.211914

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/bootstrap?section=contact")
        if (!response.ok) return
        const data = await response.json()
        if (data?.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }))
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 bg-black text-white">
          <Image
            src={settings.contactHeroImage}
            alt="Contact Us"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {settings.contactHeroTitle.split(" ").length > 1 ? (
                <>
                  {settings.contactHeroTitle.split(" ")[0]}{" "}
                  <span className="gold-text">{settings.contactHeroTitle.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <span className="gold-text">{settings.contactHeroTitle}</span>
              )}
            </h1>
            <p className="max-w-2xl text-gray-300">{settings.contactHeroSubtitle}</p>
          </div>
        </div>

        {/* Contact Section */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Get in <span className="gold-text">Touch</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Have questions about our products or services? We&apos;re here to help. Contact us using any of the
                    methods below or fill out the form and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        {settings.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">{settings.contactPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">{settings.contactEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span>11:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday:</span>
                      <span>11:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card border rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <Select value={formData.subject} onValueChange={handleSelectChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="products">Product Information</SelectItem>
                          <SelectItem value="business">Business Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gold-gradient text-black font-semibold" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-black">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Our <span className="gold-text">Location</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Visit us at our location in Sadar Bazar, Delhi.</p>
            </div>

            <div className="rounded-lg overflow-hidden h-[400px] relative">
              <OpenStreetMap
                latitude={mapLatitude}
                longitude={mapLongitude}
                zoom={17}
                markerTitle={settings.address}
                customMarker={customMarkerIcon}
              />
            </div>

            <div className="text-center mt-4">
              <a
                href={`https://www.openstreetmap.org/?mlat=${mapLatitude}&mlon=${mapLongitude}#map=17/${mapLatitude}/${mapLongitude}&layers=N`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Larger Map
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
