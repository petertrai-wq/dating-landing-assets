// Automated Dating native application form (adq) — shared embed for /d, / (a,b) and /concierge (c).
// Self-injects its <style> + overlay markup, hijacks any [data-tf-popup] button to open the native
// popup, and submits to admin.automated.dating/api/apply with ab = window.__AB (per-page variant).
// SOURCE OF TRUTH for the form — edit here, not per page.
(function () {
  function boot() {
    if (document.getElementById('adqOverlay')) return;   // already injected
    var st = document.createElement('style'); st.textContent = "  #adqOverlay { position: fixed; inset: 0; z-index: 2147482000; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }\n  #adqOverlay[hidden] { display: none; }\n  #adqCard { position: relative; background: #ffffff; width: 760px; height: min(92vh, 980px); max-width: 94vw; max-height: 94vh; border-radius: 20px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.5); display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }\n  @media (max-width: 768px) { #adqCard { width: 100vw; height: 100vh; height: 100dvh; max-width: 100vw; max-height: 100dvh; border-radius: 0; } }\n  #adqBar { height: 3px; background: #ececec; flex: 0 0 auto; }\n  #adqBarFill { height: 100%; width: 0%; background: #1A1A1A; transition: width .25s ease; }\n  #adqHead { flex: 0 0 auto; padding: 16px 22px 0; }\n  #adqHead img { height: 38px; display: block; }\n  #adqBody { flex: 1 1 auto; overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; padding: 12px 60px 70px; -webkit-overflow-scrolling: touch; }\n  #adqBody.vfit { justify-content: center; }\n  @media (max-width: 768px) { #adqBody { padding: 6px 22px 90px; } }\n  #adqBody.anim-out { opacity: 0; transform: translateY(-10px); transition: opacity .13s ease, transform .13s ease; }\n  #adqBody.anim-pre { opacity: 0; transform: translateY(16px); transition: none; }\n  #adqBody.anim-in { opacity: 1; transform: translateY(0); transition: opacity .17s ease, transform .17s ease; }\n  #adqClose { position: absolute; top: 10px; right: 12px; z-index: 2147483000; width: 38px; height: 38px; border: none; background: none; color: #9aa1ab; font-size: 32px; line-height: 38px; cursor: pointer; border-radius: 50%; }\n  #adqClose:hover { color: #1A1A1A; background: #f2f2f5; }\n  .adq-qrow { display: flex; align-items: flex-start; gap: 10px; max-width: 560px; }\n  .adq-qnum { flex: 0 0 auto; min-width: 22px; height: 22px; margin-top: 3px; padding: 0 4px; background: #1A1A1A; color: #ffffff; border-radius: 4px; font-size: 12.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; }\n  .adq-title { color: #1A1A1A; font-size: 20px; line-height: 1.4; font-weight: 400; margin: 0; }\n  .adq-req { color: #1A1A1A; margin-left: 2px; }\n  .adq-desc { color: #7b7b7b; font-size: 14.5px; line-height: 1.45; margin: 8px 0 0 32px; }\n  .adq-zone { margin: 30px 0 0 32px; }\n  @media (max-width: 768px) { .adq-desc, .adq-zone { margin-left: 0; } }\n  .adq-opts { display: flex; flex-direction: column; gap: 8px; max-width: 460px; }\n  .adq-opt { display: flex; align-items: center; gap: 10px; text-align: left; border: 1px solid rgba(96,165,250,0.6); background: rgba(96,165,250,0.1); color: #000000; border-radius: 4px; padding: 9px 12px; font-size: 15.5px; line-height: 1.3; cursor: pointer; font-family: inherit; transition: background .12s; }\n  .adq-opt:hover { background: rgba(96,165,250,0.22); }\n  .adq-opt.sel { background: rgba(96,165,250,0.32); border-width: 2px; padding: 8px 11px; font-weight: 600; }\n  .adq-key { flex: 0 0 auto; width: 22px; height: 22px; border: 1px solid rgba(96,165,250,0.8); background: #ffffff; color: #1A1A1A; border-radius: 3px; font-size: 11.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; }\n  .adq-opt.sel .adq-key { background: #60A5FA; color: #ffffff; border-color: #60A5FA; }\n  .adq-in { display: block; width: 100%; max-width: 460px; border: none; border-bottom: 1px solid #d5d9de; background: transparent; color: #000000; font-size: 20px; padding: 10px 2px 8px; outline: none; font-family: inherit; border-radius: 0; }\n  .adq-in:focus { border-bottom: 2px solid #60A5FA; padding-bottom: 7px; }\n  .adq-in::placeholder { color: #c3c9d1; }\n  textarea.adq-in { resize: none; height: 42px; min-height: 42px; overflow: hidden; font-size: 20px; line-height: 1.4; }\n  .adq-lbl { color: #7b7b7b; font-size: 13px; margin: 16px 0 0; max-width: 460px; }\n  .adq-lbl:first-child { margin-top: 0; }\n  .adq-phone { display: flex; align-items: flex-end; gap: 10px; max-width: 460px; }\n  .adq-cc { border: none; border-bottom: 1px solid #d5d9de; background: transparent; font-size: 18px; padding: 10px 0 8px; outline: none; font-family: inherit; color: #1A1A1A; cursor: pointer; max-width: 118px; -webkit-appearance: none; appearance: none; border-radius: 0; }\n  .adq-phone .adq-in { flex: 1; }\n  .adq-okrow { display: flex; align-items: center; gap: 10px; margin-top: 24px; max-width: 460px; }\n  .adq-ok { flex: 1; border: none; background: #60A5FA; color: #ffffff; font-size: 17px; font-weight: 600; padding: 14px 22px; border-radius: 4px; cursor: pointer; font-family: inherit; }\n  .adq-ok:hover { background: #4b94f5; }\n  .adq-hint { color: #9aa1ab; font-size: 12.5px; flex: none; }\n  .adq-back { display: none; flex: none; width: 50px; height: 50px; align-items: center; justify-content: center; border: 1px solid #d5d9de; background: #fff; color: #55555c; font-size: 24px; line-height: 1; border-radius: 4px; font-family: inherit; cursor: pointer; }\n  .adq-back:hover { background: #f4f6f9; }\n  @media (max-width: 768px) { .adq-back { display: flex; } }\n  @media (max-width: 768px) { .adq-hint { display: none; } }\n  .adq-err { color: #d64545; font-size: 13.5px; margin-top: 10px; min-height: 18px; }\n  #adqNav { position: absolute; bottom: 14px; right: 16px; display: flex; gap: 2px; }\n  #adqNav button { width: 34px; height: 30px; border: none; background: #60A5FA; color: #fff; font-size: 15px; cursor: pointer; }\n  #adqNav button:first-child { border-radius: 4px 0 0 4px; }\n  #adqNav button:last-child { border-radius: 0 4px 4px 0; }\n  #adqNav button:disabled { background: rgba(96,165,250,0.4); cursor: default; }\n  .adq-end { text-align: center; padding: 0 12px; }\n  .adq-end .adq-title { font-size: 22px; }\n  .adq-end .adq-desc { margin: 10px 0 0; }\n  #adqCal { display: flex; flex-direction: column; height: 100%; }\n  #adqCal .adq-caltop { padding: 4px 8px 4px; }\n  #adqCal iframe { flex: 1 1 auto; width: 100%; border: none; border-radius: 8px; background: #fff; }\n  /* \u2500\u2500 native booker v3: Calendly-integration look (Peter 2026-07-17) \u2014 no left bar \u2500\u2500 */\n  .adbk { height: 100%; font-size: 14.5px; color: #1A1A1A; overflow-y: auto; padding: 10px 30px 24px; box-sizing: border-box; }\n  .adbk-title { text-align: center; font-size: 19px; font-weight: 700; margin: 6px 0 22px; }\n  .adbk-sub { text-align: center; color: #55555c; font-size: 13.5px; line-height: 1.5; max-width: 560px; margin: -14px auto 20px; }\n  .adbk-timegrid { display: flex; gap: 44px; justify-content: center; }\n  .adbk-calwrap { flex: 0 1 430px; min-width: 0; }\n  .adbk-monthrow { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 14px; font-weight: 700; font-size: 15.5px; }\n  .adbk-monthrow button { border: none; background: #eef2fb; color: #3b6ff5; width: 34px; height: 34px; border-radius: 50%; font-size: 17px; cursor: pointer; }\n  .adbk-cal { width: 100%; border-collapse: collapse; table-layout: fixed; }\n  .adbk-cal th { color: #8a8a90; font-size: 12px; font-weight: 600; padding: 6px 0; text-align: center; }\n  .adbk-cal td { text-align: center; padding: 4px 0; }\n  .adbk-day { width: 40px; height: 40px; line-height: 40px; border-radius: 50%; display: inline-block; font-size: 14px; color: #c3c3c9; position: relative; }\n  .adbk-day.av { color: #3b6ff5; font-weight: 700; cursor: pointer; background: #eef2fb; }\n  .adbk-day.sel { background: #3b6ff5; color: #fff; }\n  .adbk-slotcol { flex: 0 0 205px; }\n  .adbk-dayhead { font-size: 14.5px; font-weight: 600; color: #1A1A1A; margin: 4px 0 14px; text-align: center; }\n  .adbk-slots { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; max-height: 430px; padding: 2px; }\n  .adbk-slot { flex: none; border: 1px solid #9db6f2; background: #fff; color: #3b6ff5; font-weight: 700; font-size: 14px; border-radius: 6px; padding: 12px 0; cursor: pointer; font-family: inherit; width: 100%; }\n  .adbk-slot:hover { border-color: #3b6ff5; background: #eef2fb; }\n  .adbk-pair { display: flex; gap: 8px; flex: none; }   /* overflow:hidden removed - in the height-capped flex column it zeroed the pair's min-size and the whole row collapsed to 0px (Peter's dead Select click) */\n  .adbk-chip { flex: 1; border: none; background: #43434a; color: #fff; font-weight: 700; font-size: 14px; border-radius: 6px; padding: 12px 0; font-family: inherit; animation: adbkChip .3s ease; }\n  .adbk-go { flex: 1; border: none; background: #3b6ff5; color: #fff; font-weight: 700; font-size: 14px; border-radius: 6px; padding: 12px 0; cursor: pointer; font-family: inherit; animation: adbkGo .3s ease; }\n  @keyframes adbkGo { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: none; } }\n  @keyframes adbkChip { from { transform: translateX(11px); } to { transform: none; } }\n  .adbk-tzwrap { margin-top: 18px; }\n  .adbk-tzlbl { color: #1A1A1A; font-size: 13.5px; font-weight: 700; margin-bottom: 7px; }\n  .adbk-tzwrap select { width: 100%; max-width: 320px; border: none; background: transparent; font-size: 13.5px; font-family: inherit; color: #55555c; outline: none; cursor: pointer; }\n  .adbk-back { display: inline-flex; align-items: center; gap: 6px; border: none; background: none; color: #3b6ff5; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; padding: 0; margin-bottom: 14px; }\n  .adbk-when { display: flex; align-items: center; justify-content: center; gap: 8px; color: #55555c; font-size: 13.5px; margin: -10px 0 18px; }\n  .adbk-details { max-width: 470px; margin: 0 auto; }\n  .adbk-details h4 { font-size: 17px; margin: 0 0 6px; font-weight: 700; text-align: center; }\n  .adbk-details label { display: block; color: #55555c; font-size: 13px; font-weight: 600; margin: 16px 0 6px; }\n  .adbk-details input[type=text], .adbk-details input[type=tel], .adbk-details input[type=email] { display: block; width: 100%; box-sizing: border-box; border: 1px solid #d9d9df; border-radius: 7px; padding: 12px 12px; font-size: 15.5px; font-family: inherit; outline: none; }\n  .adbk-details input:focus { border-color: #3b6ff5; }\n  .adbk-confirm { display: flex; gap: 12px; align-items: flex-start; margin: 18px 0 0; font-size: 13.5px; color: #1A1A1A; line-height: 1.45; cursor: pointer; }\n  .adbk-confirm input { width: 17px; height: 17px; margin-top: 3px; accent-color: #3b6ff5; flex: none; }\n  .adbk-sched { display: block; width: 100%; border: none; background: #3b6ff5; color: #fff; font-weight: 700; font-size: 15.5px; border-radius: 8px; padding: 14px 0; margin-top: 20px; cursor: pointer; font-family: inherit; }\n  .adbk-sched:disabled { opacity: .55; cursor: default; }\n  .adbk-sched.off { opacity: .45; }\n  .adbk-newtime { display: block; width: 100%; border: 1px solid #d9d9df; background: #fff; color: #55555c; font-weight: 600; font-size: 13.5px; border-radius: 8px; padding: 12px 0; margin-top: 10px; cursor: pointer; font-family: inherit; }\n  .adbk-err { color: #d64545; font-size: 13px; margin-top: 10px; min-height: 17px; text-align: center; }\n  .adbk-load { display: flex; align-items: center; justify-content: center; height: 100%; color: #8a8a90; font-size: 14.5px; }\n  .adbk-prog { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; min-height: 320px; height: 100%; text-align: center; padding: 24px 16px; box-sizing: border-box; }\n  .adbk-spin { width: 42px; height: 42px; border: 4px solid #e6ebf9; border-top-color: #3b6ff5; border-radius: 50%; animation: adbkSpin .8s linear infinite; }\n  @keyframes adbkSpin { to { transform: rotate(360deg); } }\n  .adbk-prog-msg { font-size: 15.5px; font-weight: 700; color: #1A1A1A; min-height: 22px; }\n  .adbk-prog-bar { width: min(320px, 82%); height: 6px; background: #ececf2; border-radius: 99px; overflow: hidden; }\n  .adbk-prog-bar i { display: block; height: 100%; width: 0%; background: #3b6ff5; border-radius: 99px; transition: width .35s ease; }\n  .adbk-prog-pct { font-size: 13px; font-weight: 600; color: #8a8a90; }\n  @media (max-width: 768px) {\n    .adbk { padding: 6px 16px 24px; }\n    .adbk-timegrid { flex-direction: column; gap: 14px; }\n    .adbk-calwrap { flex: none; }\n    .adbk-slotcol { flex: none; }\n    .adbk-slots { max-height: none; }\n  }"; document.head.appendChild(st);
    var holder = document.createElement('div'); holder.innerHTML = "<div id=\"adqOverlay\" hidden>\n  <div id=\"adqCard\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Automated Dating Application\">\n    <div id=\"adqBar\"><div id=\"adqBarFill\"></div></div>\n    <div id=\"adqHead\"><img src=\"https://images.typeform.com/images/dykrmwJHQJhy\" alt=\"Automated Dating Logo\" onerror=\"this.remove()\"></div>\n    <div id=\"adqBody\"></div>\n    <div id=\"adqNav\"><button id=\"adqPrev\" type=\"button\" aria-label=\"Previous\">\u25b2</button><button id=\"adqNext\" type=\"button\" aria-label=\"Next\">\u25bc</button></div>\n    <button id=\"adqClose\" type=\"button\" aria-label=\"Close\">\u00d7</button>\n  </div>\n</div>".trim();
    var node = holder.firstElementChild; if (node) document.body.appendChild(node);
    (function () {
  var API = 'https://admin.automated.dating/api/apply';
  var CAL = 'https://links.petertraidating.com/widget/bookings/automateddating8eh9hv';
  var LETTERS = 'ABCDEFGH';
  var STATE_KEY = 'adq_state_v1';
  // Same questions / options as Typeform qoQwwZI5 (verbatim — the relay matches on them).
  // Contact order: PHONE FIRST (Peter 2026-07-17: capture the number before name/email so an
  // abandoner past that step is recoverable), then name, then email.
  var QS = [
    { key: 'q1', type: 'choice', title: 'Are you a man (aged 27-55) looking to date high quality women?', opts: ['Yes', 'No'] },
    { key: 'goals', type: 'multi', title: 'What are your biggest goals in your dating life?', desc: 'Select all that apply', opts: ['Get quality dates put directly onto my calendar with zero effort on my part', 'Find a high-quality girlfriend/relationship', 'Get back into the dating game', 'Improve my dating life overall'] },
    { key: 'interest', type: 'multi', title: 'What makes you interested in us specifically? What is it about our program that stands out?', desc: 'Check all that apply.', opts: ['I want a team to run my dating apps and put quality dates directly on my calendar', "I've seen your client results & transformations", "I'm tired of putting in so much effort to get dates.", 'I want a proven system that actually get results.', 'I want to add an extra funnel for landing high quality dates.'] },
    { key: 'occupation', type: 'short', title: 'What is your current occupation and how long have you been doing it?' },
    { key: 'income', type: 'choice', title: "What's your annual income? (USD)", desc: 'This helps us determine the lifestyle and type of profile you can realistically showcase without it coming of as incongruent.', opts: ['0k to 50k', '50k to 100k', '100k to 150k', '150k-200k', '200k+'] },
    { key: 'problem', type: 'long', title: "What's the #1 problem with your dating apps / dating life?", desc: 'Be honest - the more detail, the better we can help.' },
    { key: 'start', type: 'choice', title: 'When do you want to start?', opts: ['ASAP', 'Next Week', 'Next Month'] },
    { key: 'phone', type: 'phone', title: "What's your phone number?" },
    { key: 'name', type: 'name', title: "What's your name?" },
    { key: 'email', type: 'email', title: "What's your email address?" },
    { key: 'invest', type: 'choice', title: 'Are you willing to invest if this makes sense for you?', opts: ["Yes. I'm willing and able to invest if this is a great fit.", "No. I'm not willing or able to invest at this time."] },
    { key: 'commit', type: 'choice', title: 'Last Question - On the following page, you will be able to schedule a profile audit with one of our specialists (you do not need current active profiles for this). After working with 300+ clients, we know with 100% certainty we can help you. But we can NOT help you if you do NOT show up to the scheduled call time. Will you commit to attending your selected time slot and showing up in a quiet place ready to work on your dating transformation?', opts: ['Yes - I will double-check my calendar and commit 100% to the time I choose', "Maybe - I'm not sure if I'm serious about this"] }
  ];
  var COUNTRIES = [['US','+1','🇺🇸'],['CA','+1','🇨🇦'],['GB','+44','🇬🇧'],['AU','+61','🇦🇺'],['MX','+52','🇲🇽'],['BR','+55','🇧🇷'],['DE','+49','🇩🇪'],['FR','+33','🇫🇷'],['ES','+34','🇪🇸'],['IT','+39','🇮🇹'],['NL','+31','🇳🇱'],['IN','+91','🇮🇳'],['PH','+63','🇵🇭'],['CO','+57','🇨🇴'],['AR','+54','🇦🇷'],['CL','+56','🇨🇱'],['PE','+51','🇵🇪'],['NG','+234','🇳🇬'],['ZA','+27','🇿🇦'],['AE','+971','🇦🇪'],['SA','+966','🇸🇦'],['SG','+65','🇸🇬'],['HK','+852','🇭🇰'],['JP','+81','🇯🇵'],['KR','+82','🇰🇷'],['PL','+48','🇵🇱'],['SE','+46','🇸🇪'],['CH','+41','🇨🇭'],['IE','+353','🇮🇪'],['IL','+972','🇮🇱'],['NZ','+64','🇳🇿'],['PT','+351','🇵🇹'],['TR','+90','🇹🇷']];
  var TOTAL = QS.length + 1;
  var A = {};
  var step = 0, cc = '+1';
  var submitted = false, partialSent = false, finished = '';
  var token = '';
  function newToken() { return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12); }
  try { token = sessionStorage.getItem('adq_token') || ''; if (!token) { token = newToken(); sessionStorage.setItem('adq_token', token); } } catch (e) { token = newToken(); }
  // Resume state (Peter 2026-07-17: closing the popup / clicking another CTA / coming back later
  // must not lose progress). Cleared when a submission succeeds (token rotates with it).
  try {
    var saved = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (saved && saved.token === token && saved.A && typeof saved.step === 'number') { A = saved.A; step = Math.min(Math.max(0, saved.step), QS.length - 1); finished = saved.finished || ''; cc = saved.cc || '+1'; }
    else if (saved && saved.token !== token && saved.A && !saved.done) { A = saved.A; step = Math.min(Math.max(0, saved.step || 0), QS.length - 1); finished = saved.finished || ''; cc = saved.cc || '+1'; try { sessionStorage.setItem('adq_token', saved.token); } catch (e) {} token = saved.token; }
  } catch (e) {}
  function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify({ token: token, A: A, step: step, finished: finished, cc: cc })); } catch (e) {} }
  function clearState() { try { localStorage.removeItem(STATE_KEY); } catch (e) {} }
  // /dcal test entry (Peter 2026-07-17): automated.dating/dcal redirects here with ?dcal=1 —
  // the popup opens DIRECTLY at the calendar with qualified answers prefilled and NO application
  // submit (submitted=true), so booking can be tested end-to-end without junk form fills.
  var DCAL = /[?&]dcal=1/.test(location.search);
  // /book personal scheduler link (Peter 2026-07-18): automated.dating/book/#p=<b64url json> opens
  // STRAIGHT into the native booker with the lead's details prefilled. Prefill rides the URL FRAGMENT
  // (never sent to servers/logs). Books via the same /api/apply/book pipeline as the form's booker.
  var BOOKPAGE = /^\/book(\/|$)/.test(location.pathname);
  if (BOOKPAGE) {
    var _pre = {};
    try { var _mh = (location.hash || '').match(/[#&]p=([A-Za-z0-9_-]+)/); if (_mh) _pre = JSON.parse(decodeURIComponent(escape(atob(_mh[1].replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) { _pre = {}; }
    A = { first: String(_pre.f || ''), last: String(_pre.l || ''), phone: String(_pre.p || ''), email: String(_pre.e || '') };
    finished = 'cal'; submitted = true; partialSent = true;
  }
  if (DCAL) {
    A = { q1: 'Yes', goals: ['Improve my dating life overall'], interest: ['I want a proven system that actually get results.'],
      occupation: 'Test run', income: '200k+', problem: 'Testing the booking flow', start: 'ASAP',
      first: 'Peter', last: 'Test', phone: '+13238404332', email: 'petertrai@gmail.com',
      invest: "Yes. I'm willing and able to invest if this is a great fit.", commit: 'Yes - I will double-check my calendar and commit 100% to the time I choose' };
    finished = 'cal'; submitted = true; partialSent = true;
  }
  var ov = document.getElementById('adqOverlay'), body = document.getElementById('adqBody'), bar = document.getElementById('adqBarFill');
  // Small/medium questions sit vertically CENTERED; anything that overflows aligns top and scrolls
  // (Peter 2026-07-17 — centered overflow clips the first line, top-aligned short ones look empty).
  function fitAlign() {
    if (!body) return;
    body.classList.remove('vfit');
    if (body.scrollHeight <= body.clientHeight + 2) body.classList.add('vfit');
  }
  try { window.addEventListener('resize', function () { setTimeout(fitAlign, 60); }); } catch (e) {}
  try { if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { setTimeout(fitAlign, 60); }); } catch (e) {}   // iOS keyboard fires this, not window.resize
  var prevB = document.getElementById('adqPrev'), nextB = document.getElementById('adqNext');

  // /book standalone: the phone's back button/swipe must step BACK through the booker, not exit
  // to a blank tab (Peter 2026-07-18 "hit back after picking a time and the screen went white").
  var bkHist = 0;
  function bkPush(tag) { if (!BOOKPAGE) return; try { history.pushState({ adbk: tag }, ''); bkHist++; } catch (e) {} }
  function bkStepBack() {
    if (bk.view === 'details') { bk.view = 'time'; bk.err = ''; }
    else if (bkIsMob() && bk.mStep === 'slots') { bk.mStep = 'date'; bk.armed = ''; }
    renderBooker();
  }
  try { window.addEventListener('popstate', function () { if (!BOOKPAGE) return; if (bkHist > 0) { bkHist--; bkStepBack(); } }); } catch (e) {}

  function hiddenFields() {
    var out = { ab: (window.__AB || 'd') };
    try {
      var el = document.querySelector('[data-tf-popup]');
      var s = (el && el.getAttribute('data-tf-hidden')) || '';
      s.split(',').forEach(function (pair) {
        var i = pair.indexOf('='); if (i < 1) return;
        var un = function (v) { return v.replace(/%2C/g, ',').replace(/%3D/g, '=').replace(/%25/g, '%'); };
        out[un(pair.slice(0, i))] = un(pair.slice(i + 1)).slice(0, 200);
      });
    } catch (e) {}
    out.ab = (window.__AB || 'd');
    try { out.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    return out;
  }
  // E.164 normalizer: honors a typed +country, the selected country code, US 10/11-digit styles,
  // and 00-prefixed international dialing — the relay fires automations off this exact string.
  function phoneE164() {
    var raw = String(A.phone || '').trim();
    var digits = raw.replace(/[^\d+]/g, '');
    if (digits.indexOf('00') === 0) digits = '+' + digits.slice(2);
    if (digits.charAt(0) === '+') return '+' + digits.slice(1).replace(/\D/g, '');
    var d = digits.replace(/\D/g, '');
    if (cc === '+1') { if (d.length === 11 && d.charAt(0) === '1') return '+' + d; if (d.length === 10) return '+1' + d; return '+1' + d; }
    if (d.charAt(0) === '0') d = d.replace(/^0+/, '');
    return cc + d;
  }
  function phoneValid() { var e = phoneE164().replace(/\D/g, ''); return e.length >= 8 && e.length <= 15; }
  function payload(complete) {
    return JSON.stringify({ token: token, complete: !!complete, hp: '', hidden: hiddenFields(), answers: {
      q1: A.q1 || '', goals: A.goals || [], interest: A.interest || [], occupation: A.occupation || '',
      income: A.income || '', problem: A.problem || '', start: A.start || '',
      first: A.first || '', last: A.last || '', phone: (A.phone ? phoneE164() : ''), email: A.email || '',
      invest: A.invest || '', commit: A.commit || ''
    } });
  }
  function submit() {
    if (submitted) return; submitted = true;
    var attempt = function (left) {
      try {
        fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: payload(true), keepalive: true })
          .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
          .then(function (j) {
            try { sessionStorage.removeItem('adq_token'); } catch (e) {}
            clearState();
            try { console.log('[adq] submitted', j); } catch (e) {}
          })
          .catch(function () { if (left > 0) setTimeout(function () { attempt(left - 1); }, 1500); else submitted = false; });
      } catch (e) { if (left > 0) setTimeout(function () { attempt(left - 1); }, 1500); else submitted = false; }
    };
    attempt(2);
  }
  window.addEventListener('pagehide', function () {
    if (submitted || partialSent) return;
    var hasEmail = A.email && /.+@.+\..+/.test(A.email);
    var hasPhone = A.phone && phoneValid();
    if (!hasEmail && !hasPhone) return;
    partialSent = true;
    try { navigator.sendBeacon(API, new Blob([payload(false)], { type: 'text/plain' })); } catch (e) {}
  });

  function isDq() { return A.q1 === 'No' || A.income === '0k to 50k' || /^No\./.test(A.invest || ''); }
  function hasAnswer(q) {
    if (q.type === 'multi') return (A[q.key] || []).length > 0;
    if (q.type === 'name') return !!(A.first && A.first.trim() && A.last && A.last.trim());
    return !!(A[q.key] && String(A[q.key]).trim());
  }
  function answeredCount() { var n = 0; QS.forEach(function (q) { if (hasAnswer(q)) n++; }); return n; }
  function setBar() { bar.style.width = Math.round(100 * answeredCount() / TOTAL) + '%'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function renderInner() {
    setBar();
    prevB.disabled = step === 0 || !!finished;
    nextB.disabled = !!finished || !hasAnswer(QS[step]);
    document.getElementById('adqNav').style.display = finished ? 'none' : '';
    if (finished === 'dq') {
      body.style.padding = '';
      body.innerHTML = '<div class="adq-end"><p class="adq-title">Unfortunately it seems like we aren\'t a great fit right now.</p><p class="adq-desc">Feel free to check back if things change!</p></div>';
      return;
    }
    if (finished === 'cal') {
      body.style.padding = '0';
      bar.style.width = '100%';
      renderBooker();
      return;
    }
    var q = QS[step];
    var h = '<div class="adq-qrow"><span class="adq-qnum">' + (step + 1) + '</span><h2 class="adq-title">' + esc(q.title) + '<span class="adq-req">*</span></h2></div>' +
            (q.desc ? '<p class="adq-desc">' + esc(q.desc) + '</p>' : '');
    var z = '';
    if (q.type === 'choice' || q.type === 'multi') {
      z += '<div class="adq-opts">' + q.opts.map(function (o, i) {
        var sel = q.type === 'multi' ? (A[q.key] || []).indexOf(o) >= 0 : A[q.key] === o;
        return '<button type="button" class="adq-opt' + (sel ? ' sel' : '') + '" data-i="' + i + '"><span class="adq-key">' + LETTERS[i] + '</span><span>' + esc(o) + '</span></button>';
      }).join('') + '</div>';
      if (q.type === 'multi') z += '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint">press <b>Enter ↵</b></span></div>';
    } else if (q.type === 'name') {
      z += '<div class="adq-lbl">First name<span class="adq-req">*</span></div><input class="adq-in" id="adqF" autocomplete="given-name" placeholder="Jane" value="' + esc(A.first || '') + '">' +
           '<div class="adq-lbl">Last name<span class="adq-req">*</span></div><input class="adq-in" id="adqL" autocomplete="family-name" placeholder="Smith" value="' + esc(A.last || '') + '">' +
           '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint">press <b>Enter ↵</b></span></div><div class="adq-err" id="adqErr"></div>';
    } else if (q.type === 'phone') {
      var opts = COUNTRIES.map(function (c) { return '<option value="' + c[1] + '"' + (cc === c[1] && (c[0] !== 'CA' || cc !== '+1') ? ' selected' : '') + '>' + c[2] + ' ' + c[1] + '</option>'; }).join('');
      z += '<div class="adq-phone"><select class="adq-cc" id="adqCc" aria-label="Country code">' + opts + '</select>' +
           '<input class="adq-in" id="adqIn" type="tel" inputmode="tel" autocomplete="tel" placeholder="(201) 555-0123" value="' + esc(A.phone || '') + '"></div>' +
           '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint">press <b>Enter ↵</b></span></div><div class="adq-err" id="adqErr"></div>';
    } else if (q.type === 'email') {
      z += '<input class="adq-in" id="adqIn" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" value="' + esc(A.email || '') + '">' +
           '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint">press <b>Enter ↵</b></span></div><div class="adq-err" id="adqErr"></div>';
    } else if (q.type === 'long') {
      z += '<textarea class="adq-in" id="adqIn" rows="1" placeholder="Type your answer here...">' + esc(A[q.key] || '') + '</textarea>' +
           '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint"><b>Shift ⇧ + Enter ↵</b> to make a line break</span></div><div class="adq-err" id="adqErr"></div>';
    } else {
      z += '<input class="adq-in" id="adqIn" type="text" placeholder="Type your answer here..." value="' + esc(A[q.key] || '') + '">' +
           '<div class="adq-okrow"><button type="button" class="adq-ok" id="adqOk">OK</button><span class="adq-hint">press <b>Enter ↵</b></span></div><div class="adq-err" id="adqErr"></div>';
    }
    h += '<div class="adq-zone">' + z + '</div>';
    body.style.padding = '';
    body.innerHTML = h;
    body.scrollTop = 0;   // long questions (multi-selects, Q12) load from the TOP on mobile
    body.querySelectorAll('.adq-opt').forEach(function (btn) {
      btn.addEventListener('click', function () { chooseOpt(parseInt(btn.getAttribute('data-i'), 10)); });
    });
    var ok = document.getElementById('adqOk');
    if (ok) ok.addEventListener('click', advance);
    // Mobile: a Back button sits next to OK (the floating arrows are easy to miss full-screen)
    var okr = body.querySelector('.adq-okrow');
    if (okr && step > 0) { var bb = document.createElement('button'); bb.type = 'button'; bb.className = 'adq-back'; bb.setAttribute('aria-label', 'Back'); bb.innerHTML = '&#8592;'; okr.insertBefore(bb, okr.firstChild); bb.addEventListener('click', back); }
    var ccSel = document.getElementById('adqCc');
    if (ccSel) ccSel.addEventListener('change', function () { cc = ccSel.value; saveState(); });
    var inp = document.getElementById('adqIn') || document.getElementById('adqF');
    if (inp && inp.tagName === 'TEXTAREA') {
      var grow = function () { inp.style.height = '42px'; inp.style.height = Math.min(Math.max(inp.scrollHeight, 42), 220) + 'px'; };
      inp.addEventListener('input', grow); grow();
    }
    if (inp && window.matchMedia('(min-width: 769px)').matches) { try { inp.focus(); } catch (e) {} }
  }
  // ── Native booker v2 (Peter 2026-07-17): GHL-look, tz selector, mobile days→times two-step.
  var API_SLOTS = 'https://admin.automated.dating/api/apply/slots';
  var API_BOOK = 'https://admin.automated.dating/api/apply/book';
  var IC = {
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55555c" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    cal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55555c" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55555c" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55555c" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h10M4 17h13"/></svg>'
  };
  var bk = { loaded: false, dates: {}, mins: 45, month: null, selDate: '', armed: '', slot: '', view: 'time', mStep: 'date', err: '', busy: false, tz: '' };
  try { bk.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'; } catch (e) { bk.tz = 'America/New_York'; }
  var BK_TZS = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu', 'America/Toronto', 'America/Vancouver', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney'];
  if (BK_TZS.indexOf(bk.tz) < 0) BK_TZS.unshift(bk.tz);
  function bkIsMob() { return window.matchMedia('(max-width: 768px)').matches; }
  function bkGmtLabel(tz) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(new Date());
      var off = (parts.find(function (p) { return p.type === 'timeZoneName'; }) || {}).value || '';
      return off + ' ' + tz.replace(/_/g, ' ');
    } catch (e) { return tz.replace(/_/g, ' '); }
  }
  function bkFmtTime(iso) { return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: bk.tz }); }
  function bkFmtWhen(iso) {
    var d = new Date(iso);
    return bkFmtTime(iso) + ' - ' + new Date(d.getTime() + bk.mins * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: bk.tz }) +
      ' , ' + d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: bk.tz });
  }
  function bkFetch() {
    fetch(API_SLOTS, { headers: { 'Content-Type': 'text/plain' } }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) { bk.err = (j && j.error) || 'Could not load times'; bk.loaded = true; renderBooker(); return; }
      bk.dates = j.dates || {}; bk.mins = j.durationMins || 45; bk.loaded = true; bk.err = '';
      var keys = Object.keys(bk.dates).filter(function (k) { return (bk.dates[k] || []).length; }).sort();
      if (!bk.selDate || keys.indexOf(bk.selDate) < 0) bk.selDate = keys[0] || '';
      bk.month = bk.selDate ? new Date(bk.selDate + 'T12:00:00') : new Date();
      renderBooker();
    }).catch(function () { bk.err = 'Could not load times'; bk.loaded = true; renderBooker(); });
  }
  function bkTzSelHtml() {
    return '<div class="adbk-tzwrap"><div class="adbk-tzlbl">Time zone</div>' + IC.globe + ' <select id="bkTz">' +
      BK_TZS.map(function (tz) { return '<option value="' + esc(tz) + '"' + (tz === bk.tz ? ' selected' : '') + '>' + esc(bkGmtLabel(tz)) + '</option>'; }).join('') +
      '</select></div>';
  }
  function bkCalHtml() {
    var m = bk.month || new Date();
    var y = m.getFullYear(), mo = m.getMonth();
    var first = new Date(y, mo, 1), startDow = first.getDay(), dim = new Date(y, mo + 1, 0).getDate();
    var head = '<div class="adbk-monthrow"><button type="button" data-bknav="-1">‹</button><span>' + m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + '</span><button type="button" data-bknav="1">›</button></div>';
    var h = '<table class="adbk-cal"><tr>' + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function (d) { return '<th>' + d + '</th>'; }).join('') + '</tr><tr>';
    var cell = 0;
    for (var i = 0; i < startDow; i++) { h += '<td></td>'; cell++; }
    for (var day = 1; day <= dim; day++) {
      var key = y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      var av = (bk.dates[key] || []).length > 0;
      var cls = 'adbk-day' + (av ? ' av' : '') + (key === bk.selDate ? ' sel' : '');
      h += '<td><span class="' + cls + '"' + (av ? ' data-bkdate="' + key + '"' : '') + '>' + day + '</span></td>';
      cell++;
      if (cell % 7 === 0 && day < dim) h += '</tr><tr>';
    }
    h += '</tr></table>';
    return '<div class="adbk-calwrap">' + head + h + bkTzSelHtml() + '</div>';
  }
  function bkSlotsHtml() {
    var slots = (bk.dates[bk.selDate] || []);
    if (!slots.length) return '<div class="adbk-slots"><div style="color:#8a8a90;font-size:13px">No times this day</div></div>';
    return '<div class="adbk-slots">' + slots.map(function (iso) {
      if (bk.armed === iso) return '<div class="adbk-pair"><button type="button" class="adbk-chip">' + bkFmtTime(iso) + '</button><button type="button" class="adbk-go" data-bksel="' + esc(iso) + '">Select</button></div>';
      return '<button type="button" class="adbk-slot" data-bkarm="' + esc(iso) + '">' + bkFmtTime(iso) + '</button>';
    }).join('') + '</div>';
  }
  function bkDetailsHtml() {
    var v = bk.vals || {};
    return '<div class="adbk-details">' +
      '<label>First Name *</label><input type="text" id="bkFirst" value="' + esc(v.first != null ? v.first : (A.first || '')) + '">' +
      '<label>Phone *</label><input type="tel" id="bkPhone" value="' + esc(v.phone != null ? v.phone : (A.phone ? phoneE164() : '')) + '">' +
      '<label>Email *</label><input type="email" id="bkEmail" value="' + esc(v.email != null ? v.email : (A.email || '')) + '">' +
      '<label class="adbk-confirm"><input type="checkbox" id="bkConfirm"' + (bk.confirmed ? ' checked' : '') + '><span>Please confirm you will 100% be ready at this time at a laptop with no distractions. *</span></label>' +
      '<button type="button" class="adbk-sched' + (bk.confirmed ? '' : ' off') + '" id="bkSched">Schedule Meeting</button>' +
      '<button type="button" class="adbk-newtime" id="bkNewTime">Pick a new time</button>' +
      '<div class="adbk-err" id="bkErr">' + esc(bk.err || '') + '</div></div>';
  }
  function bkDayLabel() { return bk.selDate ? new Date(bk.selDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''; }
  function renderBooker() {
    if (!bk.loaded) { body.innerHTML = '<div class="adbk-load">Loading available times…</div>'; if (!bk._fetching) { bk._fetching = true; bkFetch(); } return; }
    var inner;
    if (bk.view === 'details') {
      inner = '<button type="button" class="adbk-back" id="bkBackTimes">‹ Back</button>' +
        '<div class="adbk-title" style="margin-top:-30px">Enter Details</div>' +
        '<div class="adbk-when">' + IC.clock + ' ' + bk.mins + ' min &nbsp; ' + IC.cal + ' ' + esc(bkFmtWhen(bk.slot)) + '</div>' +
        '<div class="adbk-when">' + IC.globe + ' ' + esc(bk.tz.replace(/_/g, ' ')) + '</div>' +
        bkDetailsHtml();
    } else if (bkIsMob() && bk.mStep === 'slots') {
      inner = '<button type="button" class="adbk-back" id="bkBackDates">‹ Pick a different day</button>' +
        '<div class="adbk-dayhead">' + esc(bkDayLabel()) + '</div>' + bkSlotsHtml() +
        (bk.err ? '<div class="adbk-err">' + esc(bk.err) + '</div>' : '');
    } else if (bkIsMob()) {
      inner = '<div class="adbk-title">Select a Date &amp; Time for Your Profile Audit</div><div class="adbk-sub">30-45 min - This is where we see if our program will work for you based on your current results, logistics and goals.</div><div class="adbk-timegrid">' + bkCalHtml() + '</div>' + (bk.err ? '<div class="adbk-err">' + esc(bk.err) + '</div>' : '');
    } else {
      inner = '<div class="adbk-title">Select a Date &amp; Time for Your Profile Audit</div><div class="adbk-sub">30-45 min - This is where we see if our program will work for you based on your current results, logistics and goals.</div><div class="adbk-timegrid">' + bkCalHtml() +
        '<div class="adbk-slotcol"><div class="adbk-dayhead">' + esc(bkDayLabel()) + '</div>' + bkSlotsHtml() + '</div></div>' +
        (bk.err ? '<div class="adbk-err">' + esc(bk.err) + '</div>' : '');
    }
    body.innerHTML = '<div class="adbk">' + inner + '</div>';
    body.scrollTop = 0;
    var scr = body.querySelector('.adbk'); if (scr) scr.scrollTop = 0;
    body.querySelectorAll('[data-bkdate]').forEach(function (el) { el.addEventListener('click', function () { bk.selDate = el.getAttribute('data-bkdate'); bk.armed = ''; if (bkIsMob()) { bk.mStep = 'slots'; bkPush('slots'); } renderBooker(); }); });
    body.querySelectorAll('[data-bknav]').forEach(function (el) { el.addEventListener('click', function () { var m = bk.month || new Date(); bk.month = new Date(m.getFullYear(), m.getMonth() + parseInt(el.getAttribute('data-bknav'), 10), 1); renderBooker(); }); });
    body.querySelectorAll('[data-bkarm]').forEach(function (el) { el.addEventListener('click', function () { bk.armed = el.getAttribute('data-bkarm'); renderBooker(); }); });
    body.querySelectorAll('[data-bksel]').forEach(function (el) { el.addEventListener('click', function () { bk.slot = el.getAttribute('data-bksel'); bk.view = 'details'; bk.err = ''; bk.confirmed = false; bkPush('details'); renderBooker(); }); });
    var tzSel = document.getElementById('bkTz');
    if (tzSel) tzSel.addEventListener('change', function () { bk.tz = tzSel.value; renderBooker(); });
    var bt = document.getElementById('bkBackTimes');
    if (bt) bt.addEventListener('click', function () { if (BOOKPAGE && bkHist > 0) { history.back(); return; } bk.view = 'time'; bk.err = ''; renderBooker(); });
    var bd = document.getElementById('bkBackDates');
    if (bd) bd.addEventListener('click', function () { if (BOOKPAGE && bkHist > 0) { history.back(); return; } bk.mStep = 'date'; bk.armed = ''; renderBooker(); });
    var nt = document.getElementById('bkNewTime');
    if (nt) nt.addEventListener('click', function () { bk.view = 'time'; bk.mStep = 'date'; bk.armed = ''; bk.slot = ''; bk.err = ''; bk.loaded = false; bk._fetching = false; renderBooker(); });
    var sb = document.getElementById('bkSched');
    if (sb) sb.addEventListener('click', bkSchedule);
    var cf = document.getElementById('bkConfirm');
    if (cf) cf.addEventListener('change', function () {
      if (sb) sb.classList.toggle('off', !cf.checked);
      if (cf.checked) { var e = document.getElementById('bkErr'); if (e) e.textContent = ''; }
    });
  }
  function bkSchedule() {
    if (bk.busy) return;
    var first = (document.getElementById('bkFirst') || {}).value || '';
    var phone = (document.getElementById('bkPhone') || {}).value || '';
    var email = (document.getElementById('bkEmail') || {}).value || '';
    var conf = document.getElementById('bkConfirm');
    var errEl = document.getElementById('bkErr');
    var fail = function (m) { if (errEl) errEl.textContent = m; };
    if (!first.trim()) return fail('Please enter your first name');
    if (phone.replace(/\D/g, '').length < 8) return fail('Please enter a valid phone number');
    if (/^(\d)\1{6}$/.test(phone.replace(/\D/g, '').slice(-7))) return fail("That phone number doesn't look right. Please double-check it");
    if (!/.+@.+\..+/.test(email)) return fail('Please enter a valid email');
    if (!conf || !conf.checked) return fail('Please confirm above that you will be ready, or pick a new time below.');
    bk.busy = true;
    bk.err = '';
    bk.vals = { first: first, phone: phone, email: email };
    bk.confirmed = true;
    var BMSGS = ['Locking in your time slot...', 'Confirming with our calendar...', 'Finalizing your booking...'];
    body.innerHTML = '<div class="adbk"><div class="adbk-prog"><div class="adbk-spin"></div>' +
      '<div class="adbk-prog-msg" id="bkPMsg">' + BMSGS[0] + '</div>' +
      '<div class="adbk-prog-bar"><i id="bkPBar"></i></div>' +
      '<div class="adbk-prog-pct" id="bkPPct">0%</div></div></div>';
    var w = 0, mi = 0;
    var tick = setInterval(function () {
      w += (93 - w) * 0.08;
      var bar = document.getElementById('bkPBar'), pct = document.getElementById('bkPPct');
      if (bar) bar.style.width = w + '%';
      if (pct) pct.textContent = Math.round(w) + '%';
    }, 350);
    var mrot = setInterval(function () {
      mi = Math.min(mi + 1, BMSGS.length - 1);
      var m = document.getElementById('bkPMsg'); if (m) m.textContent = BMSGS[mi];
    }, 2600);
    var done = function () { clearInterval(tick); clearInterval(mrot); };
    fetch(API_BOOK, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ first: first.trim(), last: A.last || '', email: email.trim(), phone: phone.trim(), startTime: bk.slot }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        done();
        if (j && j.ok) {
          var bar = document.getElementById('bkPBar'), pct = document.getElementById('bkPPct'), m = document.getElementById('bkPMsg');
          if (bar) bar.style.width = '100%';
          if (pct) pct.textContent = '100%';
          if (m) m.textContent = 'Booked! Loading your confirmation...';
          try { clearState(); sessionStorage.removeItem('adq_token'); } catch (e) {}
          setTimeout(function () { window.location.href = '/thankyou/'; }, 400);
          return;
        }
        bk.busy = false;
        var msg = (j && j.error) || 'Booking failed - please try again';
        if (/just taken|pick another/i.test(msg)) { bk.view = 'time'; bk.mStep = 'date'; bk.armed = ''; bk.slot = ''; bk.err = msg; bk.loaded = false; bk._fetching = false; renderBooker(); return; }
        bk.err = msg; renderBooker();
      })
      .catch(function () { done(); bk.busy = false; bk.err = 'Network error - please try again'; renderBooker(); });
  }

  var _animBusy = false;
  function render(animate) {
    if (!animate || ov.hidden) { renderInner(); fitAlign(); return; }
    if (_animBusy) { renderInner(); fitAlign(); return; }
    _animBusy = true;
    body.classList.add('anim-out');
    setTimeout(function () {
      renderInner();
      fitAlign();
      body.classList.remove('anim-out');
      body.classList.add('anim-pre');
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        body.classList.remove('anim-pre');
        body.classList.add('anim-in');
        setTimeout(function () { body.classList.remove('anim-in'); _animBusy = false; }, 200);
      }); });
    }, 130);
  }

  function chooseOpt(i) {
    var q = QS[step], o = q.opts[i];
    if (o == null) return;
    if (q.type === 'multi') {
      var cur = A[q.key] || [];
      var at = cur.indexOf(o);
      if (at >= 0) cur.splice(at, 1); else cur.push(o);
      A[q.key] = cur;
      saveState();
      renderInner();
      fitAlign();
    } else {
      A[q.key] = o;
      saveState();
      renderInner();
      fitAlign();
      setTimeout(advance, 250);
    }
  }
  function err(msg) { var e = document.getElementById('adqErr'); if (e) e.textContent = msg || ''; }
  function collect() {
    var q = QS[step];
    if (q.type === 'name') {
      var f = document.getElementById('adqF'), l = document.getElementById('adqL');
      A.first = f ? f.value.trim() : ''; A.last = l ? l.value.trim() : '';
      saveState();
      if (!A.first || !A.last) { err('Please fill this in'); return false; }
    } else if (q.type === 'phone') {
      var v = (document.getElementById('adqIn') || {}).value || '';
      A.phone = v.trim();
      saveState();
      if (!phoneValid()) { err('Hmm... that phone number doesn\'t look right'); return false; }
    } else if (q.type === 'email') {
      var ve = ((document.getElementById('adqIn') || {}).value || '').trim();
      A.email = ve;
      saveState();
      if (!/.+@.+\..+/.test(ve)) { err('Hmm... that email doesn\'t look right'); return false; }
    } else if (q.type === 'short' || q.type === 'long') {
      var vt = ((document.getElementById('adqIn') || {}).value || '').trim();
      A[q.key] = vt;
      saveState();
      if (!vt) { err('Please fill this in'); return false; }
    } else if (q.type === 'multi') {
      if (!(A[q.key] || []).length) { err(''); return false; }
    } else if (!A[q.key]) { return false; }
    return true;
  }
  var phonePartialFired = false;
  // The moment a valid phone lands, the lead is captured server-side as a partial and the texting
  // automation fires (Peter 2026-07-17) — even if they never answer another question. The server
  // dedups partials by token, and a later COMPLETE still processes fully.
  function firePhonePartial() {
    if (phonePartialFired || submitted) return;
    phonePartialFired = true; partialSent = true;
    try { fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: payload(false), keepalive: true }).catch(function () {}); } catch (e) {}
  }
  function advance() {
    if (finished) return;
    if (!collect()) return;
    var q = QS[step];
    if (q.key === 'phone') firePhonePartial();
    // Typeform-mirrored logic: DQ (Q1 No / income 0k-50k / invest No) evaluates at the INVEST
    // question; commit "Maybe" DQs; else calendar. Submission fires when an ENDING is reached —
    // before the calendar shows, so qualified non-bookers are never lost.
    if (q.key === 'invest' && isDq()) { submit(); finished = 'dq'; saveState(); render(true); return; }
    if (q.key === 'commit') {
      if (/^Maybe/.test(A.commit || '')) { submit(); finished = 'dq'; saveState(); render(true); return; }
      submit(); finished = 'cal'; saveState(); render(true); return;
    }
    if (step < QS.length - 1) { step++; saveState(); render(true); }
  }
  function back() { if (step > 0 && !finished) { step--; saveState(); render(true); } }
  prevB.addEventListener('click', back);
  nextB.addEventListener('click', advance);

  function openModal() {
    ov.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    render(false);
  }
  function closeModal() {
    // /book standalone page: hiding the overlay leaves a blank white page (Peter 2026-07-18
    // "hit back and the screen just went white") — leave to the homepage instead.
    if (typeof BOOKPAGE !== 'undefined' && BOOKPAGE) { location.href = 'https://automated.dating/'; return; }
    ov.hidden = true; document.documentElement.style.overflow = ''; saveState(); }
  document.getElementById('adqClose').addEventListener('click', closeModal);
  if (DCAL || BOOKPAGE) setTimeout(openModal, 300);
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-tf-popup]');
    if (t) { e.preventDefault(); openModal(); }
  }, true);
  document.addEventListener('keydown', function (e) {
    if (ov.hidden || finished) return;
    var q = QS[step];
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Enter') {
      if (q.type === 'long' && e.shiftKey) return;
      e.preventDefault(); advance(); return;
    }
    if ((q.type === 'choice' || q.type === 'multi') && /^[a-hA-H]$/.test(e.key)) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      var idx = LETTERS.indexOf(e.key.toUpperCase());
      if (idx >= 0 && idx < q.opts.length) { e.preventDefault(); chooseOpt(idx); }
    }
  });
})();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
