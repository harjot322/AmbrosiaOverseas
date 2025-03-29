import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

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
export async function getProducts(filters = {}) {
  const db = await getDb()
  return db.collection(COLLECTIONS.PRODUCTS).find(filters).toArray()
}

export async function getProductById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(id) })
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
}

export async function deleteProduct(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(id) })
}

// Categories
export async function getCategories() {
  const db = await getDb()
  return db.collection(COLLECTIONS.CATEGORIES).find().toArray()
}

export async function getCategoryById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: new ObjectId(id) })
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
  const result = await db
    .collection(COLLECTIONS.CATEGORIES)
    .updateOne({ _id: new ObjectId(id) }, { $set: categoryData })
  return result
}

export async function deleteCategory(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: new ObjectId(id) })
}

// Tags
export async function getTags() {
  const db = await getDb()
  return db.collection(COLLECTIONS.TAGS).find().toArray()
}

export async function getTagById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.TAGS).findOne({ _id: new ObjectId(id) })
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
  const result = await db.collection(COLLECTIONS.TAGS).updateOne({ _id: new ObjectId(id) }, { $set: tagData })
  return result
}

export async function deleteTag(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.TAGS).deleteOne({ _id: new ObjectId(id) })
}

// Users
export async function getUsers() {
  const db = await getDb()
  return db.collection(COLLECTIONS.USERS).find().toArray()
}

export async function getUserById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) })
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
  const result = await db.collection(COLLECTIONS.USERS).updateOne({ _id: new ObjectId(id) }, { $set: userData })
  return result
}

export async function deleteUser(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.USERS).deleteOne({ _id: new ObjectId(id) })
}

// Contact Messages
export async function getMessages() {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONTACT).find().sort({ createdAt: -1 }).toArray()
}

export async function getMessageById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONTACT).findOne({ _id: new ObjectId(id) })
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
  return db.collection(COLLECTIONS.CONTACT).updateOne({ _id: new ObjectId(id) }, { $set: { read: true } })
}

export async function deleteMessage(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONTACT).deleteOne({ _id: new ObjectId(id) })
}

// Banners
export async function getBanners() {
  const db = await getDb()
  return db.collection(COLLECTIONS.BANNERS).find().toArray()
}

export async function getBannerById(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.BANNERS).findOne({ _id: new ObjectId(id) })
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
  const result = await db.collection(COLLECTIONS.BANNERS).updateOne({ _id: new ObjectId(id) }, { $set: bannerData })
  return result
}

export async function deleteBanner(id: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.BANNERS).deleteOne({ _id: new ObjectId(id) })
}

// Settings
export async function getSettings() {
  const db = await getDb()
  const settings = await db.collection(COLLECTIONS.SETTINGS).findOne({ type: "general" })
  return settings || { type: "general" }
}

export async function updateSettings(settingsData: any) {
  const db = await getDb()
  const result = await db
    .collection(COLLECTIONS.SETTINGS)
    .updateOne({ type: "general" }, { $set: { ...settingsData, updatedAt: new Date() } }, { upsert: true })
  return result
}

// Config
export async function getConfig(configType: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.CONFIG).findOne({ type: configType })
}

export async function updateConfig(configType: string, configData: any) {
  const db = await getDb()
  const result = await db
    .collection(COLLECTIONS.CONFIG)
    .updateOne({ type: configType }, { $set: { ...configData, updatedAt: new Date() } }, { upsert: true })
  return result
}

// Analytics
export async function recordPageView(pageData: any) {
  const db = await getDb()
  return db.collection(COLLECTIONS.ANALYTICS).insertOne({
    ...pageData,
    timestamp: new Date(),
  })
}

export async function getAnalytics(period: string) {
  const db = await getDb()

  let dateFilter = {}
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

  // Get page views by date
  const pageViewsByDate = await db
    .collection(COLLECTIONS.ANALYTICS)
    .aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
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

  return {
    pageViewsByDate,
    pageViewsByPage,
  }
}

// Get real-time stats
export async function getStats(period: string) {
  const db = await getDb()

  let dateFilter = {}
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
  const newPageViewsCount = await db.collection(COLLECTIONS.ANALYTICS).countDocuments(dateFilter)

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

