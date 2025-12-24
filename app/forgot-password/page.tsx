"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!isValidEmail(normalizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      if (!response.ok) {
        throw new Error("Failed to create reset request")
      }

      toast({
        title: "Check your inbox",
        description: "If an account exists, a reset link has been sent.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Password reset request error:", error)
      toast({
        title: "Request failed",
        description: "Please try again in a moment.",
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
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-md mx-auto bg-card border rounded-lg p-6 md:p-8 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground mt-2">
                  Enter your email and we&apos;ll send you a password reset link.
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gold-gradient text-black font-semibold" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
