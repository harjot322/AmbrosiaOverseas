"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8 || password.length > 64) {
      toast({
        title: "Invalid password",
        description: "Password must be 8-64 characters long.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    const token = Array.isArray(params?.token) ? params.token[0] : params?.token
    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "Please request a new password reset.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/password-reset/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.error || "Failed to reset password")
      }

      toast({
        title: "Password updated",
        description: "You can now log in with your new password.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Please try again.",
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
            <div className="max-w-md mx-auto bg-card border rounded-lg p-6 md:p-8 space-y-6 glass-panel">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold heading-premium">Reset Password</h1>
                <p className="text-muted-foreground mt-2 text-balance">Choose a new password for your account.</p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a new password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gold-gradient text-black font-semibold sheen-button" disabled={loading}>
                  {loading ? "Updating..." : "Update password"}
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
