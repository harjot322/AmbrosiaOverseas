import { NextResponse } from "next/server"
import { randomBytes, createHash } from "crypto"
import nodemailer from "nodemailer"
import { getDb } from "@/lib/db-service"

const RESET_COLLECTION = "password_resets"
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 3
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const getRateLimitKey = (request: Request, email: string) => {
  const forwardedFor = request.headers.get("x-forwarded-for") || ""
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown"
  return `${ip}:${email}`
}

const createTransport = () => {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 0)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  })
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const rateKey = getRateLimitKey(request, normalizedEmail)
    const now = Date.now()
    const record = rateLimitStore.get(rateKey)
    if (record && record.resetAt > now && record.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }
    if (!record || record.resetAt <= now) {
      rateLimitStore.set(rateKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    } else {
      record.count += 1
      rateLimitStore.set(rateKey, record)
    }

    const db = await getDb()
    const usersCollection = db.collection("users")
    const resetsCollection = db.collection(RESET_COLLECTION)

    const user = await usersCollection.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link will be sent.",
      })
    }

    await resetsCollection.deleteMany({ userId: user._id })

    const token = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await resetsCollection.insertOne({
      userId: user._id,
      tokenHash,
      expiresAt,
      used: false,
      createdAt: new Date(),
    })

    const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password/${token}`

    const transport = createTransport()
    if (transport) {
      const from = process.env.EMAIL_FROM || process.env.SMTP_USER
      await transport.sendMail({
        from,
        to: normalizedEmail,
        subject: "Reset your Ambrosia Overseas password",
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Reset your password by clicking the link below:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      })
    } else {
      console.warn("Password reset email not sent: SMTP is not configured.")
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link will be sent.",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Failed to create reset request" }, { status: 500 })
  }
}
