import assert from "node:assert/strict";
import { test } from "node:test";
import { pullRequestBranchError } from "../.github/scripts/branch-rules.mjs";

test("feature and bugfix branches target develop", () => {
  assert.equal(pullRequestBranchError("feature/add-login", "develop"), null);
  assert.equal(pullRequestBranchError("bugfix/fix-timeout", "develop"), null);
});

test("release and hotfix branches target main", () => {
  assert.equal(pullRequestBranchError("release/1.2.3", "main"), null);
  assert.equal(pullRequestBranchError("hotfix/fix-crash", "main"), null);
});

test("Copilot branches target main", () => {
  assert.equal(pullRequestBranchError("copilot/build-template", "main"), null);
  assert.match(
    pullRequestBranchError("copilot/build-template", "develop"),
    /must target main/,
  );
});

test("rejects branches with the wrong target", () => {
  assert.match(
    pullRequestBranchError("feature/add-login", "main"),
    /must target develop/,
  );
  assert.match(
    pullRequestBranchError("release/1.2.3", "develop"),
    /must target main/,
  );
});

test("rejects branch names outside the convention", () => {
  assert.match(
    pullRequestBranchError("feature/Add_Login", "develop"),
    /Unsupported branch/,
  );
  assert.match(
    pullRequestBranchError("release/latest", "main"),
    /Unsupported branch/,
  );
});
