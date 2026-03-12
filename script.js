/* ═══════════════════════════════════════════
   S.B. SURJITH — PORTFOLIO SCRIPTS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 1600);
  });

  // ── Custom Cursor ──────────────────────────
  const dot   = document.getElementById('cursorDot');
  const trail = document.getElementById('cursorTrail');

  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left   = e.clientX + 'px';
    dot.style.top    = e.clientY + 'px';
  });

  function animateTrail() {
    trailX += (parseFloat(dot.style.left)  - trailX) * 0.12;
    trailY += (parseFloat(dot.style.top)   - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .pill, .skill-cat, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width   = '14px';
      dot.style.height  = '14px';
      trail.style.width = '50px';
      trail.style.height= '50px';
      trail.style.borderColor = 'var(--amber)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width   = '8px';
      dot.style.height  = '8px';
      trail.style.width = '32px';
      trail.style.height= '32px';
      trail.style.borderColor = 'rgba(232,160,32,0.45)';
    });
  });

  // ── Navbar scroll ──────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  // ── Active nav link ────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  // ── Mobile Drawer ──────────────────────────
  const menuToggle    = document.getElementById('menuToggle');
  const drawer        = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose   = document.getElementById('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  // ── Scroll Reveal ──────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });

  // ── Skill Bars ────────────────────────────
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.si-fill').forEach(fill => {
          const w = fill.getAttribute('data-w');
          fill.style.width = w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-cat').forEach(cat => skillObserver.observe(cat));

  // ── Smooth internal links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Contact Form ──────────────────────────
  window.handleForm = function(e) {
    e.preventDefault();
    const btn     = document.getElementById('formBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');

    btn.style.background   = '#4ade80';
    btn.style.color        = '#052e16';
    btnText.textContent    = 'Message Sent!';
    btnIcon.textContent    = '✓';

    setTimeout(() => {
      btn.style.background = '';
      btn.style.color      = '';
      btnText.textContent  = 'Send Message';
      btnIcon.textContent  = '→';
      e.target.reset();
    }, 3000);
  };

  // ── Parallax hero grid on mousemove ───────
  const heroGrid = document.querySelector('.hero-grid-overlay');
  document.addEventListener('mousemove', e => {
    if (!heroGrid) return;
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGrid.style.backgroundPosition = `${x}px ${y}px`;
  });

  // ── Number counter animation ──────────────
  function animateCount(el, target, suffix = '') {
    let start = 0;
    const dur = 1600;
    const step = timestamp => {
      if (!start) start = timestamp;
      const prog = Math.min((timestamp - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.hstat-n');
        nums.forEach(n => {
          const raw = n.textContent.replace(/[^0-9]/g, '');
          const val = parseInt(raw);
          if (!isNaN(val)) {
            const hasSup = n.querySelector('sup') !== null;
            n.textContent = '0';
            if (hasSup) {
              setTimeout(() => {
                n.innerHTML = val + '<sup>+</sup>';
              }, 1600);
            }
            animateCount(n, val);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.hero-stats-bar');
  if (statsBar) statsObserver.observe(statsBar);

});
