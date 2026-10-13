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
