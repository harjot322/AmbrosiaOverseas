"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingBag } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Energy Drink",
      image: "/placeholder.svg?height=200&width=200",
      price: 350,
      quantity: 2,
      origin: "USA",
    },
    {
      id: 3,
      name: "Spicy Cheese Snacks",
      image: "/placeholder.svg?height=200&width=200",
      price: 250,
      quantity: 1,
      origin: "Mexico",
    },
    {
      id: 5,
      name: "Exotic Fruit Juice",
      image: "/placeholder.svg?height=200&width=200",
      price: 280,
      quantity: 3,
      origin: "Thailand",
    },
  ])

  // Add GST calculation
  const [taxSettings, setTaxSettings] = useState({
    enableGST: true,
    gstRate: 18,
    pricesIncludeGST: false,
  })

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))

    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    })
  }

  const clearCart = () => {
    setCartItems([])

    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate GST and total
  const calculateGST = () => {
    if (!taxSettings.enableGST) return 0

    if (taxSettings.pricesIncludeGST) {
      // If prices include GST, calculate the GST component
      return subtotal - subtotal / (1 + taxSettings.gstRate / 100)
    } else {
      // If prices don't include GST, calculate the additional GST
      return subtotal * (taxSettings.gstRate / 100)
    }
  }

  const gstAmount = calculateGST()
  const total = taxSettings.pricesIncludeGST ? subtotal : subtotal + gstAmount

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </span>
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">Imported from {item.origin}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-card border rounded-lg p-6 sticky top-20">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  {/* Update the order summary section */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {taxSettings.enableGST && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          GST ({taxSettings.gstRate}%)
                          {taxSettings.pricesIncludeGST && " (included)"}
                        </span>
                        <span>₹{gstAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-destructive text-center p-3 border border-destructive/20 bg-destructive/5 rounded-md">
                      Please call Ambrosia Overseas to confirm your order.
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/products">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
              <Button asChild className="mt-4 gold-gradient text-black font-semibold">
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
