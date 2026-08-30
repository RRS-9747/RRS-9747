/**
 * Rabbyer Rahman Portfolio - Senior Systems Architect & Full-Stack Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleMesh();
  initTypewriter();
  initCounters();
  initScrollReveals();
  initConfigInspector();
  initCopyTriggers();
  initMobileMenu();
  initHeaderScroll();
  initFaqAccordion();
});

/* ==========================================================================
   1. Interactive Particle Network Mesh (Canvas)
   ========================================================================== */
function initParticleMesh() {
  const canvas = document.getElementById('canvas-mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const count = Math.min(Math.floor(window.innerWidth / 18), 75);
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.2 + 0.6,
      alpha: Math.random() * 0.4 + 0.15
    });
  }

  let mouse = { x: null, y: null, maxDist: 130 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(5, 150, 105, ${p.alpha * 0.4})`;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(5, 150, 105, ${0.1 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Mouse proximity connection
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(5, 150, 105, ${0.25 * (1 - mdist / mouse.maxDist)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. Dynamic Role Typewriter
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Systems & Network Engineering',
    'Infrastructure Architect @ Banglaverse',
    'High-Scale Minecraft Server Clusters',
    'Java & Kotlin Discord Bot Daemons',
    'Full-Stack Next.js & React Applications',
    'Hardened Linux VPS & DevOps Pipelines'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 75;

  function tick() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 35;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 65;
    }

    if (!isDeleting && charIdx === current.length) {
      speed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 300;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* ==========================================================================
   3. Animated Metric Counters
   ========================================================================== */
function initCounters() {
  const cards = document.querySelectorAll('.metric-value[data-counter]');
  if (!cards.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        cards.forEach((card) => {
          const target = parseInt(card.getAttribute('data-counter'), 10);
          const suffix = card.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              card.textContent = target + suffix;
              clearInterval(timer);
            } else {
              card.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const container = document.querySelector('.metrics-strip');
  if (container) observer.observe(container);
}

/* ==========================================================================
   4. Scroll Reveal Engine
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Configuration Inspector
   ========================================================================== */
function initConfigInspector() {
  const tabs = document.querySelectorAll('.tab-btn');
  const codeBlocks = document.querySelectorAll('.code-block');
  const copyBtn = document.getElementById('copy-code-btn');
  const copyLabel = document.getElementById('copy-code-label');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      codeBlocks.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const block = document.getElementById(targetId);
      if (block) block.classList.add('active');
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeBlock = document.querySelector('.code-block.active');
      if (!activeBlock) return;

      const code = activeBlock.innerText || activeBlock.textContent;
      navigator.clipboard.writeText(code).then(() => {
        if (copyLabel) copyLabel.textContent = 'Copied!';
        copyBtn.innerHTML = '<i class="fa-solid fa-check text-emerald"></i> <span>Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Copy Snippet</span>';
        }, 2200);
      });
    });
  }
}

/* ==========================================================================
   6. Copy to Clipboard with Toast Notification
   ========================================================================== */
function initCopyTriggers() {
  const triggers = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const text = trigger.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard`);
      }).catch(() => {
        showToast('Copied to clipboard');
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mob-link, .mobile-drawer .btn-primary');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.toggle('open');
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && e.target !== toggle) {
      drawer.classList.remove('open');
    }
  });
}

/* ==========================================================================
   8. Header Scroll Behavior
   ========================================================================== */
function initHeaderScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu-desktop .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}




/* ==========================================================================
   9. SEO FAQ Accordion Toggles
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

