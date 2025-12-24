import { NextResponse } from "next/server"
import {
  getBanners,
  getCategories,
  getOrigins,
  getProducts,
  getSettings,
  getTags,
} from "@/lib/db-service"
import { setCached } from "@/lib/api-cache"
import { ensureDbIndexes } from "@/lib/db-indexes"
import { getSession, isAdmin } from "@/lib/auth"
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

const warmBootstrap = async () => {
  const [settings, banners, featuredProducts, origins, categories, tags] = await Promise.all([
    getSettings(),
    getBanners(),
    getProducts({ featured: true }, { limit: 4, sort: { featured: -1, createdAt: -1 } }),
    getOrigins(),
    getCategories(),
    getTags(),
  ])

  const mappedSettings = { ...settings }
  delete mappedSettings._id
  delete mappedSettings.type

  setCached("/api/settings", mappedSettings, 60_000)
  setCached("/api/banners", mapBanners(banners), 30_000)
  setCached("/api/categories", categories, 30_000)
  setCached("/api/tags", tags, 30_000)
  setCached("/api/origins", origins, 30_000)

  setCached(
    "/api/bootstrap?section=home",
    {
      settings: mappedSettings,
      banners: mapBanners(banners),
      featuredProducts,
      origins,
    },
    30_000,
  )

  setCached(
    "/api/bootstrap?section=products",
    {
      categories,
      tags,
      origins,
      banners: mapBanners(banners),
    },
    30_000,
  )

  setCached("/api/bootstrap?section=login", { settings: mappedSettings }, 60_000)
  setCached("/api/bootstrap?section=contact", { settings: mappedSettings }, 60_000)
}

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureDbIndexes()
    await warmBootstrap()
    return NextResponse.json({ success: true, message: "Warmup complete" })
  } catch (error) {
    console.error("Warmup error:", error)
    return NextResponse.json({ error: "Warmup failed" }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
