/* ============================================================
   SKILLSQUAD — INQUIRY FORM
   Client-side validation, accessible errors, loading/success/
   error states, honeypot spam guard. Wire `endpoint` in
   assets/js/site-data.js to a real backend before launch;
   empty endpoint = demo mode (validates + shows success).
   ============================================================ */
(function () {
  "use strict";

  var forms = document.querySelectorAll(".inquiry-form");
  if (!forms.length) return;

  var cfg = (window.SKILLSQUAD && window.SKILLSQUAD.form) || {};
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  forms.forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector("[type='submit']");

    function setError(field, on) {
      field.classList.toggle("is-invalid", on);
      var input = field.querySelector("input, textarea, select");
      if (input) input.setAttribute("aria-invalid", on ? "true" : "false");
    }

    function validateField(field) {
      var input = field.querySelector("input, textarea, select");
      if (!input || input.disabled) return true;
      var v = input.value.trim();
      var ok = true;

      if (input.hasAttribute("required") && !v) ok = false;
      else if (input.type === "email" && v && !EMAIL_RE.test(v)) ok = false;
      else if (input.name === "details" && v && v.length < 20) ok = false;
      else if (input.type === "tel" && v && v.replace(/\D/g, "").length < 7) ok = false;

      setError(field, !ok);
      return ok;
    }

    // live validation on blur / input
    form.querySelectorAll(".field").forEach(function (field) {
      var input = field.querySelector("input, textarea, select");
      if (!input) return;
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "" || input.hasAttribute("required")) validateField(field);
      });
      input.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) validateField(field);
      });
    });

    function showStatus(kind, msg) {
      status.className = "form-status " + (kind === "ok" ? "is-ok" : "is-err");
      status.textContent = msg;
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: silent pass for bots
      var hp = form.querySelector(".hp-field input");
      if (hp && hp.value) { showStatus("ok", "Thanks — your inquiry has been received."); form.reset(); return; }

      var fields = Array.prototype.slice.call(form.querySelectorAll(".field:not(.hp-field)"));
      var allOk = fields.map(validateField).every(Boolean);

      if (!allOk) {
        showStatus("err", "Please fix the highlighted fields and try again.");
        var firstBad = form.querySelector(".field.is-invalid input, .field.is-invalid textarea, .field.is-invalid select");
        if (firstBad) firstBad.focus();
        return;
      }

      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;

      var payload = {};
      new FormData(form).forEach(function (v, k) { if (k !== "website") payload[k] = v; });

      function done(ok, msg) {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
        if (ok) {
          form.reset();
          showStatus("ok", msg || "Inquiry sent. We'll reply within one business day.");
        } else {
          showStatus("err", msg || "Something went wrong sending your inquiry. Please email us directly instead.");
        }
      }

      if (cfg.endpoint) {
        fetch(cfg.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) { done(r.ok); })
          .catch(function () { done(false); });
      } else {
        // Demo mode: simulate a send so the UX can be reviewed pre-launch
        setTimeout(function () {
          /* eslint-disable no-console */
          console.info("[Skillsquad] demo form payload (wire endpoint in site-data.js):", payload);
          done(true, "Demo mode: inquiry validated. Connect a form endpoint in assets/js/site-data.js to go live.");
        }, 900);
      }
    });
  });
})();
