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

const output = process.env.GITHUB_OUTPUT;
if (!output) {
  throw new Error("GITHUB_OUTPUT is not set");
}

appendFileSync(output, `repo_name=${config.repoName}\n`);
appendFileSync(output, `deploy_location=${config.deployLocation}\n`);
appendFileSync(output, `language_stack=${config.languageStack}\n`);
appendFileSync(output, `template_version=${config.templateVersion}\n`);
