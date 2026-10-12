import { pullRequestBranchError } from "./branch-rules.mjs";

const head = process.env.GITHUB_HEAD_REF;
const base = process.env.GITHUB_BASE_REF;

if (!head || !base) {
  console.error("GITHUB_HEAD_REF and GITHUB_BASE_REF must be set.");
  process.exit(1);
}

const error = pullRequestBranchError(head, base);
if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Branch ${head} may target ${base}.`);
