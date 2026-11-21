# Repository template

A starter repository for Jesse's workflow, with TypeScript as the default stack.
The standing repository conventions live alongside the TypeScript implementation;
another stack should replace or extend only the stack-specific files and checks.

## Configure after applying this template

Update `project.config.json` for the destination repository:

- `repoName`: the GitHub repository name.
- `deployLocation`: the deployment target, or an empty string until one is chosen.
- `languageStack`: `typescript` for this default stack.
- `templateVersion`: the version in `VERSION` when this template was applied.
- `hasUI`: `true` if the product has a user interface. Turns on the visual
  testing layer below. Defaults to `false` when absent.
- `breakpoints`: widths where the CSS changes (default 380, 480, 768, 1024, 1920).
- `testViewports`: widths the visual checks screenshot (default 380, 768, 1024, 1920).
- `previewDeploy`: where per-pull-request previews are deployed, or an empty
  string for none. See `tools/preview-deploy.sh`.

The CI workflow reads this configuration. Reconciliation compares
`templateVersion` with `VERSION`: patch gaps are routine, minor gaps merit review,
and major gaps need close attention. Update `VERSION` and `CHANGELOG.md` together
for template releases; tag releases `vMAJOR.MINOR.PATCH`.

## Repository layout

- `src/`, `test/`, and the TypeScript/npm configuration are the default stack.
- `docs/spec.md`, `docs/build-plan.md`, and `docs/backlog.md` are workflow-ready
  starting documents. Add `docs/bugs.md` only when the destination is not hosted
  on GitHub.
- `workflows/<workflow>/<instance>/status.json` stores one status record per
  workflow run. See [`workflows/README.md`](workflows/README.md).
- `.github/labels/labels.json` is the source of truth for labels. Run
  `tools/create-labels.sh` from the destination repository to create or update
  them.
- `CODEOWNERS` starts with the repository owner; replace it if ownership changes.

## Run locally

Requirements: Git, Node.js 22.6 or later, and npm. From a fresh clone outside
a devcontainer:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. The devcontainer installs dependencies and starts
the server after it is created, then forwards port 3000. To run the full local
gate:

```sh
npm test
npm run lint
npm run format:check
npm run typecheck
npm run build
```

For a bare Ubuntu machine, run `tools/setup-linux.sh`; log out and back in after
it adds your account to the Docker group. The script installs Docker, Node.js,
npm, Git, and the tools required by this template.

## Visual testing (repositories with a UI)

Set `"hasUI": true` in `project.config.json` to use it. It is advisory and never
required to merge.

- `docs/design/` holds the design source, reference images, `tokens.json` and
  `layout-rules.md`. Fill these in before building pages.
- `visual/pages.json` lists every page and state to check (one entry per state,
  for example `/projects?fixture=empty`).
- `npm run visual` runs the structural layout checks (no overflow, no broken
  images, no clipped text, no console errors) at every test width, and compares
  against baselines where they exist.
- `npm run visual:baseline` creates only the missing baselines. It never
  overwrites one. Baselines are approved by the owner when the pull request that
  adds them is approved.
- `npm run visual:evidence` writes screenshots to `visual/output/evidence/` for the
  pull request's "Visual evidence" section.
- After `npm ci`, run `tools/setup-visual.sh` to install the browser. The
  devcontainer does this for you. Set `CHROME_PATH` to use an installed Chrome
  when Playwright cannot download one.
- `.github/workflows/visual.yml` runs the checks on pull requests and, when
  `previewDeploy` is set, deploys a preview from a self-hosted runner labelled
  `homelab`. A self-hosted runner must not run pull requests from forks, so the
  preview job only runs for pull requests from this repository. Implement
  `tools/preview-deploy.sh` for your host first.

## Branches and checks

Long-lived branches are `main` and `develop`. Use `feature/<slug>` and
`bugfix/<slug>` for work targeting `develop`; use `release/<version>` and
`hotfix/<slug>` for work targeting `main`. Pull requests are checked for both
the branch name and its target. The pull-request workflow also runs unit tests
with an 80% line-coverage threshold, lint, format check, type check, and build.

The checked-in ruleset recipes are in `.github/rulesets/`. GitHub repository
rulesets are repository settings and are not applied by copying template files.
An owner must import/enable the recipes in **Settings → Rules → Rulesets** and
confirm that the account plan supports branch-name pattern rules. Protect both
`main` and `develop`, require pull requests, and block deletion and force pushes.
The CI branch check remains active even when naming rules cannot be configured
at the repository level. Ensure the workflow's required checks are selected in
the ruleset after its first successful run.

This repository does not configure deployment credentials or change GitHub
settings on behalf of a destination repository. Those steps require an owner.
