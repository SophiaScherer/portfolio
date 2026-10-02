import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Shows every scroll-triggered section and skips entrance animations. */
async function revealAll(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() =>
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible")),
  );
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
  await expect(page).not.toHaveURL(/#project-/);
});

test("a shared case study link opens it, and Escape closes it", async ({ page }) => {
  await page.goto("/#project-dash-detective");
  const dialog = page.getByRole("dialog", { name: "DashDetective" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/#project-/);
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
  test("flags empty fields and focuses the first one", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText("Email is required.")).toBeVisible();
    await expect(page.getByText("Message is required.")).toBeVisible();
    await expect(page.getByLabel("Full Name")).toBeFocused();
  });

  test("sends a valid message", async ({ page }) => {
    // Never reach the real route, which sends email.
    let body: Record<string, unknown> | null = null;
    await page.route("**/api/contact", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("/#contact");
    await page.getByLabel("Full Name").fill("Test Visitor");
    await page.getByLabel("Email").fill("visitor@example.com");
    await page.getByLabel("Message").fill("Hello from the end-to-end tests.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByRole("status")).toHaveText("Message sent! Thanks for reaching out.");
    await expect(page.getByLabel("Full Name")).toHaveValue("");
    expect(body).toMatchObject({ name: "Test Visitor", bot_field: "" });
  });
});

test("the theme follows the OS and the toggle switches it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-theme", "dark");

  const toggle = page.getByRole("button", { name: "Dark mode" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(root).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no serious accessibility violations (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await revealAll(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });
}
