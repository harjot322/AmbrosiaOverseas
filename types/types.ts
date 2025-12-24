// types/types.ts

export interface Banner {
    _id: string
    title: string
    subtitle?: string
    imageUrl: string
    linkUrl?: string
    position: "home_hero" | "home_featured" | "products_top" | "about_page" | "contact_page"
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
  }
export interface Category {
    _id: string
    name: string
    slug: string
    subcategories: Subcategory[]
  }
  
export interface Subcategory {
    id: number
    parentId: string
    name: string
    slug: string
  }
  
export interface Product {
    _id: string
    name: string
    description?: string
    longDescription?: string
    price?: number
    category?: string
    subcategory?: string
    origin?: string
    stock?: number
    active?: boolean
    featured?: boolean
    tags?: string[]
    image?: string
    images?: string[]
    nutritionalInfo?: {
      servingSize?: string
      calories?: string
      protein?: string
      carbs?: string
      sugar?: string
      fat?: string
    }
    ingredients?: string
    createdAt?: Date
    updatedAt?: Date
  }
  
export interface Tag {
    _id: string
    name: string
    slug: string
    createdAt?: Date
    updatedAt?: Date
  }

  export interface Origin {
    _id: string
    name: string
    slug: string
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface User {
    _id: string
    name: string
    email: string
    password: string
    role: "admin" | "user"
    phone?: string
    createdAt?: Date
    updatedAt?: Date
  }
  export interface Contact {
    _id: string
    name: string
    email: string
    message: string
    read: boolean
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface Banner {
    _id: string
    title: string
    subtitle?: string
    imageUrl: string
    linkUrl?: string
    position: "home_hero" | "home_featured" | "products_top" | "about_page" | "contact_page"
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface Setting {
    _id: string
    type: string
    value: string
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface Config {
    _id: string
    type: string
    value: string
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface Analytics {
    _id: string
    page: string
    productId: string
    timestamp: Date
    createdAt?: Date
    updatedAt?: Date
  }
