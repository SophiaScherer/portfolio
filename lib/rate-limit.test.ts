import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const { take: allow } = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect([0, 10, 20, 30].map((t) => allow("a", t))).toEqual([true, true, true, false]);
  });

  it("tracks keys independently", () => {
    const { take: allow } = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("b", 0)).toBe(true);
    expect(allow("a", 1)).toBe(false);
  });

  it("slides the window rather than resetting it", () => {
    const { take: allow } = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 600)).toBe(true);
    expect(allow("a", 900)).toBe(false);
    // The first hit has expired, but the one at 600 still counts.
    expect(allow("a", 1001)).toBe(true);
    expect(allow("a", 1100)).toBe(false);
    expect(allow("a", 1601)).toBe(true);
  });

  it("does not count blocked attempts against the window", () => {
    const { take: allow } = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 500)).toBe(false);
    expect(allow("a", 999)).toBe(false);
    expect(allow("a", 1000)).toBe(true);
  });

  it("evicts the least recently seen key when over maxKeys", () => {
    const { take: allow } = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    allow("a", 0);
    allow("b", 1);
    allow("c", 2);
    // "a" was evicted, so it starts fresh; "c" is still tracked.
    expect(allow("a", 3)).toBe(true);
    expect(allow("c", 4)).toBe(false);
  });
});

describe("refund", () => {
  it("gives back the latest hit", () => {
    const { take, refund } = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(take("a", 0)).toBe(true);
    refund("a");
    expect(take("a", 1)).toBe(true);
    expect(take("a", 2)).toBe(false);
  });

  it("ignores unknown keys", () => {
    const { take, refund } = createRateLimiter({ limit: 1, windowMs: 1000 });
    refund("missing");
    expect(take("missing", 0)).toBe(true);
  });
});
