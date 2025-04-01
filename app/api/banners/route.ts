import { NextResponse } from "next/server"
import { Banner } from "@/types/types"
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/lib/db-service"

export async function GET() {
  try {
    const banners: Banner[] = await getBanners().then((result) =>
      result.map((banner) => ({
        _id: banner._id.toString(),
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        position: banner.position,
        isActive: banner.isActive,
      }))
    );
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: Banner = await request.json()

    // Validate input
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: "Title and image URL are required" }, { status: 400 })
    }

    const result = await createBanner(body)

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        bannerId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const result = await updateBanner(params.id, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
    })
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteBanner(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}