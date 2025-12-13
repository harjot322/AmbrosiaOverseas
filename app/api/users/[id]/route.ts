import { NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/lib/db-service"
import { hash } from "bcryptjs"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password, ...sanitizedUser } = user
    return NextResponse.json({ ...sanitizedUser, _id: user._id.toString() })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const existingUser = await getUserById(params.id)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()

    const updatedUser = {
      ...existingUser,
      ...body,
    }

    if (body.password) {
      updatedUser.password = await hash(body.password, 10)
    }

    const result = await updateUser(params.id, updatedUser)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteUser(params.id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
