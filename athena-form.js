// ═══ ATHENA FORM — split-test arm B (Peter 2026-07-28) ═══
// Active ONLY when window.__ADQ_FORM === 'athena' (set by the form-split boot in <head>;
// /athenatest forces it, apex splits 50/50 via the adq_form cookie).
//
// Arm B experience on the SAME page/URL:
//   hero title swaps → role-question card in the hero → testimonial wall moves up underneath →
//   answering the role question morphs the page into the Athena-style full-screen form
//   (the design approved at admin.automated.dating/athenatest) → loader → contact →
//   /api/apply submit (hidden.form = 'athena') → qualified: the SAME native booker as the
//   Original Form (adq-embed bridge) · DQ'd: the standard DQ screen, no calendar, no automations.
//
// DQ rules (client mirror — server is authoritative, keep in sync with relay tfLeadDisqualified):
//   income 'Under 150k' OR timeline not ASAP. Contact is always captured BEFORE the DQ screen.
// Shared-field contract: timeline posts as `start`, income maps onto the Original Form's buckets
// ('150k to 200k' → '150k-200k') so GHL/SendBlue fields line up across both forms.
// This file must load BEFORE adq-embed.js (its capture listener hijacks the CTA clicks on arm B).
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
  '.athq{font-size:21px;font-weight:600;line-height:1.45;color:#2f3a2f}' +
  '.athd{font-size:14px;color:#5C665C;margin-top:8px}' +
  '.athops{margin-top:26px;display:flex;flex-direction:column;gap:16px}' +
  '.athop{display:flex;align-items:center;gap:15px;cursor:pointer;font-size:17px;color:#333d33;-webkit-tap-highlight-color:transparent}' +
  '.athop .r{flex:none;width:26px;height:26px;border-radius:50%;border:1.6px solid #C4CDC0;background:#fff;transition:all .12s;position:relative}' +
  '.athop .c{flex:none;width:25px;height:25px;border-radius:6px;border:1.6px solid #C4CDC0;background:#fff;transition:all .12s;position:relative}' +
  '.athop.on .r{border-color:#24352B;background:#24352B;box-shadow:inset 0 0 0 5px #fff}' +
  '.athop.on .c{border-color:#24352B;background:#24352B}' +
  '.athop.on .c::after{content:"\\2713";position:absolute;inset:0;color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center}' +
  '@keyframes athCd{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}' +
  '.athgo{display:none;margin-top:28px;width:100%;border:none;background:#24352B;color:#fff;font-family:inherit;font-size:15.5px;font-weight:600;padding:16px 0;border-radius:8px;cursor:pointer}' +
  '.athgo:hover{background:#1c2a22}' +
  '.athgo.show{display:block;animation:athCd .6s cubic-bezier(.25,.7,.3,1) both}' +
  '.athcard{margin-top:40px;background:#DBE2D7;border-radius:13px;padding:22px 26px}' +
  '.athcard.info{display:flex;gap:14px;align-items:flex-start;font-size:14.5px;line-height:1.5;color:#2f3a2f}' +
  '.athcard.info .ic{flex:none;width:30px;height:30px;border-radius:50%;background:#1F2A20;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px}' +
  '.athcard.quote{text-align:center}' +
  '.athcard.quote .qt{font-family:"Playfair Display",serif;font-size:15.5px;line-height:1.55;color:#26302a;max-width:400px;margin:0 auto}' +
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
  '@media (max-width:760px){#athBody{padding:18px 16px 56px}#athRail{display:none !important}.athq{font-size:17.5px}.athops{margin-top:16px;gap:9px}.athop{font-size:14.5px}.athcard{margin-top:24px;padding:18px 20px}.athwm{font-size:15px}#athHead{padding:12px 0}}' +
  /* hero variant (arm B, before the takeover) */
  'html.athena-arm #heroCta,html.athena-arm #applyNowHdr{display:none !important}' +
  'html.athena-arm #adqInlineHost{display:block;width:100%;max-width:430px;margin:26px auto 0}' +
  '#athRole{background:#f7f5f1;border:1px solid #e7e3da;border-radius:16px;padding:22px 24px 24px;box-shadow:0 18px 44px rgba(20,28,21,.10);text-align:left}' +
  '#athRole h3{font-family:"Playfair Display",Georgia,serif;font-size:22px;font-weight:600;color:#182018;margin:2px 0 10px}' +
  '#athRole .sub2{font-size:12.5px;color:#8a9288;line-height:1.6;margin:0 0 22px}' +
  '.athro{display:flex;align-items:center;justify-content:space-between;border:1px solid #DCDCDC;border-radius:9px;padding:12px 15px;font-size:14.5px;color:#222;cursor:pointer;margin-bottom:10px;transition:border .12s,background .12s;background:#fff}' +
  '.athro:hover{border-color:#24352B;background:#F6F8F5}' +
  /* stylized dark hero (Peter 2026-07-28 pm: "make it stylized more like the athena one, use our colors") */
  'html.athena-arm .nav{background:#141210;border-bottom:1px solid rgba(255,255,255,.08)}' +
  'html.athena-arm .nav .brand{background:#F5F1E6;color:#141210}' +
  'html.athena-arm .nav .btn.sm{color:#F5F1E6;border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.05)}' +
  'html.athena-arm header.hero{background:radial-gradient(1100px 540px at 50% -10%,#2c2822 0%,#141210 62%),#141210;padding-bottom:70px}' +
  '.athEyebrow{color:#B9AE93;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;text-align:left;margin:10px 0 22px}' +
  'html.athena-arm .hero .wrap{text-align:left}' +
  'html.athena-arm .hero h1{font-family:"Playfair Display",Georgia,serif;color:#F5F1E6;font-weight:500;letter-spacing:-.005em;font-size:clamp(46px,7.2vw,84px);line-height:1.07;text-align:left;max-width:1000px;margin:0 0 30px}' +
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
  '@media (max-width:760px){html.athena-arm .hero h1{font-size:clamp(38px,10.5vw,46px)}html.athena-arm #adqInlineHost{margin-top:34px}}' +
  /* desktop: Athena-scale card — double-size option bubbles + text (Peter 2026-07-28 pm) */
  '@media (min-width:761px){html.athena-arm #adqInlineHost{max-width:640px}html.athena-arm #athRole{padding:36px 38px 38px;border-radius:20px}html.athena-arm #athRole h3{font-size:32px;margin-bottom:12px}html.athena-arm #athRole .sub2{font-size:16px;margin-bottom:30px}html.athena-arm .athro{font-size:20px;padding:21px 26px;border-radius:10px;margin-bottom:14px}html.athena-arm .athro b{font-size:20px}html.athena-arm #athHeroQuote{max-width:640px;font-size:14.5px}}' +
  '#athHeroQuote{max-width:430px;margin:18px auto 0;background:#fff;border:1px solid #e7e3da;border-radius:13px;padding:16px 18px;font-size:13.5px;line-height:1.6;color:#3c463c;text-align:left}' +
  '#athHeroQuote .who{display:flex;align-items:center;gap:10px;margin-top:12px}' +
  '#athHeroQuote .av{width:38px;height:38px;border-radius:50%;overflow:hidden;flex:none}' +
  '#athHeroQuote .av img{width:100%;height:100%;object-fit:cover;display:block}' +
  '#athHeroQuote .nm{font-weight:700;color:#141210;font-size:13.5px}' +
  '#athHeroQuote .rl{font-size:11.5px;font-style:italic;color:#8a9288}';
  try { var stl = document.createElement('style'); stl.textContent = css; document.head.appendChild(stl); } catch (e) {}

  // ── questions (final wording approved on /athenatest, 2026-07-28) ──
  var qi = function (icon, text) { return { kind: 'info', icon: icon, text: text }; };
  var qq = function (quote, initial, name, role, img) { return { kind: 'quote', quote: quote, initial: initial, name: name, role: role, img: img ? PIC + img : null }; };
  var STEPS = [
    { key: 'usedApps', type: 'radio', rail: true,
      title: 'Have you ever worked with a dating app management team?',
      desc: 'Many of our clients are getting real help for the first time.',
      opts: ['No, never', 'Yes, I have one now', 'Yes, but not currently'],
      card: qq('"On Hinge I actually just don\'t get matches. Like, I don\'t get any. This fixed that completely."', 'A', 'Asang', 'SaaS Owner, Sydney', 'tw-asang2.jpg') },
    { key: 'hours', type: 'radio',
      title: "In a typical week, how much of your time goes to dating-related things that don't actually require you to do them?",
      opts: ['Less than 2 hours', '2–6 hours', '6–10 hours', '10+ hours', "Honestly, I've never counted"],
      card: qq('"I don\'t have trouble with women. I just don\'t want to spend the time. It\'s like a full-time job."', 'M', 'Marco C.', 'Exec, SF', 'tw-marco2.jpg') },
    { key: 'tried', type: 'radio',
      title: 'What have you tried so far to improve your dating life?',
      opts: ['AI photos or a real photo shoot', 'Dating coaching', 'Matchmakers', 'Deleting dating apps', 'Hiring someone', 'A mix of the above', "Haven't tried anything systematically"],
      card: qi('⚙', 'Apps are great for landing high-quality dates, but someone still has to run them every single day.') },
    { key: 'datinglife', type: 'radio',
      title: 'Which best describes your current dating situation?', desc: 'Choose the closest match.',
      opts: ['Frustrating', 'Non-existent', 'Annoying but tolerable', "I'm lost"],
      card: qq('"I\'m way too busy... don\'t have the energy to text with women for three to five hours."', 'G', 'Grayson C.', 'Marketing Agency Owner, NYC', 'tw-grayson.jpg') },
    { key: 'effort', type: 'radio',
      title: 'How is your effort spent in a typical day?', desc: 'Choose the closest match.',
      opts: ['A mix of promising and dead-end conversations', 'A lot of swiping for not much return', 'Too much time on women who go nowhere', 'Mostly quality conversations', "I'm not sure"],
      card: qq('"If I just put in the time, I\'d be fine. But I just don\'t want to put in the time."', 'G', 'Grayson C.', 'Marketing Agency Owner, NYC', 'tw-grayson.jpg') },
    { key: 'interrupt', type: 'radio',
      title: "How often do you lose dates because you can't follow up fast enough or you don't have the time to swipe?",
      opts: ['Sometimes', 'Constantly', 'Rarely'],
      card: qi('◔', "Hinge's own data: a match that gets a reply within 24 hours is <b>72% more likely to turn into a date</b>. Slow follow-up is where dates die.") },
    { key: 'win', type: 'radio',
      title: 'If a team of experts ran your dating apps starting next Monday, what would be the biggest win?',
      desc: 'Most clients have their first date on the calendar within 7 days.',
      opts: ['10+ hours a week back for high-leverage work', 'Never having to deal with swiping, texting or flaking again', 'A proactive team who anticipates needs before I ask', 'Real time back for family, health or personal priorities', '1 quality date ASAP with a woman who meets my standards'],
      card: qq('"I\'m so tired of handling and managing my own stuff."', 'M', 'Marco C.', 'Exec, SF', 'tw-marco2.jpg') },
    { key: 'timesinks', type: 'multi',
      title: 'Which of these dating tasks eat up the most time in your week?', desc: 'Select at least one.',
      opts: ['Swiping & matching', 'Crafting clever opening messages', 'Keeping conversations alive', 'Planning & scheduling dates', 'Picking photos & profile upkeep', 'Pre-date small talk & texting', 'Rescheduling & flaky matches', 'All of the above (most popular)'],
      card: qi('✓', 'Our clients gain an average of 10 hours a week back after delegating.') },
    { key: 'support', type: 'multi',
      title: 'Which higher-leverage parts of your dating life would you most want expert support with?', desc: 'Select at least one.',
      opts: ['A profile that matches the lifestyle I built', 'Photos that look like my best self', 'Wardrobe & style', 'Knowing my exact type and targeting it', 'Date planning & logistics', 'First date strategy', 'Texting strategy after the first date', 'Getting into a long-term relationship', 'Traveling with a goal of meeting the right woman', 'All of the above (most popular)'],
      card: qq('"I don\'t have trouble with women. I just don\'t want to spend the time."', 'M', 'Marco C.', 'Exec, SF', 'tw-marco2.jpg') },
    { key: 'blockers', type: 'multi',
      title: "Outside of the apps, what's costing you dates?", desc: 'Select at least one.',
      opts: ['Looks', 'Style', 'Photos', 'Confidence', 'Fear of putting myself out there', 'Work schedule', "Scheduling dates in the cities I'm headed to beforehand", 'Texting', 'Matching with women who meet my preferences', 'All of the above (most popular)'],
      card: qi('❋', "Your dating life doesn't exist in silos, neither should your support.") },
    { key: 'handled', type: 'multi',
      title: 'Which of these would you want handled for you?', desc: 'Select at least one.',
      opts: ['Date spot picks & reservations', 'Reminders & prep before each date', 'Post-date follow-up texts', 'Constant photo optimization & profile upkeep', 'Weekly report of your matches & pipeline', 'All of the above (most popular)'],
      card: qi('✓', 'Your team runs it end to end. You just show up.') },
    { key: 'cost', type: 'multi',
      title: "When you're stuck doing low-value dating-related tasks, how does it cost you?", desc: 'Choose the ones that resonate most.',
      opts: ['Strategic or planning work gets pushed', 'Revenue or growth activities get delayed', 'Deep work gets fragmented', 'I spend less time with friends and family', "I don't have time to prioritize my health", "I don't achieve my most important goals", "I'm not reaching my potential", "I don't feel a meaningful trade-off"],
      card: qi('☰', 'These tradeoffs compound quietly over time.') },
    { key: 'matters', type: 'multi',
      title: 'What matters most to you in your team?',
      desc: 'These are strengths of Automated Dating. Select those that matter most to you.',
      opts: ['Experts running everything to my exact preferences', 'A team that learns my type and gets sharper every week', 'Discretion and privacy', 'Photos and a profile that represent my real life', 'Strong value for the investment', 'Proven results across 300+ clients', 'All of the above'],
      card: qi('❋', 'Everything runs to your exact preferences — you approve every match with a thumbs up.') },
    { key: 'age', type: 'radio', almost: true,
      title: 'How old are you?',
      opts: ['27–34', '35–44', '45–55', 'Outside this range'],
      card: qi('👥', 'We work with professional men at every stage.') },
    { key: 'income', type: 'radio',
      title: "What's your annual income? (USD)",
      desc: 'This helps us build a profile congruent with the lifestyle you can realistically showcase.',
      opts: ['Under 150k', '150k to 200k', '200k+'],
      card: qq('"I\'d rather just pay somebody."', 'G', 'Grayson C.', 'Marketing Agency Owner, NYC', 'tw-grayson.jpg') },
    { key: 'concerns', type: 'multi',
      title: 'Do you have any concerns about hiring Automated Dating?',
      desc: 'Understanding your concerns helps us address them early.',
      opts: ['Texting in my voice and style', 'AI photos not matching me or my life', 'Privacy and data security', 'Poor experiences with matchmakers', 'Fear of trusting a team with swiping and texting for me', "Worried you won't be able to find matches who fit my criteria", 'Other'],
      card: qi('✓', 'Discretion is built in — everything sounds like you, and nothing goes out without your approval.') },
    { key: 'wantmore', type: 'radio',
      title: 'What do you want more of right now?',
      opts: ['Time', 'Dates', 'Focus', 'A quality relationship', 'All four'],
      card: qi('✦', "Most clients pick all four. That's the point of a full team.") },
    { key: 'ninety', type: 'radio',
      title: "If nothing changes in the next 90 days, what's most likely to happen?",
      opts: ["I'll keep grinding the apps with nothing to show", "I'll probably just stop trying again", "I'll still be the guy who has everything but the relationship", "Honestly, I'll be saying this same thing in 90 days"],
      card: qq('"The likes you do get aren\'t women you\'re attracted to. I wanted fewer, better dates. That\'s exactly what this is."', 'C', 'Casey H.', 'CRO of a Series C company, Ogden UT', 'tw-casey.jpg') },
    { key: 'start', type: 'radio',
      title: 'What is your timeline for getting help?', desc: 'No pressure, this just helps us recommend next steps.',
      opts: ['ASAP - this is a priority', 'Within the next month', 'In the next 2-3 months', 'Just exploring for now'],
      card: qi('✓', 'Clients get their first date on the calendar within 7 days.') },
    { type: 'loader' },
    { type: 'contact' }
  ];

  // ── state / token / attribution ──
  var A = {};
  var step = -1, moving = false, submitted = false, partialSent = false, autoT = null, fsAcc = 0, fsLast = 0;
  function newToken() { return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12); }
  var token = '';
  try { token = sessionStorage.getItem('ath_token') || ''; if (!token) { token = newToken(); sessionStorage.setItem('ath_token', token); } } catch (e) { token = newToken(); }
  var STATE_KEY = 'ath_state_v1';
  try {
    var sv = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (sv && sv.token === token && sv.A && typeof sv.step === 'number') { A = sv.A; step = sv.step; }
  } catch (e) {}
  function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify({ token: token, A: A, step: step })); } catch (e) {} }
  function clearState() { try { localStorage.removeItem(STATE_KEY); } catch (e) {} }
  function fsBump() { var now = Date.now(); if (fsLast && now - fsLast < 120000) fsAcc += (now - fsLast) / 1000; fsLast = now; }
  function pxCookie(name) { try { var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)')); return m ? decodeURIComponent(m[1]).slice(0, 400) : ''; } catch (e) { return ''; } }
  function hiddenFields() {
    var out = { ab: (window.__ADQ_AB || window.__AB || 'c'), form: 'athena' };
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
    out.form = 'athena';
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
      navigator.sendBeacon(EP, new Blob([JSON.stringify({ event: ev, page: pg, sid: sid, ab: (window.__ADQ_AB || 'c'), form: 'athena' })], { type: 'text/plain' }));
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
  function phoneValid() { var e = phoneE164().replace(/\D/g, ''); return e.length >= 8 && e.length <= 15; }

  // income maps onto the Original Form's GHL buckets; timeline posts verbatim as `start`.
  function incomeOut() { return A.income === '150k to 200k' ? '150k-200k' : (A.income || ''); }
  function isDq() { return A.income === 'Under 150k' || !/^ASAP/.test(A.start || ''); }

  function payload(complete) {
    fsBump();
    return JSON.stringify({ token: token, complete: !!complete, hp: '', hidden: hiddenFields(), answers: {
      role: A.role || '', usedApps: A.usedApps || '', hours: A.hours || '', tried: A.tried || '',
      datinglife: A.datinglife || '', effort: A.effort || '', interrupt: A.interrupt || '',
      win: A.win || '', timesinks: A.timesinks || [], support: A.support || [], blockers: A.blockers || [],
      handled: A.handled || [], cost: A.cost || [], matters: A.matters || [],
      age_bucket: A.age || '', concerns: A.concerns || [], wantmore: A.wantmore || '', ninety: A.ninety || '',
      heard: A.heard || '',
      income: incomeOut(), start: A.start || '',
      first: A.first || '', last: A.last || '', phone: (A.phone ? phoneE164() : ''), email: A.email || ''
    } });
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
    ov.innerHTML = '<div id="athHead"><div class="inr"><button id="athBack">←</button><div class="athwm">AUTOMATED DATING</div></div></div>' +
      '<div id="athBody"><div id="athCol"></div>' +
      '<div id="athRail"><div class="lbl">Match progress</div><div class="athring"><div class="pc"><b>6%</b><span>Complete</span></div></div><div class="note">Each answer helps us build your exact dating profile plan</div></div></div>';
    document.body.appendChild(ov);
    col = document.getElementById('athCol'); railEl = document.getElementById('athRail'); backBtn = document.getElementById('athBack');
    backBtn.addEventListener('click', back);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function cardHtml(c) {
    if (!c) return '';
    if (c.kind === 'info') return '<div class="athcard info"><div class="ic">' + c.icon + '</div><div>' + c.text + '</div></div>';
    var av = c.img ? '<div class="av"><img src="' + c.img + '" alt="' + esc(c.name) + '"></div>' : '<div class="av">' + c.initial + '</div>';
    return '<div class="athcard quote"><div class="qt">' + c.quote + '</div><div class="who">' + av + '<div class="nm">' + c.name + '</div><div class="rl">' + c.role + '</div></div></div>';
  }

  function openTakeover(role) {
    if (role) A.role = role;
    mountOverlay();
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
  }

  function render(dir) {
    var s = STEPS[step];
    railEl.style.display = (s.rail ? 'flex' : 'none');
    backBtn.hidden = (s.type === 'loader' || finishedView === 'dq' || finishedView === 'booked');
    var h = '';
    if (s.almost) h += '<div class="athalmost"><div class="athbar"><i style="width:55%"></i></div><h1 class="athserif">You’re almost there!</h1><p>Just a few more questions to help us build your exact dating profile plan.</p><hr></div>';
    if (s.type === 'radio' || s.type === 'multi') {
      h += '<div class="athq">' + esc(s.title) + '</div>';
      if (s.desc) h += '<div class="athd">' + esc(s.desc) + '</div>';
      h += '<div class="athops">' + s.opts.map(function (o, i) {
        return '<div class="athop" data-i="' + i + '"><div class="' + (s.type === 'radio' ? 'r' : 'c') + '"></div><div>' + esc(o) + '</div></div>';
      }).join('') + '</div>';
      h += '<button class="athgo" id="athGo">Continue&nbsp;&nbsp;→</button>';
      h += cardHtml(s.card);
    } else if (s.type === 'loader') {
      h += '<div class="athload"><div class="athbar" style="max-width:520px"><i style="width:80%"></i></div><div class="athspin"></div>Building your profile plan...</div>';
      setTimeout(function () { if (STEPS[step] === s) { step++; render(); } }, 2600);
    } else if (s.type === 'contact') {
      h += '<div><div class="athbar" style="max-width:520px"><i style="width:90%"></i></div>' +
        '<h1 class="athserif" style="font-size:30px;color:#1e2820">Thanks! Last step.</h1>' +
        '<p style="margin-top:8px;font-size:14px;color:#4c564c">Fill in your details to help us personalize our conversation with you.</p>' +
        '<label class="athlbl">First name *</label><input class="athin" id="athF" autocomplete="given-name" value="' + esc(A.first || '') + '">' +
        '<label class="athlbl">Last name *</label><input class="athin" id="athL" autocomplete="family-name" value="' + esc(A.last || '') + '">' +
        '<label class="athlbl">Email *</label><input class="athin" id="athE" type="email" autocomplete="email" placeholder="you@email.com" value="' + esc(A.email || '') + '">' +
        '<label class="athlbl">Phone *</label><input class="athin" id="athP" type="tel" autocomplete="tel" placeholder="(201) 555-0123" value="' + esc(A.phone || '') + '">' +
        '<label class="athlbl">How did you hear about us? *</label><select class="athin" id="athH"><option value="">Please select</option>' + ['TikTok', 'Instagram', 'Facebook', 'Google', 'Referral', 'Podcast', 'Other'].map(function (o) { return '<option' + (A.heard === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>' +
        '<button class="athgo show" id="athGo" style="margin-top:24px">Continue&nbsp;&nbsp;→</button><div class="atherr" id="athErr"></div></div>';
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
    var go = document.getElementById('athGo');
    if (go) go.addEventListener('click', function () { (s.type === 'contact') ? contactDone() : next(); });
    col.classList.remove('anim', 'animL', 'out', 'outR'); void col.offsetWidth;
    col.classList.add(dir === 'back' ? 'animL' : 'anim');
    ov.scrollTop = 0;
    saveState();
  }

  function pick(i) {
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
      else autoT = setTimeout(function () { if (STEPS[step] === s) next(); }, 320);
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
  function next() {
    if (moving) return;
    moving = true;
    var s = STEPS[step];
    if (s && s.key) pingStep(s.key);
    col.classList.remove('anim', 'animL', 'outR'); void col.offsetWidth; col.classList.add('out');
    setTimeout(function () { moving = false; step++; render(); }, 400);
  }
  function back() {
    if (moving) return;
    if (finishedView) return;
    if (step <= 0) { closeTakeover(); return; }
    moving = true;
    col.classList.remove('anim', 'animL', 'out'); void col.offsetWidth; col.classList.add('outR');
    setTimeout(function () {
      moving = false;
      if (STEPS[step - 1] && STEPS[step - 1].type === 'loader') step--;
      step--; render('back');
    }, 400);
  }

  var finishedView = '';
  function contactDone() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
    A.first = g('athF'); A.last = g('athL'); A.email = g('athE'); A.phone = g('athP'); A.heard = g('athH');
    var err = document.getElementById('athErr');
    if (!A.first || !A.last) { err.textContent = 'Please fill in your first and last name.'; return; }
    if (!/.+@.+\..+/.test(A.email)) { err.textContent = 'Please enter a valid email.'; return; }
    if (!phoneValid()) { err.textContent = 'Please enter a valid phone number.'; return; }
    if (!A.heard) { err.textContent = 'Please select how you heard about us.'; return; }
    err.textContent = '';
    pingStep('contact');
    saveState();
    // Submit FIRST (qualified non-bookers are never lost), then route: DQ screen or native booker.
    var dq = isDq();
    submit(function () {});
    if (dq) {
      finishedView = 'dq';
      backBtn.hidden = true;
      col.innerHTML = '<div class="athend"><p class="t">Unfortunately it seems like we aren’t a great fit right now.</p><p class="d">Feel free to check back if things change!</p></div>';
      col.classList.remove('anim', 'animL', 'out', 'outR'); void col.offsetWidth; col.classList.add('anim');
      ov.scrollTop = 0;
      return;
    }
    finishedView = 'booked';
    try { pingEv('cal_shown', 'cal'); } catch (e) {}
    // Same native scheduler as the Original Form — adq-embed bridge opens its booker overlay
    // (slots/red-tier/booking/thankyou identical for both forms).
    var openBk = function (tries) {
      if (window.__ADQ_OPEN_BOOKER) {
        closeTakeover();
        window.__ADQ_OPEN_BOOKER({ first: A.first, last: A.last, email: A.email, phone: phoneE164(), income: incomeOut(), start: A.start });
      } else if (tries > 0) setTimeout(function () { openBk(tries - 1); }, 300);
      else { col.innerHTML = '<div class="athend"><p class="t">Almost there — loading the scheduler…</p><p class="d">If nothing loads, refresh this page and click any button to pick your time.</p></div>'; }
    };
    openBk(20);
  }

  // ── hero variant (arm B page changes) ──
  function heroVariant() {
    try {
      var h1 = document.querySelector('.hero h1');
      if (h1) {
        h1.innerHTML = '<span class="l">You’re losing 10+ hours a week</span><span class="l"><em>to work someone else should do.</em></span>';
        var eb = document.createElement('div');
        eb.className = 'athEyebrow';
        eb.textContent = 'Trusted by 300+ professional men';
        h1.parentNode.insertBefore(eb, h1);
      }
    } catch (e) {}
    try {
      var sub = document.querySelector('.hero .sub');
      if (sub) {
        sub.textContent = 'We run your dating apps, matching you with women who fit your criteria, then schedule dates for you according to your preferences and around your busy schedule.';
        var tq = document.createElement('div');
        tq.id = 'athHeroQuote';
        tq.innerHTML = '"If I just put in the time, I\'d be fine. But I just don\'t want to put in the time. I\'d rather just pay somebody."' +
          '<div class="who"><div class="av"><img src="' + PIC + 'tw-grayson.jpg" alt="Grayson"></div><div><div class="nm">Grayson C.</div><div class="rl">Marketing Agency Owner, NYC</div></div></div>';
        // testimonial goes UNDER the form card (Peter 2026-07-28 pm)
        var host0 = document.getElementById('adqInlineHost');
        if (host0 && host0.parentNode) host0.parentNode.insertBefore(tq, host0.nextSibling);
        else sub.parentNode.insertBefore(tq, sub.nextSibling);
      }
    } catch (e) {}
    try {
      var host = document.getElementById('adqInlineHost');
      if (host) {
        host.innerHTML = '<div id="athRole"><h3>What best describes your role?</h3><p class="sub2">Apply for our professional dating app management team that pays for itself in time and results.</p>' +
          ['Entrepreneur/founder', 'Business owner', 'VP/Executive/C-Suite', 'Established professional', 'Other'].map(function (r) {
            return '<div class="athro" data-role="' + r + '"><span>' + r + '</span><b>→</b></div>';
          }).join('') + '</div>';
        host.querySelectorAll('.athro').forEach(function (el) {
          el.addEventListener('click', function () { pingStep('role'); openTakeover(el.getAttribute('data-role')); });
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

  // every CTA on arm B opens the Athena form (capture beats adq-embed's own listener)
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-tf-popup]');
    if (!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (A.role) openTakeover(null);
    else { var rc = document.getElementById('athRole'); if (rc) { try { rc.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { rc.scrollIntoView(); } } }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', heroVariant); else heroVariant();
})();
