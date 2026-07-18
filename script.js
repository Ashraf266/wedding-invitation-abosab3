let opened = false;

function openCurtains() {
  if (opened) return;
  opened = true;

  var curtainLeft = document.getElementById("curtainLeft");
  var curtainRight = document.getElementById("curtainRight");
  var envScr = document.getElementById("env-screen");
  var invScr = document.getElementById("inv-screen");
  var tapHint = document.querySelector(".tap-hint");

  // Step 1: draw back the curtains
  curtainLeft.classList.add("open");
  curtainRight.classList.add("open");

  console.log(tapHint);
  tapHint.classList.add("hide");

  // Step 2: reveal invitation behind the curtains
  setTimeout(function () {
    envScr.classList.add("hide");
    invScr.classList.add("show");
    invScr.setAttribute("aria-hidden", "false");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        invScr.style.opacity = "1";
      });
    });

    initReveal();
    startCountdown();
  }, 1500);

  // Step 3: remove curtain screen from layout entirely
  setTimeout(function () {
    envScr.style.display = "none";
  }, 2600);
}

function initReveal() {
  var els = document.querySelectorAll("#inv-screen .reveal");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.06 },
  );
  els.forEach(function (el) {
    io.observe(el);
  });
}

/* ── Countdown ──────────────────────────────────────── */
function startCountdown() {
  // Wedding: August 29, 2026 — set time to start of evening (7pm Cairo, UTC+3 → 16:00 UTC)
  var weddingDate = new Date("2026-08-29T16:00:00Z");

  function tick() {
    var now = new Date();
    var diff = weddingDate - now;

    if (diff <= 0) {
      // Wedding day!
      document.getElementById("cdDays").textContent = "0";
      document.getElementById("cdHours").textContent = "0";
      document.getElementById("cdMins").textContent = "0";
      document.getElementById("cdSecs").textContent = "0";
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cdDays").textContent = days;
    document.getElementById("cdHours").textContent = pad(hours);
    document.getElementById("cdMins").textContent = pad(mins);
    document.getElementById("cdSecs").textContent = pad(secs);
  }

  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  tick();
  setInterval(tick, 1000);
}

/* ── Wishes Form ────────────────────────────────────── */
(function () {
  var form = document.getElementById("wishesForm");
  var iframe = document.getElementById("wishesIframe");
  var success = document.getElementById("wishesSuccess");
  var textarea = document.getElementById("guestMessage");
  var counter = document.getElementById("charCount");

  if (!form) return;

  if (textarea && counter) {
    textarea.addEventListener("input", function () {
      counter.textContent = textarea.value.length;
    });
  }

  var submitted = false;

  form.addEventListener("submit", function () {
    if (submitted) return;
    submitted = true;

    var btn = form.querySelector(".submit-btn span");
    var btnEl = form.querySelector(".submit-btn");
    if (btn) btn.textContent = "Sending\u2026";
    if (btnEl) btnEl.disabled = true;

    function showSuccess() {
      if (success.classList.contains("visible")) return;
      form.style.display = "none";
      success.classList.add("visible");
      success.setAttribute("aria-hidden", "false");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    iframe.addEventListener("load", showSuccess, { once: true });
    setTimeout(showSuccess, 3000);
  });
})();
