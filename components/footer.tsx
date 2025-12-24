"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

import { Logo } from "@/components/logo"

type FooterSettings = {
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
  }
}

const defaultSettings: FooterSettings = {
  contactEmail: "ambrosiaoverseas.an@gmail.com",
  contactPhone: "+91 8287587442",
  address: "Ambrosia Overseas, 4420 Gali Bahu Ji, Sadar Bazar Delhi-110006",
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
}

let settingsCache: FooterSettings | null = null
let settingsPromise: Promise<FooterSettings | null> | null = null

const getFooterSettings = async (): Promise<FooterSettings | null> => {
  if (settingsCache) {
    return settingsCache
  }
  if (settingsPromise) {
    return settingsPromise
  }
  settingsPromise = (async () => {
    try {
      const response = await fetch("/api/settings")
      if (!response.ok) return null
      const data = await response.json()
      settingsCache = {
        contactEmail: data?.contactEmail || defaultSettings.contactEmail,
        contactPhone: data?.contactPhone || defaultSettings.contactPhone,
        address: data?.address || defaultSettings.address,
        socialLinks: {
          facebook: data?.socialLinks?.facebook || "",
          instagram: data?.socialLinks?.instagram || "",
          twitter: data?.socialLinks?.twitter || "",
        },
      }
      return settingsCache
    } catch (error) {
      console.error("Error fetching settings:", error)
      return null
    } finally {
      settingsPromise = null
    }
  })()
  return settingsPromise
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings)

  useEffect(() => {
    let mounted = true
    const fetchSettings = async () => {
      const data = await getFooterSettings()
      if (data && mounted) {
        setSettings(data)
      }
    }
    fetchSettings()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Premium imported food products from around the world, bringing global flavors to your doorstep.
            </p>
            <div className="flex space-x-4">
              {settings.socialLinks.facebook && (
                <Link
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
              {settings.socialLinks.instagram && (
                <Link
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              )}
              {settings.socialLinks.twitter && (
                <Link
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=beverages"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Beverages
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=snacks"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookies & Muffins
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cereals"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Breakfast Cereals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=exclusive"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ambrosia Overseas Exclusive
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Ambrosia Overseas. All rights reserved. Owned by Ayansh Jaiswal.</p>
        </div>
      </div>
    </footer>
  )
}
