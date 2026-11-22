# Changelog

## [1.2.0] - 2026-11-22

- CI creates missing screenshot baselines. A new "Create missing baselines" job in
  `visual.yml` runs `tools/ci-baseline.sh` on pull requests from this repository,
  commits the new baseline images to the branch and comments the list for review.
  It never overwrites or deletes a baseline, never gates a merge, and does not run
  for forks. Baselines are no longer committed from a local machine.
- Fixes `visual.yml`, which was not valid YAML: the preview comment step had an
  unquoted colon, so GitHub would have rejected the whole workflow.

## [1.1.3] - 2026-11-21

- The visual checks start the app from the repository root instead of the `visual/`
  folder, so a `visualServer` command with relative paths works.

## [1.1.2] - 2026-11-21

- The clipped-text check now looks only at elements that hold text themselves and
  skips visually hidden text, so decorative containers and screen-reader-only
  labels no longer trigger it.

## [1.1.1] - 2026-11-21

- `project.config.json` gains an optional `visualServer` (`command` and `url`) so
  the visual checks can start the right server for the stack (for example a
  production preview build). Defaults to `npm run dev` on port 3000.

## [1.1.0] - 2026-11-21

- Add the visual testing layer for repositories with a UI: `hasUI`,
  `breakpoints`, `testViewports` and `previewDeploy` in `project.config.json`;
  `docs/design/` (reference images, tokens, layout rules); Playwright layout,
  baseline and evidence checks in `visual/`; a non-gating `visual.yml` workflow
  with a self-hosted preview deploy; a pull request template with a visual
  evidence section; `CLAUDE.md` rules; and `tools/setup-visual.sh`.
- Visual checks never gate merging. The five pull request checks are unchanged.

## [1.0.0] - 2026-10-12

- Initial version of the standing repository conventions and TypeScript default
  stack.
