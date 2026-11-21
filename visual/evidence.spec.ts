import { mkdirSync } from "node:fs";
import { test } from "@playwright/test";
import { pages } from "./pages.ts";

// Writes a screenshot per page and viewport to visual/output/evidence/ for the
// "Visual evidence" section of a pull request. Not a pass/fail check.
for (const entry of pages) {
  test(`${entry.name} evidence screenshot`, async ({ page }, testInfo) => {
    await page.goto(entry.path);
    await page.waitForLoadState("networkidle");
    const directory = `visual/output/evidence/${testInfo.project.name}`;
    mkdirSync(directory, { recursive: true });
    await page.screenshot({
      path: `${directory}/${entry.name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}
