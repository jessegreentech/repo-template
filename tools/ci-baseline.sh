#!/usr/bin/env bash
# Creates the screenshot baselines that do not exist yet and commits them to the
# current branch, so the owner can review the images in the pull request diff.
# Run by the "Create missing baselines" job in .github/workflows/visual.yml.
#
# It never overwrites or deletes a baseline: if running the baseline command
# changes or removes a tracked baseline, it stops with an error and commits
# nothing. To change an approved baseline, delete its file in the pull request;
# CI then recreates it and the change shows up as a modified image in the diff.
#
# Environment:
#   VISUAL_BASELINE_CMD    command that creates missing baselines (default: npm run visual:baseline)
#   BASELINE_DIR           where baselines live (default: visual/baselines)
#   BASELINE_COMMENT_FILE  where the review comment is written (default: visual/output/baseline-comment.md)
#   BASELINE_BRANCH        branch to push to (default: GITHUB_HEAD_REF, else the current branch)
#   BASELINE_PUSH          set to 0 to commit without pushing
set -euo pipefail

dir="${BASELINE_DIR:-visual/baselines}"
cmd="${VISUAL_BASELINE_CMD:-npm run visual:baseline}"
comment="${BASELINE_COMMENT_FILE:-visual/output/baseline-comment.md}"
branch="${BASELINE_BRANCH:-${GITHUB_HEAD_REF:-$(git branch --show-current)}}"

bash -c "${cmd}"

# Guard: only additions are allowed.
changed="$(git status --porcelain --untracked-files=no -- "${dir}")"
if [[ -n "${changed}" ]]; then
  echo "error: the baseline command changed or deleted existing baselines. Nothing was committed." >&2
  echo "${changed}" >&2
  exit 1
fi

new="$(git ls-files --others --exclude-standard -- "${dir}")"
if [[ -z "${new}" ]]; then
  echo "No missing baselines."
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then echo "added=false" >> "${GITHUB_OUTPUT}"; fi
  exit 0
fi

count="$(printf '%s\n' "${new}" | wc -l | tr -d ' ')"
mkdir -p "$(dirname "${comment}")"
{
  echo "CI created ${count} missing screenshot baseline(s) and committed them to this branch:"
  echo
  printf '%s\n' "${new}" | sed 's/^/- `/; s/$/`/'
  echo
  echo "They were captured from this branch exactly as it renders now. Open the images in the Files changed tab and check that each one shows the page you expect. Approving this pull request approves them as the baseline. Existing baselines were not touched."
} > "${comment}"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -- "${dir}"
git commit -q -m "test(visual): add missing screenshot baselines" \
  -m "Created by CI from this branch; review the images in the diff. Approving the pull request approves them."

if [[ "${BASELINE_PUSH:-1}" == "1" ]]; then
  if ! git push origin "HEAD:refs/heads/${branch}"; then
    echo "error: could not push to ${branch}; it may have moved while this job ran. A new run starts when it changes; re-run this job otherwise." >&2
    exit 1
  fi
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then echo "added=true" >> "${GITHUB_OUTPUT}"; fi
echo "Committed ${count} baseline(s)."
