import { expect, test } from "@playwright/test";
import { pages } from "./pages.ts";

// Structural layout checks. They need no baseline, so they can be written and
// run before the UI exists (they should fail first, then pass).
for (const entry of pages) {
  test.describe(entry.name, () => {
    test("renders without console or page errors", async ({ page }) => {
      const problems: string[] = [];
      page.on("pageerror", (error) => problems.push(error.message));
      page.on("console", (message) => {
        // Browsers request /favicon.ico on their own; a missing one is not a layout bug.
        if (message.location().url.endsWith("/favicon.ico")) return;
        if (message.type() === "error") problems.push(message.text());
      });
      await page.goto(entry.path);
      await page.waitForLoadState("networkidle");
      expect(problems).toEqual([]);
    });

    test("has no horizontal overflow", async ({ page }) => {
      await page.goto(entry.path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(
        1,
      );
    });

    test("has no broken images", async ({ page }) => {
      await page.goto(entry.path);
      await page.waitForLoadState("networkidle");
      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      );
      expect(broken).toEqual([]);
    });

    test("has no silently clipped text", async ({ page }) => {
      await page.goto(entry.path);
      await page.waitForLoadState("networkidle");
      // Text cut off by overflow:hidden without an ellipsis is usually a
      // layout bug. Intentional clipping should use text-overflow: ellipsis or
      // line clamping. Only elements that hold text themselves are checked, so
      // decorative containers are ignored, and visually hidden text (such as
      // screen-reader-only labels) is skipped.
      const clipped = await page.evaluate(() => {
        const found: string[] = [];
        for (const element of Array.from(document.body.querySelectorAll("*"))) {
          const style = getComputedStyle(element);
          const hidesX =
            style.overflowX === "hidden" || style.overflowX === "clip";
          const ownText = Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent ?? "")
            .join("")
            .trim();
          if (
            hidesX &&
            style.textOverflow !== "ellipsis" &&
            ownText.length > 0 &&
            element.clientWidth > 2 &&
            element.scrollWidth > element.clientWidth + 1
          ) {
            found.push(
              `${element.tagName.toLowerCase()}: ${ownText.slice(0, 40)}`,
            );
          }
          if (found.length >= 20) break;
        }
        return found;
      });
      expect(clipped).toEqual([]);
    });
  });
}
