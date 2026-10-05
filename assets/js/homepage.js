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

// Bilingual Language Switcher (EN / BN)
const I18N_DICT = {
  bn: {
    nav_home: "হোম",
    nav_how: "যেভাবে কাজ করে",
    nav_features: "ফিচারসমূহ",
    nav_pricing: "প্রাইসিং",
    nav_docs: "ডকুমেন্টেশন",
    nav_help: "হেল্প সেন্টার",
    nav_login: "লগইন",
    nav_register: "শুরু করুন ফ্রি",
    hero_badge: "নতুন: হোয়াটসঅ্যাপ বাল্ক SMS ও ইমেইল মার্কেটিং ইঞ্জিন ২.০",
    hero_headline: `অল-ইন-ওয়ান<br /><span class="text-gradient-green">হোয়াটসঅ্যাপ API, ইমেইল মার্কেটিং</span><br />ও AI অটোমেশন প্ল্যাটফর্ম`,
    hero_sub: "হোয়াটসঅ্যাপ ও SMTP রিলে কানেক্ট করুন, সরাসরি হাই-কনভার্টিং বাল্ক মেসেজ ও ইমেইল ক্যাম্পেইন পাঠান, লিড সংগ্রহ করুন এবং একটি শক্তিশালী প্ল্যাটফর্ম থেকে আপনার সম্পূর্ণ ব্যবসার সেলস ও সাপোর্ট অটোমেট করুন।",
    hero_cta_primary: `বিনামূল্যে শুরু করুন <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    hero_cta_secondary: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> API ডক্স দেখুন`,
    trust_1: "সহজ ও দ্রুত সেটআপ",
    trust_2: "ফ্রি ট্রায়াল অন্তর্ভুক্ত",
    trust_3: "যেকোনো সময় বাতিলযোগ্য",
    fb_1: "মেসেজ ডেলিভার্ড ✓",
    fb_2: "AI রিপ্লাই তৈরি হয়েছে",
    fb_3: "নতুন লিড ক্যাপচার্ড",
    fb_4: "অর্ডার কনফার্মড",
    stat_biz_lbl: "সফল ব্যবসা",
    stat_biz_desc: "প্রতিদিন NEXORAAI ব্যবহার করছে",
    stat_msg_lbl: "অটোমেটেড মেসেজ",
    stat_msg_desc: "হোয়াটসঅ্যাপ ও ইমেইল প্রসেসড",
    stat_uptime_lbl: "প্ল্যাটফর্ম আপটাইম",
    stat_uptime_desc: "নির্ভরযোগ্য ও নিরাপদ ক্লাউড",
    stat_auto_lbl: "AI অটোমেশন",
    stat_auto_desc: "সার্বক্ষণিক স্মার্ট রিপ্লাই ও সাপোর্ট",
    how_badge: "যেভাবে কাজ করে",
    how_title: "৪টি সহজ ধাপে সম্পূর্ণ বিজনেস অটোমেশন",
    how_sub: "কানেক্ট করা থেকে ফুল অটোমেশন — মাত্র কয়েক মিনিটে",
    feat_badge: "ফিচারসমূহ",
    feat_title: "ব্যবসা পরিচালনা ও সেলস বৃদ্ধির সব ফিচার এক প্ল্যাটফর্মে",
    feat_sub: "হোয়াটসঅ্যাপ অটোমেশন, AI এজেন্ট, লিড ও ড্রপ-অফ অর্ডার রিকভারির সম্পূর্ণ সমাধান",
    price_badge: "প্রাইসিং ও প্ল্যান",
    price_title: "স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান",
    price_sub: "বিনামূল্যে শুরু করুন, প্রয়োজন অনুযায়ী স্কেল করুন। কোনো লুকানো চার্জ নেই।",
    cta_title: "আপনার হোয়াটসঅ্যাপ ও সেলস অটোমেট করতে প্রস্তুত?",
    cta_desc: "আজই যুক্ত হোন হাজার হাজার সফল ব্যবসার সাথে এবং AI এর শক্তিতে কাস্টমার কনভার্সন বাড়ান।",
    cta_btn: "বিনামূল্যে শুরু করুন",
    cta_docs: "ডকুমেন্টেশন পড়ুন"
  },
  en: {
    nav_home: "Home",
    nav_how: "How It Works",
    nav_features: "Features",
    nav_pricing: "Pricing",
    nav_docs: "Documentation",
    nav_help: "Help Center",
    nav_login: "Login",
    nav_register: "Get Started Free",
    hero_badge: "New: WhatsApp Bulk SMS & Email Marketing Engine v2.0",
    hero_headline: `The All-in-One<br /><span class="text-gradient-green">WhatsApp API, Email Marketing</span><br />& AI Automation Platform`,
    hero_sub: "Connect WhatsApp & SMTP relays, send high-converting bulk WhatsApp SMS & Email blasts, capture leads, manage customers and build intelligent workflows from one powerful platform.",
    hero_cta_primary: `Get Started Free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    hero_cta_secondary: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> View API Docs`,
    trust_1: "No complicated setup",
    trust_2: "Free trial included",
    trust_3: "Cancel anytime",
    fb_1: "Message Delivered ✓",
    fb_2: "AI Reply Generated",
    fb_3: "New Lead Captured",
    fb_4: "Order Confirmed",
    stat_biz_lbl: "Businesses",
    stat_biz_desc: "Trusting NEXORAAI daily",
    stat_msg_lbl: "Messages Automated",
    stat_msg_desc: "WhatsApp & Email processed",
    stat_uptime_lbl: "Platform Uptime",
    stat_uptime_desc: "Enterprise-grade reliability",
    stat_auto_lbl: "AI Automation",
    stat_auto_desc: "Always-on intelligent replies",
    how_badge: "How It Works",
    how_title: "Four steps to intelligent automation",
    how_sub: "From connection to full automation in under an hour",
    feat_badge: "Features",
    feat_title: "Everything you need to automate customer conversations",
    feat_sub: "A complete platform for WhatsApp automation, AI, leads, and business growth",
    price_badge: "Pricing",
    price_title: "Simple, transparent pricing",
    price_sub: "Start free, scale as you grow. No hidden fees.",
    cta_title: "Ready to automate your WhatsApp?",
    cta_desc: "Join thousands of businesses using NEXORAAI to power their customer conversations with AI.",
    cta_btn: "Get Started Free",
    cta_docs: "Read the Docs"
  }
};

window.I18N_DICT = I18N_DICT;

window.switchSiteLang = function(lang) {
  const selectedLang = lang === 'en' ? 'en' : 'bn';
  try { localStorage.setItem('nexora_lang', selectedLang); } catch (e) {}

  // Update button active state
  document.querySelectorAll('#langBtnBN, #langMobileBtnBN').forEach(btn => {
    btn.classList.toggle('active', selectedLang === 'bn');
  });
  document.querySelectorAll('#langBtnEN, #langMobileBtnEN').forEach(btn => {
    btn.classList.toggle('active', selectedLang === 'en');
  });
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === selectedLang);
  });

  document.documentElement.lang = selectedLang;

  // Update all data-i18n elements
  const dict = I18N_DICT[selectedLang];
  if (dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });
  }

  const toastMsg = selectedLang === 'en' ? 'Switched to English' : 'বাংলা ভাষায় পরিবর্তিত হয়েছে';
  if (window.Toast && typeof window.Toast.show === 'function') {
    window.Toast.show(toastMsg, 'info');
  } else if (typeof showToast === 'function') {
    showToast(toastMsg, 'info');
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  StatCounters.init();
  HeroAnimation.init();
  FloatingBadges.init();
  SmoothScroll.init();

  // Load saved language or default to BN
  const savedLang = localStorage.getItem('nexora_lang') || 'bn';
  window.switchSiteLang(savedLang);
});

