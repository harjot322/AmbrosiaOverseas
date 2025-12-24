import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { hash } from "bcryptjs"
import { getDb } from "@/lib/db-service"

const RESET_COLLECTION = "password_resets"

export async function PUT(request: Request, { params }: { params: { token: string } }) {
  try {
    const { password } = await request.json()

    if (typeof password !== "string" || password.length < 8 || password.length > 64) {
      return NextResponse.json({ error: "Password must be 8-64 characters long" }, { status: 400 })
    }

    const tokenHash = createHash("sha256").update(params.token).digest("hex")
    const db = await getDb()
    const resetsCollection = db.collection(RESET_COLLECTION)
    const usersCollection = db.collection("users")

    const resetRecord = await resetsCollection.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!resetRecord) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    await usersCollection.updateOne(
      { _id: resetRecord.userId },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
    )

    await resetsCollection.updateOne(
      { _id: resetRecord._id },
      { $set: { used: true, usedAt: new Date() } },
    )

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
