# dating-landing-assets — marketing site (GitHub Pages)

This repo IS the live apex site **automated.dating** (GitHub Pages, repo petertrai-wq/dating-landing-assets). `index.html` = VSL landing (Typeform popup qoQwwZI5), `video/` and `thankyou/` = GHL exports. The web app is a different system (admin.automated.dating, repo bromine3/hinge-proj).

Rules:
- **Browser pixels are PageView-only** (Meta dataset 997126436410749 + TikTok D94PJOBC77U0A0PAN09G). All conversion events (Lead/Schedule/Purchase + TikTok twins) fire SERVER-side from the relay — never add browser conversion events (they'd double-count).
- The landing pipes UTMs + fbclid into the Typeform as hidden fields and posts a beacon to `admin.automated.dating/api/analytics/track`. `utm_content` defaults to 'vsl'/'auto' when absent — don't change those defaults; per-ad attribution depends on them.
- Ad URL contract: `utm_source=tiktok-ads` (TikTok) / the existing ig/paid_social params (Meta) — the tracking sheet, Overview, and funnel pages route on these exact values.
- A/B test: sticky cookie `ab_vsl` (a = video, b = no-video) → Typeform hidden field `ab`. Keep variant assignment logic intact.
- Push to main = live within ~a minute (Pages). Verify on the real site after pushing.
