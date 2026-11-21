# Design

The design source for this product, kept in the repository so every build can
read it.

- `reference/`: reference images, one per page and viewport, named
  `<page>-<width>.png`. Include a reference for each state the spec names.
- `tokens.json`: the single source for colours, type scale, spacing, radii and
  breakpoints. The application theme is generated from or checked against it.
- `layout-rules.md`: how each page lays out and reflows. Fill in before building.
- The design source itself (HTML/CSS export or a written spec) goes here too.

## Breakpoints and test widths

Breakpoints are the widths where the CSS changes (`project.config.json`
`breakpoints`, default 380, 480, 768, 1024, 1920). 380 is the smallest supported
width. Test widths are where screenshots are taken (`testViewports`, default 380,
768, 1024, 1920). Test inside each band rather than on the boundary, and add a
boundary check only for pages with tricky reflow.

## Fonts

Use web fonts that ship with the app. System fonts differ between machines and
make screenshots differ for reasons that are not bugs.
