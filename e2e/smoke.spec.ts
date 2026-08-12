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
  const response = await page.request.get("/JhorlinDeArmas-Resume.pdf");
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
