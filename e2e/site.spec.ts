import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Shows every scroll-triggered section and waits for the entrances to settle. */
async function revealAll(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(async () => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    await Promise.all(document.getAnimations().map((animation) => animation.finished));
  });
}

async function expectNoSeriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
}

test("home page renders without client errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Building high-performance software",
  );
  expect(errors).toEqual([]);
});

test("a case study opens with its own URL and Back closes it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open case study: unPawse" }).click();

  const dialog = page.getByRole("dialog", { name: "unPawse" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/#project-unpawse$/);

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a shared case study link opens it, and Escape closes it", async ({ page }) => {
  await page.goto("/#project-dash-detective");
  const dialog = page.getByRole("dialog", { name: "DashDetective" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/");
});

test("the mobile menu closes with Back and links to sections", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The hamburger menu only shows on small screens.");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  const menu = page.getByRole("navigation", { name: "Mobile" });

  await toggle.click();
  await expect(menu).toBeVisible();
  await page.goBack();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL("/");

  await toggle.click();
  await menu.getByRole("link", { name: /Interests/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#interests$/);
});

test("the 404 page links back to the home page sections", async ({ page, isMobile }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");

  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: /Projects/ }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
  }
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator("#projects")).toBeAttached();
});

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    // Never reach the real route, which sends email.
    await page.route("**/api/contact**", (route) => route.fulfill({ json: { ok: true } }));
  });

  test("flags empty fields and focuses the first one", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText("Email is required.")).toBeVisible();
    await expect(page.getByText("Message is required.")).toBeVisible();
    await expect(page.getByLabel("Full Name")).toBeFocused();
  });

  test("sends a valid message", async ({ page }) => {
    const request = page.waitForRequest("**/api/contact**");
    await page.goto("/#contact");
    const form = page.locator("form.contact-form");
    await form.getByLabel("Full Name").fill("Test Visitor");
    await form.getByLabel("Email").fill("visitor@example.com");
    await form.getByLabel("Message").fill("Hello from the end-to-end tests.");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(form.getByRole("status")).toHaveText("Message sent! Thanks for reaching out.");
    await expect(form.getByLabel("Full Name")).toHaveValue("");
    expect((await request).postDataJSON()).toMatchObject({ name: "Test Visitor", bot_field: "" });
  });
});

test.describe("theme", () => {
  test.beforeEach(async ({ page }) => {
    // Records the theme at the moment <body> is parsed, before anything paints.
    await page.addInitScript(() => {
      new MutationObserver((_, observer) => {
        if (!document.body) return;
        (window as unknown as { themeAtFirstPaint?: string }).themeAtFirstPaint =
          document.documentElement.dataset.theme;
        observer.disconnect();
      }).observe(document, { childList: true, subtree: true });
    });
    await page.emulateMedia({ colorScheme: "dark" });
  });

  const themeAtFirstPaint = (page: Page) =>
    page.evaluate(() => (window as unknown as { themeAtFirstPaint?: string }).themeAtFirstPaint);

  test("is dark before first paint when the OS prefers dark", async ({ page }) => {
    await page.goto("/");
    expect(await themeAtFirstPaint(page)).toBe("dark");
  });

  test("the toggle switches it, and the choice survives a reload", async ({ page }) => {
    await page.goto("/");
    const root = page.locator("html");
    const toggle = page.getByRole("button", { name: "Dark mode" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(root).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await page.reload();
    expect(await themeAtFirstPaint(page)).toBe("light");
  });
});

test.describe("accessibility", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`home page has no serious violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");
      await revealAll(page);
      await expectNoSeriousViolations(page);
    });
  }

  test("an open case study has no serious violations", async ({ page }) => {
    await page.goto("/#project-unpawse");
    await expect(page.getByRole("dialog", { name: "unPawse" })).toBeVisible();
    await revealAll(page);
    await expectNoSeriousViolations(page);
  });

  test("the open mobile menu has no serious violations", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The hamburger menu only shows on small screens.");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    await revealAll(page);
    await expectNoSeriousViolations(page);
  });

  test("the 404 page and form errors have no serious violations", async ({ page }) => {
    await page.goto("/no-such-page");
    await expectNoSeriousViolations(page);

    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await revealAll(page);
    await expectNoSeriousViolations(page);
  });
});
