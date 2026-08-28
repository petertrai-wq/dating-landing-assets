// ═══ SITE BANNER + THANK-YOU PAGE TRACKING ═══
// Banner split tests 7/9 CONCLUDED (Peter 2026-07-28 "remove the banner split test"): every visitor
// now sees ONE static banner. Copy swapped 2026-07-29 (Peter "Price Increase After Aug 1 then show
// an accurate timer") — counts down to the increase moment (end of Aug 1 ET) and self-retires there.
// No arms, no adq_bnr cookie writes (adq-embed's hidden.bnr simply stays absent; old cookies ignored).
// Thank-you page engagement tracking (ty_view / ty_hb / ty_click → Split Test 8 analytics) is
// UNCHANGED — that measures the page, not the banner.
(function () {
  try {
    var EP = 'https://admin.automated.dating/api/analytics/track';
    var DEADLINE = new Date('2026-09-01T00:00:00-04:00').getTime();   // increase hits Sep 1 ET (Peter 2026-08-27); banner self-retires at midnight
    var TY = location.pathname.indexOf('thankyou') >= 0;
    // Copy swapped to capacity framing 2026-08-28 (Peter's call, matches the rt-0827 ad captions:
    // "3 spots open at the current rate before September 1"). Was '$500 Price Increase Sep 1' —
    // price-panic framing; keep the spots number REAL and in sync with the ads.
    var MSG = '3 Spots Left at the Current Rate';
    var sid;
    try { sid = sessionStorage.getItem('ad_sid'); if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('ad_sid', sid); } }
    catch (e) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
    // Identity for thank-you engagement (Peter 2026-07-31 "attribute watch time to contacts"):
    // adq_em is written by BOTH forms at submit, but a lead who lands on /thankyou from the GHL
    // calendar hop (or a fresh tab) has no adq_em — fall back to the booking stash the resched
    // popup already keeps, then to an ?email= param. Without one of these the watch time is
    // anonymous and can never reach a contact or revenue.
    var em = '';
    if (TY) {
      try { em = (localStorage.getItem('adq_em') || '').slice(0, 120); } catch (e) {}
      if (!em) { try { var _bk = JSON.parse(localStorage.getItem('adq_book') || 'null'); if (_bk && _bk.e) em = String(_bk.e).toLowerCase().slice(0, 120); } catch (e) {} }
      if (!em) { try { var _qe = new URLSearchParams(location.search).get('email'); if (_qe && /^.+@.+\..+$/.test(_qe)) em = _qe.toLowerCase().slice(0, 120); } catch (e) {} }
      if (em) { try { localStorage.setItem('adq_em', em); } catch (e) {} }
    }
    function beacon(ev, extra) {
      try {
        var d = { event: ev, sid: sid, page: 's' };   // s = static banner (post-split-test)
        if (em) d.email = em;
        if (extra) { for (var k in extra) { d[k] = extra[k]; } }
        var s = JSON.stringify(d);
        if (navigator.sendBeacon) navigator.sendBeacon(EP, new Blob([s], { type: 'text/plain' }));
        else { var x = new XMLHttpRequest(); x.open('POST', EP, true); x.setRequestHeader('Content-Type', 'text/plain'); x.send(s); }
      } catch (e) {}
    }
    var live = Date.now() < DEADLINE;

    // ── the static banner (everyone, until the deadline; ?bnr=n hides for QA) ──
    // Athena-style (Peter 2026-07-28 pm "remove the moving banner... stay at the top cleanly like
    // this athena one. Put an x button and match their font"): cream bar, centered Figtree copy,
    // dark DAYS/HRS chips, × dismisses for the session. No marquee.
    var hideQA = /[?&]bnr=n\b/.test(location.search);
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('adq_bnr_x') === '1'; } catch (e) {}
    var LANDING = /^\/(index\.html)?$/.test(location.pathname);   // Peter 2026-08-27: banner on the LANDING page only
    if (live && !hideQA && !dismissed && !TY && LANDING) {   // Peter 2026-07-31: no banner on the thank-you page (its eyebrow carries the price message)
      try {
        var fl = document.createElement('link'); fl.rel = 'stylesheet';
        fl.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
        document.head.appendChild(fl);
      } catch (e) {}
      var st = document.createElement('style');
      // Cream top bar while the banner is live (Peter 2026-08-27: the nav renders dark on the
      // landing — black text was invisible; "should be a cream colored top bar"). The override
      // is removed whenever the banner goes (dismiss / form-click / deadline) so the nav
      // returns to its normal look.
      st.textContent = '.nav{background:#FCF7E6 !important;backdrop-filter:none !important;border-bottom:1px solid #efe8d2 !important}' +
        '.nav .wrap a:not(.btn),.nav .txtus{color:#111 !important;opacity:.92}' +
        '.nav .txtus svg{color:#111 !important}' +
        '#adBnrIn{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:9px;white-space:nowrap}' +
        '#adBnrIn .m{font-size:13.5px;font-weight:700;letter-spacing:-0.01em;color:#111}' +
        '.adBnrChip{flex:none;background:#1F2A20;color:#fff;border-radius:5px;padding:3px 7px 2px;text-align:center;line-height:1}' +
        '.adBnrChip b{font-size:12.5px;font-variant-numeric:tabular-nums;display:block;font-weight:700}' +
        '.adBnrChip span{font-size:7px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}' +
        '#adBnrX{border:none;background:none;color:#9a9a90;font-size:15px;line-height:1;cursor:pointer;padding:4px;font-family:inherit}' +
        '#adBnrX:hover{color:#111}' +
        '@media (max-width:1180px){' +
          '.nav .wrap{flex-wrap:wrap;height:auto;min-height:66px;position:relative}' +
          '#adBnrIn{position:static;transform:none;width:100%;justify-content:center;order:3;padding:6px 0 8px;border-top:1px solid rgba(0,0,0,.07);margin-top:2px}' +
        '}';
      document.head.appendChild(st);
      // ONE top bar (Peter 2026-08-27 "put these both on the same top banner"): the message +
      // countdown live INSIDE the site nav next to the brand pill — no second stacked strip.
      var host = document.querySelector('.nav .wrap');
      var bar = document.createElement('div');
      bar.id = 'adBnrIn';
      bar.innerHTML = '<span class="m">' + MSG + '</span>' +
        '<span class="adBnrChip"><b id="adBnrD">0</b><span>days</span></span>' +
        '<span class="adBnrChip"><b id="adBnrH">0</b><span>hrs</span></span>' +
        '<button id="adBnrX" aria-label="Dismiss">\u2715</button>';
      if (host) { try { host.style.position = 'relative'; } catch (e) {} host.appendChild(bar); }
      else if (document.body) document.body.insertBefore(bar, document.body.firstChild);
      var retire = function () { try { bar.remove(); } catch (e) {} try { st.remove(); } catch (e) {} };
      try { document.getElementById('adBnrX').addEventListener('click', function () { try { sessionStorage.setItem('adq_bnr_x', '1'); } catch (e) {} retire(); }); } catch (e) {}
      var tick = function () {
        var left = DEADLINE - Date.now();
        if (left <= 0) { retire(); return; }
        var d2 = function (n) { return (n < 10 ? '0' : '') + n; };
        var dEl = document.getElementById('adBnrD'), hEl = document.getElementById('adBnrH');
        if (dEl) dEl.textContent = d2(Math.floor(left / 86400000));
        if (hEl) hEl.textContent = d2(Math.floor(left % 86400000 / 3600000));
      };
      tick();
      setInterval(tick, 30000);
      // Peter 2026-08-27 'remove it when they click into the form': any form entry —
      // a Typeform-popup CTA click or focus/click inside the inline hero form — drops the bar.
      var hideOnForm = function () { retire(); };
      document.addEventListener('click', function (e) {
        try { if (e.target && e.target.closest && (e.target.closest('[data-tf-popup]') || e.target.closest('#adqInlineHost'))) hideOnForm(); } catch (err) {}
      }, true);
      document.addEventListener('focusin', function (e) {
        try { if (e.target && e.target.closest && e.target.closest('#adqInlineHost')) hideOnForm(); } catch (err) {}
      }, true);
    }

    if (!TY) { if (live) beacon('bnr_view'); return; }

    // ── thank-you page engagement tracking (unchanged, runs even past the banner deadline) ──
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
    // ── Per-video watch tracking on the page's OWN video grid (Peter 2026-07-31). The videos are
    // cream FACADE cards (question in the top half) that swap to a YouTube iframe on click, so the
    // stable tracking anchor is the [data-vkey] WRAPPER, not the iframe: a click inside the wrapper
    // (the only way to start playback) fires ty_vid once; watched seconds = clicked + wrapper
    // in-viewport + tab visible. Beacons unchanged (ty_vid, ty_vid_time pct=secs) so the relay's
    // GHL sync keeps filling per-contact totals under the same keys.
    try {
      var tyW = {};
      var vwraps = [].slice.call(document.querySelectorAll('[data-vkey]'));
      if (vwraps.length) {
        var vio = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
          es.forEach(function (en) { var k = en.target.getAttribute('data-vkey'); if (tyW[k]) tyW[k].vis = en.isIntersecting; });
        }, { threshold: 0.4 }) : null;
        vwraps.forEach(function (w) {
          var k = w.getAttribute('data-vkey');
          tyW[k] = { on: false, vis: !vio, secs: 0, sent: 0, stateful: false, play: false, engaged: false };
          if (vio) vio.observe(w);
          w.addEventListener('click', function () {
            if (!tyW[k].on) { tyW[k].on = true; beacon('ty_vid', { utm_content: k }); }
          });
          // v2 facade players (2026-07-31) dispatch real play/pause state as 'tyvid' CustomEvents —
          // engaged:false while the hero autoplay is still muted, so passive seconds never count.
          // Once any tyvid arrives that wrapper's WATCH SECONDS follow true player state; the
          // click heuristic above stays as the fallback (and still fires ty_vid on first tap).
          w.addEventListener('tyvid', function (ev) {
            var d = (ev && ev.detail) || {}, t = tyW[k]; if (!t) return;
            t.stateful = true; t.play = !!d.playing; t.engaged = !!d.engaged;
            if (t.play && t.engaged && !t.on) { t.on = true; beacon('ty_vid', { utm_content: k }); }
          });
        });
        setInterval(function () {
          Object.keys(tyW).forEach(function (k) {
            var w = tyW[k];
            var watching = w.stateful ? (w.play && w.engaged && !document.hidden) : (w.on && w.vis && !document.hidden);
            if (watching) w.secs += 5;
            if (w.secs - w.sent >= 15) { w.sent = w.secs; beacon('ty_vid_time', { utm_content: k, pct: Math.round(w.secs) }); }
          });
        }, 5000);
        window.addEventListener('pagehide', function () {
          Object.keys(tyW).forEach(function (k) { var w = tyW[k]; if (w.secs > w.sent) { w.sent = w.secs; beacon('ty_vid_time', { utm_content: k, pct: Math.round(w.secs) }); } });
        });
      }
    } catch (e) {}
  } catch (e) {}
})();
