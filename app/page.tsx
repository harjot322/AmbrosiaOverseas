"use client";
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, TrendingUp, Award, Globe } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/AmbrosiaOverseas.png"
            alt="Premium imported foods"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>

        <div className="container relative z-20 text-center space-y-6 px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="gold-text">Your Gateway</span> To Global Snacks & Sips
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            Discover exquisite flavors from around the world, curated for the most discerning palates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gold-gradient text-black font-semibold">
              <Link href="/products">Explore Products</Link>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Beverages",
                image: "/Beverages.png?height=400&width=600",
                description: "Premium cold drinks, energy drinks, and coffees from around the world.",
                link: "/products?category=beverages",
              },
              {
                title: "Snacks",
                image: "/Snacks.png?height=400&width=600",
                description: "Delicious Cheetos, Takis, Dip'n'eat and more imported snacks.",
                link: "/products?category=snacks",
              },
              {
                title: "Cookies & Muffins",
                image: "/cookiesMuffins.png?height=400&width=600",
                description: "Indulge in gourmet cookies and muffins from premium international brands.",
                link: "/products?category=cookies",
              },
              {
                title: "Breakfast Cereals",
                image: "/Cereals.png?height=400&width=600",
                description: "Start your day with nutritious and delicious imported breakfast cereals.",
                link: "/products?category=cereals",
              },
              {
                title: "Protein Bars",
                image: "/Protein.png?height=400&width=600",
                description: "High-quality protein bars for fitness enthusiasts and health-conscious individuals.",
                link: "/products?category=protein",
              },
              {
                title: "Taco Shells",
                image: "/Taco.png?height=400&width=600",
                description: "Authentic taco shells imported directly from Mexico and the USA.",
                link: "/products?category=taco",
              },
            ].map((category, index) => (
              <Link
                href={category.link}
                key={index}
                className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all duration-300 hover:shadow-lg hover:border-primary"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">{category.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Explore Products</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Premium Energy Drink",
                image: "/placeholder.svg?height=400&width=400",
                origin: "USA",
                price: "₹350",
                category: "Beverages",
                rating: 5,
              },
              {
                name: "Gourmet Chocolate Cookies",
                image: "/placeholder.svg?height=400&width=400",
                origin: "Belgium",
                price: "₹450",
                category: "Cookies",
                rating: 4,
              },
              {
                name: "Spicy Cheese Snacks",
                image: "/placeholder.svg?height=400&width=400",
                origin: "Mexico",
                price: "₹250",
                category: "Snacks",
                rating: 5,
              },
              {
                name: "Protein Granola Bars",
                image: "/placeholder.svg?height=400&width=400",
                origin: "Australia",
                price: "₹550",
                category: "Protein",
                rating: 4,
              },
            ].map((product, index) => (
              <Card key={index} className="product-card overflow-hidden border-border group">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    Imported from {product.origin}
                  </div>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                    <div className="flex items-center">
                      {Array(product.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                        ))}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{product.price}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            {["USA", "UK", "Dubai", "Thailand", "Australia", "New Zealand"].map((country) => (
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
            {[
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Premium Quality",
                description: "We source only the highest quality products from reputable international brands.",
              },
              {
                icon: <Globe className="h-10 w-10 text-primary" />,
                title: "Global Selection",
                description: "Explore flavors from around the world, all in one place.",
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-primary" />,
                title: "Exclusive Products",
                description: "Access to rare and exclusive imported products not found elsewhere.",
              },
              {
                icon: <Star className="h-10 w-10 text-primary" />,
                title: "Curated Experience",
                description: "Each product is carefully selected to ensure exceptional taste and quality.",
              },
            ].map((feature, index) => (
              <div
                key={index}
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
              Ready to Explore <span className="gold-text">Premium Flavors?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Browse our extensive collection of imported food products and discover new flavors today.
            </p>
            <Button asChild size="lg" className="gold-gradient text-black font-semibold">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

