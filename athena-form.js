// ═══ ATHENA2 FORM — the ONLY form since 2026-08-04 (SPLIT TEST 10 concluded: ATHENA WON) ═══
// Active ONLY when window.__ADQ_FORM === 'athena' (set by the boot in <head>; always-on since
// 08-04 — no coin flip; /athenatest permalink unchanged; ?form=original = QA override).
//
// ATHENA2 = the Athena UX (hero q1 card → full-screen stylized takeover, one-question-at-a-time
// cards, Playfair/Figtree styling, inline native booker) carrying the ORIGINAL FORM's questions
// VERBATIM from adq-embed.js QS — MINUS 'methow', 'interest', 'occupation', 'occ_years',
// 'problem', 'start', 'age' and the athena-only 'role' (Peter 2026-08-04 review cuts). Final
// flow: q1 answered IN THE HERO CARD (Yes/No — replaced the role card 08-04 pm), then the
// takeover: hinge_banned (pure intel — never DQs), time_week, dates30, income, phone, name,
// email, invest (dynamic title), commit.
// With 'start' gone there is no timeline question and therefore no timeline DQ; q1 'No' still
// DQs at invest exactly like the Original (contact captured first at phone/name/email).
// Titles/opts must NEVER be paraphrased — the relay's DFORM refs + tfQualified/
// tfLeadDisqualified/TF_ANSWER_FIELDS regexes key on the exact strings.
// Submissions and beacons TAG form='athena2' (hidden.form + every analytics beacon).
// Typed questions AUTOFOCUS (Peter 2026-08-04): an offscreen input is focused SYNCHRONOUSLY
// inside the tap that advances to a typed step (adq-embed's primeKeyboard trick — iOS only opens
// the keyboard from a user gesture), then render() moves focus to the real input.
//
// DQ rules (client mirror — server is authoritative, keep in sync with the relay's
// tfLeadDisqualified/tfQualified athena2 branch): q1 'No' · income '0k to 50k' / '50k to 100k' ·
// invest 'No.' · commit 'Maybe'. NO timeline DQ — the start question is pure intel on athena2
// (Peter 2026-08-04). DQ evaluates at INVEST (contact is captured before it, at phone/name/email).
// This file must load BEFORE adq-embed.js (its capture listener hijacks the CTA clicks).
(function () {
  'use strict';
  if (window.__ADQ_FORM !== 'athena') return;

  var API = 'https://admin.automated.dating/api/apply';
  var EP = 'https://admin.automated.dating/api/analytics/track';
  var PIC = 'https://automated.dating/concierge/';

  // ── fonts for the takeover (Athena look: Figtree + Playfair Display) ──
  try {
    var fl = document.createElement('link'); fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Figtree:wght@400;500;600;700&display=swap';
    document.head.appendChild(fl);
  } catch (e) {}

  // ── styles (ported from the approved athenatest page) ──
  var css = '' +
  'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}' +   /* large-font accessibility settings must scale, not shatter, the layout (John 2026-07-28) */
  '#athOv{position:fixed;inset:0;z-index:2147481000;background:#F7F4ED;color:#2E3A30;font-family:Figtree,Inter,-apple-system,sans-serif;display:none;flex-direction:column;overflow-y:auto}' +
  '#athOv.on{display:flex}' +
  '.athserif{font-family:"Playfair Display",Georgia,serif}' +
  '#athHead{background:#F7F4ED;border-bottom:1px solid #E5E2D9;padding:16px 0;flex:0 0 auto}' +
  '#athHead .inr{max-width:1180px;margin:0 auto;padding:0 22px;display:flex;align-items:center;gap:18px}' +
  '#athBack{width:30px;height:30px;border-radius:7px;border:none;background:#CDD9CC;color:#2E3A30;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
  '#athBack[hidden]{visibility:hidden;display:flex}' +
  '.athwm{font-size:18px;letter-spacing:.1em;font-weight:600;color:#111}' +
  '#athBody{max-width:1180px;width:100%;margin:0 auto;padding:38px 22px 80px;display:flex;gap:70px;align-items:flex-start;justify-content:center;flex:1 1 auto}' +
  '#athCol{flex:0 1 620px;min-width:0}' +
  '.athq{font-size:31px;font-weight:600;line-height:1.35;color:#2f3a2f}' +
  '.athd{font-size:18px;color:#5C665C;margin-top:12px}' +
  '.athops{margin-top:34px;display:flex;flex-direction:column;gap:24px}' +
  '.athop{display:flex;align-items:center;gap:14px;cursor:pointer;font-size:17.5px;color:#333d33;-webkit-tap-highlight-color:transparent}' +
  '.athop .r{flex:none;width:26px;height:26px;border-radius:50%;border:2px solid #C4CDC0;background:#fff;transition:all .12s;position:relative}' +
  '.athop .c{flex:none;width:26px;height:26px;border-radius:8px;border:2px solid #C4CDC0;background:#fff;transition:all .12s;position:relative}' +
  '.athop.on .r{border-color:#24352B;background:#24352B;box-shadow:inset 0 0 0 4px #fff}' +
  '.athop.on .c{border-color:#24352B;background:#24352B}' +
  '.athop.on .c::after{content:"\\2713";position:absolute;inset:0;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center}' +
  '@keyframes athCd{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}' +
  '.athgo{display:none;margin-top:34px;width:100%;border:none;background:#24352B;color:#fff;font-family:inherit;font-size:18px;font-weight:600;padding:19px 0;border-radius:9px;cursor:pointer}' +
  '.athgo:hover{background:#1c2a22}' +
  '.athgo.show{display:block;animation:athCd .6s cubic-bezier(.25,.7,.3,1) both}' +
  '.athcard{margin-top:40px;background:#DBE2D7;border-radius:13px;padding:22px 26px}' +
  '.athcard.info{display:flex;gap:14px;align-items:flex-start;font-size:14.5px;line-height:1.5;color:#2f3a2f}' +
  '.athcard.info .ic{flex:none;width:30px;height:30px;border-radius:50%;background:#1F2A20;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px}' +
  '.athcard.quote{text-align:center}' +
  '.athcard.quote .qt{font-family:"Playfair Display",serif;font-size:17.5px;line-height:1.55;color:#26302a;max-width:460px;margin:0 auto}' +
  '.athcard.quote .who{margin-top:14px;display:flex;flex-direction:column;align-items:center;gap:3px}' +
  '.athcard.quote .av{width:52px;height:52px;border-radius:50%;background:#1F2A20;color:#fff;display:flex;align-items:center;justify-content:center;font-family:"Playfair Display",serif;font-size:18px;margin-bottom:5px;overflow:hidden}' +
  '.athcard.quote .av img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}' +
  '.athcard.quote .nm{font-family:"Playfair Display",serif;font-size:16px;color:#1e2820}' +
  '.athcard.quote .rl{font-size:11.5px;font-style:italic;color:#5C665C}' +
  '#athRail{flex:0 0 220px;display:none;flex-direction:column;align-items:center;gap:22px;padding-top:4px}' +
  '#athRail .lbl{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6a746a}' +
  '.athring{width:96px;height:96px;border-radius:50%;position:relative;background:conic-gradient(#24352B 0deg 22deg,#E3E0D5 22deg 360deg)}' +
  '.athring::after{content:"";position:absolute;inset:7px;background:#F7F4ED;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.06)}' +
  '.athring .pc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1}' +
  '.athring .pc b{font-size:19px;color:#222c22}' +
  '.athring .pc span{font-size:8px;letter-spacing:.1em;color:#778076;text-transform:uppercase}' +
  // Inline qualify card on the FIRST question (Peter 2026-07-30, styled off Athena's "Finding your EA match")
  '.athqual{display:none;align-items:center;gap:14px;background:#fff;border:1px solid #E3E0D5;border-radius:14px;padding:13px 16px;margin-bottom:24px;box-shadow:0 1px 8px rgba(0,0,0,.04)}' +
  '.athqual .ring{flex:none;width:46px;height:46px;border-radius:50%;position:relative;background:conic-gradient(#24352B 0deg 22deg,#E3E0D5 22deg 360deg)}' +
  '.athqual .ring::after{content:"";position:absolute;inset:5px;background:#fff;border-radius:50%}' +
  '.athqual .ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#222c22;z-index:1}' +
  '.athqual .tt{font-size:15px;font-weight:700;color:#141210}' +
  '.athqual .ss{font-size:13px;color:#5C665C;margin-top:2px}' +
  '#athRail .note{background:#fff;border:1px solid #EAE7DC;border-radius:11px;padding:16px 18px;font-size:12.5px;font-weight:600;text-align:center;color:#2f3a2f;line-height:1.5;max-width:200px}' +
  '.athbar{height:5px;background:#D9CBB2;border-radius:99px;overflow:hidden;margin-bottom:32px}' +
  '.athbar i{display:block;height:100%;background:#3F5A49;border-radius:99px}' +
  '.athalmost h1{font-size:33px;font-weight:600;color:#1e2820}' +
  '.athalmost p{margin-top:10px;font-size:14.5px;color:#4c564c}' +
  '.athalmost hr{border:none;border-top:1px solid #E5E2D9;margin:26px 0 30px}' +
  '.athload{padding-top:26px;text-align:center;color:#4A6B57;font-size:15px}' +
  '.athspin{width:42px;height:42px;border:4px solid #E6EBE0;border-top-color:#24352B;border-radius:50%;margin:30px auto 18px;animation:athSp .8s linear infinite}' +
  '@keyframes athSp{to{transform:rotate(360deg)}}' +
  '.athlbl{display:block;text-align:left;font-size:12px;font-weight:600;color:#556055;margin:16px 0 6px}' +
  '.athin{display:block;width:100%;border:1px solid #DDDAD0;border-radius:9px;background:#fff;padding:13px 14px;font-size:15px;font-family:inherit;outline:none;box-sizing:border-box}' +
  '.athin:focus{border-color:#4A6B57}' +
  '.atherr{color:#d64545;font-size:13.5px;margin-top:10px;min-height:18px}' +
  '.athend{text-align:center;padding:40px 12px 0}' +
  '.athend .t{font-size:22px;font-weight:600;color:#1e2820;line-height:1.45}' +
  '.athend .d{margin-top:10px;font-size:14.5px;color:#4c564c}' +
  '@keyframes athRise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}' +
  '#athOv.enter #athBody{animation:athRise .5s cubic-bezier(.22,.8,.3,1) both}' +
  '@keyframes athOut{to{opacity:0;transform:translateX(-64px)}}' +
  '@keyframes athOutR{to{opacity:0;transform:translateX(64px)}}' +
  '@keyframes athIn{from{opacity:0;transform:translateX(64px)}to{opacity:1;transform:none}}' +
  '@keyframes athInL{from{opacity:0;transform:translateX(-64px)}to{opacity:1;transform:none}}' +
  '#athCol.out{animation:athOut .4s ease both}' +
  '#athCol.outR{animation:athOutR .4s ease both}' +
  '#athCol.anim{animation:athIn .6s cubic-bezier(.25,.7,.3,1) both}' +
  '#athCol.animL{animation:athInL .6s cubic-bezier(.25,.7,.3,1) both}' +
  '@media (max-width:760px){#athBody{padding:20px 16px 56px}#athRail{display:none !important}.athqual{display:flex}.athq{font-size:26px}.athd{font-size:16.5px}.athops{margin-top:26px;gap:20px}.athop{font-size:17.5px;gap:14px}.athop .r{width:32px;height:32px}.athop .c{width:31px;height:31px}.athcard{margin-top:28px;padding:20px 22px}.athwm{font-size:15px}#athHead{padding:12px 0}}' +
  /* hero variant (arm B, before the takeover) */
  'html.athena-arm #heroCta,html.athena-arm #applyNowHdr{display:none !important}' +
  'html.athena-arm #adqInlineHost{display:block;width:100%;max-width:430px;margin:26px auto 0}' +
  '#athRole{background:#f7f5f1;border:1px solid #e7e3da;border-radius:16px;padding:22px 24px 24px;box-shadow:0 18px 44px rgba(20,28,21,.10);text-align:left}' +
  '#athRole h3{font-family:"Playfair Display",Georgia,serif;font-size:22px;font-weight:600;color:#182018;margin:2px 0 10px}' +
  '#athRole .sub2{font-size:12.5px;color:#8a9288;line-height:1.6;margin:0 0 22px}' +
  '.athro{display:flex;align-items:center;justify-content:space-between;border:1px solid #DCDCDC;border-radius:9px;padding:12px 15px;font-size:14.5px;color:#222;cursor:pointer;margin-bottom:10px;transition:border .12s,background .12s;background:#fff}' +
  '.athro:hover{border-color:#24352B;background:#F6F8F5}' +
  /* stylized dark hero (Peter 2026-07-28 pm: "make it stylized more like the athena one, use our colors") */
  /* Athena's own northern-lights green fade (Peter 2026-07-31: "apply this same green fade
     northern lights color background athena has") — nav shares the base so there's no seam. */
  'html.athena-arm .nav{background:#0d1714;border-bottom:1px solid rgba(255,255,255,.08)}' +
  'html.athena-arm .nav .brand{background:#F5F1E6;color:#141210}' +
  'html.athena-arm .nav .btn.sm{display:none}' +   /* Sign In hidden on the B test (Peter 2026-07-28 pm) */
  'html.athena-arm header.hero{background:radial-gradient(1300px 780px at 12% -8%,rgba(58,118,92,.55) 0%,rgba(58,118,92,0) 58%),radial-gradient(1100px 680px at 88% 6%,rgba(28,78,62,.45) 0%,rgba(28,78,62,0) 62%),radial-gradient(1500px 900px at 50% 118%,rgba(22,62,50,.5) 0%,rgba(22,62,50,0) 64%),linear-gradient(158deg,#0e1a15 0%,#10211a 46%,#0a1410 100%),#0c1613;padding-bottom:70px}' +
  '.athEyebrow{color:#B9AE93;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;text-align:left;margin:10px 0 22px}' +
  'html.athena-arm .hero .wrap{text-align:left}' +
  'html.athena-arm .hero h1{font-family:"Playfair Display",Georgia,serif;color:#F5F1E6;font-weight:500;letter-spacing:-.005em;font-size:clamp(44px,5.8vw,72px);line-height:1.08;text-align:left;max-width:1000px;margin:0 0 30px}' +
  'html.athena-arm .hero h1 .l{white-space:normal;display:block}' +
  '@media (max-width:1080px){html.athena-arm .poly{display:none !important}}' +
  'html.athena-arm .hero h1 em{font-style:italic}' +
  'html.athena-arm .hero .sub{color:#E7E2D4;text-align:left;font-size:clamp(17px,2vw,21px);line-height:1.55;max-width:640px;margin:0 0 26px}' +
  'html.athena-arm .hero .sub b{color:#fff}' +
  'html.athena-arm .hero .nopay{color:#F5F1E6;text-align:left;margin-bottom:6px}' +
  'html.athena-arm #adqInlineHost{margin:46px 0 0}' +
  'html.athena-arm #athHeroQuote{margin-left:0;margin-right:0}' +
  'html.athena-arm #athRole{background:#FAF7EF;border:1.5px solid #C9A85C;box-shadow:0 26px 64px rgba(0,0,0,.4)}' +
  'html.athena-arm .athro{background:#ECE8DC;border:1px solid #ECE8DC}' +
  'html.athena-arm .athro:hover{background:#E4DFD0;border-color:#141210}' +
  'html.athena-arm .athro b{color:#B08D3F}' +
  'html.athena-arm #athHeroQuote{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.16);color:#D9D6CB}' +
  'html.athena-arm #athHeroQuote .nm{color:#fff}' +
  'html.athena-arm #athHeroQuote .rl{color:#9a958a}' +
  '@media (max-width:760px){html.athena-arm .hero h1{font-size:clamp(34px,10vw,42px);line-height:1.12}html.athena-arm #adqInlineHost{margin-top:34px}}' +
  /* desktop: Athena-scale card — double-size option bubbles + text (Peter 2026-07-28 pm) */
  '@media (min-width:761px){html.athena-arm #adqInlineHost{max-width:640px}html.athena-arm #athRole{padding:36px 38px 38px;border-radius:20px}html.athena-arm #athRole h3{font-size:32px;margin-bottom:12px}html.athena-arm #athRole .sub2{font-size:16px;margin-bottom:30px}html.athena-arm .athro{font-size:20px;padding:21px 26px;border-radius:10px;margin-bottom:14px}html.athena-arm .athro b{font-size:20px}html.athena-arm #athHeroQuote{max-width:640px;font-size:14.5px}}' +
  '#athHeroQuote{max-width:430px;margin:18px auto 0;background:#fff;border:1px solid #e7e3da;border-radius:13px;padding:16px 18px;font-size:13.5px;line-height:1.6;color:#3c463c;text-align:left}' +
  '#athHeroQuote .who{display:flex;align-items:center;gap:10px;margin-top:12px}' +
  '#athHeroQuote .av{width:38px;height:38px;border-radius:50%;overflow:hidden;flex:none}' +
  '#athHeroQuote .av img{width:100%;height:100%;object-fit:cover;display:block}' +
  '#athHeroQuote .nm{font-weight:700;color:#141210;font-size:13.5px}' +
  '#athHeroQuote .rl{font-size:11.5px;font-style:italic;color:#8a9288}' +
  /* inline native booker (Peter 2026-07-28 pm: embedded in the takeover, not the popup) */
  '.abk{max-width:860px;text-align:left}' +
  '.abk-back{background:none;border:none;color:#556055;font-size:14px;cursor:pointer;padding:0 0 14px;font-family:inherit}' +
  '.abk-title{font-family:"Playfair Display",Georgia,serif;font-size:clamp(26px,3vw,34px);font-weight:500;color:#1e2820;margin:0 0 10px}' +
  '.abk-sub{font-size:14.5px;color:#4c564c;line-height:1.6;margin:0 0 26px;max-width:640px}' +
  '.abk-grid{display:flex;gap:38px;align-items:flex-start}' +
  '.abk-calwrap{flex:none;width:340px}' +
  '.abk-monthrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-weight:600;color:#1e2820}' +
  '.abk-monthrow button{background:#fff;border:1px solid #DDDAD0;border-radius:8px;width:32px;height:32px;font-size:16px;cursor:pointer;color:#1e2820}' +
  '.abk-cal{width:100%;border-collapse:collapse}' +
  '.abk-cal th{font-size:11px;font-weight:600;color:#8a9288;padding:6px 0;text-transform:uppercase;letter-spacing:.06em}' +
  '.abk-cal td{text-align:center;padding:3px 0}' +
  '.abk-day{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;font-size:14px;color:#b6bdb4}' +
  '.abk-day.av{background:#E3E8DF;color:#1e2820;font-weight:600;cursor:pointer}' +
  '.abk-day.av:hover{background:#d6ddd1}' +
  '.abk-day.sel{background:#24352B;color:#fff}' +
  '.abk-tzwrap{margin-top:18px;font-size:13px;color:#4c564c;display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
  '.abk-tzlbl{width:100%;font-weight:600;font-size:12px;color:#556055}' +
  '.abk-tzwrap select{border:1px solid #DDDAD0;border-radius:8px;background:#fff;padding:8px 10px;font-size:13px;font-family:inherit;color:#1e2820;max-width:280px}' +
  '.abk-slotcol{flex:1;min-width:0;max-width:340px}' +
  '.abk-dayhead{font-weight:600;color:#1e2820;margin-bottom:12px}' +
  '.abk-slots{display:flex;flex-direction:column;gap:10px;max-height:430px;overflow-y:auto;padding-right:4px}' +
  '.abk-slot{display:block;width:100%;background:#fff;border:1.5px solid #C4CDC0;border-radius:9px;padding:12px 0;font-size:15px;font-weight:600;color:#24352B;cursor:pointer;font-family:inherit;transition:all .12s;text-align:center}' +
  '.abk-slot:hover{border-color:#24352B}' +
  '.abk-pair{display:flex;gap:8px}' +
  '.abk-chip{flex:1;background:#8f978c;border:none;border-radius:9px;color:#fff;font-weight:600;font-size:15px;font-family:inherit;text-align:center}' +
  '.abk-go{flex:1;background:#24352B;border:none;border-radius:9px;color:#fff;font-weight:600;font-size:15px;padding:12px 0;cursor:pointer;font-family:inherit;text-align:center}' +
  '.abk-when{display:flex;align-items:center;gap:8px;font-size:14px;color:#4c564c;margin-top:8px}' +
  '.abk-details{max-width:430px;margin-top:6px}' +
  '.abk-confirm{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:#3c463c;margin-top:18px;line-height:1.5;cursor:pointer}' +
  '.abk-confirm input{margin-top:3px;accent-color:#24352B;width:17px;height:17px}' +
  '.abk-sched{display:block;width:100%;margin-top:20px;background:#24352B;color:#F5F1E6;border:none;border-radius:10px;padding:16px 0;font-size:16.5px;font-weight:600;cursor:pointer;font-family:inherit}' +
  '.abk-sched.off{opacity:.45;cursor:not-allowed}' +
  '.abk-newtime{display:block;width:100%;margin-top:10px;background:none;border:none;color:#556055;font-size:14px;cursor:pointer;text-decoration:underline;font-family:inherit;padding:8px 0}' +
  '.abk-err{color:#d64545;font-size:13.5px;margin-top:12px;min-height:18px}' +
  '.abk-load{padding:40px 0;color:#4c564c}' +
  '.abk-prog{max-width:430px;margin:60px auto;text-align:center}' +
  '.abk-spin{width:34px;height:34px;border:3px solid #DDDAD0;border-top-color:#24352B;border-radius:50%;margin:0 auto 18px;animation:abkSpin .8s linear infinite}' +
  '@keyframes abkSpin{to{transform:rotate(360deg)}}' +
  '.abk-prog-msg{font-size:15px;color:#1e2820;font-weight:600;margin-bottom:14px}' +
  '.abk-prog-bar{height:6px;background:#E3E8DF;border-radius:3px;overflow:hidden}' +
  '.abk-prog-bar i{display:block;height:100%;width:0;background:#24352B;transition:width .35s}' +
  '.abk-prog-pct{font-size:12.5px;color:#8a9288;margin-top:8px}' +
  '.abk-prog-note{font-size:12.5px;color:#8a9288;margin-top:12px;line-height:1.45;max-width:340px;margin-left:auto;margin-right:auto}' +
  '@media (max-width:760px){.abk-grid{display:block}.abk-calwrap{width:100%;max-width:360px;margin:0 auto}.abk-slotcol{max-width:none}}' +
  /* ATHENA2 (2026-08-04): prominent top progress bar, styled off the Original Form's #adqBar
     (track #e7e9ee, fill #1A1A1A, pill, .3s width ease) but bigger + always visible up top. */
  '#athProgWrap{flex:0 0 auto;background:#F7F4ED;padding:14px 22px 0}' +
  '#athProg{max-width:1180px;margin:0 auto;height:10px;background:#e7e9ee;border-radius:99px;overflow:hidden}' +
  '#athProg i{display:block;height:100%;width:0%;background:#1A1A1A;border-radius:99px;transition:width .3s ease}' +
  /* iOS-style scroll wheel (ported from the Original Form's age/occ_years wheel, athena palette) */
  '.athwheelwrap{position:relative;max-width:280px;margin:34px auto 0;width:100%}' +
  '.athwheel{height:220px;box-sizing:border-box;overflow-y:auto;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;padding:88px 0;scrollbar-width:none;outline:none;touch-action:pan-y;overscroll-behavior:contain}' +
  '.athwheel::-webkit-scrollbar{display:none}' +
  '.athwitem{box-sizing:border-box;height:44px;line-height:44px;text-align:center;font-size:22px;color:#b6bdb4;scroll-snap-align:center;cursor:pointer;transition:color .12s ease,font-size .12s ease,font-weight .12s ease}' +
  '.athwitem.cur{color:#1e2820;font-weight:700;font-size:26px}' +
  '.athwhl{display:block;position:absolute;left:0;right:0;top:88px;height:44px;box-sizing:border-box;pointer-events:none;background:rgba(36,53,43,.08);border:2px solid #24352B;border-radius:10px}' +
  'textarea.athin{resize:none;min-height:96px;line-height:1.5;font-family:inherit}' +
  /* compact title (commit question): ~desc size + tight leading so the whole card fits one
     mobile screen; options tighten up too on mobile */
  '.athq.compact{font-size:19px;line-height:1.45;font-weight:600}' +
  '@media (max-width:760px){.athq.compact{font-size:16.5px;line-height:1.42}.athq.compact~.athops{margin-top:18px;gap:14px}}';
  try { var stl = document.createElement('style'); stl.textContent = css; document.head.appendChild(stl); } catch (e) {}

  // ── questions (ATHENA2, 2026-08-04): the ORIGINAL FORM's questions VERBATIM from adq-embed.js
  //    QS — same keys, titles, options, order, skipIf and dynamic titles. Rendered as Athena-style
  //    cards (income stays a CARD, not a slider; age/occ_years keep the original's wheel). The
  //    decorative quote/info cards below the options are Athena UX flair — NOT part of any
  //    question — and never touch the matched strings. ──
  var qi = function (icon, text) { return { kind: 'info', icon: icon, text: text }; };
  var qq = function (quote, initial, name, role, img) { return { kind: 'quote', quote: quote, initial: initial, name: name, role: role, img: img ? PIC + img : null }; };
  // Price disclosure fully RETIRED (Peter 2026-07-31) — kept as a function so the invest title
  // stays in lockstep with adq-embed.js's invqPriceShown() history.
  function invqPriceShown() { return false; }
  // q1 lives in the HERO CARD (Peter 2026-08-04: it replaced the role question there) — answered
  // before the takeover opens, prefilled into A.q1, still submitted + still the first DQ gate.
  // 'age' REMOVED the same pass (never fed DQ — the 27-55 gate is in q1's wording).
  var STEPS = [
    // QUESTION 2 (Peter 2026-08-05: moved to the FIRST takeover step, right after the hero q1) —
    // pure intel, NO DQ effect from any answer. Mirrored in the relay DFORM (hinge_banned); no
    // GHL custom field — rides form_fills → admin /form + lead cards + #leads generically.
    // rail:true = the "Match progress" side panel shows on the first takeover card.
    { key: 'hinge_banned', type: 'radio', rail: true, title: 'Are you banned on Hinge currently?', opts: ['Yes', 'No', 'Not sure'] },
    { key: 'time_week', type: 'radio', title: 'How many hours are you spending each week texting, swiping, thinking about, or meeting women?', opts: ['Under 3 hours', '3-7 hours', '8-15 hours', '15+ hours'],
      card: qq('"I don\'t have too much trouble with women, I just can\'t afford to spend the hours it takes to land even one decent date now. It\'s almost like a full time job."', 'M', 'Marco C.', 'Exec, SF', 'tw-marco2.jpg') },
    { key: 'dates30', type: 'radio', title: 'How many quality dates did you go on in the last 30 days?', opts: ['0', '1-2', '3-5', '5+'],
      card: qi('◔', "Hinge's own data: a match that gets a reply within 24 hours is <b>72% more likely to turn into a date</b>. Slow follow-up is where dates die.") },
    // 'methow' + 'interest' (Peter 2026-08-04 review) and 'occupation' + 'occ_years' (Peter
    // 2026-08-04 second pass) REMOVED from athena2 — the Original Form (adq-embed, ?form=original
    // QA) still asks all four; the relay's DFORM keeps their entries and every parser no-ops when
    // the keys are absent.
    { key: 'income', type: 'radio', title: "What's your annual income? (USD)", desc: 'This helps us determine the lifestyle and type of profile you can realistically showcase without it coming off as incongruent.', opts: ['0k to 50k', '50k to 100k', '100k to 150k', '150k-200k', '200k+'],
      card: qq('"I\'m way too busy... don\'t have the energy to text with women for three to five hours."', 'S', 'Shaun R.', 'Finance Exec, London', 'tw-shaun2.jpg') },
    // 'problem' long-text and the 'start' timeline question also REMOVED (Peter 2026-08-04 review
    // cuts) — same DFORM/parser tolerance as the other cuts; downstream surfaces (lead cards,
    // /form view, GHL) render absence as empty, never 'undefined' (they enumerate present answers
    // only). With no start answer, the server's red-tier derivation (GHL start field) simply never
    // trips for athena2 leads — slots stay standard.
    { key: 'phone', type: 'phone', almost: true, title: "What's your phone number?", descHtml: 'Please input your real number - we require a text confirmation for your appointment. We will not spam you.' },
    { key: 'name', type: 'name', title: "What's your name?" },
    { key: 'email', type: 'email', title: "What's your email address?" },
    { key: 'invest', type: 'radio', title: function () { return invqPriceShown() ? 'Our minimum investment to get started is $3000 for a month. $6000 for 3 months. Are you able to invest if this is a great fit?' : 'Are you willing to invest if this makes sense for you?'; }, descHtml: function () { return invqPriceShown() ? '<span style="color:#d92d20;font-weight:600">We\'re scheduled to increase price $500 on August 1st so we can maintain high quality results for clients.</span>' : ''; }, opts: ["Yes. I'm willing and able to invest if this is a great fit.", "No. I'm not willing or able to invest at this time."],
      card: qq('"The likes you do get aren\'t women you\'re attracted to. I wanted fewer, better dates. That\'s exactly what this is."', 'C', 'Casey H.', 'CRO of a Series C company, Ogden UT', 'tw-casey.jpg') },
    { key: 'commit', type: 'radio', compact: true /* long title renders at desc size so title+options+Continue fit one mobile screen (Peter 2026-08-04) */, title: 'Last Question - On the following page, you will be able to schedule a profile audit with one of our specialists (you do not need current active profiles for this). After working with 300+ clients, we know with 100% certainty we can help you. But we can NOT help you if you do NOT show up to the scheduled call time. Will you commit to attending your selected time slot and showing up in a quiet place ready to work on your dating transformation?', opts: ['Yes - I will double-check my calendar and commit 100% to the time I choose', "Maybe - I'm not sure if I'm serious about this"] }
  ];

  // ── state / token / attribution ──
  var A = {};
  var step = -1, moving = false, locked = false, submitted = false, partialSent = false, autoT = null, fsAcc = 0, fsLast = 0;
  function newToken() { return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12); }
  var token = '';
  try { token = sessionStorage.getItem('ath_token') || ''; if (!token) { token = newToken(); sessionStorage.setItem('ath_token', token); } } catch (e) { token = newToken(); }
  var STATE_KEY = 'ath_state_v2';   // v2 (2026-08-04, athena2): the v1 deck's saved answers (usedApps/hours/…, athena income buckets) are incompatible with the Original question set — old state is simply ignored
  try {
    var sv = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (sv && sv.token === token && sv.A && typeof sv.step === 'number') {
      A = sv.A;
      step = Math.min(Math.max(0, sv.step), STEPS.length - 1);   // clamp (2026-07-31: removing questions shrank STEPS; unclamped resumes crashed / skipped the start question)
      // A resumed session can carry answers for questions that no longer exist, and can land past
      // a question with it unanswered (wrong DQ after contact capture). Rewind to the first
      // unanswered required step so edited decks stay coherent. skipIf steps count as answered.
      var validKeys = { first: 1, last: 1, q1: 1 /* answered in the hero card, not a STEPS entry */ }; STEPS.forEach(function (q) { if (q.key) validKeys[q.key] = 1; });   // 'role'/'age' dropped 2026-08-04 — swept from old saved state here
      Object.keys(A).forEach(function (k) { if (!validKeys[k]) delete A[k]; });
      for (var si = 0; si < STEPS.length && si < step; si++) {
        var sq = STEPS[si];
        if (sq.skipIf && sq.skipIf(A)) continue;
        if (sq.type === 'name') { if (!A.first || !A.last) { step = si; break; } continue; }
        var av = A[sq.key];
        if (av == null || av === '' || (Array.isArray(av) && !av.length)) { step = si; break; }
      }
    }
  } catch (e) {}
  function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify({ token: token, A: A, step: step })); } catch (e) {} }
  function clearState() { try { localStorage.removeItem(STATE_KEY); } catch (e) {} }
  function fsBump() { var now = Date.now(); if (fsLast && now - fsLast < 120000) fsAcc += (now - fsLast) / 1000; fsLast = now; }
  function pxCookie(name) { try { var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)')); return m ? decodeURIComponent(m[1]).slice(0, 400) : ''; } catch (e) { return ''; } }
  function hiddenFields() {
    var out = { ab: (window.__ADQ_AB || window.__AB || 'c'), form: 'athena2' };
    try {
      var el = document.querySelector('[data-tf-popup]');
      var s = (el && el.getAttribute('data-tf-hidden')) || '';
      s.split(',').forEach(function (pair) {
        var i = pair.indexOf('='); if (i < 1) return;
        var un = function (v) { return v.replace(/%2C/g, ',').replace(/%3D/g, '=').replace(/%25/g, '%'); };
        out[un(pair.slice(0, i))] = un(pair.slice(i + 1)).slice(0, 200);
      });
    } catch (e) {}
    out.ab = (window.__ADQ_AB || window.__AB || 'c');
    out.form = 'athena2';   // athena2 tag (2026-08-04): the relay's formLabel/recordFunnel/beacon gates all accept it
    // ST14 DSL deck arm (2026-08-05 pm): localStorage is the assignment's source of truth (set by
    // index.html's mount script); rides the hidden bag into form_fills for the ST14 money tail.
    try { var dv = localStorage.getItem('adq_dsl'); if (dv === 'a' || dv === 'b') out.dsl = dv; } catch (e) {}
    try { if (fsAcc >= 1) out.form_secs = String(Math.round(fsAcc)); } catch (e) {}
    try { out.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    try { var p = pxCookie('_fbp'); if (p) out.fbp = p; var c = pxCookie('_fbc'); if (c) out.fbc = c; } catch (e) {}
    return out;
  }
  var sid;
  try { sid = sessionStorage.getItem('ad_sid') || ''; if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('ad_sid', sid); } } catch (e) { sid = Date.now().toString(36); }
  var stepPinged = {};
  function pingEv(ev, pg) {
    try {
      navigator.sendBeacon(EP, new Blob([JSON.stringify({ event: ev, page: pg, sid: sid, ab: (window.__ADQ_AB || 'c'), form: 'athena2' })], { type: 'text/plain' }));
    } catch (e) {}
  }
  function pingStep(key) { if (stepPinged[key]) return; stepPinged[key] = 1; pingEv('form_step', key); }

  // ── phone/E.164 (same normalizer contract as the Original Form) ──
  function phoneE164() {
    var raw = String(A.phone || '').trim();
    var digits = raw.replace(/[^\d+]/g, '');
    if (digits.indexOf('00') === 0) digits = '+' + digits.slice(2);
    if (digits.charAt(0) === '+') return '+' + digits.slice(1).replace(/\D/g, '');
    var d = digits.replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') return '+' + d;
    if (d.length === 10) return '+1' + d;
    return '+1' + d;
  }
  function phoneValid() {
    var raw = String(A.phone || '').trim();
    if (!raw || /[^\d+().\-\s]/.test(raw)) return false;      // letters or stray chars = invalid
    if (raw.lastIndexOf('+') > 0) return false;                 // '+' only allowed at the front
    var d = raw.replace(/\D/g, '');
    if (raw.charAt(0) === '+' || raw.indexOf('00') === 0) {     // international
      if (raw.indexOf('00') === 0) d = d.slice(2);
      return d.length >= 8 && d.length <= 15;
    }
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d.length === 10 && d.charAt(0) !== '0' && d.charAt(0) !== '1';
  }

  // ATHENA2 DQ (Peter 2026-08-04): the Original Form's gates MINUS the timeline — the start
  // question was removed outright, so there is no timeline DQ. commit 'Maybe' DQs at the commit
  // step (same as the Original's advance()). Keep in sync with relay tfLeadDisqualified/
  // tfQualified (their athena2 branch skips the timeline gate the same way — server and client
  // must agree).
  function isDq() { return A.q1 === 'No' || A.income === '0k to 50k' || A.income === '50k to 100k' || /^No\./.test(A.invest || ''); }

  function payload(complete) {
    fsBump();
    // Same answers shape as adq-embed's payload() — the relay's DFORM builders parse these keys.
    // methow/methow_other/interest/occupation/occ_years/problem/start/age/role intentionally
    // absent (Peter's 2026-08-04 review cuts) — the relay's addChoices/addText builders no-op on
    // missing keys. q1 rides in from the HERO card answer.
    return JSON.stringify({ token: token, complete: !!complete, hp: '', hidden: hiddenFields(), answers: {
      q1: A.q1 || '', hinge_banned: A.hinge_banned || '', time_week: A.time_week || '', dates30: A.dates30 || '',
      income: A.income || '',
      first: A.first || '', last: A.last || '', phone: (A.phone ? phoneE164() : ''), email: A.email || '',
      invest: A.invest || '', commit: A.commit || ''
    } });
  }
  // ── typed-question AUTOFOCUS (Peter 2026-08-04). iOS Safari only opens the keyboard from a
  //    user gesture, and the step animation renders ~720ms after the tap — so an offscreen input
  //    is focused SYNCHRONOUSLY inside the advancing tap (adq-embed's primeKeyboard trick), then
  //    render() moves focus to the real input. ──
  var TYPED_Q = { short: 1, long: 1, phone: 1, email: 1, name: 1 };
  var _kbPrime = null;
  function primeKeyboard() {
    try {
      if (!_kbPrime) {
        _kbPrime = document.createElement('input');
        _kbPrime.type = 'text';
        _kbPrime.setAttribute('aria-hidden', 'true');
        _kbPrime.style.cssText = 'position:fixed;top:-100px;left:0;width:1px;height:1px;opacity:0;border:none;padding:0;font-size:16px';
        (ov || document.body).appendChild(_kbPrime);
      }
      _kbPrime.focus({ preventScroll: true });
    } catch (e) {}
  }
  // The moment a valid phone lands, the lead is captured server-side as a partial (same contract
  // as adq-embed's firePhonePartial) — even if they never answer another question.
  var phonePartialFired = false;
  function firePhonePartial() {
    if (phonePartialFired || submitted) return;
    phonePartialFired = true; partialSent = true;
    try { fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: payload(false), keepalive: true }).catch(function () {}); } catch (e) {}
  }
  function submit(cb) {
    if (submitted) { if (cb) cb(); return; }
    submitted = true;
    var attempt = function (left) {
      try {
        fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: payload(true), keepalive: true })
          .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
          .then(function () {
            try { pingEv(isDq() ? 'form_done_dq' : 'form_done_q', 'done'); } catch (e) {}
            try { if (A.email) localStorage.setItem('adq_em', String(A.email).toLowerCase().slice(0, 120)); } catch (e) {}
            try { sessionStorage.removeItem('ath_token'); } catch (e) {}
            clearState();
            if (cb) cb();
          })
          .catch(function () { if (left > 0) setTimeout(function () { attempt(left - 1); }, 1500); else { submitted = false; if (cb) cb(); } });
      } catch (e) { if (left > 0) setTimeout(function () { attempt(left - 1); }, 1500); else { submitted = false; if (cb) cb(); } }
    };
    attempt(5);
  }
  window.addEventListener('pagehide', function () {
    if (submitted || partialSent) return;
    var hasEmail = A.email && /.+@.+\..+/.test(A.email);
    var hasPhone = A.phone && phoneValid();
    if (!hasEmail && !hasPhone) return;
    partialSent = true;
    try { navigator.sendBeacon(API, new Blob([payload(false)], { type: 'text/plain' })); } catch (e) {}
  });

  // ── overlay DOM ──
  var ov, col, railEl, backBtn;
  function mountOverlay() {
    if (ov) return;
    ov = document.createElement('div');
    ov.id = 'athOv';
    ov.innerHTML = '<div id="athBnrSlot"></div><div id="athHead"><div class="inr"><button id="athBack">←</button><div class="athwm">AUTOMATED DATING</div></div></div>' +
      '<div id="athProgWrap"><div id="athProg"><i id="athProgFill"></i></div></div>' +
      '<div id="athBody"><div id="athCol"></div>' +
      '<div id="athRail"><div class="lbl">Match progress</div><div class="athring"><div class="pc"><b>6%</b><span>Complete</span></div></div><div class="note">Each answer helps us build your exact dating profile plan</div></div></div>';
    document.body.appendChild(ov);
    col = document.getElementById('athCol'); railEl = document.getElementById('athRail'); backBtn = document.getElementById('athBack');
    backBtn.addEventListener('click', back);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  // ── prominent top progress bar (2026-08-04, styled off the Original Form's #adqBar): counts
  //    answered questions + step position like adq-embed's setBar, so it moves on every card. ──
  function answeredCount() {
    var n = 0;
    STEPS.forEach(function (q) {
      if (q.skipIf && q.skipIf(A)) { n++; return; }   // skipped questions count as done or the bar can never fill
      if (q.type === 'name') { if (A.first && A.last) n++; return; }
      var v = A[q.key];
      if (v != null && !(Array.isArray(v) && !v.length) && String(v).trim() !== '') n++;
    });
    return n;
  }
  function setBar(full) {
    var el = document.getElementById('athProgFill'); if (!el) return;
    var TOTAL = STEPS.length + 1;
    var n = full ? TOTAL : Math.max(answeredCount(), Math.min(Math.max(step, 0), STEPS.length));
    el.style.width = Math.max(3, Math.round(100 * n / TOTAL)) + '%';
  }
  function cardHtml(c) {
    if (!c) return '';
    if (c.kind === 'info') return '<div class="athcard info"><div class="ic">' + c.icon + '</div><div>' + c.text + '</div></div>';
    var av = c.img ? '<div class="av"><img src="' + c.img + '" alt="' + esc(c.name) + '"></div>' : '<div class="av">' + c.initial + '</div>';
    return '<div class="athcard quote"><div class="qt">' + c.quote + '</div><div class="who">' + av + '<div class="nm">' + c.name + '</div><div class="rl">' + c.role + '</div></div></div>';
  }

  function openTakeover() {
    // q1 was answered in the HERO card (A.q1 already set + saved) — the takeover always begins at
    // the next question (STEPS[0] = hinge_banned since 0bfa467). Peter 2026-08-04: role card retired.
    mountOverlay();
    // banner GONE once they answer q1 and enter the form (Peter 2026-07-29 — supersedes 7/28's
    // "keep the banner at the top"; the countdown did its job on the landing, the form needs room)
    try { var bnr = document.getElementById('adBnr'); if (bnr) bnr.remove(); } catch (e) {}
    ov.classList.add('on');
    ov.classList.remove('enter'); void ov.offsetWidth; ov.classList.add('enter');
    document.documentElement.style.overflow = 'hidden';
    if (!stepPinged.form_open) { stepPinged.form_open = 1; pingEv('form_open', 'open'); }
    if (step < 0) step = 0;
    fsLast = Date.now();
    render();
    ov.scrollTop = 0;
  }
  function closeTakeover() {
    if (!ov) return;
    ov.classList.remove('on');
    document.documentElement.style.overflow = '';
    try { var bnr = document.getElementById('adBnr'); if (bnr && ov.contains(bnr) && document.body) document.body.insertBefore(bnr, document.body.firstChild); } catch (e) {}
  }

  function render(dir) {
    var s = STEPS[step];
    setBar();
    railEl.style.display = (s.rail ? 'flex' : 'none');
    backBtn.hidden = !!finishedView;
    var _qt = (typeof s.title === 'function') ? s.title(A) : s.title;
    var _qdH = (typeof s.descHtml === 'function') ? s.descHtml(A) : s.descHtml;
    var h = '';
    if (s.almost) h += '<div class="athalmost"><h1 class="athserif">You’re almost there!</h1><p>Just a few more questions to help us build your exact done-for-you dating app strategy.</p><hr></div>';
    if (s.type === 'radio' || s.type === 'multi') {
      if (step === 0) h += '<div class="athqual"><div class="ring"><b>6%</b></div><div><div class="ss">Each answer helps us build your exact dating profile plan.</div></div></div>';
      h += '<div class="athq' + (s.compact ? ' compact' : '') + '">' + esc(_qt) + '</div>';
      if (_qdH) h += '<div class="athd">' + _qdH + '</div>';
      else if (s.desc) h += '<div class="athd">' + esc(s.desc) + '</div>';
      h += '<div class="athops">' + s.opts.map(function (o, i) {
        return '<div class="athop" data-i="' + i + '"><div class="' + (s.type === 'radio' ? 'r' : 'c') + '"></div><div>' + esc(o) + '</div></div>';
      }).join('') + '</div>';
      h += '<button class="athgo" id="athGo">Continue&nbsp;&nbsp;→</button>';
      h += cardHtml(s.card);
    } else if (s.type === 'wheel') {
      // iOS-style scroll wheel — ported from adq-embed (age 18-65 def 35 / occ_years 1-99 def 8)
      if (!A[s.key]) A[s.key] = String(s.def || s.min || 18);
      h += '<div class="athq">' + esc(_qt) + '</div>';
      var wItems = '';
      for (var wv = (s.min || 18); wv <= (s.max || 65); wv++) wItems += '<div class="athwitem' + (String(wv) === String(A[s.key]) ? ' cur' : '') + '" data-wv="' + wv + '">' + wv + '</div>';
      h += '<div class="athwheelwrap"><div class="athwheel" id="athWheel">' + wItems + '</div><div class="athwhl"></div></div>';
      h += '<button class="athgo show" id="athGo">Continue&nbsp;&nbsp;→</button>';
      h += cardHtml(s.card);
    } else {
      // typed questions: short / long / phone / email / name
      h += '<div class="athq">' + esc(_qt) + '</div>';
      if (_qdH) h += '<div class="athd">' + _qdH + '</div>';
      else if (s.desc) h += '<div class="athd">' + esc(s.desc) + '</div>';
      if (s.type === 'name') {
        h += '<label class="athlbl" style="margin-top:26px">First name *</label><input class="athin" id="athF" autocomplete="given-name" placeholder="Jane" value="' + esc(A.first || '') + '" style="max-width:430px">' +
             '<label class="athlbl">Last name *</label><input class="athin" id="athL" autocomplete="family-name" placeholder="Smith" value="' + esc(A.last || '') + '" style="max-width:430px">';
      } else if (s.type === 'long') {
        h += '<textarea class="athin" id="athIn" rows="3" placeholder="Type your answer here..." style="margin-top:26px">' + esc(A[s.key] || '') + '</textarea>';
      } else {
        var _it = s.type === 'email' ? 'email' : (s.type === 'phone' ? 'tel' : 'text');
        var _ac = s.type === 'email' ? 'email' : (s.type === 'phone' ? 'tel' : 'off');
        var _ph = s.type === 'email' ? 'name@example.com' : (s.type === 'phone' ? '(201) 555-0123' : 'Type your answer here...');
        h += '<input class="athin" id="athIn" type="' + _it + '" ' + (s.type === 'phone' ? 'inputmode="tel" ' : '') + 'autocomplete="' + _ac + '" placeholder="' + _ph + '" value="' + esc(A[s.key] || '') + '" style="margin-top:26px;max-width:430px">';
      }
      h += '<button class="athgo show" id="athGo">Continue&nbsp;&nbsp;→</button><div class="atherr" id="athErr"></div>';
      h += cardHtml(s.card);
    }
    col.innerHTML = h;
    if ((s.type === 'radio' || s.type === 'multi') && A[s.key] && A[s.key].length) {
      var prev = (s.type === 'radio') ? [A[s.key]] : A[s.key];
      var els2 = col.querySelectorAll('.athop');
      s.opts.forEach(function (o, i) { if (prev.indexOf(o) !== -1) els2[i].classList.add('on'); });
      var cb2 = document.getElementById('athGo'); if (cb2) cb2.classList.add('show');
    }
    col.querySelectorAll('.athop').forEach(function (el) {
      el.addEventListener('click', function () { pick(parseInt(el.getAttribute('data-i'), 10)); });
    });
    var wh = document.getElementById('athWheel');
    if (wh) {
      var IH = 44, wMin = s.min || 18, wMax = s.max || 65;
      wh.scrollTop = (parseInt(A[s.key], 10) - wMin) * IH;
      var _wt = null;
      var wSync = function () {
        var idx = Math.max(0, Math.min(wMax - wMin, Math.round(wh.scrollTop / IH)));
        var val = String(wMin + idx);
        if (val !== A[s.key]) {
          A[s.key] = val;
          var c0 = wh.querySelector('.athwitem.cur'); if (c0) c0.classList.remove('cur');
          var c1 = wh.querySelector('[data-wv="' + val + '"]'); if (c1) c1.classList.add('cur');
          if (_wt) clearTimeout(_wt);
          _wt = setTimeout(saveState, 150);
        }
      };
      wh.addEventListener('scroll', wSync);
      wh.addEventListener('click', function (ev) {
        var t = ev.target && ev.target.closest ? ev.target.closest('.athwitem') : null;
        if (!t) return;
        // Instant jump, not smooth-scroll (adq-embed lesson: snap + .cur retag cancel the animation)
        wh.scrollTop = (parseInt(t.getAttribute('data-wv'), 10) - wMin) * IH;
        wSync();
      });
    }
    var ta = col.querySelector('textarea.athin');
    if (ta) { var grow = function () { ta.style.height = 'auto'; ta.style.height = Math.min(Math.max(ta.scrollHeight, 96), 260) + 'px'; }; ta.addEventListener('input', grow); grow(); }
    var go = document.getElementById('athGo');
    if (go) go.addEventListener('click', next);
    // Autofocus every typed question — the keyboard prime in the advancing tap keeps iOS willing
    // to show the keyboard even though this render happens after the gesture window.
    var inp = document.getElementById('athIn') || document.getElementById('athF');
    if (inp) { try { inp.focus({ preventScroll: true }); } catch (e) { try { inp.focus(); } catch (e2) {} } }
    else if (_kbPrime) { try { _kbPrime.blur(); } catch (e) {} }
    col.classList.remove('anim', 'animL', 'out', 'outR'); void col.offsetWidth;
    col.classList.add(dir === 'back' ? 'animL' : 'anim');
    locked = false;
    ov.scrollTop = 0;
    saveState();
  }

  function pick(i) {
    if (moving || locked) return;   // taps during auto-advance/transition were re-selecting (Peter 2026-07-28)
    var s = STEPS[step];
    fsBump();
    var els = col.querySelectorAll('.athop');
    if (s.type === 'radio') {
      var revisit = (A[s.key] !== undefined);
      els.forEach(function (e) { e.classList.remove('on'); });
      els[i].classList.add('on');
      A[s.key] = s.opts[i];
      clearTimeout(autoT);
      if (revisit) document.getElementById('athGo').classList.add('show');
      else {
        locked = true;
        if (TYPED_Q[(STEPS[nextIdx(step)] || {}).type] && !(s.key === 'invest' && isDq()) && s.key !== 'commit') primeKeyboard();   // keyboard primes inside THIS tap's gesture (never before an ending screen)
        autoT = setTimeout(function () { if (STEPS[step] === s) next(); }, 320);
      }
    } else {
      var isAll = /^All of the above|^All four/.test(s.opts[i]);
      if (isAll) { els.forEach(function (e, j) { e.classList.toggle('on', j === i); }); }
      else { els[i].classList.toggle('on'); els.forEach(function (e, j) { if (/^All of the above/.test(s.opts[j])) e.classList.remove('on'); }); }
      var on = [].slice.call(els).filter(function (e) { return e.classList.contains('on'); });
      A[s.key] = on.map(function (e) { return e.textContent; });
      document.getElementById('athGo').classList.toggle('show', on.length > 0);
    }
    saveState();
  }
  function errMsg(m) { var e = document.getElementById('athErr'); if (e) e.textContent = m || ''; }
  // Per-type validation + answer capture (mirror of adq-embed's collect())
  function collect(s) {
    if (s.type === 'name') {
      var f = document.getElementById('athF'), l = document.getElementById('athL');
      A.first = f ? f.value.trim() : ''; A.last = l ? l.value.trim() : '';
      saveState();
      if (!A.first || !A.last) { errMsg('Please fill in your first and last name.'); return false; }
    } else if (s.type === 'phone') {
      A.phone = ((document.getElementById('athIn') || {}).value || '').trim();
      saveState();
      if (!phoneValid()) { errMsg('Hmm... that phone number doesn\'t look right'); return false; }
    } else if (s.type === 'email') {
      A.email = ((document.getElementById('athIn') || {}).value || '').trim();
      saveState();
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(A.email)) { errMsg('Hmm... that email doesn\'t look right'); return false; }
    } else if (s.type === 'short' || s.type === 'long') {
      var vt = ((document.getElementById('athIn') || {}).value || '').trim();
      A[s.key] = vt; saveState();
      if (!vt) { errMsg('Please fill this in'); return false; }
    } else if (s.type === 'multi') {
      if (!(A[s.key] || []).length) return false;
    } else if (!A[s.key]) { return false; }
    errMsg('');
    return true;
  }
  function nextIdx(from) { var s2 = from + 1; while (s2 < STEPS.length - 1 && STEPS[s2].skipIf && STEPS[s2].skipIf(A)) s2++; return s2; }   // skipIf-aware (defensive — no skipIf steps in the current deck)
  function prevIdx(from) { var s2 = from - 1; while (s2 > 0 && STEPS[s2].skipIf && STEPS[s2].skipIf(A)) s2--; return s2; }
  function next() {
    if (moving) return;
    var s = STEPS[step];
    fsBump();
    if (!collect(s)) { locked = false; return; }
    if (s.key) pingStep(s.key);
    if (s.key === 'phone') firePhonePartial();
    // Original Form endings, verbatim (keep in sync with adq-embed's advance()): DQ evaluates at
    // the INVEST question; commit "Maybe" DQs; else calendar. Submission fires when an ENDING is
    // reached — before the calendar shows, so qualified non-bookers are never lost.
    if (s.key === 'invest' && isDq()) { showDq(); return; }
    if (s.key === 'commit') {
      if (/^Maybe/.test(A.commit || '')) { showDq(); return; }
      showBooker(); return;
    }
    moving = true;
    if (TYPED_Q[(STEPS[nextIdx(step)] || {}).type]) primeKeyboard();   // Continue taps call next() synchronously — still inside the gesture
    col.classList.remove('anim', 'animL', 'outR'); void col.offsetWidth; col.classList.add('out');
    setTimeout(function () { moving = false; step = nextIdx(step); render(); }, 400);
  }
  function back() {
    if (moving) return;
    if (finishedView) return;
    if (step <= 0) { closeTakeover(); return; }
    moving = true;
    if (TYPED_Q[(STEPS[prevIdx(step)] || {}).type]) primeKeyboard();
    col.classList.remove('anim', 'animL', 'out'); void col.offsetWidth; col.classList.add('outR');
    setTimeout(function () { moving = false; step = prevIdx(step); render('back'); }, 400);
  }

  var finishedView = '';
  function showDq() {
    // Submit FIRST (DQ'd leads are still captured — contact landed at phone/name/email), then the soft no.
    submit(function () {});
    finishedView = 'dq';
    backBtn.hidden = true;
    railEl.style.display = 'none';
    setBar(1);
    clearTimeout(autoT); moving = false; locked = false;
    col.innerHTML = '<div class="athend"><p class="t">Unfortunately it seems like we aren’t a great fit right now.</p><p class="d">Feel free to check back if things change!</p></div>';
    col.classList.remove('anim', 'animL', 'out', 'outR'); void col.offsetWidth; col.classList.add('anim');
    ov.scrollTop = 0;
  }
  function showBooker() {
    submit(function () {});
    finishedView = 'booker';
    setBar(1);
    clearTimeout(autoT); moving = false; locked = false;
    try { navigator.sendBeacon(EP, new Blob([JSON.stringify({ event: 'cal_shown', page: 'cal', sid: sid, ab: (window.__ADQ_AB || 'c'), form: 'athena2', email: (A.email || '') })], { type: 'text/plain' })); } catch (e) {}
    openInlineBooker();
  }


  // ── inline native booker (Peter 2026-07-28 pm: "go in line with the form... same backend as
  //    the popup native one"). Ported 1:1 from the adq-embed popup booker — same /api/apply/slots
  //    + /api/apply/book pipeline, retries, mobile two-step, slot-taken recovery and /thankyou
  //    redirect — rendered inside the takeover in the Athena skin. athena2 (2026-08-04): the
  //    start/timeline question is gone, so the client never sends a red-tier hint — slots stay
  //    standard (the server still re-derives red from the GHL contact for legacy/lied-on-app).
  var ABK_SLOTS = 'https://admin.automated.dating/api/apply/slots';
  var ABK_BOOK = 'https://admin.automated.dating/api/apply/book';
  var ABK_IC = {
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#556055" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    cal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#556055" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#556055" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/></svg>'
  };
  var abk = { loaded: false, fetching: false, dates: {}, mins: 30, month: null, selDate: '', armed: '', slot: '', view: 'time', mStep: 'date', err: '', busy: false, tz: '', confirmed: false, vals: null };
  try { abk.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'; } catch (e) { abk.tz = 'America/New_York'; }
  var ABK_TZS = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu', 'America/Toronto', 'America/Vancouver', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney'];
  if (ABK_TZS.indexOf(abk.tz) < 0) ABK_TZS.unshift(abk.tz);
  function abkMob() { return window.matchMedia('(max-width: 760px)').matches; }
  function abkGmt(tz) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(new Date());
      var off = (parts.find(function (p) { return p.type === 'timeZoneName'; }) || {}).value || '';
      return off + ' ' + tz.replace(/_/g, ' ');
    } catch (e) { return tz.replace(/_/g, ' '); }
  }
  function abkTime(iso) { return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: abk.tz }); }
  function abkWhen(iso) {
    var d = new Date(iso);
    return abkTime(iso) + ' - ' + new Date(d.getTime() + abk.mins * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: abk.tz }) +
      ' , ' + d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: abk.tz });
  }
  function abkFetch() {
    var f = function (left) {
      return fetch(ABK_SLOTS, { headers: { 'Content-Type': 'text/plain' } }).then(function (r) { return r.json(); })
        .catch(function (e) { if (left > 0) return new Promise(function (rz) { setTimeout(rz, 2500); }).then(function () { return f(left - 1); }); throw e; });
    };
    f(3).then(function (j) {
      if (!j || !j.ok) { abk.err = (j && j.error) || 'Could not load times'; abk.loaded = true; abkRender(); return; }
      abk.dates = j.dates || {}; abk.mins = j.durationMins || 30; abk.loaded = true; abk.err = '';
      var keys = Object.keys(abk.dates).filter(function (k) { return (abk.dates[k] || []).length; }).sort();
      if (!abk.selDate || keys.indexOf(abk.selDate) < 0) abk.selDate = keys[0] || '';
      abk.month = abk.selDate ? new Date(abk.selDate + 'T12:00:00') : new Date();
      abkRender();
    }).catch(function () { abk.err = 'Could not load times'; abk.loaded = true; abkRender(); });
  }
  function abkTzHtml() {
    return '<div class="abk-tzwrap"><div class="abk-tzlbl">Time zone</div>' + ABK_IC.globe + ' <select id="abkTz">' +
      ABK_TZS.map(function (tz) { return '<option value="' + esc(tz) + '"' + (tz === abk.tz ? ' selected' : '') + '>' + esc(abkGmt(tz)) + '</option>'; }).join('') +
      '</select></div>';
  }
  function abkCalHtml() {
    var m = abk.month || new Date();
    var y = m.getFullYear(), mo = m.getMonth();
    var first = new Date(y, mo, 1), startDow = first.getDay(), dim = new Date(y, mo + 1, 0).getDate();
    var head = '<div class="abk-monthrow"><button type="button" data-abknav="-1">&lsaquo;</button><span>' + m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + '</span><button type="button" data-abknav="1">&rsaquo;</button></div>';
    var h = '<table class="abk-cal"><tr>' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (d) { return '<th>' + d + '</th>'; }).join('') + '</tr><tr>';
    var cell = 0;
    for (var i = 0; i < startDow; i++) { h += '<td></td>'; cell++; }
    for (var day = 1; day <= dim; day++) {
      var key = y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      var av = (abk.dates[key] || []).length > 0;
      var cls = 'abk-day' + (av ? ' av' : '') + (key === abk.selDate ? ' sel' : '');
      h += '<td><span class="' + cls + '"' + (av ? ' data-abkdate="' + key + '"' : '') + '>' + day + '</span></td>';
      cell++;
      if (cell % 7 === 0 && day < dim) h += '</tr><tr>';
    }
    h += '</tr></table>';
    var others = Object.keys(abk.dates).filter(function (k) { if (!(abk.dates[k] || []).length) return false; var d2 = new Date(k + 'T12:00:00'); return d2.getMonth() !== mo || d2.getFullYear() !== y; }).sort().slice(0, 6);
    var extra = '';
    if (others.length) extra = '<div style="margin-top:10px;text-align:center;font-size:13px;color:#5C665C">Also available: ' + others.map(function (k) { var d3 = new Date(k + 'T12:00:00'); return '<span class="abk-day av" data-abkdate="' + k + '" style="width:auto;height:30px;line-height:30px;padding:0 12px;border-radius:99px;margin:0 3px">' + d3.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</span>'; }).join('') + '</div>';
    return '<div class="abk-calwrap">' + head + h + extra + abkTzHtml() + '</div>';
  }
  function abkSlotsHtml() {
    var slots = (abk.dates[abk.selDate] || []);
    if (!slots.length) return '<div class="abk-slots"><div style="color:#8a9288;font-size:13px">No times this day</div></div>';
    return '<div class="abk-slots">' + slots.map(function (iso) {
      if (abk.armed === iso) return '<div class="abk-pair"><button type="button" class="abk-chip">' + abkTime(iso) + '</button><button type="button" class="abk-go" data-abksel="' + esc(iso) + '">Select</button></div>';
      return '<button type="button" class="abk-slot" data-abkarm="' + esc(iso) + '">' + abkTime(iso) + '</button>';
    }).join('') + '</div>';
  }
  function abkDetailsHtml() {
    var v = abk.vals || {};
    return '<div class="abk-details">' +
      '<label class="athlbl">First Name *</label><input class="athin" type="text" id="abkFirst" value="' + esc(v.first != null ? v.first : (A.first || '')) + '">' +
      '<label class="athlbl">Phone *</label><input class="athin" type="tel" id="abkPhone" value="' + esc(v.phone != null ? v.phone : (A.phone ? phoneE164() : '')) + '">' +
      '<label class="athlbl">Email *</label><input class="athin" type="email" id="abkEmail" value="' + esc(v.email != null ? v.email : (A.email || '')) + '">' +
      '<label class="abk-confirm"><input type="checkbox" id="abkConfirm"' + (abk.confirmed ? ' checked' : '') + '><span>Please confirm you will 100% be ready at this time at a laptop with no distractions. *</span></label>' +
      '<button type="button" class="abk-sched' + (abk.confirmed ? '' : ' off') + '" id="abkSched">Schedule Meeting</button>' +
      '<button type="button" class="abk-newtime" id="abkNewTime">Pick a new time</button>' +
      '<div class="abk-err" id="abkErr">' + esc(abk.err || '') + '</div></div>';
  }
  function abkDayLabel() { return abk.selDate ? new Date(abk.selDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''; }
  var ABK_HEAD = '<div class="abk-title">Select a Date &amp; Time for Your Profile Audit</div><div class="abk-sub">30 min - This is where we see if our program will work for you based on your current results, logistics and goals.</div>';
  function abkRender() {
    if (!abk.loaded) { col.innerHTML = '<div class="abk"><div class="abk-load">Loading available times…</div></div>'; if (!abk.fetching) { abk.fetching = true; abkFetch(); } return; }
    var inner;
    if (abk.view === 'details') {
      inner = '<button type="button" class="abk-back" id="abkBackTimes">&lsaquo; Back</button>' +
        '<div class="abk-title">Enter Details</div>' +
        '<div class="abk-when">' + ABK_IC.clock + ' ' + abk.mins + ' min &nbsp; ' + ABK_IC.cal + ' ' + esc(abkWhen(abk.slot)) + '</div>' +
        '<div class="abk-when">' + ABK_IC.globe + ' ' + esc(abk.tz.replace(/_/g, ' ')) + '</div>' +
        abkDetailsHtml();
    } else if (abkMob() && abk.mStep === 'slots') {
      inner = '<button type="button" class="abk-back" id="abkBackDates">&lsaquo; Pick a different day</button>' +
        '<div class="abk-dayhead">' + esc(abkDayLabel()) + '</div>' + abkSlotsHtml() +
        (abk.err ? '<div class="abk-err">' + esc(abk.err) + '</div>' : '');
    } else if (abkMob()) {
      inner = '<button type="button" class="abk-back" id="abkBackForm">&lsaquo; Back</button>' + ABK_HEAD + abkCalHtml() +
        (abk.err ? '<div class="abk-err">' + esc(abk.err) + '</div>' : '');
    } else {
      inner = '<button type="button" class="abk-back" id="abkBackForm">&lsaquo; Back</button>' + ABK_HEAD +
        '<div class="abk-grid">' + abkCalHtml() +
        '<div class="abk-slotcol"><div class="abk-dayhead">' + esc(abkDayLabel()) + '</div>' + abkSlotsHtml() + '</div></div>' +
        (abk.err ? '<div class="abk-err">' + esc(abk.err) + '</div>' : '');
    }
    col.innerHTML = '<div class="abk">' + inner + '</div>';
    // Arming a slot re-renders the same list — keep the scroll (Peter 2026-08-06: tapping any
    // time below the fold on mobile snapped the overlay back to the top). View CHANGES still
    // start at the top like before.
    if (abk._keepScroll != null) { ov.scrollTop = abk._keepScroll; abk._keepScroll = null; }
    else ov.scrollTop = 0;
    col.querySelectorAll('[data-abkdate]').forEach(function (el) { el.addEventListener('click', function () { abk.selDate = el.getAttribute('data-abkdate'); abk.month = new Date(abk.selDate + 'T12:00:00'); abk.armed = ''; if (abkMob()) abk.mStep = 'slots'; abkRender(); }); });
    col.querySelectorAll('[data-abknav]').forEach(function (el) { el.addEventListener('click', function () { var m = abk.month || new Date(); abk.month = new Date(m.getFullYear(), m.getMonth() + parseInt(el.getAttribute('data-abknav'), 10), 1); abkRender(); }); });
    col.querySelectorAll('[data-abkarm]').forEach(function (el) { el.addEventListener('click', function () { abk.armed = el.getAttribute('data-abkarm'); abk._keepScroll = ov.scrollTop; abkRender(); }); });
    col.querySelectorAll('[data-abksel]').forEach(function (el) { el.addEventListener('click', function () { abk.slot = el.getAttribute('data-abksel'); abk.view = 'details'; abk.err = ''; abk.confirmed = false; abkRender(); }); });
    var tzSel = document.getElementById('abkTz');
    if (tzSel) tzSel.addEventListener('change', function () { abk.tz = tzSel.value; abkRender(); });
    var bt = document.getElementById('abkBackTimes');
    if (bt) bt.addEventListener('click', function () { abk.view = 'time'; abk.err = ''; abkRender(); });
    var bd = document.getElementById('abkBackDates');
    if (bd) bd.addEventListener('click', function () { abk.mStep = 'date'; abk.armed = ''; abkRender(); });
    // "‹ Back" from the calendar returns to the contact step (already submitted — the submitted
    // flag guards a double-fire; Continue just reopens the booker).
    var bf = document.getElementById('abkBackForm');
    if (bf) bf.addEventListener('click', function () { finishedView = ''; backBtn.hidden = false; render('back'); });
    var nt = document.getElementById('abkNewTime');
    if (nt) nt.addEventListener('click', function () { abk.view = 'time'; abk.mStep = 'date'; abk.armed = ''; abk.slot = ''; abk.err = ''; abk.loaded = false; abk.fetching = false; abkRender(); });
    var sb = document.getElementById('abkSched');
    if (sb) sb.addEventListener('click', abkSchedule);
    var cf = document.getElementById('abkConfirm');
    if (cf) cf.addEventListener('change', function () {
      if (sb) sb.classList.toggle('off', !cf.checked);
      if (cf.checked) { var e = document.getElementById('abkErr'); if (e) e.textContent = ''; }
    });
  }
  function abkSchedule() {
    if (abk.busy) return;
    var first = (document.getElementById('abkFirst') || {}).value || '';
    var phone = (document.getElementById('abkPhone') || {}).value || '';
    var email = (document.getElementById('abkEmail') || {}).value || '';
    var conf = document.getElementById('abkConfirm');
    var errEl = document.getElementById('abkErr');
    var fail = function (m) { if (errEl) errEl.textContent = m; };
    if (!first.trim()) return fail('Please enter your first name');
    if (phone.replace(/\D/g, '').length < 8) return fail('Please enter a valid phone number');
    if (/^(\d)\1{6}$/.test(phone.replace(/\D/g, '').slice(-7))) return fail("That phone number doesn't look right. Please double-check it");
    if (!/.+@.+\..+/.test(email)) return fail('Please enter a valid email');
    if (!conf || !conf.checked) return fail('Please confirm above that you will be ready, or pick a new time below.');
    abk.busy = true;
    abk.err = '';
    abk.vals = { first: first, phone: phone, email: email };
    abk.confirmed = true;
    var MSGS = ['Locking in your time slot...', 'Confirming with our calendar...', 'Finalizing your booking...'];
    col.innerHTML = '<div class="abk"><div class="abk-prog"><div class="abk-spin"></div>' +
      '<div class="abk-prog-msg" id="abkPMsg">' + MSGS[0] + '</div>' +
      '<div class="abk-prog-bar"><i id="abkPBar"></i></div>' +
      '<div class="abk-prog-pct" id="abkPPct">0%</div>' +
      '<div class="abk-prog-note">Please allow up to 30 seconds for your booking to go through &amp; redirect.</div></div></div>';
    var w = 0, mi = 0;
    var tick = setInterval(function () {
      w += (93 - w) * 0.08;
      var bar = document.getElementById('abkPBar'), pct = document.getElementById('abkPPct');
      if (bar) bar.style.width = w + '%';
      if (pct) pct.textContent = Math.round(w) + '%';
    }, 350);
    var mrot = setInterval(function () {
      mi = Math.min(mi + 1, MSGS.length - 1);
      var m = document.getElementById('abkPMsg'); if (m) m.textContent = MSGS[mi];
    }, 2600);
    var done = function () { clearInterval(tick); clearInterval(mrot); };
    var body = JSON.stringify({ first: first.trim(), last: A.last || '', email: email.trim(), phone: phone.trim(), startTime: abk.slot, red: '', fbp: pxCookie('_fbp'), fbc: pxCookie('_fbc') });
    var bookFetch = function (left) {
      return fetch(ABK_BOOK, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: body }).then(function (r) { return r.json(); })
        .catch(function (e) { if (left > 0) return new Promise(function (rz) { setTimeout(rz, 3000); }).then(function () { return bookFetch(left - 1); }); throw e; });
    };
    bookFetch(2)
      .then(function (j) {
        done();
        if (j && j.ok) {
          try { pingEv('booked_ok', 'booked'); } catch (e) {}
          var bar = document.getElementById('abkPBar'), pct = document.getElementById('abkPPct'), m = document.getElementById('abkPMsg');
          if (bar) bar.style.width = '100%';
          if (pct) pct.textContent = '100%';
          if (m) m.textContent = 'Booked! Loading your confirmation...';
          try { clearState(); sessionStorage.removeItem('ath_token'); } catch (e) {}
          try { if (email) localStorage.setItem('adq_em', String(email).toLowerCase().trim().slice(0, 120)); } catch (e) {}
          try { localStorage.setItem('adq_book', JSON.stringify({ iso: abk.slot, f: first.trim(), l: A.last || '', p: phone.trim(), e: String(email).toLowerCase().trim(), ts: Date.now() })); } catch (e) {}   // /thankyou reschedule popup reads this (Peter 2026-07-30)
          setTimeout(function () { window.location.href = '/thankyou/'; }, 400);
          return;
        }
        abk.busy = false;
        var msg = (j && j.error) || 'Booking failed - please try again';
        if (/just taken|pick another/i.test(msg)) { abk.view = 'time'; abk.mStep = 'date'; abk.armed = ''; abk.slot = ''; abk.err = msg; abk.loaded = false; abk.fetching = false; abkRender(); return; }
        abk.err = msg; abkRender();
      })
      .catch(function () { done(); abk.busy = false; abk.err = 'Network error - please try again'; abkRender(); });
  }
  function openInlineBooker() {
    backBtn.hidden = true;
    railEl.style.display = 'none';
    col.classList.remove('anim', 'animL', 'out', 'outR'); void col.offsetWidth; col.classList.add('anim');
    abkRender();
  }

  // ── hero variant (arm B page changes) ──
  // ── Ad-congruent hero routing (Peter 2026-08-04, pain-ads launch): the H1 + subline swap by the
  // arriving ad's utm_content ({{ad.name}} — every Meta ad carries it via the account url_tags).
  // ONLY the H1/subline change; eyebrow, q1 hero card, quote, and the whole page stay identical.
  // Buckets: time (delegation) · stuck (invisible/nowhere/restart) · winners (successful, selective).
  // Prefix fallbacks so future ads degrade to a sensible hero, never the generic one: pain-* → stuck,
  // vsl-* → time. No utm / organic / unmapped → the default hero below, unchanged. The choice is
  // remembered (localStorage) so a return visit without UTMs stays congruent. Tracking needs no new
  // field: per-hero conversion falls out of utm_content grouping, which every beacon already carries.
  var HERO_MAP = {
    'pain-too-busy': 'time', 'vsl-0801-v1': 'time', 'vsl-0801-v2': 'time', 'vsl-0801-v5': 'time',
    'pain-zero-matches': 'stuck', 'pain-matches-no-dates': 'stuck', 'pain-left-on-read': 'stuck',
    'pain-texts-wont-meet': 'stuck', 'pain-photos-killing': 'stuck', 'pain-bots-ghosting': 'stuck',
    'pain-new-city': 'stuck', 'pain-after-divorce': 'stuck', 'vsl-0801-v3': 'stuck',
    'pain-successful-single': 'winners', 'pain-winning-work': 'winners', 'pain-close-deals': 'winners',
    'pain-better-in-person': 'winners', 'pain-good-at-dating': 'winners', 'pain-only-matching': 'winners',
    'vsl-0801-v4': 'winners'
  };
  // One shared subline across ALL hero variations (Peter 2026-08-04 pm: 'change this for every variation').
  // 2026-08-05 pm (Peter, DSL pass): First/Then structure retired — one sentence, no labels.
  var HERO_SUB = 'We run all of your dating apps scheduling dates for you. You just show up.';
  var HERO_COPY = {
    time: { h1: '<span class="l">If your time’s worth $50 an hour,</span><span class="l"><em>stop swiping.</em></span>',
      sub: HERO_SUB },
    stuck: { h1: '<span class="l">It’s not you.</span><span class="l"><em>It’s the ranking system.</em></span>',
      sub: HERO_SUB },
    winners: { h1: '<span class="l">You built everything but the</span><span class="l"><em>one thing you actually want.</em></span>',
      sub: HERO_SUB }
  };
  function heroBucket() {
    try {
      var uc = new URLSearchParams(location.search).get('utm_content') || '';
      var b = uc && (HERO_MAP[uc] || (uc.indexOf('pain-') === 0 ? 'stuck' : (uc.indexOf('vsl-') === 0 ? 'time' : '')));
      if (b) { try { localStorage.setItem('adq_hero', b); } catch (e) {} return b; }
      return localStorage.getItem('adq_hero') || '';
    } catch (e) { return ''; }
  }
  function heroVariant() {
    var hb = null; try { hb = HERO_COPY[heroBucket()] || null; } catch (e) {}
    try {
      var h1 = document.querySelector('.hero h1');
      if (h1) {
        h1.innerHTML = hb ? hb.h1 : '<span class="l">You’re losing 10+ hours a week</span><span class="l"><em>to work someone else should do.</em></span>';
        // 'Trusted by 300+...' eyebrow retired on every hero (Peter 2026-08-05 pm: "remove this
        // from everything"); the .athEyebrow style rule stays for old cached HTML, harmless.
      }
    } catch (e) {}
    try {
      var sub = document.querySelector('.hero .sub');
      if (sub) {
        sub.innerHTML = hb ? hb.sub : HERO_SUB;   // First/Then copy everywhere (labels bold via .sub b)
        var tq = document.createElement('div');
        tq.id = 'athHeroQuote';
        tq.innerHTML = '"If I just put in the time, I\'d be fine. But I can\'t afford to with my schedule. Landing high quality dates is literally a full time job nowadays."' +
          '<div class="who"><div class="av"><img src="' + PIC + 'tw-grayson.jpg" alt="Grayson"></div><div><div class="nm">Grayson C.</div><div class="rl">Founder, NYC</div></div></div>';
        // testimonial goes UNDER the form card (Peter 2026-07-28 pm)
        var host0 = document.getElementById('adqInlineHost');
        if (host0 && host0.parentNode) host0.parentNode.insertBefore(tq, host0.nextSibling);
        else sub.parentNode.insertBefore(tq, sub.nextSibling);
      }
    } catch (e) {}
    try {
      // Hero card = the q1 question (Peter 2026-08-04: replaced the role card — same #athRole
      // styling/frame, q1's VERBATIM title, Yes/No options). Answering it prefills A.q1 and opens
      // the takeover at the NEXT question; q1 still submits and still gates DQ (isDq/tfQualified).
      var host = document.getElementById('adqInlineHost');
      if (host) {
        host.innerHTML = '<div id="athRole"><h3>Are you a man (aged 27-55) looking to date high quality women?</h3><p class="sub2">Apply for our professional dating app management team that pays for itself in time and results.</p>' +
          ['Yes', 'No'].map(function (r) {
            return '<div class="athro" data-q1="' + r + '"><span>' + r + '</span><b>→</b></div>';
          }).join('') + '</div>';
        host.querySelectorAll('.athro').forEach(function (el) {
          el.addEventListener('click', function () {
            A.q1 = el.getAttribute('data-q1');
            saveState();
            pingStep('q1');
            if (TYPED_Q[(STEPS[0] || {}).type]) primeKeyboard();   // gesture-synchronous, same as in-flow taps
            openTakeover();
          });
        });
      }
    } catch (e) {}
    // testimonial wall moves up right under the hero (Peter: "the testimonials are coming up underneath it")
    try {
      var wall = document.getElementById('wall');
      var hero = document.querySelector('header.hero');
      if (wall && hero) {
        var sect = wall.closest('section') || wall.parentElement;
        if (sect && hero.parentNode) hero.parentNode.insertBefore(sect, hero.nextSibling);
      }
    } catch (e) {}
  }

  // every CTA opens the Athena form (capture beats adq-embed's own listener). Until q1 is
  // answered in the hero card, CTAs scroll back to it instead of opening the takeover.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-tf-popup]');
    if (!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (A.q1) openTakeover();
    else { var rc = document.getElementById('athRole'); if (rc) { try { rc.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { rc.scrollIntoView(); } } }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', heroVariant); else heroVariant();

})();
