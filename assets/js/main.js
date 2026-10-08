/* ============================================================
   SKILLSQUAD — SHARED INTERACTIONS
   Nav, cursor, reveals, counters, magnetic, menu, process rail.
   GPU-friendly (transform/opacity). Respects reduced motion.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Footer year + contact config injection ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  // Inject editable contact details wherever placeholders exist
  if (window.SKILLSQUAD) {
    var c = window.SKILLSQUAD.company, s = window.SKILLSQUAD.social;
    document.querySelectorAll("[data-contact='email']").forEach(function (el) {
      el.textContent = c.email; if (el.tagName === "A") el.href = "mailto:" + c.email;
    });
    document.querySelectorAll("[data-contact='phone']").forEach(function (el) {
      el.textContent = c.phone; if (el.tagName === "A") el.href = "tel:" + c.phone.replace(/\s+/g, "");
    });
    document.querySelectorAll("[data-contact='location']").forEach(function (el) { el.textContent = c.location; });
    Object.keys(s).forEach(function (key) {
      document.querySelectorAll("[data-social='" + key + "']").forEach(function (el) {
        if (s[key] && s[key] !== "#") el.href = s[key];
      });
    });
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.querySelector(".site-nav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".nav-burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.body.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a.mlink").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === path || (path === "" && href === "index.html")) a.setAttribute("aria-current", "page");
  });

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1400, start = null;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    if (reduceMotion) { el.textContent = target; return; }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Custom cursor (desktop pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    var dot = document.createElement("div"); dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true");
    var ring = document.createElement("div"); ring.className = "cursor-ring"; ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = '<span class="cursor-label">VIEW</span>';
    document.body.appendChild(dot); document.body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      var half = ring.classList.contains("is-view") ? 44 : (ring.classList.contains("is-hover") ? 28 : 18);
      ring.style.transform = "translate(" + (rx - half) + "px," + (ry - half) + "px)";
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("a, button, .service-row, .ind-tag").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
    });
    document.querySelectorAll("[data-cursor='view']").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-view"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-view"); });
    });
    document.addEventListener("mousedown", function () { ring.style.scale = "0.85"; });
    document.addEventListener("mouseup", function () { ring.style.scale = "1"; });
  }

  /* ---------- Magnetic buttons (desktop pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 22;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x / r.width * strength + "px," + y / r.height * strength + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
        el.style.transition = "transform 500ms cubic-bezier(0.22,1,0.36,1)";
        setTimeout(function () { el.style.transition = ""; }, 500);
      });
    });
  }

  /* ---------- Hero: cursor-reactive depth + parallax ---------- */
  var hero = document.querySelector("[data-hero]");
  if (hero && finePointer && !reduceMotion) {
    var heroMedia = hero.querySelector("[data-hero-media]");
    var heroContent = hero.querySelector("[data-hero-content]");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      if (heroMedia) heroMedia.style.transform =
        "translate3d(" + x * 26 + "px," + y * 26 + "px,0) rotateY(" + x * 4 + "deg) rotateX(" + (-y * 4) + "deg)";
      if (heroContent) heroContent.style.transform =
        "translate3d(" + x * -12 + "px," + y * -12 + "px,0)";
    });
    hero.addEventListener("mouseleave", function () {
      if (heroMedia) heroMedia.style.transform = "";
      if (heroContent) heroContent.style.transform = "";
    });
    // gentle scroll parallax
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2 && heroMedia) {
          heroMedia.style.translate = "0 " + y * 0.12 + "px";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Testimonial rotator ---------- */
  var testiWrap = document.querySelector("[data-testimonials]");
  if (testiWrap) {
    var items = Array.prototype.slice.call(testiWrap.querySelectorAll(".testimonial"));
    var dotsWrap = testiWrap.querySelector(".testi-nav");
    var idx = 0, timer = null;
    function show(i) {
      idx = (i + items.length) % items.length;
      items.forEach(function (it, k) { it.hidden = k !== idx; });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
          d.setAttribute("aria-current", k === idx ? "true" : "false");
        });
      }
    }
    if (dotsWrap) {
      items.forEach(function (_, k) {
        var b = document.createElement("button");
        b.className = "testi-dot";
        b.setAttribute("aria-label", "Show testimonial " + (k + 1));
        b.addEventListener("click", function () { show(k); restart(); });
        dotsWrap.appendChild(b);
      });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { show(idx + 1); }, 7000);
    }
    show(0); restart();
  }

  /* ---------- Process horizontal scroll (desktop) ---------- */
  var proc = document.querySelector("[data-process-horizontal]");
  if (proc && window.matchMedia("(min-width: 1024px)").matches && !reduceMotion) {
    var track = proc.querySelector(".process-track");
    var viewport = proc.querySelector(".process-viewport");
    function layoutProc() {
      var maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
      function onScroll() {
        var r = proc.getBoundingClientRect();
        var total = proc.offsetHeight - window.innerHeight;
        var p = Math.min(Math.max(-r.top / Math.max(total, 1), 0), 1);
        track.style.transform = "translate3d(" + (-p * maxX) + "px,0,0)";
      }
      // give the section scroll room: height = viewport + track overflow
      proc.style.height = (window.innerHeight + maxX) + "px";
      window.addEventListener("scroll", function () { requestAnimationFrame(onScroll); }, { passive: true });
      onScroll();
    }
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(layoutProc); }
    else { window.addEventListener("load", layoutProc); }
    window.addEventListener("resize", function () {
      proc.style.height = ""; track.style.transform = ""; layoutProc();
    });
  }

  /* ---------- Smooth anchor offset for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          var y = t.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }
    });
  });

  /* ---------- Why cards: fullscreen 3D focus on hover ---------- */
  if (finePointer && !reduceMotion) {
    var whyCards = document.querySelectorAll(".why-item, .why-lead");
    var overlay = null, showTimer = null;

    function closeWhyFocus() {
      if (!overlay) return;
      overlay.classList.remove("is-visible");
      document.body.classList.remove("why-focus-active");
      var el = overlay;
      setTimeout(function () { el.remove(); }, 400);
      overlay = null;
    }

    whyCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        if (overlay) return;
        showTimer = setTimeout(function () {
          overlay = document.createElement("div");
          overlay.className = "why-focus-overlay";
          overlay.setAttribute("aria-hidden", "true");
          overlay.innerHTML = '<div class="why-focus-card">' + card.innerHTML + "</div>";
          document.body.appendChild(overlay);
          document.body.classList.add("why-focus-active");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { overlay.classList.add("is-visible"); });
          });
          overlay.addEventListener("mouseleave", closeWhyFocus);
        }, 220);
      });
      card.addEventListener("mouseleave", function () {
        if (showTimer) { clearTimeout(showTimer); showTimer = null; }
      });
    });
  }
})();
