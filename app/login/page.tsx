"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginLoading(true);

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
    });

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } else {
      // Fetch the user session to get the role
      const session = await fetch("/api/auth/session").then((res) => res.json());

      if (session?.user?.role === "admin") {
        toast({
          title: "Welcome Admin",
          description: "Redirecting to admin dashboard...",
        });
        router.push("/admin");
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back to Ambrosia Overseas!",
        });
        router.push("/");
      }
    }
  } catch (error) {
    toast({
      title: "Login Failed",
      description: "An error occurred during login.",
      variant: "destructive",
    });
  } finally {
    setLoginLoading(false);
  }
};
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setRegisterLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      })

      // Auto login after registration
      await signIn("credentials", {
        redirect: false,
        email: registerData.email,
        password: registerData.password,
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-16">
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome to <span className="gold-text">Ambrosia Overseas</span>
                </h1>
                <p className="text-muted-foreground max-w-md">
                  Sign in to your account or create a new one to explore our premium imported food products.
                </p>
              </div>

              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg?height=800&width=800" alt="Login" fill className="object-cover" />
              </div>
            </div>

            <div className="lg:w-1/2 w-full max-w-md mx-auto lg:max-w-none">
              <div className="bg-card border rounded-lg p-6 md:p-8">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="login-email" className="text-sm font-medium">
                          Email or Username
                        </label>
                        <Input
                          id="login-email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          placeholder="Your email or username"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="login-password" className="text-sm font-medium">
                            Password
                          </label>
                          <Link href="#" className="text-xs text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={handleLoginChange}
                            placeholder="Your password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full gold-gradient text-black font-semibold"
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Logging in...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Login
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="register-name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="register-name"
                          name="name"
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="register-email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          placeholder="Your email address"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="register-phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="register-phone"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          placeholder="Your phone number"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            placeholder="Create a password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="register-confirm-password" className="text-sm font-medium">
                          Confirm Password
                        </label>
                        <Input
                          id="register-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full gold-gradient text-black font-semibold"
                        disabled={registerLoading}
                      >
                        {registerLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Registering...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Register
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

