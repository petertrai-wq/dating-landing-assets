
## Form-split page sync (2026-07-28)
`concierge/index.html` is the CANONICAL landing document. It serves three paths byte-identically
(the in-page boot picks the arm by path/cookie; `<base href="/concierge/">` keeps assets working):
- `/` (apex — 50/50 Original vs Athena form split)
- `/athenatest` (always the Athena arm — Peter's permalink)
- `/concierge` (legacy links; URL rewrites to `/`)
After ANY edit to concierge/index.html run:
    cp concierge/index.html index.html && cp concierge/index.html athenatest/index.html
