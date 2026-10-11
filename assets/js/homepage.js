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

    // How It Works
    how_badge: "যেভাবে কাজ করে",
    how_title: "৪টি সহজ ধাপে সম্পূর্ণ বিজনেস অটোমেশন",
    how_sub: "কানেক্ট করা থেকে ফুল অটোমেশন — মাত্র কয়েক মিনিটে",
    step_1_title: "হোয়াটসঅ্যাপ কানেক্ট করুন",
    step_1_desc: "QR কোড স্ক্যান করে অথবা আমাদের নিরাপদ API ব্যবহার করে কয়েক সেকেন্ডে আপনার ব্যবসার হোয়াটসঅ্যাপ নম্বরটি যুক্ত করুন।",
    step_2_title: "AI কনফিগার করুন",
    step_2_desc: "আপনার ব্যবসার প্রোডাক্ট ক্যাটালগ, প্রশ্ন-উত্তর (FAQ) এবং নিয়মাবলী আপলোড করে AI এজেন্টকে ট্রেইন করুন।",
    step_3_title: "অটোমেশন বিল্ড করুন",
    step_3_desc: "ভিজ্যুয়াল নো-কোড বিল্ডার দিয়ে ড্রপ-অফ অর্ডার রিকভারি, লিড কালেকশন এবং অটোমেটিক রিপ্লাই ফ্লো তৈরি করুন।",
    step_4_title: "ব্যবসা বৃদ্ধি করুন",
    step_4_desc: "২৪ ঘণ্টা কাস্টমার সাপোর্ট দিন, লিড কনভার্ট করুন এবং ইনকমপ্লিট অর্ডার রিকভার করে ব্যবসার সেলস বহুগুণ বাড়িয়ে নিন।",
    step_link: "বিস্তারিত জানুন →",

    // Features Section
    feat_badge: "ফিচারসমূহ",
    feat_title: "ব্যবসা পরিচালনা ও সেলস বৃদ্ধির সব ফিচার এক প্ল্যাটফর্মে",
    feat_sub: "হোয়াটসঅ্যাপ অটোমেশন, AI এজেন্ট, লিড ও ড্রপ-অফ অর্ডার রিকভারির সম্পূর্ণ সমাধান",
    feat_1_title: "অফিসিয়াল হোয়াটসঅ্যাপ API ও সেশন",
    feat_1_desc: "টেক্সট, মিডিয়া ফাইল, বাটন, এবং প্রোডাক্ট ক্যাটালগ সহ সম্পূর্ণ REST API সাপোর্ট। ডেভেলপার ফ্রেন্ডলি ডক্স ও লাইভ মাল্টি-সেশন ম্যানেজমেন্ট।",
    feat_1_tag: "কোর ফিচার",
    feat_1_li1: "সব ধরনের মেসেজ সেন্ড ও রিসিভ",
    feat_1_li2: "মাল্টিপল সেশন ও নম্বর সাপোর্ট",
    feat_1_li3: "রিয়েল-টাইম ওয়েবহুক ডেলিভারি",
    feat_1_li4: "সহজ ও পূর্ণাঙ্গ API ডকুমেন্টেশন",
    feat_2_title: "AI অটো রিপ্লাই",
    feat_2_desc: "আপনার ব্যবসার তথ্য অনুযায়ী কাস্টমারদের যেকোনো প্রশ্নের সঠিক উত্তর দিন ২৪ ঘণ্টা তাৎক্ষণিকভাবে।",
    feat_3_title: "স্মার্ট AI এজেন্টস",
    feat_3_desc: "সেলস, কাস্টমার সাপোর্ট, লিড কোয়ালিফিকেশন এবং অর্ডার ট্র্যাকিংয়ের জন্য আলাদা স্পেশালাইজড AI এজেন্ট তৈরি করুন।",
    feat_4_title: "ইনকমপ্লিট অর্ডার রিকভারি",
    feat_4_desc: "চেকআউট পেজে নাম ও ফোন নম্বর লিখে যারা অর্ডার সম্পন্ন না করে চলে যায়, তাদের ১-ক্লিকে WhatsApp রিমাইন্ডার পাঠিয়ে সেলস রিকভার করুন।",
    feat_4_tag: "নতুন",
    feat_5_title: "ইউনিফাইড ইনবক্স",
    feat_5_desc: "টিমের সবাই মিলে একই ড্যাশবোর্ড থেকে সব হোয়াটসঅ্যাপ মেসেজের রিপ্লাই দিন, ট্যাগ লাগান এবং এজেন্ট অ্যাসাইন করুন।",
    feat_6_title: "লিড পাইপলাইন ও CRM",
    feat_6_desc: "কানবান পাইপলাইনে লিড ম্যানেজ করুন। ক্যাপচার থেকে শুরু করে ক্লোজ পর্যন্ত সব অ্যাক্টিভিটি হিস্ট্রি ট্র্যাক করুন।",
    feat_7_title: "হোয়াটসঅ্যাপ বাল্ক SMS",
    feat_7_desc: "হাজার হাজার কাস্টমারকে এক ক্লিকে পার্সোনালাইজড ব্রডকাস্ট মেসেজ পাঠান। অ্যান্টি-ব্যান র‍্যান্ডম ডিলে সুবিধা সহ।",
    feat_8_title: "ইমেইল মার্কেটিং ও ব্লাস্টার",
    feat_8_desc: "এইচটিএমএল নিউজলেটার ডিজাইন করুন, ড্রিপ ক্যাম্পেইন চালান এবং ৯৯.৮% ইনবক্স প্লেসমেন্ট নিশ্চিত করুন।",
    feat_9_title: "ওয়ার্কফ্লো অটোমেশন",
    feat_9_desc: "নো-কোড ভিজ্যুয়াল ওয়ার্কফ্লো বিল্ডার। ট্রিগার, কন্ডিশন এবং স্টেপ-বাই-স্টেপ অ্যাকশন তৈরি করুন খুব সহজে।",
    feat_10_title: "অর্ডার ও কমার্স",
    feat_10_desc: "হোয়াটসঅ্যাপ চ্যাটের ভেতরেই অর্ডার তৈরি, পেমেন্ট ট্র্যাকিং এবং ডেলিভারি স্ট্যাটাস আপডেট করুন।",
    feat_11_title: "লাইভ অ্যানালিটিক্স",
    feat_11_desc: "মেসেজ রেসপন্স টাইম, কনভার্সন রেট, ক্যাম্পেইন পারফরম্যান্স এবং রেভিনিউ রিপোর্ট এক নজরে দেখুন।",
    feat_12_title: "টিম ও পারমিশন কন্ট্রোল",
    feat_12_desc: "অ্যাডমিন, ম্যানেজার এবং সাপোর্ট এজেন্টের জন্য আলাদা অ্যাক্সেস কন্ট্রোল ও টিম ম্যানেজমেন্ট।",
    feat_all_btn: "সব ফিচারসমূহ দেখুন →",

    // Integrations
    int_badge: "ইন্টিগ্রেশন",
    int_title: "আপনার পছন্দের সকল টুলসের সাথে কানেক্ট করুন",
    int_sub: "যে টুলসগুলো আপনি ইতিমধ্যে ব্যবহার করছেন সেগুলোর সাথে সরাসরি ইন্টিগ্রেট করুন",
    int_note: "এছাড়াও যেকোনো ওয়েবহুক এবং আমাদের ওপেন REST API দিয়ে কাস্টম ইন্টিগ্রেশন সম্ভব",

    // Pricing
    price_badge: "প্রাইসিং ও প্ল্যান",
    price_title: "স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান",
    price_sub: "বিনামূল্যে শুরু করুন, প্রয়োজন অনুযায়ী স্কেল করুন। কোনো লুকানো চার্জ নেই।",
    plan_starter_name: "স্টার্টার (Starter)",
    plan_starter_desc: "ছোট ব্যবসা এবং স্টার্টআপের জন্য হোয়াটসঅ্যাপ অটোমেশন শুরু করার সেরা প্ল্যান।",
    plan_pro_name: "প্রফেশনাল (Professional)",
    plan_pro_desc: "গ্রোয়িং বিজনেস এবং ই-কমার্সের জন্য শক্তিশালী অটোমেশন ও ড্রপ-অফ রিকভারি।",
    plan_bus_name: "বিজনেস (Business)",
    plan_bus_desc: "এজেন্সি এবং হাই-ভলিউম এন্টারপ্রাইজের জন্য আনলিমিটেড ক্যাপাসিটি।",
    plan_popular_badge: "সর্বাধিক জনপ্রিয়",
    plan_btn_starter: "শুরু করুন",
    plan_btn_pro: "শুরু করুন ফ্রি",
    plan_btn_bus: "শুরু করুন",
    plan_ent_title: "কাস্টম এন্টারপ্রাইজ সলিউশন",
    plan_ent_desc: "বড় প্রতিষ্ঠান ও কর্পোরেট এজেন্সির জন্য কাস্টম সার্ভার, ডেডিকেটেড ইনফ্রাস্ট্রাকচার ও SLA সাপোর্ট।",
    plan_ent_btn: "সেলস টিমের সাথে কথা বলুন →",
    plan_all_btn: "সম্পূর্ণ প্রাইসিং বিবরণ দেখুন →",
    price_period: "/মাস",
    plan_feat_1wa: "১টি হোয়াটসঅ্যাপ নম্বর",
    plan_feat_5k: "৫,০০০ মেসেজ / মাস",
    plan_feat_ai_rep: "AI অটো রিপ্লাই সাপোর্ট",
    plan_feat_500c: "৫০০ কন্টাক্ট ও লিড",
    plan_feat_2team: "২ জন টিম মেম্বার",
    plan_feat_3wa: "৩টি হোয়াটসঅ্যাপ নম্বর",
    plan_feat_25k: "২৫,০০০ মেসেজ / মাস",
    plan_feat_ai_kb: "AI এজেন্টস + নলেজ বেস",
    plan_feat_cart_rec: "ড্রপ-অফ ও ইনকমপ্লিট অর্ডার রিকভারি",
    plan_feat_wa_bulk: "হোয়াটসঅ্যাপ বাল্ক SMS ও ক্যাম্পেইন",
    plan_feat_10team: "১০ জন টিম মেম্বার",
    plan_feat_full_api: "ফুল API ও ওয়েবহুক অ্যাক্সেস",
    plan_feat_10wa: "১০টি হোয়াটসঅ্যাপ নম্বর",
    plan_feat_100k: "১,০০,০০০ মেসেজ / মাস",
    plan_feat_unl_ai: "আনলিমিটেড AI এজেন্টস",
    plan_feat_unl_leads: "আনলিমিটেড কন্টাক্ট ও লিড",
    plan_feat_vip_sup: "প্রায়োরিটি VIP সাপোর্ট",
    plan_feat_25team: "২৫ জন টিম মেম্বার",
    plan_feat_ded_bw: "ফুল ডেডিকেটেড ব্যান্ডউইথ",

    // CTA
    cta_title: "আপনার হোয়াটসঅ্যাপ ও সেলস অটোমেট করতে প্রস্তুত?",
    cta_desc: "আজই যুক্ত হোন হাজার হাজার সফল ব্যবসার সাথে এবং AI এর শক্তিতে কাস্টমার কনভার্সন বাড়ান।",
    cta_btn: "বিনামূল্যে শুরু করুন",
    cta_docs: "ডকুমেন্টেশন পড়ুন",

    // Footer
    footer_desc: "হোয়াটসঅ্যাপ ক্লাউড API, অটোনোমাস AI এজেন্টস, ড্রপ-অফ অর্ডার রিকভারি এবং কমার্স অটোমেশনের সর্বাধুনিক প্ল্যাটফর্ম।",
    footer_col_prod: "প্রোডাক্ট",
    footer_col_res: "রিসোর্স",
    footer_col_comp: "কোম্পানি ও পলিসি",
    footer_link_feat: "ফিচারসমূহ",
    footer_link_bulk: "হোয়াটসঅ্যাপ বাল্ক SMS",
    footer_link_email: "ইমেইল মার্কেটিং",
    footer_link_rec: "ইনকমপ্লিট অর্ডার রিকভারি",
    footer_link_pricing: "প্রাইসিং প্ল্যান",
    footer_link_api: "API ডক্স",
    footer_link_status: "সার্ভার স্ট্যাটাস",
    footer_link_docs: "ডকুমেন্টেশন",
    footer_link_help: "হেল্প সেন্টার",
    footer_link_blog: "ব্লগ ও টিপস",
    footer_link_faq: "সাধারণ প্রশ্নোত্তর (FAQ)",
    footer_link_how: "যেভাবে কাজ করে",
    footer_link_about: "আমাদের সম্পর্কে",
    footer_link_contact: "যোগাযোগ",
    footer_link_privacy: "প্রাইভেসি পলিসি",
    footer_link_terms: "ব্যবহারের শর্তাবলী",
    footer_link_refund: "রিফান্ড পলিসি",
    footer_copy: "© ২০২৬ NEXORAAI. সর্বস্বত্ব সংরক্ষিত।",
    footer_b_privacy: "প্রাইভেসি",
    footer_b_terms: "শর্তাবলী",
    footer_b_refund: "রিফান্ড",
    footer_b_status: "স্ট্যাটাস"
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

    // How It Works
    how_badge: "How It Works",
    how_title: "Four Steps to Complete Business Automation",
    how_sub: "From connection to full automation in under an hour",
    step_1_title: "Connect WhatsApp",
    step_1_desc: "Scan the QR code or use our secure official Cloud API to link your business WhatsApp number in seconds.",
    step_2_title: "Configure AI",
    step_2_desc: "Upload your product catalog, FAQs, and business rules to train your specialized autonomous AI agents.",
    step_3_title: "Build Automations",
    step_3_desc: "Use the visual no-code builder to set up dropped order recovery, lead qualification, and automatic reply sequences.",
    step_4_title: "Grow Your Business",
    step_4_desc: "Deliver 24/7 instant customer support, convert incoming leads, and recover abandoned checkouts to multiply revenue.",
    step_link: "Learn More →",

    // Features Section
    feat_badge: "Features",
    feat_title: "Everything You Need to Automate Conversations & Scale Revenue",
    feat_sub: "A complete platform for WhatsApp automation, AI agents, leads, and dropped cart recovery",
    feat_1_title: "Official WhatsApp API & Sessions",
    feat_1_desc: "Full REST API support for text, rich media, interactive buttons, and product catalogs with multi-session management.",
    feat_1_tag: "Core Feature",
    feat_1_li1: "Send & receive all message types",
    feat_1_li2: "Multiple sessions & numbers supported",
    feat_1_li3: "Real-time webhook delivery",
    feat_1_li4: "Simple & complete API documentation",
    feat_2_title: "AI Auto Reply",
    feat_2_desc: "Provide instantaneous, accurate answers to customer inquiries 24/7 trained on your business knowledge base.",
    feat_3_title: "Smart AI Agents",
    feat_3_desc: "Deploy specialized AI agents dedicated to sales, customer care, lead qualification, and live order tracking.",
    feat_4_title: "Incomplete Order Recovery",
    feat_4_desc: "Capture customers who enter details on checkout but leave without paying. Recover them with 1-click WhatsApp alerts.",
    feat_4_tag: "NEW",
    feat_5_title: "Unified Team Inbox",
    feat_5_desc: "Collaborate seamlessly: assign chats, manage tags, and reply across all connected numbers from a single shared dashboard.",
    feat_6_title: "Lead Pipeline & CRM",
    feat_6_desc: "Manage leads with Kanban boards. Track customer interactions and conversion history from discovery to deal close.",
    feat_7_title: "WhatsApp Bulk SMS",
    feat_7_desc: "Send personalized broadcast campaigns to thousands with anti-ban random delay algorithms and dynamic contact tags.",
    feat_8_title: "Email Marketing & Blaster",
    feat_8_desc: "Design responsive HTML newsletters, run automated drip series, and maintain 99.8% primary inbox delivery.",
    feat_9_title: "Workflow Automation",
    feat_9_desc: "Visual drag-and-drop workflow builder. Chain triggers, conditional branches, and automated actions effortlessly.",
    feat_10_title: "Orders & Commerce",
    feat_10_desc: "Generate in-chat invoices, accept mobile payments, and dispatch automatic delivery tracking notifications.",
    feat_11_title: "Live Analytics",
    feat_11_desc: "Track message delivery rates, response times, lead conversion, and campaign revenue with real-time analytics.",
    feat_12_title: "Team & Role Control",
    feat_12_desc: "Granular role-based permissions and seat management for administrators, managers, and support agents.",
    feat_all_btn: "View All Features →",

    // Integrations
    int_badge: "Integrations",
    int_title: "Connect with the Tools You Already Use",
    int_sub: "Seamless native integrations with popular CRMs, eCommerce platforms, and payment gateways",
    int_note: "Custom webhooks and open REST APIs available for any bespoke platform or custom stack",

    // Pricing
    price_badge: "Pricing & Plans",
    price_title: "Simple, Scalable & Transparent Pricing",
    price_sub: "Start free and scale as you grow. No hidden fees or surprises.",
    plan_starter_name: "Starter",
    plan_starter_desc: "Best for small businesses and startups launching their first automated WhatsApp line.",
    plan_pro_name: "Professional",
    plan_pro_desc: "Built for growing ecommerce stores needing dropped checkout recovery and higher throughput.",
    plan_bus_name: "Business",
    plan_bus_desc: "Enterprise throughput for high-volume brands, marketing agencies, and large sales teams.",
    plan_popular_badge: "Most Popular",
    plan_btn_starter: "Get Started",
    plan_btn_pro: "Start Free Trial",
    plan_btn_bus: "Get Started",
    plan_ent_title: "Custom Enterprise Solutions",
    plan_ent_desc: "Dedicated cloud clusters, custom private LLMs, SLA guarantees, and multi-tenant agency whitelabel.",
    plan_ent_btn: "Talk to Sales Team →",
    plan_all_btn: "View Detailed Pricing →",
    price_period: "/month",
    plan_feat_1wa: "1 WhatsApp Number",
    plan_feat_5k: "5,000 Messages / month",
    plan_feat_ai_rep: "AI Auto Reply Support",
    plan_feat_500c: "500 Contacts & Leads",
    plan_feat_2team: "2 Team Members",
    plan_feat_3wa: "3 WhatsApp Numbers",
    plan_feat_25k: "25,000 Messages / month",
    plan_feat_ai_kb: "AI Agents + Knowledge Base",
    plan_feat_cart_rec: "Abandoned Checkout Recovery",
    plan_feat_wa_bulk: "WhatsApp Bulk SMS & Campaigns",
    plan_feat_10team: "10 Team Members",
    plan_feat_full_api: "Full API & Webhook Access",
    plan_feat_10wa: "10 WhatsApp Numbers",
    plan_feat_100k: "100,000 Messages / month",
    plan_feat_unl_ai: "Unlimited AI Agents",
    plan_feat_unl_leads: "Unlimited Contacts & Leads",
    plan_feat_vip_sup: "Priority VIP Support",
    plan_feat_25team: "25 Team Members",
    plan_feat_ded_bw: "Dedicated Cloud Bandwidth",

    // CTA
    cta_title: "Ready to Automate Your WhatsApp & Sales?",
    cta_desc: "Join thousands of successful businesses powering customer conversations with NEXORAAI.",
    cta_btn: "Get Started Free",
    cta_docs: "Read Documentation",

    // Footer
    footer_desc: "The all-in-one platform for WhatsApp Cloud API, AI agents, cart drop-off recovery, and sales automation.",
    footer_col_prod: "Product",
    footer_col_res: "Resources",
    footer_col_comp: "Company & Legal",
    footer_link_feat: "Features",
    footer_link_bulk: "WhatsApp Bulk SMS",
    footer_link_email: "Email Marketing",
    footer_link_rec: "Incomplete Order Recovery",
    footer_link_pricing: "Pricing Plans",
    footer_link_api: "API Docs",
    footer_link_status: "Server Status",
    footer_link_docs: "Documentation",
    footer_link_help: "Help Center",
    footer_link_blog: "Blog & Guides",
    footer_link_faq: "FAQ",
    footer_link_how: "How It Works",
    footer_link_about: "About Us",
    footer_link_contact: "Contact Us",
    footer_link_privacy: "Privacy Policy",
    footer_link_terms: "Terms of Service",
    footer_link_refund: "Refund Policy",
    footer_copy: "© 2026 NEXORAAI. All rights reserved.",
    footer_b_privacy: "Privacy",
    footer_b_terms: "Terms",
    footer_b_refund: "Refund",
    footer_b_status: "Status"
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
  const dict = I18N_DICT[selectedLang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  if (window.LanguageManager && typeof window.LanguageManager.applyLang === 'function') {
    window.LanguageManager.applyLang(selectedLang);
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

