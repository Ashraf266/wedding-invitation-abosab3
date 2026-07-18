let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  const seal   = document.getElementById('seal');
  const flap   = document.getElementById('envFlap');
  const card   = document.getElementById('envCard');
  const envScr = document.getElementById('env-screen');
  const invScr = document.getElementById('inv-screen');

  // Step 1: break the wax seal
  seal.classList.add('pop');

  // Step 2: open the flap
  setTimeout(function() {
    flap.classList.add('open');
  }, 310);

  // Step 3: rise the card
  setTimeout(function() {
    card.classList.add('rise');
  }, 820);

  // Step 4: reveal invitation
  setTimeout(function() {
    envScr.classList.add('hide');
    invScr.classList.add('show');
    invScr.setAttribute('aria-hidden', 'false');
    // Double rAF forces display:block to paint before opacity transition fires
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        invScr.style.opacity = '1';
      });
    });
    initReveal();
  }, 1620);

  // Step 5: remove envelope from layout entirely
  setTimeout(function() {
    envScr.style.display = 'none';
  }, 2600);
}

function initReveal() {
  var els = document.querySelectorAll('#inv-screen .reveal');
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  els.forEach(function(el) { io.observe(el); });
}

// ── Wishes Form ────────────────────────────────────────────────
(function () {
  var form     = document.getElementById('wishesForm');
  var iframe   = document.getElementById('wishesIframe');
  var success  = document.getElementById('wishesSuccess');
  var textarea = document.getElementById('guestMessage');
  var counter  = document.getElementById('charCount');

  if (!form) return;

  // Live character counter
  if (textarea && counter) {
    textarea.addEventListener('input', function () {
      counter.textContent = textarea.value.length;
    });
  }

  // Form submit — post into hidden iframe so the page never navigates away
  var submitted = false;

  form.addEventListener('submit', function () {
    if (submitted) return;
    submitted = true;

    var btn = form.querySelector('.submit-btn span');
    var btnEl = form.querySelector('.submit-btn');
    if (btn) btn.textContent = 'Sending\u2026';
    if (btnEl) btnEl.disabled = true;

    function showSuccess() {
      if (success.classList.contains('visible')) return;
      form.style.display = 'none';
      success.classList.add('visible');
      success.setAttribute('aria-hidden', 'false');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Primary: listen for the iframe load after Google redirects to its thank-you page
    iframe.addEventListener('load', showSuccess, { once: true });

    // Fallback: if the iframe event never fires (some browsers block cross-origin load events),
    // show success after 3 seconds — the POST has already been sent by then
    setTimeout(showSuccess, 3000);
  });
}());