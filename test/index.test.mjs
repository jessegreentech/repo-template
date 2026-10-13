import assert from "node:assert/strict";
import { test } from "node:test";
import { greet } from "../src/index.ts";

test("greets the supplied name", () => {
  assert.equal(greet("Ada"), "Hello, Ada!");
});
