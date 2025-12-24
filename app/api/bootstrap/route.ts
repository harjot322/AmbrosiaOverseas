import { NextResponse } from "next/server"
import {
  getBanners,
  getCategories,
  getOrigins,
  getProducts,
  getSettings,
  getTags,
} from "@/lib/db-service"
import { getCached, setCached } from "@/lib/api-cache"
import { ensureDbIndexes } from "@/lib/db-indexes"
import type { Banner } from "@/types/types"

const mapBanners = (result: Banner[]) =>
  result.map((banner) => ({
    _id: banner._id.toString(),
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
    position: banner.position,
    isActive: banner.isActive,
  }))

export async function GET(request: Request) {
  try {
    void ensureDbIndexes()
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section") || "home"
    const cacheKey = `/api/bootstrap?section=${section}`
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    if (section === "home") {
      const [settings, banners, featuredProducts, origins] = await Promise.all([
        getSettings(),
        getBanners(),
        getProducts({ featured: { $in: [true, "true"] } }, { limit: 4, sort: { featured: -1, createdAt: -1 } }),
        getOrigins(),
      ])

      const mappedSettings = { ...settings }
      delete mappedSettings._id
      delete mappedSettings.type

      const payload = {
        settings: mappedSettings,
        banners: mapBanners(banners),
        featuredProducts,
        origins,
      }
      setCached(cacheKey, payload, 30_000)
      return NextResponse.json(payload)
    }

    if (section === "products") {
      const [categories, tags, origins, banners] = await Promise.all([
        getCategories(),
        getTags(),
        getOrigins(),
        getBanners(),
      ])

      const payload = {
        categories,
        tags,
        origins,
        banners: mapBanners(banners),
      }
      setCached(cacheKey, payload, 30_000)
      return NextResponse.json(payload)
    }

    if (section === "login" || section === "contact") {
      const [settings, banners] = await Promise.all([getSettings(), getBanners()])
      const mappedSettings = { ...settings }
      delete mappedSettings._id
      delete mappedSettings.type

      const payload = { settings: mappedSettings, banners: mapBanners(banners) }
      setCached(cacheKey, payload, 60_000)
      return NextResponse.json(payload)
    }

    return NextResponse.json({ error: "Unknown section" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching bootstrap data:", error)
    return NextResponse.json({ error: "Failed to fetch bootstrap data" }, { status: 500 })
  }
}
