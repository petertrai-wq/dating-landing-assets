
## Form-split page sync (2026-07-28; ST10 CONCLUDED 2026-08-04 — Athena won)
`concierge/index.html` is the CANONICAL landing document. It serves three paths byte-identically
(`<base href="/concierge/">` keeps assets working):
- `/` (apex — 100% Athena arm since 08-04; the live question set is ATHENA2 = Athena UX +
  the Original Form's questions; submissions/beacons tag form='athena2')
- `/athenatest` (same arm — Peter's permalink, kept working)
- `/concierge` (legacy links; URL rewrites to `/`)
`?form=original` = QA override for the legacy adq-embed engine. After ANY edit to
concierge/index.html run:
    cp concierge/index.html index.html && cp concierge/index.html athenatest/index.html
