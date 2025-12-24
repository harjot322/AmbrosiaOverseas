import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { getUserByPhone } from "@/lib/db-service"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`register:${ip}`, 10, 60 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { name, email, phone, password } = await request.json()
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
    const normalizedPhone = typeof phone === "string" ? phone.trim() : ""

    // Validate input
    if (!name || !normalizedEmail || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("ambrosia")
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }
    if (normalizedPhone) {
      const existingPhone = await getUserByPhone(normalizedPhone)
      if (existingPhone) {
        return NextResponse.json({ error: "User with this phone already exists" }, { status: 409 })
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await usersCollection.insertOne({
      name,
      email: normalizedEmail,
      phone: normalizedPhone || "",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
