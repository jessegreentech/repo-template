# Changelog

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
