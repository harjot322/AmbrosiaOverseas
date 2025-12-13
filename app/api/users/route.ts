import { NextResponse } from "next/server"
import { getUsers, createUser } from "@/lib/db-service"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    const users = await getUsers()

    // Remove password from response
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return {
        ...userWithoutPassword,
        _id: user._id.toString(),
      }
    })

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Hash password
    const hashedPassword = await hash(body.password, 10)

    const userData = {
      ...body,
      password: hashedPassword,
      role: body.role || "user",
    }

    const result = await createUser(userData)

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

