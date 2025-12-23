import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { Product, Category, Tag, User, Contact, Banner, Setting, Config, Analytics } from "@/types/types"

// Database and collection names
const DB_NAME = "ambrosia"
const COLLECTIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  TAGS: "tags",
  USERS: "users",
  CONTACT: "contact",
  BANNERS: "banners",
  SETTINGS: "settings",
  ANALYTICS: "analytics",
  CONFIG: "config",
}

// Get database instance
export async function getDb() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Products
export async function getProducts(
  filters = {},
  options: { sort?: Record<string, 1 | -1>; limit?: number; skip?: number } = {},
) {
  const db = await getDb()
  let query = db.collection(COLLECTIONS.PRODUCTS).find(filters)

  if (options.sort) {
    query = query.sort(options.sort)
  }
  if (typeof options.skip === "number") {
    query = query.skip(options.skip)
  }
  if (typeof options.limit === "number") {
    query = query.limit(options.limit)
  }

  return query.toArray()
}

export async function getProductById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getProductById:", error)
    return null
  }
}

export async function createProduct(productData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.PRODUCTS).insertOne({
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function updateProduct(id: string, productData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.PRODUCTS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error in updateProduct:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteProduct:", error)
    throw error
  }
}

// Categories
export async function getCategories() {
  const db = await getDb()
  return db.collection(COLLECTIONS.CATEGORIES).find().toArray()
}

export async function getCategoryById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getCategoryById:", error)
    return null
  }
}

export async function createCategory(categoryData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.CATEGORIES).insertOne({
    ...categoryData,
    createdAt: new Date(),
  })
  return result
}

export async function updateCategory(id: string, categoryData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.CATEGORIES).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...categoryData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error in updateCategory:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteCategory:", error)
    throw error
  }
}

// Tags
export async function getTags() {
  const db = await getDb()
  return db.collection(COLLECTIONS.TAGS).find().toArray()
}

export async function getTagById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.TAGS).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getTagById:", error)
    return null
  }
}

export async function createTag(tagData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.TAGS).insertOne({
    ...tagData,
    createdAt: new Date(),
  })
  return result
}

export async function updateTag(id: string, tagData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.TAGS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...tagData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error in updateTag:", error)
    throw error
  }
}

export async function deleteTag(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.TAGS).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteTag:", error)
    throw error
  }
}

// Users
export async function getUsers() {
  const db = await getDb()
  return db.collection(COLLECTIONS.USERS).find().toArray()
}

export async function getUserById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.USERS).findOne({ email })
}

export async function createUser(userData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.USERS).insertOne({
    ...userData,
    createdAt: new Date(),
  })
  return result
}

export async function updateUser(id: string, userData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...userData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error in updateUser:", error)
    throw error
  }
}

export async function deleteUser(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.USERS).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteUser:", error)
    throw error
  }
}

// Contact Messages
export async function getMessages() {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONTACT).find().sort({ createdAt: -1 }).toArray()
}

export async function getMessageById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CONTACT).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getMessageById:", error)
    return null
  }
}

export async function createMessage(messageData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.CONTACT).insertOne({
    ...messageData,
    read: false,
    createdAt: new Date(),
  })
  return result
}

export async function markMessageAsRead(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CONTACT).updateOne({ _id: new ObjectId(id) }, { $set: { read: true } })
  } catch (error) {
    console.error("Error in markMessageAsRead:", error)
    throw error
  }
}

export async function deleteMessage(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CONTACT).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteMessage:", error)
    throw error
  }
}

// Banners
export async function getBanners() {
  const db = await getDb()
  return db.collection(COLLECTIONS.BANNERS).find().toArray()
}

export async function getBannerById(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.BANNERS).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getBannerById:", error)
    return null
  }
}

export async function createBanner(bannerData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.BANNERS).insertOne({
    ...bannerData,
    createdAt: new Date(),
  })
  return result
}

export async function updateBanner(id: string, bannerData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.BANNERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...bannerData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error in updateBanner:", error)
    throw error
  }
}

export async function deleteBanner(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.BANNERS).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteBanner:", error)
    throw error
  }
}

// Settings
export async function getSettings() {
  const db = await getDb()
  const settings = await db.collection(COLLECTIONS.SETTINGS).findOne({ type: "general" })
  return settings || { type: "general" }
}

export async function updateSettings(settingsData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { type: "general" },
      {
        $set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )
    return result
  } catch (error) {
    console.error("Error in updateSettings:", error)
    throw error
  }
}

// Config
export async function getConfig(configType: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONFIG).findOne({ type: configType })
}

export async function updateConfig(configType: string, configData: any) {
  const db = await getDb()
  try {
    const result = await db.collection(COLLECTIONS.CONFIG).updateOne(
      { type: configType },
      {
        $set: {
          ...configData,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )
    return result
  } catch (error) {
    console.error("Error in updateConfig:", error)
    throw error
  }
}

// Analytics
export async function getAnalytics(period: string) {
  const db = await getDb()

  let dateFilter: { timestamp?: { $gte: Date } } = {}
  const now = new Date()

  if (period === "last_month") {
    const lastMonth = new Date(now)
    lastMonth.setMonth(now.getMonth() - 1)
    dateFilter = { timestamp: { $gte: lastMonth } }
  } else if (period === "last_3_months") {
    const last3Months = new Date(now)
    last3Months.setMonth(now.getMonth() - 3)
    dateFilter = { timestamp: { $gte: last3Months } }
  } else if (period === "last_6_months") {
    const last6Months = new Date(now)
    last6Months.setMonth(now.getMonth() - 6)
    dateFilter = { timestamp: { $gte: last6Months } }
  } else if (period === "last_year") {
    const lastYear = new Date(now)
    lastYear.setFullYear(now.getFullYear() - 1)
    dateFilter = { timestamp: { $gte: lastYear } }
  }

  // Get page views by date (grouped by month)
  const pageViewsByMonth = await db
    .collection(COLLECTIONS.ANALYTICS)
    .aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])
    .toArray()

  // Get page views by page
  const pageViewsByPage = await db
    .collection(COLLECTIONS.ANALYTICS)
    .aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])
    .toArray()

  // Get product views (only for product pages)
  const productViews = await db
    .collection(COLLECTIONS.ANALYTICS)
    .aggregate([
      {
        $match: {
          ...dateFilter,
          productId: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    .toArray()

  // Get product details for the top viewed products
  const productIds = productViews
    .map((item) => {
      try {
        return new ObjectId(item._id)
      } catch (error) {
        return null
      }
    })
    .filter((id) => id !== null)

  let topProducts: {
      _id: string
      name: string
      views: number
      price: number
      category: string
    }[] = []
  if (productIds.length > 0) {
    const products = await db
      .collection(COLLECTIONS.PRODUCTS)
      .find({ _id: { $in: productIds } })
      .toArray()

    // Map product details with view counts
    topProducts = productViews.map((view) => {
      const product = products.find((p) => p._id.toString() === view._id)
      return {
        _id: view._id,
        name: product ? product.name : "Unknown Product",
        views: view.count,
        price: product ? product.price : 0,
        category: product ? product.category : "Unknown",
      }
    })
  }

  return {
    pageViewsByMonth,
    pageViewsByPage,
    topProducts,
  }
}

// Get real-time stats
export async function getStats(period: string) {
  const db = await getDb()

  let dateFilter: { createdAt?: { $gte: Date } } = {}
  const now = new Date()

  if (period === "last_month") {
    const lastMonth = new Date(now)
    lastMonth.setMonth(now.getMonth() - 1)
    dateFilter = { createdAt: { $gte: lastMonth } }
  } else if (period === "last_3_months") {
    const last3Months = new Date(now)
    last3Months.setMonth(now.getMonth() - 3)
    dateFilter = { createdAt: { $gte: last3Months } }
  } else if (period === "last_6_months") {
    const last6Months = new Date(now)
    last6Months.setMonth(now.getMonth() - 6)
    dateFilter = { createdAt: { $gte: last6Months } }
  } else if (period === "last_year") {
    const lastYear = new Date(now)
    lastYear.setFullYear(now.getFullYear() - 1)
    dateFilter = { createdAt: { $gte: lastYear } }
  }

  // Get product count
  const productsCount = await db.collection(COLLECTIONS.PRODUCTS).countDocuments()
  const newProductsCount = await db.collection(COLLECTIONS.PRODUCTS).countDocuments(dateFilter)

  // Get user count
  const usersCount = await db.collection(COLLECTIONS.USERS).countDocuments()
  const newUsersCount = await db.collection(COLLECTIONS.USERS).countDocuments(dateFilter)

  // Get page views count
  const pageViewsCount = await db.collection(COLLECTIONS.ANALYTICS).countDocuments()
  const newPageViewsCount = await db.collection(COLLECTIONS.ANALYTICS).countDocuments({
    timestamp: dateFilter.createdAt,
  })

  // Calculate percentage changes
  const productChange = productsCount > 0 ? (newProductsCount / productsCount) * 100 : 0
  const userChange = usersCount > 0 ? (newUsersCount / usersCount) * 100 : 0
  const pageViewChange = pageViewsCount > 0 ? (newPageViewsCount / pageViewsCount) * 100 : 0

  return {
    products: {
      count: productsCount,
      change: Math.round(productChange),
    },
    users: {
      count: usersCount,
      change: Math.round(userChange),
    },
    pageViews: {
      count: pageViewsCount,
      change: Math.round(pageViewChange),
    },
    interactions: {
      count: Math.round(pageViewsCount * 0.4), // Estimate interactions as 40% of page views
      change: Math.round(pageViewChange * 1.2), // Slightly higher change rate for interactions
    },
  }
}
export async function getCategory(id: string) {
  const db = await getDb()
  try {
    return db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in getCategory:", error)
    return null
  }
}
export { ObjectId } from "mongodb"

export async function recordPageView(data: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.ANALYTICS).insertOne({
    ...data,
    timestamp: new Date(),
  })
  return result
}
