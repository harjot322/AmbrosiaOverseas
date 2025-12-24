import { NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser, getUserByPhone } from "@/lib/db-service"
import { hash } from "bcryptjs"
import { getSession, isAdmin, isSameUser } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session || (!isAdmin(session) && !isSameUser(session, id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ ...userWithoutPassword, _id: user._id.toString() })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { id } = await params

    if (!session || (!isAdmin(session) && !isSameUser(session, id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }

    const updateData: Record<string, unknown> = {}
    if (typeof body.name === "string") updateData.name = body.name
    if (typeof body.phone === "string") updateData.phone = body.phone
    if (body.password) {
      updateData.password = await hash(body.password, 10)
    }
    if (isAdmin(session) && typeof body.role === "string") {
      updateData.role = body.role
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 })
    }

    if (updateData.phone) {
      const digitsOnly = String(updateData.phone).replace(/\D/g, "")
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return NextResponse.json({ error: "Phone number must be 10-15 digits" }, { status: 400 })
      }
      const existingPhone = await getUserByPhone(String(updateData.phone))
      if (existingPhone && existingPhone._id.toString() !== id) {
        return NextResponse.json({ error: "User with this phone already exists" }, { status: 409 })
      }
    }

    const result = await updateUser(id, updateData)
    if (isAdmin(session)) {
      await logAdminAction({
        session,
        request,
        action: "update",
        resource: "user",
        resourceId: id,
      })
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params
    if (!session || (!isAdmin(session) && !isSameUser(session, id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }
    const result = await deleteUser(id)
    if (isAdmin(session)) {
      await logAdminAction({
        session,
        request,
        action: "delete",
        resource: "user",
        resourceId: id,
      })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
