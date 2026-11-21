import { readFileSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const config = JSON.parse(readFileSync("project.config.json", "utf8"));
const widths: number[] = config.testViewports ?? [380, 768, 1024, 1920];
// How to start the app under test. Set "visualServer" in project.config.json
// when the default dev server is not the right one.
const server: { command: string; url: string } = config.visualServer ?? {
  command: "npm run dev",
  url: "http://localhost:3000",
};

// Use a locally installed Chrome when the Playwright browser download is not
// possible (for example in a sandbox with a restricted network).
const chromePath = process.env.CHROME_PATH;

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  // One baseline per page and viewport. No platform suffix, so the same file is
  // used wherever the check runs.
  snapshotPathTemplate: "{testDir}/baselines/{projectName}/{arg}{ext}",
  outputDir: "output/test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "output/report", open: "never" }],
  ],
  fullyParallel: true,
  use: {
    baseURL: process.env.BASE_URL ?? server.url,
    launchOptions: chromePath ? { executablePath: chromePath } : {},
  },
  projects: widths.map((width) => ({
    name: `w${width}`,
    use: { viewport: { width, height: 900 } },
  })),
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: server.command,
        url: server.url,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
