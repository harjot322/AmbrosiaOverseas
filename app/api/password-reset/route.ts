import { NextResponse } from "next/server"
import { randomBytes, createHash } from "crypto"
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

const sendWithResend = async (to: string, subject: string, text: string, html: string) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    return false
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
    }),
  })

  return response.ok
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

    const subject = "Reset your Ambrosia Overseas password"
    const text = `Reset your password: ${resetUrl}`
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b0b0b;color:#f5f5f5;-webkit-text-fill-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0b0b" background="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='%230b0b0b'/></svg>" style="background-color:#0b0b0b;background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='%230b0b0b'/></svg>&quot;);">
      <tr>
        <td align="center" bgcolor="#0b0b0b" style="padding:32px 16px;background-color:#0b0b0b;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" background="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='%23121212'/></svg>" style="max-width:600px;background:#121212;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='%23121212'/></svg>&quot;);">
            <tr>
              <td style="padding:24px 28px;background:linear-gradient(120deg,#1a1a1a,#111);">
                <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d4af37;">Ambrosia Overseas</p>
                <h1 style="margin:12px 0 0;font-size:24px;color:#ffffff;">Reset your password</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d1d1;">
                  We received a request to reset your password. Click the button below to choose a new one.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;">
                  <tr>
                    <td align="center" bgcolor="#d4af37" style="border-radius:10px;">
                      <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;color:#111;text-decoration:none;font-weight:600;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#b5b5b5;">
                  If the button doesn&apos;t work, copy and paste this link into your browser:
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9f9f9f;word-break:break-all;">
                  ${resetUrl}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #2a2a2a;color:#8c8c8c;font-size:11px;">
                If you didn&apos;t request this, you can safely ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

    const sent = await sendWithResend(normalizedEmail, subject, text, html)
    if (!sent) {
      console.warn("Password reset email not sent: Resend is not configured.")
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
