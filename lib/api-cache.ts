type CacheEntry = {
  value: unknown
  expiresAt: number
}

const cacheStore = new Map<string, CacheEntry>()

export const getCached = (key: string) => {
  const entry = cacheStore.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key)
    return null
  }
  return entry.value
}

export const setCached = (key: string, value: unknown, ttlMs = 30_000) => {
  cacheStore.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}

export const invalidateCacheByPrefix = (prefix: string) => {
  for (const key of cacheStore.keys()) {
    if (key.includes(prefix)) {
      cacheStore.delete(key)
    }
  }
}
