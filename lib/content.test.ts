import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProjectGalleryMap, getProjectImageMap, getResumeDownload } from "./content";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("./hygraph", () => ({ request }));

const asset = (fileName: string, url = `https://cdn.test/${fileName}`) => ({
  url,
  fileName,
  width: 100,
  height: 100,
});

type Asset = ReturnType<typeof asset>;

const respondWith = (images: Asset[], resumeFile: Asset | null = null) =>
  request.mockResolvedValue({ portfolios: [{ resumeFile, images }] });

beforeEach(() => {
  request.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getProjectImageMap", () => {
  it("keys images by file name and keeps the first duplicate", async () => {
    respondWith([asset("a.png", "u1"), asset("b.png", "u2"), asset("a.png", "u3")]);
    expect(await getProjectImageMap()).toEqual({ "a.png": "u1", "b.png": "u2" });
  });

  it("returns an empty map when the CMS request fails", async () => {
    request.mockRejectedValue(new Error("down"));
    expect(await getProjectImageMap()).toEqual({});
  });
});

describe("getProjectGalleryMap", () => {
  it("groups by lowercased project id and sorts numerically", async () => {
    respondWith([
      asset("Dash-Detective-gallery-10.png", "u10"),
      asset("dash-detective-gallery-2.png", "u2"),
      asset("unpawse-gallery-1.jpg", "p1"),
      asset("unrelated.png"),
    ]);
    const map = await getProjectGalleryMap();
    expect(Object.keys(map).sort()).toEqual(["dash-detective", "unpawse"]);
    expect(map["dash-detective"].map((i) => i.url)).toEqual(["u2", "u10"]);
  });

  it("keeps the first asset when two share an index", async () => {
    respondWith([asset("x-gallery-1.png", "first"), asset("x-gallery-1.jpg", "second")]);
    expect((await getProjectGalleryMap()).x.map((i) => i.url)).toEqual(["first"]);
  });
});

describe("getResumeDownload", () => {
  it("returns null when no resume is published", async () => {
    respondWith([]);
    expect(await getResumeDownload()).toBeNull();
  });

  it("returns the resume url and file name", async () => {
    respondWith([], asset("resume.pdf", "r"));
    expect(await getResumeDownload()).toEqual({ url: "r", fileName: "resume.pdf" });
  });
});
