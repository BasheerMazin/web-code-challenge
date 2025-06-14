type CacheEntry<T = unknown> = {
  data: T;
  timestamp: number;
};

const inMemoryCache = new Map<string, CacheEntry>();

const buildCacheKey = (key: string, params?: Record<string, unknown>) =>
  `${key}-${JSON.stringify(params ?? {})}`;

export const getCached = <T>(
  key: string,
  ttl: number,
  params?: Record<string, unknown>
): T | null => {
  const cacheKey = buildCacheKey(key, params);
  const now = Date.now();

  const memoryEntry = inMemoryCache.get(cacheKey);
  if (memoryEntry && now - memoryEntry.timestamp < ttl) {
    return memoryEntry.data as T;
  }

  const sessionRaw = sessionStorage.getItem(cacheKey);
  if (sessionRaw) {
    try {
      const sessionEntry: CacheEntry = JSON.parse(sessionRaw);
      if (now - sessionEntry.timestamp < ttl) {
        inMemoryCache.set(cacheKey, sessionEntry);
        return sessionEntry.data as T;
      } else {
        sessionStorage.removeItem(cacheKey);
      }
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }

  return null;
};

export const setCached = <T>(
  key: string,
  params: Record<string, unknown> | undefined,
  data: T
) => {
  const cacheKey = buildCacheKey(key, params);
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  inMemoryCache.set(cacheKey, entry);
  sessionStorage.setItem(cacheKey, JSON.stringify(entry));
};
