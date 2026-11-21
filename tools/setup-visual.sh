#!/usr/bin/env bash
# Installs the browser the visual checks need. Run after `npm ci`.
# Does nothing unless project.config.json sets "hasUI": true.
set -euo pipefail

has_ui="$(node -p "JSON.parse(require('fs').readFileSync('project.config.json','utf8')).hasUI === true")"
if [[ "${has_ui}" != "true" ]]; then
  echo "hasUI is not true in project.config.json; skipping visual test setup."
  exit 0
fi

if [[ -n "${CHROME_PATH:-}" ]]; then
  echo "CHROME_PATH is set (${CHROME_PATH}); using that browser."
  exit 0
fi

npx playwright install --with-deps chromium
