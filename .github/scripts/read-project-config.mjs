import { appendFileSync, readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("project.config.json", "utf8"));
const requiredStrings = [
  "repoName",
  "deployLocation",
  "languageStack",
  "templateVersion",
];

for (const key of requiredStrings) {
  if (typeof config[key] !== "string") {
    throw new Error(`project.config.json must define ${key} as a string`);
  }
  if (/[\r\n]/.test(config[key])) {
    throw new Error(`project.config.json ${key} cannot contain line breaks`);
  }
}

if (!/^[A-Za-z0-9_.-]+$/.test(config.repoName)) {
  throw new Error(
    "project.config.json repoName must be a valid repository name",
  );
}

if (!/^\d+\.\d+\.\d+$/.test(config.templateVersion)) {
  throw new Error(
    "project.config.json templateVersion must be MAJOR.MINOR.PATCH",
  );
}

// Optional visual-testing fields. A config without them behaves as a repo with
// no UI, so repositories bootstrapped from an earlier template version keep working.
const hasUI = config.hasUI ?? false;
if (typeof hasUI !== "boolean") {
  throw new Error("project.config.json hasUI must be true or false");
}

const viewportLists = ["breakpoints", "testViewports"];
for (const key of viewportLists) {
  const value = config[key];
  if (
    value !== undefined &&
    !(
      Array.isArray(value) &&
      value.every((width) => Number.isInteger(width) && width > 0)
    )
  ) {
    throw new Error(
      `project.config.json ${key} must be a list of positive whole numbers`,
    );
  }
}

const visualServer = config.visualServer;
if (
  visualServer !== undefined &&
  !(
    typeof visualServer?.command === "string" &&
    typeof visualServer?.url === "string"
  )
) {
  throw new Error(
    "project.config.json visualServer must have a command and a url, both strings",
  );
}

const previewDeploy = config.previewDeploy ?? "";
if (typeof previewDeploy !== "string" || /[\r\n]/.test(previewDeploy)) {
  throw new Error(
    "project.config.json previewDeploy must be a single-line string",
  );
}

const output = process.env.GITHUB_OUTPUT;
if (!output) {
  throw new Error("GITHUB_OUTPUT is not set");
}

appendFileSync(output, `repo_name=${config.repoName}\n`);
appendFileSync(output, `deploy_location=${config.deployLocation}\n`);
appendFileSync(output, `language_stack=${config.languageStack}\n`);
appendFileSync(output, `template_version=${config.templateVersion}\n`);
appendFileSync(output, `has_ui=${hasUI}\n`);
appendFileSync(output, `preview_deploy=${previewDeploy}\n`);
