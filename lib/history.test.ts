import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const back = vi.fn();

beforeEach(() => {
  vi.resetModules();
  back.mockReset();
  const events = new EventTarget();
  vi.stubGlobal("window", {
    history: { state: { overlay: "menu" }, back },
    addEventListener: events.addEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("currentOverlay", () => {
  it("reads the overlay key from history state", async () => {
    const { currentOverlay } = await import("./history");
    expect(currentOverlay()).toBe("menu");
  });
});

describe("historyBack", () => {
  it("ignores repeat calls until popstate arrives", async () => {
    const { historyBack } = await import("./history");
    historyBack();
    historyBack();
    expect(back).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("popstate"));
    historyBack();
    expect(back).toHaveBeenCalledTimes(2);
  });
});
