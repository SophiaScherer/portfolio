import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HygraphConfigError, request } from "./hygraph";

beforeEach(() => {
  vi.stubEnv("HYGRAPH_ENDPOINT", "https://hygraph.test/graphql");
  vi.stubEnv("HYGRAPH_TOKEN", "token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("request", () => {
  it("returns the data field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ data: { ok: 1 } }))),
    );
    expect(await request("{ a }")).toEqual({ ok: 1 });
  });

  it("times out even if fetch ignores its abort signal", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const pending = request("{ slow }");
    const assertion = expect(pending).rejects.toThrow(/timed out/);
    await vi.advanceTimersByTimeAsync(8_000);
    await assertion;
  });

  it("reports missing credentials as a config error", async () => {
    vi.stubEnv("HYGRAPH_TOKEN", "");
    await expect(request("{ b }")).rejects.toBeInstanceOf(HygraphConfigError);
  });
});
