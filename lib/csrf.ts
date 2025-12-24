export const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (!origin || !host) return false
  try {
    const originUrl = new URL(origin)
    return originUrl.host === host
  } catch {
    return false
  }
}
