/* DSL click-through player (STAGED PREVIEW, untracked).
   Our own HTML player, deliberately NOT a Google Slides iframe, so we can track
   per-slide progress. Copy = the DSL v3 deck (source of truth: the "Automated
   Dating - DSL v3" Slides file / build_v3.js), TIME funnel sequence by default.

   ARCHITECTURE NOTES (for the real build):
   - The opener slide (index 0) and the problem slide (index 2) swap per hero
     variant (utm_content HERO_MAP), same as the landing hero H1 does.
   - ANALYTICS HOOK: every slide advance calls emitSlideBeacon(). When wired,
     it will POST {ev:"dsl_slide", slide:<idx>, total:<n>, sid:<form/session id>,
     hero:<hero variant>} to the relay funnel-analytics endpoint (same rail as
     the landing's drop-off beacons). NOT wired yet on purpose. */

(function () {
  "use strict";

  var AV = "/concierge/"; // testimonial avatars already shipped with the site (root-absolute: index.html has <base href="/concierge/">)

  // ---- slide data (DSL v3 copy, verbatim) ----
  var SLIDES = [
    { k: "AUTOMATED DATING", h: "If your time's worth $50 an hour, stop swiping.",
      ps: [["dsub", "Done-for-you dating for busy professionals."]],
      bullets: ["We learn your type", "We swipe, we text, we schedule", "You just show up to dates on your calendar"] },

    { k: "WHO ARE WE", h: "Founded by Peter Trai.", dense: true,
      ps: [["dsub", "A dating coach who's coached hundreds of successful men to more dates than they know what to do with."]],
      bullets: ["300+ men coached with proven dating systems",
                "Built the ONLY done-for-you automated dating system",
                "99% of clients get higher volume AND higher quality matches from day 1",
                "Hundreds of thousands of followers, millions of views across platforms"] },

    { center: true, k: "THE PROBLEM WE SOLVE",
      runs: [["strong", "More dates. Higher quality dates."], ["accent", "While saving you hours every week for your higher leverage work."]] },

    { k: "THE AGREEABLE TRUTH", h: "More high quality women than ever are using dating apps.",
      ps: [["para", "However. Landing a date with even one of them takes hours of swiping, hours of small talk, and then there's still a chance she flakes."]] },

    { k: "THE SOLUTION", h: "Luckily, we handle all of that for you.", hsm: true, dense: true,
      stack: [["We learn your type.", 0], ["We do the swiping.", 0], ["We do the texting.", 0], ["We do the scheduling.", 0], ["You get the dates, right on your calendar.", 1]],
      ps: [["mut", "Zero effort on your part required."]] },

    { k: "WHY MEN CHOOSE THIS", h: "It's the best method we've discovered to:",
      bullets: ["Land a high amount of high quality dates",
                "Get higher quality dates on autopilot",
                "Get into your ideal long-term relationship",
                "Have more time for the things you actually care about",
                "Finally take control of your dating life."] },

    { k: "BEFORE THE DETAILS", h: "I'm going to reveal the details in a minute.",
      ps: [["accent", "First: why this works so well right now (and may not later)."]] },

    { k: "WHY THIS WORKS", hsm: true,
      h: "Right now, your photos are the number one reason your dating life isn't working the way you want it to.",
      ps: [["para", "And almost nobody can make AI photos that actually work. You've probably tried them yourself. They looked nothing like you."],
           ["strong", "Photographers? Expensive, a hassle, and the results are not guaranteed to work."]] },

    { k: "WHY THIS WORKS", hsm: true,
      h: "Across hundreds of clients, well done AI pictures get better results than any photographer ever will.",
      ps: [["para", "Done right, we've seen upwards of a 1000% increase in matches."],
           ["strong", "Guys who never got a single match, now getting more matches than they know what to do with."]] },

    { k: "WHY THIS WORKS", h: "Matches are half the game. The script is the other half.", hsm: true,
      ps: [["para", "A high volume of quality matches, run through a texting script proven across hundreds of clients."],
           ["strong", "Combine that with a team who knows how to do it even better than you, and you've got a system that will make your friends jealous and wanting to know exactly what you're doing."]] },

    { k: "STEP 1", h: "First, we learn you.",
      bullets: ["Your type, exactly", "Your preferences", "Your schedule",
                "Your venues", "Your preferred activity (drinks, coffee, dinner...)"] },

    { k: "STEP 2", h: "Then we run everything.",
      bullets: ["We do the swiping, on your type", "We do the texting", "We send every match to you for approval first", "We set up the dates and put them on your calendar"],
      psAfter: [["accent", "You just show up."], ["strong", "You have the final say. Nothing goes on your calendar without your approval."]] },

    { cards: [
        { img: "tw-derek.jpg", q: "You guys have literally changed my life", n: "Derek", r: "Startup Founder · Seattle, WA" },
        { img: "tw-shaun2.jpg", q: "Three dates, three nights in a row this past Sunday, Monday and Tuesday. All at my place.", n: "Shaun", r: "Finance Executive · London, UK" },
        { img: "tw-asang2.jpg", q: "On Hinge I actually just don't get matches. Like, I don't get any. This fixed that completely.", n: "Asang", r: "SaaS Owner · Sydney, Australia" }
      ], k: "FROM OUR CLIENTS" },

    { k: "WE CAN DO ALL OF THIS FOR YOU", h: "Want us to do all of this for you?",
      ps: [["accent", "Then fill out the application below."],
           ["mut", "It takes about two minutes."],
           ["strong", "Spaces are limited due to Hinge geolocation restrictions."]] },

    { cards: [
        { img: "tw-marco2.jpg", q: "I don't have trouble with women. I just don't want to spend the time. It's like a full-time job.", n: "Marco", r: "Exec · San Francisco, CA" },
        { img: "tw-grayson.jpg", q: "If I just put in the time, I'd be fine. But I just don't want to put in the time. I'd rather just pay somebody.", n: "Grayson", r: "Marketing Agency Owner · New York, NY" }
      ], k: "FROM OUR CLIENTS" },

    { cards: [
        { img: "tw-casey.jpg", q: "The likes you do get aren't women you're attracted to. I wanted fewer, better dates. That's exactly what this is.", n: "Casey", r: "Contracting Officer · Ogden, UT" },
        { img: "tw-james2.jpg", q: "She was exactly my type", n: "James", r: "M&A Attorney · Boston, MA" },
        { img: "tw-jonathan.jpg", q: "the hinge/raya is firing btw, thanks a lot for the pics. game changer actually haha", n: "Jonathan", r: "Product Manager · New York, NY" }
      ], k: "FROM OUR CLIENTS" },

    { k: "HOW WE'LL HELP YOU",
      stack: [["We learn your type.", 0], ["We swipe. You approve.", 2], ["We text.", 0], ["You get dates on your calendar.", 1]],
      ps: [["strong", "You have the final say. Nothing goes on your calendar without your approval."]] },

    { k: "AND ONE MORE THING", h: "Plus, we'll even rebuild your entire profile.",
      ps: [["para", "Data-backed photos and prompts, guaranteed to increase your match rate."]] },

    { k: "SO...", hsm: true,
      h: "If you want us to put high quality dates on your calendar, set to your preferences, while you get your time back for the things you care about...",
      ps: [["accent", "Then fill out the application on this page and talk to us."]],
      guar: "Your first date in 7 days. Or you don't pay." },

    { k: "THE OFFER", h: "When you work with us, we will personally:", dense: true,
      bullets: ["Rebuild your entire profile with data-backed photos and prompts",
                "Send as many outbound likes and messages as you want, every single day",
                "Work your dating apps like clockwork",
                "Send every match to you for approval before anything gets set up",
                "Set up each date you approve however you want it. Coffee, wine, dinner. You tell us, we set it up."],
      guar: "Your first date in 7 days. Or you don't pay." },

    { k: "WHY NOW", h: "This advantage will not be here forever.", hsm: true,
      ps: [["para", "AI is moving fast. Within a year or so, it will probably swipe for people. Right now the big AI models are locked against it. So it takes a trained team."],
           ["para", "And AI photos that look real and actually convert will soon be in everyone's hands. Once everyone has them, the edge is gone."]] },

    { k: "THE WINDOW IS OPEN", hsm: true,
      h: "You're seeing this right now. That means you can still take advantage of it.",
      ps: [["para", "Spaces are limited due to Hinge geolocation restrictions. We can only run 30 devices at a time in one location before accounts start getting flagged. When those spots are full, they are full."],
           ["accent", "Fill out the application below right now, and invest in yourself."]] }
  ];

  // ---- render ----
  var stage = document.getElementById("dslStage");
  var countEl = document.getElementById("dslCount");
  var prevBtn = document.getElementById("dslPrev");
  var nextBtn = document.getElementById("dslNext");
  var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };

  SLIDES.forEach(function (sl) {
    var d = document.createElement("div");
    d.className = "dsl-slide" + (sl.center ? " center" : "") + (sl.hsm ? " hsm" : "") + (sl.dense ? " dense" : "") +
      (sl.cards && sl.cards.length === 3 ? " cards3" : "");
    var h = "";
    // kickers retired (Peter 2026-08-05 pm: "remove the yellow title at the very top of each of
    // the slides") — the k values stay in the data as section labels for whoever edits copy.
    if (sl.runs) {
      h += "<h2>" + sl.runs.map(function (r) {
        return '<span class="' + r[0] + '">' + esc(r[1]) + "</span>";
      }).join("<br>") + "</h2>";
    }
    if (sl.h) h += "<h2>" + esc(sl.h) + "</h2>";
    if (sl.stack) {
      h += '<div class="stack">' + sl.stack.map(function (r) {
        var t = esc(r[0]);
        if (r[1] === 1) return '<span class="accent">' + t + "</span>";
        if (r[1] === 2) return t.replace("You approve.", '<span class="accent">You approve.</span>');
        return t;
      }).join("<br>") + "</div>";
    }
    var para = function (p) { return '<p class="para ' + p[0] + '">' + esc(p[1]) + "</p>"; };
    if (sl.ps) h += sl.ps.map(para).join("");
    if (sl.bullets) h += "<ul>" + sl.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
    if (sl.psAfter) h += sl.psAfter.map(para).join("");
    if (sl.cards) {
      h += '<div class="tcards">' + sl.cards.map(function (c) {
        return '<div class="dsl-tcard"><img src="' + AV + c.img + '" alt="">' +
          '<div><div class="qt">“' + esc(c.q) + '”</div>' +
          '<div class="nm"><b>' + esc(c.n) + "</b> <span>" + esc(c.r) + "</span></div></div></div>";
      }).join("") + "</div>";
    }
    if (sl.guar) h += '<div class="guar">' + esc(sl.guar) + "</div>";
    d.innerHTML = h;
    stage.appendChild(d);
  });

  var slides = stage.children;
  var cur = 0;

  /* ST14 slide-depth beacon: fires only on NEW max depth (back-taps and re-views stay silent),
     only on the live apex (localhost previews must not pollute the test). The 1-based slide
     number rides the numeric `pct` column of web_analytics_events — no schema change. */
  var _maxSeen = -1;
  function emitSlideBeacon(idx) {
    try {
      if (idx <= _maxSeen) return; _maxSeen = idx;
      if (!/(^|\.)automated\.dating$/.test(location.hostname)) return;
      var sid; try { sid = sessionStorage.getItem('ad_sid') || ''; } catch (e) { sid = ''; }
      navigator.sendBeacon('https://admin.automated.dating/api/analytics/track',
        new Blob([JSON.stringify({ event: 'dsl_slide', pct: idx + 1, sid: sid, form: 'athena2' })], { type: 'text/plain' }));
    } catch (e2) {}
  }

  function go(n) {
    if (n < 0 || n >= slides.length) return;
    for (var i = 0; i < slides.length; i++) slides[i].classList.toggle("on", i === n);
    cur = n;
    countEl.textContent = (n + 1) + " / " + slides.length;
    prevBtn.disabled = n === 0;
    nextBtn.disabled = n === slides.length - 1;
    emitSlideBeacon(n);
  }

  prevBtn.addEventListener("click", function () { go(cur - 1); });
  nextBtn.addEventListener("click", function () { go(cur + 1); });

  // tap/click the slide: left quarter = back, rest = forward
  stage.addEventListener("click", function (e) {
    var r = stage.getBoundingClientRect();
    (e.clientX - r.left < r.width * 0.25) ? go(cur - 1) : go(cur + 1);
  });

  // keyboard
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });

  // swipe
  var tx = null;
  stage.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (tx == null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) { dx < 0 ? go(cur + 1) : go(cur - 1); }
    tx = null;
  }, { passive: true });

  go(0);
})();
