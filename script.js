(function () {

  /* ══════════════════════════════════
     LOADER — guaranteed hide
  ══════════════════════════════════ */
  var loaderDone = false;
  var fill       = document.getElementById('loaderFill');
  var pct        = document.getElementById('loaderPct');
  var pctVal     = 0;

  var fillInterval = setInterval(function () {
    var step = pctVal < 80 ? 2 : 0.8;
    pctVal = Math.min(pctVal + step, 99);
    if (fill) fill.style.width = pctVal + '%';
    if (pct)  pct.textContent  = Math.floor(pctVal) + '%';
  }, 30);

  function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;
    clearInterval(fillInterval);
    if (fill) fill.style.width = '100%';
    if (pct)  pct.textContent  = '100%';
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('gone');
      startCounters();
    }, 350);
  }

  setTimeout(hideLoader, 2400);
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 600);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hideLoader, 600);
    });
  }


  /* ══════════════════════════════════
     CUSTOM CURSOR — Antigravity B&B
  ══════════════════════════════════ */
  var cur  = document.getElementById('cur');
  var ring = document.getElementById('curRing');
  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var rx = mx, ry = my;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  function lerpRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  }
  lerpRing();

  var hoverEls = document.querySelectorAll(
    'a, button, .sk-card, .proj-card, .edu-card, .exp-card, .clink, .btn-primary, .btn-outline, .cf-btn'
  );
  hoverEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cur.classList.add('big');
      ring.classList.add('big');
    });
    el.addEventListener('mouseleave', function () {
      cur.classList.remove('big');
      ring.classList.remove('big');
    });
  });


  /* ══════════════════════════════════
     STICKY HEADER
  ══════════════════════════════════ */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('stuck', window.scrollY > 40);
    updateActiveNav();
  }, { passive: true });


  /* ══════════════════════════════════
     ACTIVE NAV HIGHLIGHT
  ══════════════════════════════════ */
  var navLinks = document.querySelectorAll('.nav-list a');
  var sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    var scrollY = window.scrollY;
    var current = '';
    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }


  /* ══════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════ */
  var burger   = document.getElementById('burger');
  var mMenu    = document.getElementById('mMenu');
  var mOverlay = document.getElementById('mOverlay');
  var mClose   = document.getElementById('mClose');

  function openMenu()  { mMenu.classList.add('on');  mOverlay.classList.add('on');  document.body.style.overflow = 'hidden'; }
  function closeMenu() { mMenu.classList.remove('on'); mOverlay.classList.remove('on'); document.body.style.overflow = ''; }

  if (burger)   burger.addEventListener('click', openMenu);
  if (mClose)   mClose.addEventListener('click', closeMenu);
  if (mOverlay) mOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.m-link').forEach(function (l) {
    l.addEventListener('click', closeMenu);
  });


  /* ══════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════
     HERO PARTICLE CANVAS
  ══════════════════════════════════ */
  var canvas = document.getElementById('heroCanvas');
  var ctx    = canvas ? canvas.getContext('2d') : null;
  var W, H, particles;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function buildParticles() {
    particles = [];
    var count = Math.min(80, Math.floor(W * H / 14000));
    for (var i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.3 + 0.4
      });
    }
  }

  var mouseX = W / 2 || 600;
  var mouseY = H / 2 || 400;

  if (canvas && ctx) {
    resizeCanvas();
    buildParticles();
    window.addEventListener('resize', function () { resizeCanvas(); buildParticles(); });
    window.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });

    function drawCanvas() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        var dx  = p.x - mouseX;
        var dy  = p.y - mouseY;
        var d   = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          p.vx += (dx / d) * 0.007;
          p.vy += (dy / d) * 0.007;
        }

        var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.4) { p.vx = (p.vx / spd) * 1.4; p.vy = (p.vy / spd) * 1.4; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fill();
      });

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / 110) * 0.07) + ')';
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawCanvas);
    }
    drawCanvas();
  }


  /* ══════════════════════════════════
     TYPEWRITER
  ══════════════════════════════════ */
  var phrases = [
    'PHP Developer',
    'Laravel Expert',
    'Full-Stack Engineer',
    'Backend Specialist',
    'Web Architect'
  ];
  var typeEl  = document.getElementById('typeEl');
  var pIdx    = 0;
  var cIdx    = 0;
  var deleting = false;

  function type() {
    if (!typeEl) return;
    var phrase = phrases[pIdx];
    if (deleting) {
      cIdx--;
      typeEl.textContent = phrase.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 44);
    } else {
      cIdx++;
      typeEl.textContent = phrase.slice(0, cIdx);
      if (cIdx === phrase.length) {
        setTimeout(function () { deleting = true; type(); }, 1900);
        return;
      }
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 2600);


  /* ══════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════ */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = (idx % 4) * 100;
        setTimeout(function () { el.classList.add('in'); }, delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { revealObs.observe(el); });


  /* ══════════════════════════════════
     SKILL BAR ANIMATION
  ══════════════════════════════════ */
  var skCards  = document.querySelectorAll('.sk-card');
  var skillObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sk-fill').forEach(function (bar) {
          bar.style.width = bar.getAttribute('data-w') + '%';
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skCards.forEach(function (c) { skillObs.observe(c); });


  /* ══════════════════════════════════
     NUMBER COUNTERS
  ══════════════════════════════════ */
  function startCounters() {
    var statsBox = document.querySelector('.hero-stats');
    if (!statsBox) return;

    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.hstat-n').forEach(function (el) {
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var dur    = 1800;
          var t0     = performance.now();
          function tick(now) {
            var p    = Math.min((now - t0) / dur, 1);
            var ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(ease * target) + (p >= 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        cntObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    cntObs.observe(statsBox);
  }


  /* ══════════════════════════════════
     PROJECT CARD MOUSE GLOW
  ══════════════════════════════════ */
  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  });


  /* ══════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════ */
  window.sendForm = function (e) {
    e.preventDefault();
    var btn      = document.getElementById('cfBtn');
    var textSpan = btn.querySelector('.cf-btn-text');
    var arrSpan  = btn.querySelector('.cf-btn-arrow');
    if (!btn) return;

    btn.style.background    = '#4ade80';
    btn.style.color         = '#052e16';
    btn.style.boxShadow     = '0 0 30px rgba(74,222,128,0.4)';
    if (textSpan) textSpan.textContent = 'Message Sent!';
    if (arrSpan)  arrSpan.textContent  = '✓';

    setTimeout(function () {
      btn.style.background = '';
      btn.style.color      = '';
      btn.style.boxShadow  = '';
      if (textSpan) textSpan.textContent = 'Send Message';
      if (arrSpan)  arrSpan.textContent  = '→';
      e.target.reset();
    }, 3200);
  };

})();