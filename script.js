/* ============================================
   RASIN ACHARYA - PORTFOLIO SCRIPT
   ============================================ */

'use strict';

// ─── Cursor Glow ───
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ─── Navbar Scroll Effect ───
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollY / docH) * 100;

  if (progressBar) progressBar.style.width = pct + '%';
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
  if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);

  // Active nav link
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
});

// ─── Back to Top ───
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Mobile Menu ───
const menuBtn = document.getElementById('nav-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ─── Typing Effect ───
const phrases = [
  'BIM Student',
  'Web Developer',
  'Python Enthusiast',
  'Problem Solver',
  'Tech Explorer'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.querySelector('.typed-text');

function typeWriter() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typeWriter, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  setTimeout(typeWriter, isDeleting ? 60 : 90);
}
setTimeout(typeWriter, 1000);

// ─── Counter Animation ───
function animateCounter(el, target, duration = 1600, suffix = '') {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ─── Intersection Observer ───
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger skill bars
      if (entry.target.id === 'skills') {
        setTimeout(() => {
          document.querySelectorAll('.skill-bar-fill').forEach(fill => {
            const pct = fill.getAttribute('data-pct');
            fill.style.width = pct + '%';
          });
        }, 400);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(sec => sectionObserver.observe(sec));

// Stats observer
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-item').forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          const numEl = item.querySelector('.stat-number');
          const target = parseInt(numEl.getAttribute('data-target'));
          const suffix = numEl.getAttribute('data-suffix') || '';
          animateCounter(numEl, target, 1500, suffix);
        }, i * 120);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

// ─── Smooth Scroll for Anchor Links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Tilt Effect on Project Cards ───
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── Particle Canvas ───
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArr = [];
  let animId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife ||
          this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#4f8ef7';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++) particlesArr.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArr.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

console.log('%c🚀 Rasin Acharya — Portfolio', 'color: #4f8ef7; font-size: 14px; font-weight: bold;');
console.log('%c Built with passion & clean code.', 'color: #8892a4; font-size: 12px;');
