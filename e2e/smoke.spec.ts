import { test, expect } from "@playwright/test";

test("renders all sections without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Jhorlin De Armas" })).toBeVisible();
  for (const section of ["Highlights", "Experience", "Projects", "Skills"]) {
    await expect(page.getByRole("heading", { name: section, exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("serves the PDF download", async ({ page }) => {
  await page.goto("/");
  const response = await page.request.get("/JhorlinDeArmas-Resume-Full.pdf");
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("theme toggle flips the dark class", async ({ page }) => {
  await page.goto("/");
  const isDark = () => page.locator("html").evaluate((el) => el.classList.contains("dark"));
  const before = await isDark();
  await page.getByRole("button", { name: "Toggle theme" }).click();
  expect(await isDark()).toBe(!before);
});

test("serves the Word download", async ({ page }) => {
  await page.goto("/");
  const response = await page.request.get("/JhorlinDeArmas-Resume-Full.docx");
  expect(response.status()).toBe(200);
  // .docx is a ZIP — magic bytes "PK".
  expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
});

test("lite view keeps every role but trims bullets", async ({ page }) => {
  await page.goto("/");
  // A Full-only Skillfaber bullet is present on the full view...
  await expect(page.getByText(/Abstracted delivery into a channels layer/)).toBeVisible();
  await page.goto("/#/lite");
  await expect(page.getByRole("heading", { level: 1, name: "Jhorlin De Armas" })).toBeVisible();
  // ...the 20-year range is kept (oldest role still shows)...
  await expect(page.getByText("Highwinds Software")).toBeVisible();
  // ...but the trimmed bullet is gone.
  await expect(page.getByText(/Abstracted delivery into a channels layer/)).toHaveCount(0);
});

test("extended view renders React Flow diagrams", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/#/extended");
  await expect(page.getByText("The extended cut.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Architecture", exact: true })).toBeVisible();
  await expect(page.getByText("Skillfaber agent runtime")).toBeVisible();
  await expect(page.getByText("ChatAsync Lambda")).toBeVisible();
  expect(errors).toEqual([]);
});

test("tier transitions add and remove content without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  const channels = page.getByText(/Abstracted delivery into a channels layer/);
  const extended = page.getByText(/Built the whole suite solo in 19 months/);

  await page.goto("/#/lite");
  await expect(channels).toHaveCount(0); // trimmed in Lite

  await page.getByRole("link", { name: "Full", exact: true }).click();
  await expect(channels).toBeVisible(); // added stepping up to Full

  await page.getByRole("link", { name: "Extended", exact: true }).click();
  await expect(extended).toBeVisible(); // extended-only highlight

  await page.getByRole("link", { name: "Lite", exact: true }).click();
  await expect(extended).toHaveCount(0); // removed stepping back down
  await expect(channels).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("downloads follow the selected tier, and all versions are reachable", async ({ page }) => {
  const pdf = () => page.getByRole("link", { name: "PDF", exact: true });
  await page.goto("/#/lite");
  await expect(pdf()).toHaveAttribute("href", "/JhorlinDeArmas-Resume-Lite.pdf");
  await page.getByRole("link", { name: "Full", exact: true }).click();
  await expect(pdf()).toHaveAttribute("href", "/JhorlinDeArmas-Resume-Full.pdf");
  await page.getByRole("link", { name: "Extended", exact: true }).click();
  await expect(pdf()).toHaveAttribute("href", "/JhorlinDeArmas-Resume-Extended.pdf");

  // every variant is available from the disclosure
  await page.getByText("All versions").click();
  for (const f of ["Lite", "Full", "Extended"]) {
    for (const ext of ["pdf", "docx"]) {
      await expect(
        page.locator(`a[href="/JhorlinDeArmas-Resume-${f}.${ext}"]`).first()
      ).toBeVisible();
    }
  }
});

test("search finds results across tiers and jumps to them", async ({ page }) => {
  await page.goto("/#/lite");
  // Wait for hydration so the global key listener is attached.
  const trigger = page.getByRole("button", { name: /Search/i });
  await expect(trigger).toBeVisible();

  // Opens with the keyboard, from anywhere on the page.
  await page.keyboard.press("/");
  const box = page.getByPlaceholder(/Search every version/);
  await expect(box).toBeVisible();

  // "Okta" only appears in Full/Extended — from Lite it must still be findable
  // and labelled as living elsewhere.
  await box.fill("okta");
  const first = page.getByRole("dialog").getByRole("button").first();
  await expect(first).toContainText(/in Full/);

  // Opening it switches tier, scrolls to the entry and flashes it.
  await first.click();
  await expect(page).toHaveURL(/#\/($|extended)/); // Full's canonical hash is "#/"
  await expect(page.locator("[data-sid].search-flash")).toBeVisible();

  // A term present in every tier stays put.
  await page.goto("/#/lite");
  await expect(page.getByRole("button", { name: /Search/i })).toBeVisible();
  await page.keyboard.press("/");
  await page.getByPlaceholder(/Search every version/).fill("checkpoint");
  await page.getByRole("dialog").getByRole("button").first().click();
  await expect(page).toHaveURL(/#\/lite/);
});
