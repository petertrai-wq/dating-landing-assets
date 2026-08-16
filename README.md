
## Form-split page sync (2026-07-28; ST10 CONCLUDED 2026-08-04 — Athena won)
`index.html` (repo root) is the CANONICAL landing document (flipped 2026-08-15: edits had
landed on root — incl. the 12+ dates guarantee meta and the VSL split — while concierge/ went
stale with the retired "you don't pay" copy; syncing concierge→root would have reverted live). It serves three paths byte-identically
(`<base href="/concierge/">` keeps assets working):
- `/` (apex — 100% Athena arm since 08-04; the live question set is ATHENA2 = Athena UX +
  the Original Form's questions; submissions/beacons tag form='athena2')
- `/athenatest` (same arm — Peter's permalink, kept working)
- `/concierge` (legacy links; URL rewrites to `/`)
`?form=original` = QA override for the legacy adq-embed engine. After ANY edit to
index.html run:
    cp index.html concierge/index.html && cp index.html athenatest/index.html
