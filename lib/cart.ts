export type CartItem = {
  id: string
  name: string
  image?: string
  price: number
  quantity: number
  origin?: string
}

const STORAGE_KEY = "ambrosia_cart"
const CART_EVENT = "cart:updated"

const safeParse = (value: string | null) => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Failed to parse cart:", error)
    return []
  }
}

export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return []
  return safeParse(window.localStorage.getItem(STORAGE_KEY)) as CartItem[]
}

export const saveCartItems = (items: CartItem[]) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export const addToCart = (item: CartItem) => {
  const current = getCartItems()
  const existing = current.find((entry) => entry.id === item.id)
  const updated = existing
    ? current.map((entry) =>
        entry.id === item.id ? { ...entry, quantity: entry.quantity + item.quantity } : entry,
      )
    : [...current, item]
  saveCartItems(updated)
  return updated
}

export const updateCartItem = (id: string, quantity: number) => {
  const current = getCartItems()
  const updated = current.map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
  saveCartItems(updated)
  return updated
}

export const removeCartItem = (id: string) => {
  const current = getCartItems()
  const updated = current.filter((entry) => entry.id !== id)
  saveCartItems(updated)
  return updated
}

export const clearCartItems = () => {
  if (typeof window === "undefined") return []
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CART_EVENT))
  return []
}

export const getCartEventName = () => CART_EVENT
