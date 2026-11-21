# Working in this repository

Process rules that apply to every change. The workflow skills assume them.

## UI work (only when project.config.json has "hasUI": true)

- The design source and reference images are in `docs/design/`. Layout rules
  (grid, breakpoints, reflow, truncation) are in `docs/design/layout-rules.md`.
  Read both before building any page.
- Use the tokens in `docs/design/tokens.json` for every colour, font size,
  spacing and radius. No magic numbers. Reuse an existing component before
  adding a new one.
- Build the layout shell before the content. Test each page at every width in
  `testViewports` and at every state the spec names (empty, loading, error, very
  long content, many items). Add the page and its states to `visual/pages.json`.
- Write the structural checks in `visual/layout.spec.ts` terms first and see
  them fail before implementing, like any other test.
- Never create, overwrite or delete a screenshot baseline to make a check pass.
  Fix the UI instead. Baselines are added with `npm run visual:baseline`, which
  only creates missing ones, and each addition or change is called out in the
  pull request for the owner to approve.
- Before opening a pull request for UI work, run `npm run visual:evidence`, view
  the screenshots next to the reference images, and list every difference in the
  pull request's "Visual evidence" section.

## Running the visual checks without a downloadable browser

If Playwright cannot download Chromium (a restricted network), set `CHROME_PATH`
to an installed Chrome, for example `CHROME_PATH=/usr/bin/google-chrome npm run visual`.
Baselines made with a different browser build can differ slightly from CI.
