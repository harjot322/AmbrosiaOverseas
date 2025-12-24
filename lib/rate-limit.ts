type RateLimitRecord = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

export const rateLimit = (key: string, max: number, windowMs: number) => {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (record.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }

  record.count += 1
  rateLimitStore.set(key, record)
  return { allowed: true, retryAfter: 0 }
}

export const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for") || ""
  const ip = forwardedFor.split(",")[0]?.trim()
  return ip || request.headers.get("x-real-ip") || "unknown"
}
