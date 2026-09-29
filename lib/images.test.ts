import { describe, expect, it } from "vitest";
import { imageSrcSet, resizedImage } from "./images";

const ASSET = "https://us-west-2.graphassets.com/env123/handle456";

describe("resizedImage", () => {
  it("inserts a resize and WebP transform before the handle", () => {
    expect(resizedImage(ASSET, 800)).toBe(
      "https://us-west-2.graphassets.com/env123/resize=width:800,fit:max/output=format:webp/handle456",
    );
  });

  it("leaves other URLs untouched", () => {
    expect(resizedImage("https://example.com/a.png", 800)).toBe("https://example.com/a.png");
    const transformed = resizedImage(ASSET, 400);
    expect(resizedImage(transformed, 800)).toBe(transformed);
  });
});

describe("imageSrcSet", () => {
  it("lists one candidate per width", () => {
    expect(imageSrcSet(ASSET, [400, 800])).toBe(
      `${resizedImage(ASSET, 400)} 400w, ${resizedImage(ASSET, 800)} 800w`,
    );
  });

  it("is undefined for non-Hygraph URLs", () => {
    expect(imageSrcSet("https://example.com/a.png", [400])).toBeUndefined();
  });
});
