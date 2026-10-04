/**
 * NEXORAAI — Homepage JavaScript
 */

'use strict';

// Animated counter for stats
const StatCounters = (() => {
  function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + range * eased);
      element.textContent = formatStatNumber(current) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function formatStatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(0) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  }

  function init() {
    if (!('IntersectionObserver' in window)) return;

    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate numbers
          const businesses = statsSection.querySelector('[data-stat="businesses"]');
          const messages = statsSection.querySelector('[data-stat="messages"]');
          const uptime = statsSection.querySelector('[data-stat="uptime"]');

          if (businesses) { businesses.textContent = '10K+'; }
          if (messages) { messages.textContent = '50M+'; }
          if (uptime) { uptime.textContent = '99.9%'; }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  return { init };
})();

// Hero dashboard animation
const HeroAnimation = (() => {
  function init() {
    const bars = document.querySelectorAll('.mini-bar-fill');
    if (!bars.length) return;

    function animateBars() {
      bars.forEach((bar, i) => {
        const heights = [40, 65, 50, 80, 60, 90, 75];
        setTimeout(() => {
          bar.parentElement.style.height = heights[i % heights.length] + '%';
        }, i * 80);
      });
    }

    animateBars();
    setInterval(animateBars, 4000);
  }
  return { init };
})();

// Floating badges animation stagger
const FloatingBadges = (() => {
  function init() {
    const badges = document.querySelectorAll('.floating-badge');
    badges.forEach((badge, i) => {
      badge.style.animationDelay = `${-i * 0.8}s`;
    });
  }
  return { init };
})();

// Smooth scroll for anchor links
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
          const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }
  return { init };
})();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  StatCounters.init();
  HeroAnimation.init();
  FloatingBadges.init();
  SmoothScroll.init();
});
