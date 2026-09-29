type RateLimitOptions = {
  limit: number;
  windowMs: number;
  /** Upper bound on tracked keys; the oldest are evicted first. */
  maxKeys?: number;
};

/**
 * Sliding-window limiter. Returns true when the call is allowed.
 * Best effort only: serverless instances don't share memory, so each one counts separately.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: RateLimitOptions) {
  const hits = new Map<string, number[]>();
  let lastSweep = 0;

  return (key: string, now = Date.now()): boolean => {
    const cutoff = now - windowMs;

    if (now - lastSweep >= windowMs) {
      for (const [k, times] of hits) {
        if (times[times.length - 1] <= cutoff) hits.delete(k);
      }
      lastSweep = now;
    }

    const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }

    recent.push(now);
    // Re-inserting moves the key to the end, so eviction drops the least recently seen.
    hits.delete(key);
    hits.set(key, recent);
    while (hits.size > maxKeys) {
      const oldest = hits.keys().next().value;
      if (oldest === undefined) break;
      hits.delete(oldest);
    }
    return true;
  };
}
