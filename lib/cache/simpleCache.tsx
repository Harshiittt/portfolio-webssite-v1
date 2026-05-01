const cache = new Map<string, unknown>();
const timestamps = new Map<string, number>();

// ── Existing API (unchanged) ───────────────────────────────────────────────────

export function getCache(key: string) {
  return cache.get(key);
}

export function setCache(key: string, value: unknown) {
  cache.set(key, value);
  timestamps.set(key, Date.now()); // always stamp on set
}

// ── New helpers ────────────────────────────────────────────────────────────────

/** Returns how many ms ago the key was last set, or null if never set. */
export function getCacheAge(key: string): number | null {
  const ts = timestamps.get(key);
  return ts == null ? null : Date.now() - ts;
}

/** Returns true if the key doesn't exist or is older than maxAgeMs. */
export function isCacheStale(key: string, maxAgeMs: number): boolean {
  const age = getCacheAge(key);
  return age === null || age > maxAgeMs;
}

/** Returns the raw timestamp (epoch ms) the key was last set, or null. */
export function getCacheTimestamp(key: string): number | null {
  return timestamps.get(key) ?? null;
}

/** Removes a key from both cache and timestamp maps. */
export function clearCache(key: string): void {
  cache.delete(key);
  timestamps.delete(key);
}