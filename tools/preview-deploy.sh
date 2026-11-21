#!/usr/bin/env bash
# Deploys a per-pull-request preview to the host named in project.config.json
# ("previewDeploy"). Called by .github/workflows/visual.yml on a self-hosted runner.
#
# Contract:
#   inputs   PR_NUMBER, PREVIEW_DEPLOY (the previewDeploy value), PR_HEAD_SHA
#   output   the preview URL, as the last line written to stdout
#   exit     0 on success, non-zero on failure
#
# This is a placeholder. Replace the body for your host (for example docker
# compose on the homelab behind a wildcard hostname such as pr-<number>.<domain>).
set -euo pipefail

: "${PR_NUMBER:?PR_NUMBER is required}"
: "${PREVIEW_DEPLOY:?PREVIEW_DEPLOY is required}"

echo "tools/preview-deploy.sh is not implemented for '${PREVIEW_DEPLOY}'." >&2
echo "Implement it for your host, then keep the contract above." >&2
exit 2
