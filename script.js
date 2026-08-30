document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollReveals();
  initMobileMenu();
  initHeaderScroll();
  initFaqAccordion();
  initCopyTriggers();
  initConfigInspector();
  initCounters();

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initParticleMesh(), { timeout: 1000 });
  } else {
    setTimeout(initParticleMesh, 100);
  }
});

function initParticleMesh() {
  const canvas = document.getElementById('canvas-mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width, height;
  let particles = [];
  let isVisible = true;
  let animId = null;

  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 18 : 42;
  const maxDistance = isMobile ? 85 : 125;

  const mouse = { x: null, y: null, radius: 100 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(5, 150, 105, ${this.alpha * 0.4})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function render() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const alpha = (1 - mdist / mouse.radius) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(5, 150, 105, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting && !document.hidden;
      if (isVisible) {
        if (!animId) animId = requestAnimationFrame(render);
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !animId) animId = requestAnimationFrame(render);
    else if (!isVisible && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  });

  animId = requestAnimationFrame(render);
}

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
  let pauseEnd = false;

  function tick() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        isDeleting = true;
        pauseEnd = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 45);
    } else {
      if (pauseEnd) pauseEnd = false;
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 25);
    }
  }

  tick();
}

function initCounters() {
  const cards = document.querySelectorAll('.metric-value[data-counter]');
  if (!cards.length) return;

  let animated = false;

  function runCounters() {
    if (animated) return;
    animated = true;

    cards.forEach((card) => {
      const target = parseInt(card.getAttribute('data-counter'), 10);
      const suffix = card.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1600;
      const stepTime = 16;
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const container = document.querySelector('.metrics-bento');
  if (container) observer.observe(container);
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initConfigInspector() {
  const tabs = document.querySelectorAll('.tab-btn');
  const codeBlocks = document.querySelectorAll('.code-block');
  const copyBtn = document.getElementById('copy-code-btn');
  const copyLabel = document.getElementById('copy-code-label');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      codeBlocks.forEach((b) => b.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetBlock = document.getElementById(targetId);
      if (targetBlock) targetBlock.classList.add('active');
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeBlock = document.querySelector('.code-block.active');
      if (!activeBlock) return;

      navigator.clipboard.writeText(activeBlock.innerText).then(() => {
        const origText = copyLabel ? copyLabel.textContent : 'Copy';
        if (copyLabel) copyLabel.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = origText;
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }
}

function initCopyTriggers() {
  const triggers = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (toast && toastMsg) {
          toastMsg.textContent = `Copied "${textToCopy}" to clipboard!`;
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3000);
        }
      });
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mob-link');

  if (!toggle || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', toggleMenu);

  links.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function initHeaderScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu-desktop .nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isOpen);
      btn.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}


