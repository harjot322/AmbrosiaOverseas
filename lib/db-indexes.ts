import clientPromise from "@/lib/mongodb"

const DB_NAME = "ambrosia"

let indexesPromise: Promise<void> | null = null

export const ensureDbIndexes = () => {
  if (indexesPromise) return indexesPromise

  indexesPromise = (async () => {
    const client = await clientPromise
    const db = client.db(DB_NAME)

    const createIndexSafe = async (name: string, fn: () => Promise<unknown>) => {
      try {
        await fn()
      } catch (error) {
        console.warn(`Index creation skipped for ${name}:`, error)
      }
    }

    await Promise.all([
      createIndexSafe("settings.type", () => db.collection("settings").createIndex({ type: 1 }, { unique: true })),
      createIndexSafe("users.email", () => db.collection("users").createIndex({ email: 1 }, { unique: true })),
      createIndexSafe("users.phone", () =>
        db.collection("users").createIndex(
          { phone: 1 },
          { unique: true, partialFilterExpression: { phone: { $exists: true, $type: "string", $gt: "" } } },
        ),
      ),
      createIndexSafe("categories.slug", () => db.collection("categories").createIndex({ slug: 1 }, { unique: true })),
      createIndexSafe("tags.slug", () => db.collection("tags").createIndex({ slug: 1 }, { unique: true })),
      createIndexSafe("origins.slug", () => db.collection("origins").createIndex({ slug: 1 }, { unique: true })),
      createIndexSafe("products.category", () => db.collection("products").createIndex({ category: 1 })),
      createIndexSafe("products.subcategory", () => db.collection("products").createIndex({ subcategory: 1 })),
      createIndexSafe("products.origin", () => db.collection("products").createIndex({ origin: 1 })),
      createIndexSafe("products.tags", () => db.collection("products").createIndex({ tags: 1 })),
      createIndexSafe("products.featured_createdAt", () =>
        db.collection("products").createIndex({ featured: -1, createdAt: -1 }),
      ),
      createIndexSafe("products.createdAt", () => db.collection("products").createIndex({ createdAt: -1 })),
      createIndexSafe("products.price", () => db.collection("products").createIndex({ price: 1 })),
      createIndexSafe("analytics.timestamp", () => db.collection("analytics").createIndex({ timestamp: -1 })),
      createIndexSafe("analytics.productId_timestamp", () =>
        db.collection("analytics").createIndex({ productId: 1, timestamp: -1 }),
      ),
      createIndexSafe("analytics.page_timestamp", () =>
        db.collection("analytics").createIndex({ page: 1, timestamp: -1 }),
      ),
    ])
  })()

  return indexesPromise
}
