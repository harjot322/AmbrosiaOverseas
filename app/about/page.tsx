import Image from "next/image"
import Link from "next/link"
import { Globe, Award, TrendingUp, Star } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 bg-black text-white">
          <Image
            src="/Classic.png?height=400&width=1920"
            alt="About Ambrosia Overseas"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              About <span className="gold-text">Ambrosia Overseas</span>
            </h1>
            <p className="max-w-2xl text-gray-300">Bringing the finest imported food products to India since 2015.</p>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/AmbrosiaOverseas.png?height=800&width=800" alt="Our Story" fill className="object-cover" />
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  Our <span className="gold-text">Story</span>
                </h2>
                <p className="text-muted-foreground">
                Ambrosia Overseas was founded in 2024 with a simple mission: to bring the finest imported food products from around the world to Indian consumers. What started as a small passion project has now grown into one of India's leading retailers of gourmet and specialty food items.
                </p>
                <p className="text-muted-foreground">
                  Our founder, Ayansh Jaiswal, traveled extensively and was always fascinated by the diverse flavors and
                  food products available globally. He noticed a gap in the Indian market for authentic, high-quality
                  imported foods and decided to bridge this gap by establishing Ambrosia Overseas.
                </p>
                <p className="text-muted-foreground">
                  Today, we source products from over 20 countries, working directly with manufacturers and suppliers to
                  ensure that only the best products reach our customers. Our extensive range includes beverages,
                  snacks, cookies, breakfast cereals, protein bars, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-black text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Our <span className="gold-text">Mission</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              "To introduce Indian consumers to the finest global flavors and food products, curated with passion and
              delivered with excellence."
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
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
                  className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-16 bg-gradient-to-b from-background to-black text-white">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Our <span className="gold-text">Process</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                How we bring the finest imported products to our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((step, index) => (
                <div key={index} className="relative p-6 rounded-lg border border-primary/20 bg-card/10">
                  <div className="absolute -top-5 -left-5 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 mt-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black">
          <div className="container px-4">
            <div className="bg-gradient-to-r from-black via-card to-black p-8 md:p-12 rounded-xl border border-primary/20 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
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
      </div>

      <Footer />
    </main>
  )
}

