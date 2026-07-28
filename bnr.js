// ═══ PRICE-INCREASE BANNER SPLIT TEST + THANK-YOU PAGE TRACKING (Peter 2026-07-28) ═══
// Landing pages (/, /concierge): 50/50 red marquee banner (cookie adq_bnr y|n, ?bnr=y|n forces).
// The arm rides into /api/apply as hidden.bnr → web_funnel_events.bnr → SPLIT TEST 7 on the sheet.
// Thank-you page: its OWN 50/50 (cookie adq_tybnr — a person can be in either arm of each test)
// plus first-party engagement tracking: ty_view / ty_hb (15s heartbeats = time on page) / ty_click,
// each carrying the arm in `page` and the booker's email (localStorage adq_em, set by adq-embed at
// submit/booking — same-origin only, POSTed in the body, NEVER in a URL) → SPLIT TEST 8.
// Banner auto-retires at the Aug 5 deadline: past it nothing renders and no bnr_view fires.
(function () {
  try {
    var EP = 'https://admin.automated.dating/api/analytics/track';
    var DEADLINE = new Date('2026-07-31T00:00:00-04:00').getTime();   // July 31, midnight ET (Peter 2026-07-28: pulled in from Aug 5)
    var TY = location.pathname.indexOf('thankyou') >= 0;
    var CK = TY ? 'adq_tybnr' : 'adq_bnr';
    var sid;
    try { sid = sessionStorage.getItem('ad_sid'); if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('ad_sid', sid); } }
    catch (e) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
    var em = '';
    if (TY) { try { em = (localStorage.getItem('adq_em') || '').slice(0, 120); } catch (e) {} }
    function beacon(ev, extra) {
      try {
        var d = { event: ev, sid: sid, page: ARM };
        if (em) d.email = em;
        if (extra) { for (var k in extra) { d[k] = extra[k]; } }
        var s = JSON.stringify(d);
        if (navigator.sendBeacon) navigator.sendBeacon(EP, new Blob([s], { type: 'text/plain' }));
        else { var x = new XMLHttpRequest(); x.open('POST', EP, true); x.setRequestHeader('Content-Type', 'text/plain'); x.send(s); }
      } catch (e) {}
    }
    // ── arm assignment (sticky 180d; ?bnr= forces for QA) ──
    // Landing = SPLIT TEST 9 (Peter 2026-07-28): y (red price banner) vs p (free Photo & Profile
    // Optimization banner). The old no-banner arm 'n' is RETIRED on landing — legacy n cookies
    // re-roll into y|p; ?bnr=n still forces bannerless for QA. Thank-you keeps its own y/n test
    // (ST8 measures banner-vs-none engagement) — only the y copy/date changed there.
    var ARM;
    try {
      var f = (location.search.match(/[?&]bnr=([ynp])\b/) || [])[1];
      var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + CK + '=([ynp])\\b'));
      ARM = f || (m && m[1]) || '';
      if (!f) {
        if (TY) { if (ARM !== 'y' && ARM !== 'n') ARM = (Math.random() < 0.5) ? 'y' : 'n'; }
        else if (ARM !== 'y' && ARM !== 'p') ARM = (Math.random() < 0.5) ? 'y' : 'p';
      }
      if (f || !m || (m && m[1] !== ARM)) document.cookie = CK + '=' + ARM + '; path=/; max-age=15552000; SameSite=Lax; domain=.automated.dating';
    } catch (e) { ARM = 'n'; }
    var live = Date.now() < DEADLINE;

    // ── the banner (arms y/p, until the deadline) ──
    if ((ARM === 'y' || ARM === 'p') && live) {
      var MSG = ARM === 'p'
        ? 'Onboard by July 31 to get Photo & Profile Optimization included for FREE.'
        : 'Due to increased demand, our prices are increasing by $500 on July 31st so we can maintain high quality results for clients.';
      var st = document.createElement('style');
      st.textContent = '#adBnr{position:relative;z-index:70;background:#c81e1e;color:#fff;height:42px;display:flex;align-items:center;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
        '#adBnrTrack{display:flex;white-space:nowrap;animation:adBnrScroll 28s linear infinite;will-change:transform}' +
        '#adBnrTrack span{font-size:14.5px;font-weight:700;letter-spacing:.01em;padding-right:48px}' +
        '@keyframes adBnrScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
        '@media (prefers-reduced-motion: reduce){#adBnrTrack{animation:none}}' +
        '#adBnrCd{flex:none;position:absolute;right:0;top:0;bottom:0;display:flex;align-items:center;gap:7px;padding:0 14px 0 26px;background:linear-gradient(90deg,rgba(200,30,30,0),#a31212 26%);font-size:13px;font-weight:800}' +
        '#adBnrCd b{font-variant-numeric:tabular-nums;font-size:13.5px}' +
        '@media (max-width:768px){#adBnr{height:38px}#adBnrTrack span{font-size:12.5px;padding-right:34px}#adBnrCd{font-size:11px;padding:0 10px 0 20px}#adBnrCd b{font-size:12px}}';
      document.head.appendChild(st);
      var bar = document.createElement('div');
      bar.id = 'adBnr';
      var half = '<span>' + MSG + '</span><span>' + MSG + '</span>';
      bar.innerHTML = '<div id="adBnrTrack">' + half + half + '</div><div id="adBnrCd">⏳ <b id="adBnrT"></b></div>';
      if (document.body) document.body.insertBefore(bar, document.body.firstChild);
      var tick = function () {
        var left = DEADLINE - Date.now();
        if (left <= 0) { try { bar.remove(); } catch (e) {} return; }
        var d2 = function (n) { return (n < 10 ? '0' : '') + n; };
        var days = Math.floor(left / 86400000);
        var h = Math.floor(left % 86400000 / 3600000), mi = Math.floor(left % 3600000 / 60000), s2 = Math.floor(left % 60000 / 1000);
        var el = document.getElementById('adBnrT');
        if (el) el.textContent = (days ? days + 'd ' : '') + d2(h) + ':' + d2(mi) + ':' + d2(s2);
      };
      tick();
      setInterval(tick, 1000);
    }

    if (!TY) { if (live) beacon('bnr_view'); return; }

    // ── thank-you page engagement tracking (both arms, runs even past the banner deadline) ──
    beacon('ty_view');
    var hb = 0;
    setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      if (++hb > 40) return;   // cap at 10 min so a parked tab can't fake an hour on page
      beacon('ty_hb');
    }, 15000);
    var clicks = 0;
    document.addEventListener('click', function (e) {
      try {
        if (clicks >= 10) return;
        var t = e.target && e.target.closest && e.target.closest('a,button,[role="button"]');
        var label = t ? (t.getAttribute('aria-label') || t.textContent || t.tagName || '').trim().replace(/\s+/g, ' ').slice(0, 80) : (e.target && e.target.tagName) || 'page';
        clicks++;
        beacon('ty_click', { utm_content: label });
      } catch (err) {}
    }, true);
    // Embedded-video clicks land inside cross-origin iframes (YouTube) — the click event never
    // reaches this document. The blur+activeElement trick catches the tap instead.
    window.addEventListener('blur', function () {
      try {
        var a = document.activeElement;
        if (a && a.tagName === 'IFRAME' && clicks < 10) {
          clicks++;
          beacon('ty_click', { utm_content: 'video: ' + ((a.getAttribute('title') || a.src || '').slice(0, 70)) });
        }
      } catch (err) {}
    });
  } catch (e) {}
})();
