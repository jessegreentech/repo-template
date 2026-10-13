#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required." >&2
  exit 1
fi

gh auth status >/dev/null

while IFS=$'\t' read -r name color description; do
  gh label create "${name}" --color "${color}" --description "${description}" --force
done < <(
  node --input-type=module -e '
    import { readFileSync } from "node:fs";
    for (const label of JSON.parse(readFileSync(".github/labels/labels.json", "utf8"))) {
      console.log(`${label.name}\t${label.color}\t${label.description}`);
    }
  '
)
