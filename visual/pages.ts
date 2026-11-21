import { readFileSync } from "node:fs";

export interface PageEntry {
  /** Unique, file-name-safe name. Used for screenshot file names. */
  name: string;
  /** Path (and query) served by the app, e.g. "/projects?fixture=empty". */
  path: string;
}

export const configPath = "project.config.json";
export const pagesPath = process.env.VISUAL_PAGES ?? "visual/pages.json";

export const pages: PageEntry[] = JSON.parse(
  readFileSync(pagesPath, "utf8"),
).pages;
