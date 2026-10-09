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

  /* ---------- Why cards: 3D tilt following cursor ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".why-item, .why-lead").forEach(function (card) {
      var glare = document.createElement("div");
      glare.className = "why-glare";
      glare.setAttribute("aria-hidden", "true");
      card.appendChild(glare);

      var raf = null;
      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rY = (px - 0.5) * 16;
          var rX = (0.5 - py) * 16;
          card.style.transform =
            "perspective(1100px) rotateX(" + rX.toFixed(2) + "deg) rotateY(" + rY.toFixed(2) + "deg) translateY(-8px) scale(1.02)";
          card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
      });
      card.addEventListener("mouseleave", function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "";
        setTimeout(function () { card.style.transition = ""; }, 500);
      });
      card.addEventListener("mouseenter", function () {
        card.style.transition = "transform 0.12s ease-out";
        setTimeout(function () { card.style.transition = ""; }, 130);
      });
    });
  }

  /* ---------- CTA interactive gold particles (mouse-reactive) ---------- */
  (function () {
    var canvas = document.querySelector(".cta-particles");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var section = canvas.closest(".cta-band");
    var W, H, parts = [];
    var COUNT = 130;
    // base drift: slow, one direction (up-right)
    var BASE_VX = 0.22, BASE_VY = -0.35;

    var mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999, active: false };

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.floor(r.width));
      H = canvas.height = Math.max(1, Math.floor(r.height));
    }
    function spawn(init) {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : (Math.random() < 0.5 ? H + 8 : Math.random() * H),
        r: 0.7 + Math.random() * 2.4,
        vx: BASE_VX * (0.6 + Math.random() * 0.8),
        vy: BASE_VY * (0.6 + Math.random() * 0.8),
        a: 0.25 + Math.random() * 0.65,
        tw: Math.random() * Math.PI * 2,
        ts: 0.015 + Math.random() * 0.045
      };
    }
    function init() {
      resize();
      parts = [];
      for (var i = 0; i < COUNT; i++) parts.push(spawn(true));
    }
    init();
    window.addEventListener("resize", init);

    section.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (mouse.lastX > -9999) {
        mouse.vx = (x - mouse.lastX) * 0.35;
        mouse.vy = (y - mouse.lastY) * 0.35;
      }
      mouse.lastX = x; mouse.lastY = y;
      mouse.x = x; mouse.y = y;
      mouse.active = true;
      clearTimeout(mouse.t);
      mouse.t = setTimeout(function () { mouse.active = false; mouse.vx = 0; mouse.vy = 0; }, 120);
    });
    section.addEventListener("mouseleave", function () {
      mouse.active = false; mouse.vx = 0; mouse.vy = 0;
      mouse.lastX = -9999; mouse.x = -9999;
    });

    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    }

    (function tick() {
      requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      var mvx = mouse.active ? mouse.vx : 0;
      var mvy = mouse.active ? mouse.vy : 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.tw += p.ts;
        // ease velocity toward base drift + mouse push
        var targetVX = p.vx * 0.985 + BASE_VX * 0.015 + mvx * 0.06;
        var targetVY = p.vy * 0.985 + BASE_VY * 0.015 + mvy * 0.06;
        // extra push for particles near the cursor
        if (mouse.active) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 32400) {
            var d = Math.sqrt(d2) || 1;
            var f = (180 - d) / 180 * 0.9;
            targetVX += (mvx * 0.35 + dx / d * 0.4) * f;
            targetVY += (mvy * 0.35 + dy / d * 0.4) * f;
          }
        }
        p.vx = targetVX; p.vy = targetVY;
        p.x += p.vx + Math.sin(p.tw) * 0.2;
        p.y += p.vy;
        if (p.y < -12) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.y > H + 12) { p.y = -8; p.x = Math.random() * W; }
        if (p.x < -12) p.x = W + 8;
        if (p.x > W + 12) p.x = -8;
        var flicker = p.a * (0.6 + 0.4 * Math.sin(p.tw * 2));
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        g.addColorStop(0, "rgba(253,184,21," + flicker.toFixed(3) + ")");
        g.addColorStop(0.5, "rgba(253,184,21," + (flicker * 0.35).toFixed(3) + ")");
        g.addColorStop(1, "rgba(253,184,21,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        // bright core
        ctx.fillStyle = "rgba(255,225,150," + (flicker * 0.9).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // decay mouse velocity
      mouse.vx *= 0.9; mouse.vy *= 0.9;
    })();
  })();
})();

/* ---------- 3D Testimonial Carousel ---------- */
(function () {
  var carousel = document.querySelector('.testi-carousel');
  if (!carousel) return;
  var cards = Array.prototype.slice.call(carousel.querySelectorAll('.testi-card'));
  var dotsWrap = carousel.querySelector('.testi-dots');
  var prevBtn = carousel.querySelector('.testi-prev');
  var nextBtn = carousel.querySelector('.testi-next');
  var n = cards.length;
  var current = 0;
  var timer = null;

  // Build dots
  var dots = cards.map(function (_, i) {
    var d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); restart(); });
    dotsWrap.appendChild(d);
    return d;
  });

  function layout() {
    cards.forEach(function (card, i) {
      var offset = ((i - current) % n + n) % n; // 0 = front, 1 = right, n-1 = left
      var abs = Math.min(offset, n - offset);
      var dir = offset <= n / 2 ? 1 : -1;
      if (offset === 0) {
        card.style.transform = 'translateZ(220px) rotateY(0deg)';
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.zIndex = '10';
      } else {
        var angle = dir * Math.min(abs * 38, 76);
        var z = 220 - abs * 140;
        var x = dir * abs * 42;
        card.style.transform = 'translateX(' + x + '%) translateZ(' + z + 'px) rotateY(' + (-angle) + 'deg)';
        card.style.opacity = String(Math.max(0.25, 1 - abs * 0.3));
        card.style.filter = 'brightness(' + Math.max(0.4, 1 - abs * 0.25) + ')';
        card.style.zIndex = String(10 - abs);
      }
      card.style.pointerEvents = 'auto';
      card.style.cursor = offset === 0 ? 'grab' : 'pointer';
      dots[i].classList.toggle('active', i === current);
    });
  }

  function goTo(i) {
    current = ((i % n) + n) % n;
    layout();
  }

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 4500);
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });
  carousel.addEventListener('mouseenter', function () { if (!dragging && timer) clearInterval(timer); });
  carousel.addEventListener('mouseleave', function () { if (!dragging) restart(); });

  // Touch swipe
  var startX = 0;
  carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
  }, { passive: true });

  // Mouse drag
  var dragging = false;
  var wasDrag = false;
  var dragX = 0;
  var dragDX = 0;
  var stage = carousel.querySelector('.testi-stage');
  stage.style.cursor = 'grab';

  carousel.addEventListener('mousedown', function (e) {
    dragging = true;
    dragX = e.clientX;
    dragDX = 0;
    stage.style.cursor = 'grabbing';
    if (timer) clearInterval(timer);
    e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    dragDX = e.clientX - dragX;
    // Live feedback: tilt the whole stage slightly with the drag
    stage.style.transition = 'none';
    stage.style.transform = 'translateX(' + (dragDX * 0.15) + 'px) rotateY(' + (dragDX * 0.02) + 'deg)';
  });

  window.addEventListener('mouseup', function (e) {
    if (!dragging) return;
    dragging = false;
    wasDrag = Math.abs(dragDX) > 10;
    stage.style.cursor = 'grab';
    stage.style.transition = '';
    stage.style.transform = '';
    if (wasDrag && Math.abs(dragDX) > 60) {
      goTo(current + (dragDX < 0 ? 1 : -1));
    }
    dragDX = 0;
    restart();
    // Clear the drag flag after click events have fired
    setTimeout(function () { wasDrag = false; }, 50);
  });

  // Click a back card to bring it to front
  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      if (wasDrag) return; // it was a drag, not a tap
      if (i !== current) { goTo(i); restart(); }
    });
  });

  layout();
  restart();
})();
