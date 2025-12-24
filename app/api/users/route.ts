import { NextResponse } from "next/server"
import { getUsers, createUser, getUserByPhone, getUserByEmail } from "@/lib/db-service"
import { hash } from "bcryptjs"
import { getSession, isAdmin } from "@/lib/auth"
import { isSameOrigin } from "@/lib/csrf"
import { logAdminAction } from "@/lib/audit"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await getUsers()

    // Remove password from response
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return { ...userWithoutPassword, _id: user._id.toString() }
    })

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 })
    }

    const body = await request.json()
    delete body._id
    const normalizedEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const normalizedPhone = typeof body.phone === "string" ? body.phone.trim() : ""

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    if (!body.password || typeof body.password !== "string" || body.password.length < 8 || body.password.length > 64) {
      return NextResponse.json({ error: "Password must be 8-64 characters long" }, { status: 400 })
    }
    const existingEmail = await getUserByEmail(normalizedEmail)
    if (existingEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }
    if (normalizedPhone) {
      const existingPhone = await getUserByPhone(normalizedPhone)
      if (existingPhone) {
        return NextResponse.json({ error: "User with this phone already exists" }, { status: 409 })
      }
    }

    // Hash password
    const hashedPassword = await hash(body.password, 10)

    const userData = {
      ...body,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: body.role || "user",
    }

    const result = await createUser(userData)
    await logAdminAction({
      session,
      request,
      action: "create",
      resource: "user",
      resourceId: String(result.insertedId),
    })

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
