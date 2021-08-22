import { expect, test } from "@playwright/test";
import React from "react";
import ReactDOM from "react-dom/server";
import { useTheme } from "../src/lib";

test.describe("is initialized with the system theme by default", () => {
  test("for light OSes", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("#current-theme")).toContainText("light");
  });

  test("for dark OSes", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("#current-theme")).toContainText("dark");
  });
});

test("is initialized with localStorage theme, if present", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.emulateMedia({ colorScheme: "light" });

  await page.reload();
  await expect(page.locator("#current-theme")).toContainText("dark");
});

test("can switch theme on demand", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.click("#theme-switch");
  await expect(page.locator("#current-theme")).toContainText("dark");
});

test("can persist manual theme changes across page reloads", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.click("#theme-switch");
  await expect(page.locator("#current-theme")).toContainText("dark");

  await page.reload();
  await expect(page.locator("#current-theme")).toContainText("dark");
});

test("can sync themes across tabs", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const otherPage = await context.newPage();
  await otherPage.emulateMedia({ colorScheme: "light" });
  await otherPage.goto("/");

  await page.click("#theme-switch");
  await expect(otherPage.locator("#current-theme")).toContainText("dark");
});

test("can switch theme when OS theme changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("#current-theme")).toContainText("light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("#current-theme")).toContainText("dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("#current-theme")).toContainText("light");
});

test("can snap back to OS theme", async ({ page }) => {
  // Start with light theme
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  // Manually switch to dark theme
  await page.click("#theme-switch");

  // Manually switch back to light theme
  await page.click("#theme-switch");

  // Check if OS theme changes reflect in theme as well
  await expect(page.locator("#current-theme")).toContainText("light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("#current-theme")).toContainText("dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("#current-theme")).toContainText("light");
});

test("does not crash during SSR", async () => {
  const Component = function () {
    const { theme } = useTheme();
    return React.createElement(React.Fragment);
  };

  ReactDOM.renderToString(React.createElement(Component));
});
