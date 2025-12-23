"use client";
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, TrendingUp, Award, Globe } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Banner, Product } from "@/types/types"

const defaultWhyChoose = [
  {
    key: "premium",
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Premium Quality",
    description: "We source only the highest quality products from reputable international brands.",
  },
  {
    key: "global",
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Global Selection",
    description: "Explore flavors from around the world, all in one place.",
  },
  {
    key: "exclusive",
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
    title: "Exclusive Products",
    description: "Access to rare and exclusive imported products not found elsewhere.",
  },
  {
    key: "curated",
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Curated Experience",
    description: "Each product is carefully selected to ensure exceptional taste and quality.",
  },
]

export default function Home() {
  const [heroBanner, setHeroBanner] = useState<Banner | null>(null)
  const [featuredBanners, setFeaturedBanners] = useState<Banner[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [origins, setOrigins] = useState<string[]>([])
  const [settings, setSettings] = useState({
    homeHeroTitle: "Your Gateway To Global Snacks & Sips",
    homeHeroSubtitle: "Discover exquisite flavors from around the world, curated for the most discerning palates.",
    homeHeroImage: "/AmbrosiaOverseas.png",
    homeCtaTitle: "Ready to Explore Premium Flavors?",
    homeCtaSubtitle: "Browse our extensive collection of imported food products and discover new flavors today.",
    homeCtaButtonText: "View All Products",
    homeCtaButtonLink: "/products",
    homeWhyChoose: defaultWhyChoose.map(({ title, description }) => ({ title, description })),
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (!response.ok) return
        const data = await response.json()
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    const loadBanners = async () => {
      try {
        const response = await fetch("/api/banners")
        if (!response.ok) return
        const data = await response.json()
        const activeBanners = (data || []).filter((banner: Banner) => banner.isActive)
        setHeroBanner(activeBanners.find((banner: Banner) => banner.position === "home_hero") || null)
        setFeaturedBanners(activeBanners.filter((banner: Banner) => banner.position === "home_featured"))
      } catch (error) {
        console.error("Error loading banners:", error)
      }
    }

    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true&limit=4&sort=featured")
        if (!response.ok) return
        const data = await response.json()
        setFeaturedProducts(data)
      } catch (error) {
        console.error("Error loading featured products:", error)
      }
    }

    const loadOrigins = async () => {
      try {
        const response = await fetch("/api/products?distinct=origin")
        if (!response.ok) return
        const data = await response.json()
        setOrigins(data.filter(Boolean))
      } catch (error) {
        console.error("Error loading origins:", error)
      }
    }

    loadSettings()
    loadBanners()
    loadFeaturedProducts()
    loadOrigins()
  }, [])

  const heroTitle = heroBanner?.title || settings.homeHeroTitle
  const heroSubtitle = heroBanner?.subtitle || settings.homeHeroSubtitle
  const heroImage = heroBanner?.imageUrl || settings.homeHeroImage
  const heroLink = heroBanner?.linkUrl || settings.homeCtaButtonLink

  const whyChooseItems = Array.isArray(settings.homeWhyChoose) && settings.homeWhyChoose.length > 0
    ? settings.homeWhyChoose.map((item: { title: string; description: string }, index: number) => ({
        ...item,
        icon: defaultWhyChoose[index]?.icon || defaultWhyChoose[0].icon,
      }))
    : defaultWhyChoose

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Premium imported foods"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>

        <div className="container relative z-20 text-center space-y-6 px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="gold-text">{heroTitle}</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">{heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gold-gradient text-black font-semibold">
              <Link href={heroLink}>Explore Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-gold hover:bg-white/10">
              <Link href="/about">About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-black to-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gold-text">Explore</span> Our Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our extensive collection of premium imported food products from around the world.
            </p>
          </div>

          {featuredBanners.length === 0 ? (
            <div className="text-center text-muted-foreground">No featured categories configured yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBanners.map((category, index) => (
                <Link
                  href={category.linkUrl || "/products"}
                  key={category._id || index}
                  className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all duration-300 hover:shadow-lg hover:border-primary"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.imageUrl || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">{category.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-4">{category.subtitle}</p>
                    <div className="flex items-center text-primary font-medium">
                      <span>Explore Products</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gold-text">Featured</span> Products
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Our most popular premium imported products, handpicked for exceptional quality and taste.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center text-primary font-medium mt-4 md:mt-0">
              <span>View All Products</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center text-muted-foreground">No featured products yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product._id} className="product-card overflow-hidden border-border group">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      Imported from {product.origin || "Global"}
                    </div>
                    <Image
                      src={product.image || product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{product.category || "Uncategorized"}</span>
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{product.price ? `₹${product.price}` : "Price on request"}</span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Link href={`/products/${product._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-black text-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gold-text">Global</span> Flavors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We source our premium products from the finest producers across the globe.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {(origins.length > 0 ? origins : ["Global"]).map((country) => (
              <div
                key={country}
                className="flex flex-col items-center p-4 bg-card/10 rounded-lg hover:bg-card/20 transition-colors"
              >
                <Globe className="h-10 w-10 text-primary mb-3" />
                <span className="font-medium">{country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-background to-black text-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gold-text">Ambrosia Overseas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are committed to bringing you the finest imported food products with unmatched quality and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseItems.map((feature, index) => (
              <div
                key={feature.key || index}
                className="bg-card/10 p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container px-4">
          <div className="bg-gradient-to-r from-black via-card to-black p-8 md:p-12 rounded-xl border border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {settings.homeCtaTitle.split("Premium").length > 1 ? (
                <>
                  {settings.homeCtaTitle.split("Premium")[0]}<span className="gold-text">Premium</span>
                  {settings.homeCtaTitle.split("Premium")[1]}
                </>
              ) : (
                settings.homeCtaTitle
              )}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">{settings.homeCtaSubtitle}</p>
            <Button asChild size="lg" className="gold-gradient text-black font-semibold">
              <Link href={settings.homeCtaButtonLink}>{settings.homeCtaButtonText}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
