import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { pages } from "./pages.ts";

// Baseline screenshots. A baseline is a decision by the owner, made when the
// pull request that adds it is approved. This spec never overwrites one:
//  - `npm run visual` compares against existing baselines and skips pages that
//    have none yet.
//  - `npm run visual:baseline` creates only the missing baselines.
// To change an approved baseline, delete its file deliberately in the pull
// request so the change is visible in review.
const creating = process.env.VISUAL_BASELINE === "1";

for (const entry of pages) {
  test(`${entry.name} matches its baseline`, async ({ page }, testInfo) => {
    const file = testInfo.snapshotPath(`${entry.name}.png`);
    test.skip(
      !creating && !existsSync(file),
      "No baseline yet. Add one with npm run visual:baseline.",
    );
    await page.goto(entry.path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${entry.name}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.001,
    });
  });
}
