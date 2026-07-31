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
    var DEADLINE = new Date('2026-08-02T00:00:00-04:00').getTime();   // increase hits after Aug 1 = end of Aug 1 ET
    var TY = location.pathname.indexOf('thankyou') >= 0;
    var MSG = '$500 Off Until Aug 1';
    var sid;
    try { sid = sessionStorage.getItem('ad_sid'); if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('ad_sid', sid); } }
    catch (e) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
    var em = '';
    if (TY) { try { em = (localStorage.getItem('adq_em') || '').slice(0, 120); } catch (e) {} }
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
    if (live && !hideQA && !dismissed) {
      try {
        var fl = document.createElement('link'); fl.rel = 'stylesheet';
        fl.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
        document.head.appendChild(fl);
      } catch (e) {}
      var st = document.createElement('style');
      st.textContent = '#adBnr{position:relative;z-index:70;background:#FCF7E6;color:#41402f;border-bottom:1px solid #efe8d2;display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 40px;font-family:Figtree,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
        '#adBnr .m{font-size:13.5px;font-weight:500;text-align:center;line-height:1.35}' +
        '.adBnrChip{flex:none;background:#1F2A20;color:#fff;border-radius:5px;padding:3px 7px 2px;text-align:center;line-height:1}' +
        '.adBnrChip b{font-size:13px;font-variant-numeric:tabular-nums;display:block;font-weight:700}' +
        '.adBnrChip span{font-size:7.5px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}' +
        '#adBnrX{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:#b3a97e;font-size:17px;line-height:1;cursor:pointer;padding:6px;font-family:inherit}' +
        '#adBnrX:hover{color:#41402f}' +
        '@media (max-width:768px){#adBnr{padding:7px 34px;gap:8px}#adBnr .m{font-size:11.5px}}';
      document.head.appendChild(st);
      var bar = document.createElement('div');
      bar.id = 'adBnr';
      bar.innerHTML = '<span class="m">' + MSG + '</span>' +
        '<span class="adBnrChip"><b id="adBnrD">0</b><span>days</span></span>' +
        '<span class="adBnrChip"><b id="adBnrH">0</b><span>hrs</span></span>' +
        '<button id="adBnrX" aria-label="Dismiss">✕</button>';
      if (document.body) document.body.insertBefore(bar, document.body.firstChild);
      try { document.getElementById('adBnrX').addEventListener('click', function () { try { sessionStorage.setItem('adq_bnr_x', '1'); } catch (e) {} try { bar.remove(); } catch (e) {} }); } catch (e) {}
      var tick = function () {
        var left = DEADLINE - Date.now();
        if (left <= 0) { try { bar.remove(); } catch (e) {} return; }
        var d2 = function (n) { return (n < 10 ? '0' : '') + n; };
        var dEl = document.getElementById('adBnrD'), hEl = document.getElementById('adBnrH');
        if (dEl) dEl.textContent = d2(Math.floor(left / 86400000));
        if (hEl) hEl.textContent = d2(Math.floor(left % 86400000 / 3600000));
      };
      tick();
      setInterval(tick, 30000);
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
    // ── Per-video watch tracking on the page's OWN video grid (Peter 2026-07-31: the appended
    // "Before your call" button list is gone — the new videos live in the static hero + numbered
    // grid, tagged data-vkey). Click detection = the same blur+activeElement trick (cross-origin
    // iframes); watched seconds = clicked + in-viewport + tab visible. Beacons unchanged
    // (ty_vid once per video, ty_vid_time cumulative secs) so the relay's GHL sync keeps filling
    // per-contact totals under the same keys.
    try {
      var tyW = {};
      var vifs = [].slice.call(document.querySelectorAll('iframe[data-vkey]'));
      if (vifs.length) {
        var vio = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
          es.forEach(function (en) { var k = en.target.getAttribute('data-vkey'); if (tyW[k]) tyW[k].vis = en.isIntersecting; });
        }, { threshold: 0.4 }) : null;
        vifs.forEach(function (f) {
          var k = f.getAttribute('data-vkey');
          tyW[k] = { on: false, vis: !vio, secs: 0, sent: 0 };
          if (vio) vio.observe(f);
        });
        window.addEventListener('blur', function () {
          try {
            var a = document.activeElement;
            if (a && a.tagName === 'IFRAME' && a.getAttribute('data-vkey')) {
              var k2 = a.getAttribute('data-vkey');
              if (tyW[k2] && !tyW[k2].on) { tyW[k2].on = true; beacon('ty_vid', { utm_content: k2 }); }
            }
          } catch (err) {}
        });
        setInterval(function () {
          Object.keys(tyW).forEach(function (k) {
            var w = tyW[k];
            if (w.on && w.vis && !document.hidden) w.secs += 5;
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
