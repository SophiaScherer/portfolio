type RateLimitOptions = {
  limit: number;
  windowMs: number;
  /** Upper bound on tracked keys; the oldest are evicted first. */
  maxKeys?: number;
};

export type RateLimiter = {
  /** Records a hit and returns true, or returns false when the key is at its limit. */
  take: (key: string, now?: number) => boolean;
  /** Removes the key's latest hit, for when the action it guarded failed. */
  refund: (key: string) => void;
};

/**
 * Sliding-window limiter.
 * Best effort only: serverless instances don't share memory, so each one counts separately.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
}: RateLimitOptions): RateLimiter {
  const hits = new Map<string, number[]>();
  let lastSweep = 0;

  const take = (key: string, now = Date.now()): boolean => {
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

  const refund = (key: string): void => {
    const times = hits.get(key);
    times?.pop();
    if (times?.length === 0) hits.delete(key);
  };

  return { take, refund };
}
