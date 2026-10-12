/**
 * NEXORAAI Comprehensive Bilingual i18n System (EN / BN)
 * Provides seamless, lossless English <-> Bengali translation across all pages.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nexora_lang';

  // Bengali numerals to English numerals and vice-versa helpers
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  function toBnDigits(str) {
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  }

  function toEnDigits(str) {
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[০-৯]/g, d => enDigits[bnDigits.indexOf(d)]);
  }

  // Master Dictionaries for data-i18n tags
  const I18N_MASTER = {
    bn: {
      // Common Navigation
      nav_home: "হোম",
      nav_how: "যেভাবে কাজ করে",
      nav_features: "ফিচারসমূহ",
      nav_pricing: "প্রাইসিং",
      nav_docs: "ডকুমেন্টেশন",
      nav_help: "হেল্প সেন্টার",
      nav_login: "লগইন",
      nav_register: "শুরু করুন ফ্রি",
      nav_contact: "যোগাযোগ",
      nav_about: "আমাদের সম্পর্কে",
      nav_faq: "প্রশ্নোত্তর",
      nav_blog: "ব্লগ",
      nav_dashboard: "ড্যাশবোর্ড",

      // Common Footer
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
      footer_link_blog: "ব্লগ ও গাইড",
      footer_link_faq: "প্রশ্নোত্তর (FAQ)",
      footer_link_how: "যেভাবে কাজ করে",
      footer_link_about: "আমাদের সম্পর্কে",
      footer_link_contact: "যোগাযোগ",
      footer_link_privacy: "প্রাইভেসি পলিসি",
      footer_link_terms: "শর্তাবলী",
      footer_link_refund: "রিফান্ড পলিসি",
      footer_copy: "© ২০২৬ NEXORAAI. হোয়াটসঅ্যাপ API + AI অটোমেশন + স্মার্ট লিড ম্যানেজমেন্ট। সর্বস্বত্ব সংরক্ষিত।",
      footer_b_privacy: "প্রাইভেসি",
      footer_b_terms: "শর্তাবলী",
      footer_b_refund: "রিফান্ড",
      footer_b_status: "স্ট্যাটাস",

      // Hero Section (index.html)
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

      // Pricing (Index & Pricing Page)
      price_badge: "প্রাইসিং ও প্ল্যান",
      price_title: "স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান",
      price_sub: "বিনামূল্যে শুরু করুন, প্রয়োজন অনুযায়ী স্কেল করুন। কোনো লুকানো চার্জ নেই।",
      pricing_hero_badge: "স্বচ্ছ প্রাইসিং",
      pricing_hero_title: `সহজ প্রাইসিং, <span style="color:var(--primary)">বিশাল ROI</span>`,
      pricing_hero_sub: "যেকোনো প্ল্যানে ১৪ দিনের ফ্রি ট্রায়াল দিয়ে শুরু করুন। ক্রেডিট কার্ড লাগবে না। যেকোনো সময় বাতিলযোগ্য।",
      billing_monthly: "মাসিক",
      billing_annual: "বাৎসরিক",
      billing_save20: "২০% সাশ্রয়",
      plan_starter_name: "স্টার্টার",
      plan_starter_desc: "ছোট ব্যবসা এবং স্টার্টআপের জন্য হোয়াটসঅ্যাপ অটোমেশন শুরু করার সেরা প্ল্যান।",
      plan_pro_name: "প্রফেশনাল",
      plan_pro_desc: "গ্রোয়িং বিজনেস এবং ই-কমার্সের জন্য শক্তিশালী অটোমেশন ও ড্রপ-অফ রিকভারি।",
      plan_bus_name: "বিজনেস",
      plan_bus_desc: "এজেন্সি এবং হাই-ভলিউম এন্টারপ্রাইজের জন্য আনলিমিটেড ক্যাপাসিটি।",
      plan_popular_badge: "সর্বাধিক জনপ্রিয়",
      plan_btn_starter: "শুরু করুন",
      plan_btn_pro: "শুরু করুন ফ্রি",
      plan_btn_bus: "শুরু করুন",
      plan_price_starter: "৳ ৬৯৯",
      plan_price_pro: "৳ ২,৯৯৯",
      plan_price_bus: "৳ ৪,৯৯৯",
      price_period: "/মাস",
      price_period_full: "/ মাস",
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
      plan_ent_title: "কাস্টম এন্টারপ্রাইজ সলিউশন",
      plan_ent_desc: "বড় প্রতিষ্ঠান ও কর্পোরেট এজেন্সির জন্য কাস্টম সার্ভার, ডেডিকেটেড ইনফ্রাস্ট্রাকচার ও SLA সাপোর্ট।",
      plan_ent_btn: "সেলস টিমের সাথে কথা বলুন →",
      plan_all_btn: "সম্পূর্ণ প্রাইসিং বিবরণ দেখুন →",

      // ROI Calculator
      roi_title: "ইন্টারেক্টিভ ROI ক্যালকুলেটর",
      roi_sub: "সনাতন কাস্টমার সাপোর্টের তুলনায় NEXORAAI আপনার ব্যবসার প্রতি মাসে কত টাকা সাশ্রয় করে তা দেখুন",
      roi_inquiries_label: "দৈনিক ইনকামিং মেসেজ:",
      roi_agents_label: "ফুল-টাইম সাপোর্ট এজেন্ট প্রয়োজন:",
      roi_agents_note: "প্রতি মানব এজেন্টের দৈনিক গড়ে ৮০টি চ্যাটের উপর ভিত্তি করে",
      roi_savings_title: "আনুমানিক মাসিক সাশ্রয়",
      roi_savings_note: "সাথে ২৪/৭ শূন্য অপেক্ষার তাৎক্ষণিক রেসপন্স টাইম!",

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

      // Features Page
      feat_badge: "ফিচারসমূহ",
      feat_title: "ব্যবসা পরিচালনা ও সেলস বৃদ্ধির সব ফিচার এক প্ল্যাটফর্মে",
      feat_sub: "হোয়াটসঅ্যাপ অটোমেশন, AI এজেন্ট, লিড ও ড্রপ-অফ অর্ডার রিকভারির সম্পূর্ণ সমাধান",
      feat_hero_badge: "রেভিনিউ বৃদ্ধির জন্য নির্মিত",
      feat_hero_title: `হোয়াটসঅ্যাপে স্কেল করার <span style="color:var(--primary)">সব প্রযুক্তি</span>`,
      feat_hero_sub: "হোয়াটসঅ্যাপ কানেক্টিভিটি, আধুনিক AI মডেল, CRM লিড ম্যানেজমেন্ট এবং অটোমেশন একসাথে এক প্ল্যাটফর্মে।",
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
      feat_8_desc: "এইচটিএমএল নিউজলেটার ডিজাইন করুন, ড্রপ ক্যাম্পেইন চালান এবং ৯৯.৮% ইনবক্স প্লেসমেন্ট নিশ্চিত করুন।",
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

      // CTA
      cta_title: "আপনার হোয়াটসঅ্যাপ ও সেলস অটোমেট করতে প্রস্তুত?",
      cta_desc: "আজই যুক্ত হোন হাজার হাজার সফল ব্যবসার সাথে এবং AI এর শক্তিতে কাস্টমার কনভার্সন বাড়ান।",
      cta_btn: "বিনামূল্যে শুরু করুন",
      cta_docs: "ডকুমেন্টেশন পড়ুন",

      // Contact Page
      contact_badge: "যোগাযোগ করুন",
      contact_title: `আপনার <span style="color:var(--primary)">হোয়াটসঅ্যাপ স্ট্র্যাটেজি</span> নিয়ে আলোচনা করি`,
      contact_sub: "এন্টারপ্রাইজ SLA, হাই-ভলিউম মেসেজিং অথবা কাস্টম AI ইন্টিগ্রেশনের জন্য আমাদের বিশেষজ্ঞ দল প্রস্তুত।",
      contact_name_lbl: "আপনার পুরো নাম",
      contact_email_lbl: "ব্যবসায়িক ইমেইল",
      contact_phone_lbl: "হোয়াটসঅ্যাপ নম্বর",
      contact_company_lbl: "কোম্পানির নাম",
      contact_volume_lbl: "মাসিক আনুমানিক মেসেজ ভলিউম",
      contact_msg_lbl: "আপনার মেসেজ বা রিকোয়ারমেন্ট",
      contact_btn: "মেসেজ পাঠান",

      // Help Center
      help_title: "আমরা আপনাকে কীভাবে সাহায্য করতে পারি?",
      help_sub: "ডকুমেন্টেশন, টিউটোরিয়াল এবং দ্রুত উত্তরের জন্য সার্চ করুন",
      help_search_ph: "প্রশ্ন বা বিষয় লিখে সার্চ করুন...",

      // Auth
      auth_login_title: "NEXORAAI তে লগইন করুন",
      auth_login_sub: "আপনার অটোমেশন ড্যাশবোর্ডে প্রবেশ করুন",
      auth_email: "ইমেইল অ্যাড্রেস",
      auth_password: "পাসওয়ার্ড",
      auth_remember: "মনে রাখুন",
      auth_forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      auth_login_btn: "লগইন করুন",
      auth_no_acc: "অ্যাকাউন্ট নেই? বিনামূল্যে শুরু করুন",
      auth_register_title: "নতুন অ্যাকাউন্ট তৈরি করুন",
      auth_register_sub: "১৪ দিনের ফ্রি ট্রায়াল শুরু করুন",
      auth_fullname: "পুরো নাম",
      auth_phone: "হোয়াটসঅ্যাপ নম্বর",
      auth_register_btn: "রেজিস্ট্রেশন সম্পন্ন করুন",
      auth_have_acc: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন"
    },

    en: {
      // Common Navigation
      nav_home: "Home",
      nav_how: "How It Works",
      nav_features: "Features",
      nav_pricing: "Pricing",
      nav_docs: "Documentation",
      nav_help: "Help Center",
      nav_login: "Login",
      nav_register: "Get Started Free",
      nav_contact: "Contact",
      nav_about: "About Us",
      nav_faq: "FAQ",
      nav_blog: "Blog",
      nav_dashboard: "Dashboard",

      // Common Footer
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
      footer_copy: "© 2026 NEXORAAI. WhatsApp API + AI Automation + Smart Lead Management. All rights reserved.",
      footer_b_privacy: "Privacy",
      footer_b_terms: "Terms",
      footer_b_refund: "Refund",
      footer_b_status: "Status",

      // Hero Section (index.html)
      hero_badge: "NEW: WhatsApp Bulk SMS & Email Marketing Engine 2.0",
      hero_headline: `All-in-One<br /><span class="text-gradient-green">WhatsApp API, Email Marketing</span><br />& AI Automation Platform`,
      hero_sub: "Connect WhatsApp & SMTP relays, send high-converting bulk campaigns, capture leads, and automate your entire business sales & customer support from one powerful command center.",
      hero_cta_primary: `Get Started Free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
      hero_cta_secondary: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> View API Docs`,
      trust_1: "Quick 2-Minute Setup",
      trust_2: "14-Day Free Trial",
      trust_3: "Cancel Anytime",
      fb_1: "Message Delivered ✓",
      fb_2: "AI Reply Generated",
      fb_3: "New Lead Captured",
      fb_4: "Order Confirmed",
      stat_biz_lbl: "Active Businesses",
      stat_biz_desc: "Scaling daily with NEXORAAI",
      stat_msg_lbl: "Automated Messages",
      stat_msg_desc: "Processed across WhatsApp & Email",
      stat_uptime_lbl: "Platform Uptime",
      stat_uptime_desc: "Enterprise SLA cloud infrastructure",
      stat_auto_lbl: "Autonomous AI",
      stat_auto_desc: "24/7 intelligent instant replies",

      // Pricing (Index & Pricing Page)
      price_badge: "Pricing & Plans",
      price_title: "Simple, Scalable & Transparent Pricing",
      price_sub: "Start free and scale as you grow. No hidden fees or surprises.",
      pricing_hero_badge: "TRANSPARENT PRICING",
      pricing_hero_title: `Simple Pricing, <span style="color:var(--primary)">Massive ROI</span>`,
      pricing_hero_sub: "Start with a 14-day free trial on any tier. No credit card required. Cancel anytime.",
      billing_monthly: "Monthly",
      billing_annual: "Annual",
      billing_save20: "Save 20%",
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
      plan_price_starter: "৳ 699",
      plan_price_pro: "৳ 2,999",
      plan_price_bus: "৳ 4,999",
      price_period: "/month",
      price_period_full: "/ month",
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
      plan_ent_title: "Custom Enterprise Solutions",
      plan_ent_desc: "Dedicated cloud clusters, custom private LLMs, SLA guarantees, and multi-tenant agency whitelabel.",
      plan_ent_btn: "Talk to Sales Team →",
      plan_all_btn: "View Detailed Pricing →",

      // ROI Calculator
      roi_title: "Interactive ROI Calculator",
      roi_sub: "See how much NEXORAAI saves your business each month compared to traditional manual support staff",
      roi_inquiries_label: "Incoming Inquiries / Day:",
      roi_agents_label: "Full-time Support Agents Required:",
      roi_agents_note: "Based on average 80 chats/day per human agent",
      roi_savings_title: "Estimated Monthly Savings",
      roi_savings_note: "Plus 24/7 zero-wait response time!",

      // How It Works
      how_badge: "How It Works",
      how_title: "4 Simple Steps to Complete Business Automation",
      how_sub: "From QR connection to full automation in just a few minutes",
      step_1_title: "Connect WhatsApp",
      step_1_desc: "Scan QR code or use our secure Cloud API to attach your business WhatsApp number in seconds.",
      step_2_title: "Configure AI Agents",
      step_2_desc: "Upload product catalogs, knowledge FAQs, and business rules to train specialized AI agents.",
      step_3_title: "Build Workflows",
      step_3_desc: "Create dropped-order recovery, lead triage, and multi-branch auto-replies with visual no-code builder.",
      step_4_title: "Scale Your Business",
      step_4_desc: "Deliver 24/7 instant support, recover abandoned carts, and multiply sales revenue effortlessly.",
      step_link: "Learn More →",

      // Features Page
      feat_badge: "Features",
      feat_title: "Everything You Need to Scale on WhatsApp",
      feat_sub: "All-in-one platform for WhatsApp connectivity, AI agents, CRM pipeline, and cart recovery",
      feat_hero_badge: "BUILT FOR REVENUE",
      feat_hero_title: `Everything You Need to Scale on <span style="color:var(--primary)">WhatsApp</span>`,
      feat_hero_sub: "A unified platform combining enterprise WhatsApp connectivity, cutting-edge LLMs, CRM lead management, and visual workflow automation.",
      feat_1_title: "Official WhatsApp Cloud API & Sessions",
      feat_1_desc: "Full REST API support for text, rich media, interactive buttons, and product catalogs with multi-session management.",
      feat_1_tag: "Core Feature",
      feat_1_li1: "Send and receive all message types",
      feat_1_li2: "Multiple sessions and phone lines",
      feat_1_li3: "Real-time webhook events",
      feat_1_li4: "Developer-friendly documentation",
      feat_2_title: "AI Auto Reply",
      feat_2_desc: "Answer customer inquiries 24/7 with zero wait time using fine-tuned AI trained on your catalog.",
      feat_3_title: "Smart AI Agents",
      feat_3_desc: "Deploy specialized autonomous agents for sales closing, customer support, lead triage, and order tracking.",
      feat_4_title: "Incomplete Order Recovery",
      feat_4_desc: "Automatically re-engage dropped checkouts on WhatsApp with 1-click reminders to boost store revenue.",
      feat_4_tag: "High ROI",
      feat_5_title: "Unified Team Inbox",
      feat_5_desc: "Centralized multi-agent inbox for WhatsApp chats with custom tags, private notes, and agent assignments.",
      feat_6_title: "Lead Pipeline & CRM",
      feat_6_desc: "Kanban board pipeline for visual deal tracking, contact tagging, and chronological activity history.",
      feat_7_title: "WhatsApp Bulk SMS",
      feat_7_desc: "Broadcast personalized marketing messages to thousands of opt-in customers with anti-ban throttling.",
      feat_8_title: "Email Marketing & Blast Engine",
      feat_8_desc: "Design responsive newsletters, build drip sequences, and achieve 99.8% inbox delivery via SMTP relays.",
      feat_9_title: "Visual Workflow Automation",
      feat_9_desc: "No-code flow canvas to trigger multi-step actions based on keywords, inbound messages, and webhooks.",
      feat_10_title: "WhatsApp Orders & Commerce",
      feat_10_desc: "Showcase in-chat catalogs, create orders, collect payments via bKash/Nagad/Cards, and push shipping updates.",
      feat_11_title: "Live Analytics & Reports",
      feat_11_desc: "Monitor message delivery, response latency, conversion funnels, and revenue metrics in real time.",
      feat_12_title: "Team & Role Control",
      feat_12_desc: "Granular role-based permissions and seat management for administrators, managers, and support agents.",
      feat_all_btn: "View All Features →",

      // Integrations
      int_badge: "Integrations",
      int_title: "Connect with the Tools You Already Use",
      int_sub: "Seamless native integrations with popular CRMs, eCommerce platforms, and payment gateways",
      int_note: "Custom webhooks and open REST APIs available for any bespoke platform or custom stack",

      // CTA
      cta_title: "Ready to Automate Your WhatsApp & Sales?",
      cta_desc: "Join thousands of successful businesses powering customer conversations with NEXORAAI.",
      cta_btn: "Get Started Free",
      cta_docs: "Read Documentation",

      // Contact Page
      contact_badge: "GET IN TOUCH",
      contact_title: `Let’s Talk About Your <span style="color:var(--primary)">WhatsApp Strategy</span>`,
      contact_sub: "Whether you want an enterprise SLA, high-volume broadcasting, or custom AI fine-tuning, our engineering team is ready.",
      contact_name_lbl: "Your Full Name",
      contact_email_lbl: "Business Email",
      contact_phone_lbl: "WhatsApp Number",
      contact_company_lbl: "Company Name",
      contact_volume_lbl: "Estimated Monthly Volume",
      contact_msg_lbl: "Your Message or Requirements",
      contact_btn: "Send Message",

      // Help Center
      help_title: "How can we help you today?",
      help_sub: "Search documentation, setup guides, and platform tutorials",
      help_search_ph: "Search articles, guides, or questions...",

      // Auth
      auth_login_title: "Sign in to NEXORAAI",
      auth_login_sub: "Enter your credentials to access your dashboard",
      auth_email: "Email Address",
      auth_password: "Password",
      auth_remember: "Remember me",
      auth_forgot: "Forgot password?",
      auth_login_btn: "Sign In",
      auth_no_acc: "Don't have an account? Start Free Trial",
      auth_register_title: "Create your Account",
      auth_register_sub: "Start your 14-day free trial today",
      auth_fullname: "Full Name",
      auth_phone: "WhatsApp Phone Number",
      auth_register_btn: "Complete Registration",
      auth_have_acc: "Already have an account? Sign in"
    }
  };

  // Comprehensive bidirectional phrase lookup map for UI text elements
  // Maps English phrases <-> Bengali phrases
  const PHRASE_PAIRS = [
    // Brand & Taglines
    ["NEXORAAI ড্যাশবোর্ড", "NEXORAAI Dashboard"],
    ["অল-ইন-ওয়ান হোয়াটসঅ্যাপ API, ইমেইল মার্কেটিং ও AI অটোমেশন প্ল্যাটফর্ম", "All-in-One WhatsApp API, Email Marketing & AI Automation Platform"],
    ["নতুন: হোয়াটসঅ্যাপ বাল্ক SMS ও ইমেইল মার্কেটিং ইঞ্জিন ২.০", "NEW: WhatsApp Bulk SMS & Email Marketing Engine 2.0"],

    // Navigation & Buttons
    ["হোম", "Home"],
    ["যেভাবে কাজ করে", "How It Works"],
    ["ফিচারসমূহ", "Features"],
    ["প্রাইসিং", "Pricing"],
    ["ডকুমেন্টেশন", "Documentation"],
    ["ডক্স", "Docs"],
    ["API ডক্স", "API Docs"],
    ["API ডক্স দেখুন", "View API Docs"],
    ["হেল্প সেন্টার", "Help Center"],
    ["হেল্প", "Help"],
    ["সহায়তা", "Help"],
    ["যোগাযোগ", "Contact"],
    ["যোগাযোগ করুন", "Contact Us"],
    ["আমাদের সম্পর্কে", "About Us"],
    ["প্রশ্নোত্তর", "FAQ"],
    ["ব্লগ", "Blog"],
    ["লগইন", "Login"],
    ["লগইন করুন", "Log In"],
    ["শুরু করুন", "Get Started"],
    ["শুরু করুন ফ্রি", "Start Free Trial"],
    ["বিনামূল্যে শুরু করুন", "Get Started Free"],
    ["ফ্রি ট্রায়াল শুরু করুন", "Start Free Trial"],
    ["লগআউট", "Sign Out"],
    ["সাইন ইন", "Sign In"],
    ["সাইন আপ", "Sign Up"],
    ["অ্যাকাউন্ট তৈরি করুন", "Create Account"],
    ["রেজিস্ট্রেশন সম্পন্ন করুন", "Complete Registration"],
    ["সেভ করুন", "Save Changes"],
    ["বাতিল", "Cancel"],
    ["মুছে ফেলুন", "Delete"],
    ["সম্পাদনা", "Edit"],
    ["ফিল্টার", "Filter"],
    ["সার্চ", "Search"],
    ["এক্সপোর্ট", "Export"],
    ["ডাউনলোড", "Download"],
    ["আপলোড", "Upload"],
    ["নতুন যোগ করুন", "Create New"],
    ["কানেক্ট করুন", "Connect"],
    ["ডিসকানেক্ট", "Disconnect"],
    ["রিফ্রেশ", "Refresh"],
    ["কপি করুন", "Copy"],
    ["বিস্তারিত জানুন →", "Learn More →"],
    ["সব ফিচারসমূহ দেখুন →", "View All Features →"],
    ["সম্পূর্ণ প্রাইসিং বিবরণ দেখুন →", "View Detailed Pricing →"],
    ["সেলস টিমের সাথে কথা বলুন →", "Talk to Sales Team →"],

    // Pricing & Plans
    ["স্টার্টার", "Starter"],
    ["প্রফেশনাল", "Professional"],
    ["বিজনেস", "Business"],
    ["এন্টারপ্রাইজ", "Enterprise"],
    ["সর্বাধিক জনপ্রিয়", "MOST POPULAR"],
    ["সবচেয়ে জনপ্রিয়", "MOST POPULAR"],
    ["মাসিক", "Monthly"],
    ["বাৎসরিক", "Annual"],
    ["২০% সাশ্রয়", "Save 20%"],
    ["/মাস", "/month"],
    ["/ মাস", "/ month"],
    ["/mo", "/mo"],
    ["স্বচ্ছ প্রাইসিং", "TRANSPARENT PRICING"],
    ["প্রাইসিং ও প্ল্যান", "Pricing Plans & ROI"],
    ["সহজ প্রাইসিং, বিশাল ROI", "Simple Pricing, Massive ROI"],
    ["স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান", "Simple, Scalable & Transparent Pricing"],
    ["ছোট ব্যবসা এবং স্টার্টআপের জন্য হোয়াটসঅ্যাপ অটোমেশন শুরু করার সেরা প্ল্যান।", "Best for small businesses and startups launching their first automated WhatsApp line."],
    ["গ্রোয়িং বিজনেস এবং ই-কমার্সের জন্য শক্তিশালী অটোমেশন ও ড্রপ-অফ রিকভারি।", "Built for growing ecommerce stores needing dropped checkout recovery and higher throughput."],
    ["এজেন্সি এবং হাই-ভলিউম এন্টারপ্রাইজের জন্য আনলিমিটেড ক্যাপাসিটি।", "Enterprise throughput for high-volume brands, marketing agencies, and large sales teams."],
    ["১টি হোয়াটসঅ্যাপ নম্বর", "1 Connected WhatsApp Number"],
    ["৫,০০০ মেসেজ / মাস", "5,000 Messages / mo"],
    ["১টি AI এজেন্ট পার্সোনা", "1 AI Agent Persona"],
    ["AI অটো রিপ্লাই সাপোর্ট", "AI Auto Reply Support"],
    ["৫০০ কন্টাক্ট ও লিড", "500 Contacts & Leads"],
    ["২ জন টিম মেম্বার", "2 Team Agent Seats"],
    ["ইউনিফাইড ইনবক্স ও CRM কন্টাক্টস", "Unified Inbox & CRM Contacts"],
    ["৩টি হোয়াটসঅ্যাপ নম্বর", "3 WhatsApp Numbers"],
    ["২৫,০০০ মেসেজ / মাস", "25,000 Messages / month"],
    ["৫০,০০০ মেসেজ / মাস", "50,000 Messages / mo"],
    ["AI এজেন্টস + নলেজ বেস", "AI Agents + Knowledge Base"],
    ["ড্রপ-অফ ও ইনকমপ্লিট অর্ডার রিকভারি", "Abandoned Checkout Recovery"],
    ["হোয়াটসঅ্যাপ বাল্ক SMS ও ক্যাম্পেইন", "WhatsApp Bulk SMS & Campaigns"],
    ["১০ জন টিম মেম্বার", "10 Team Members"],
    ["ফুল API ও ওয়েবহুক অ্যাক্সেস", "Full API & Webhook Access"],
    ["১০টি হোয়াটসঅ্যাপ নম্বর", "10 WhatsApp Numbers"],
    ["১,০০,০০০ মেসেজ / মাস", "100,000 Messages / month"],
    ["আনলিমিটেড AI এজেন্টস", "Unlimited AI Agents"],
    ["আনলিমিটেড কন্টাক্ট ও লিড", "Unlimited Contacts & Leads"],
    ["প্রায়োরিটি VIP সাপোর্ট", "Priority VIP Support"],
    ["২৫ জন টিম মেম্বার", "25 Team Members"],
    ["ফুল ডেডিকেটেড ব্যান্ডউইথ", "Dedicated Cloud Bandwidth"],
    ["কাস্টম এন্টারপ্রাইজ সলিউশন", "Custom Enterprise Solutions"],

    // Pricing Numbers
    ["৳ ৬৯৯", "৳ 699"],
    ["৳ ২,৯৯৯", "৳ 2,999"],
    ["৳ ৪,৯৯৯", "৳ 4,999"],
    ["৳ ৫৫৯", "৳ 559"],
    ["৳ ২,৩৯৯", "৳ 2,399"],
    ["৳ ৩,৯৯৯", "৳ 3,999"],

    // ROI Calculator
    ["ইন্টারেক্টিভ ROI ক্যালকুলেটর", "Interactive ROI Calculator"],
    ["সনাতন কাস্টমার সাপোর্টের তুলনায় NEXORAAI আপনার ব্যবসার প্রতি মাসে কত টাকা সাশ্রয় করে তা দেখুন", "See how much NEXORAAI saves your business each month compared to traditional manual support staff"],
    ["দৈনিক ইনকামিং মেসেজ:", "Incoming Inquiries / Day:"],
    ["ফুল-টাইম সাপোর্ট এজেন্ট প্রয়োজন:", "Full-time Support Agents Required:"],
    ["প্রতি মানব এজেন্টের দৈনিক গড়ে ৮০টি চ্যাটের উপর ভিত্তি করে", "Based on average 80 chats/day per human agent"],
    ["আনুমানিক মাসিক সাশ্রয়", "Estimated Monthly Savings"],
    ["সাথে ২৪/৭ শূন্য অপেক্ষার তাৎক্ষণিক রেসপন্স টাইম!", "Plus 24/7 zero-wait response time!"],

    // Dashboard Sidebar & Shell
    ["ওভারভিউ", "Overview"],
    ["ইনবক্স", "Inbox"],
    ["হোয়াটসঅ্যাপ", "WhatsApp"],
    ["সেশন", "Sessions"],
    ["কন্টাক্টস", "Contacts"],
    ["লিডস", "Leads"],
    ["লিড হান্ট", "Lead Hunt"],
    ["লিড রিসার্চ", "Lead Research"],
    ["মার্কেটিং ও ব্রডকাস্ট", "Marketing & Broadcast"],
    ["আউটরিচ", "Outreach"],
    ["হোয়াটসঅ্যাপ বাল্ক SMS", "WhatsApp Bulk SMS"],
    ["বাল্ক ইমেইল ব্লাস্টার", "Bulk Email Blaster"],
    ["ক্যাম্পেইন ও টেমপ্লেটস", "Campaigns & Templates"],
    ["ক্যাম্পেইনস", "Campaigns"],
    ["এআই ও অটোমেশন", "AI & Automation"],
    ["AI রাইটার ও কপি", "AI Writer & Copy"],
    ["অটোমেশনস", "Automations"],
    ["AI এজেন্টস", "AI Agents"],
    ["নলেজ বেস", "Knowledge Base"],
    ["কমার্স", "Commerce"],
    ["প্রোডাক্টস", "Products"],
    ["অর্ডারস", "Orders"],
    ["ইনকমপ্লিট অর্ডারস", "Incomplete Orders"],
    ["অ্যানালিটিক্স ও ডেভ", "Analytics & Dev"],
    ["অ্যানালিটিক্স", "Analytics"],
    ["API ও কী", "API & Keys"],
    ["ওয়েবহুকস", "Webhooks"],
    ["ইন্টিগ্রেশনস", "Integrations"],
    ["n8n অটোমেশন", "n8n Automation"],
    ["অ্যাকাউন্ট", "Account"],
    ["টিম", "Team"],
    ["বিলিং", "Billing"],
    ["সাপোর্ট", "Support"],
    ["সেটিংস", "Settings"],
    ["হেল্প ও নির্দেশিকা", "Help & Guidelines"],
    ["ইউজার গাইড ও প্লেবুক", "User Guide & Playbook"],
    ["অ্যাডমিন কন্ট্রোল সেন্টার", "Admin Control Center"],
    ["সুপার অ্যাডমিন কন্ট্রোল সেন্টার", "Super Admin Control Center"],
    ["দ্রুত খুঁজুন", "Quick Search"],
    ["সার্চ পেজ, কন্টাক্ট, অটোমেশন...", "Search pages, contacts, deals, automations..."],
    ["সেটআপ উইজার্ড", "Setup Wizard"],
    ["প্ল্যাটফর্ম নির্দেশিকা ও অ্যাডমিন SOP", "Platform Guidelines & Admin SOP"],
    ["প্ল্যাটফর্ম ওভারভিউ", "Platform Overview"],
    ["টেন্যান্ট ও ইউজারস", "Tenants & Users"],
    ["ইউজার ম্যানেজমেন্ট", "User Management"],
    ["অর্গানাইজেশনস", "Organizations"],
    ["প্ল্যান ও প্রাইসিং", "Plans & Pricing"],
    ["সেলস ও অর্ডারস", "Sales & Orders"],
    ["ইনকমপ্লিট অর্ডারস", "Incomplete Orders"],
    ["লেনদেন ও ট্রানজ্যাকশন", "Transactions"],
    ["ইনফ্রাস্ট্রাকচার", "Infrastructure"],
    ["হোয়াটসঅ্যাপ মনিটর", "WhatsApp Monitor"],
    ["ইমেইল মনিটর", "Email Monitor"],
    ["অডিট লগস", "Audit Logs"],
    ["ডকুমেন্টেশন ও অপারেশনস", "Documentation & Operations"],
    ["অ্যাডমিন গাইড ও SOP", "Admin Guide & SOP"],
    ["কনফিগারেশন", "Configuration"],
    ["সিস্টেম সেটিংস", "System Settings"],
    ["অ্যাপে ফিরে যান", "Exit to App"],
    ["NEXORAAI সিস্টেম অ্যাডমিনিস্ট্রেশন", "NEXORAAI System Administration"],
    ["প্রোডাকশন ক্লাস্টার: সক্রিয়", "Production Cluster: Healthy"],
    ["প্ল্যাটফর্ম অডিট ট্রেইল", "Platform Audit Trail"],
    ["অথেনটিকেশন ইভেন্ট, API কী এবং কনফিগারেশন পরিবর্তনের অপরিবর্তনীয় নিরাপত্তা লগ", "Immutable security log of authentication events, API key revocations, and configuration changes"],
    ["ইউজার", "User"],
    ["প্রতিষ্ঠান", "Organization"],
    ["প্ল্যান", "Plan"],
    ["রোল", "Role"],
    ["স্ট্যাটাস", "Status"],
    ["অ্যাকশনস", "Actions"],
    ["অ্যাকশন", "Action"],
    ["ইউজার / অ্যাক্টর", "User / Actor"],
    ["টেন্যান্ট প্রতিষ্ঠান", "Tenant Org"],
    ["আইপি অ্যাড্রেস", "IP Address"],
    ["টাইমস্ট্যাম্প", "Timestamp"],
    ["সুরক্ষিত অ্যাকাউন্ট", "Protected Account"],
    ["রুট সুপার অ্যাডমিন", "Root Super Admin"],
    ["সুপার অ্যাডমিন মাস্টার", "Super Admin Master"],
    ["সক্রিয় (মূল)", "Active (Primary)"],
    ["সক্রিয়", "Active"],
    ["স্থগিত", "Suspended"],
    ["পেন্ডিং অনুমোদন", "Pending Approval"],
    ["পাসওয়ার্ড রিসেট", "Reset PW"],
    ["সাসপেন্ড", "Suspend"],
    ["অনুমোদন করুন", "Approve"],
    ["বাতিল করুন", "Reject"],
    ["সকল বিজনেস টেন্যান্টের ইউজার অ্যাকাউন্ট অনুসন্ধান ও পরিচালনা করুন", "Search, inspect, and manage system accounts across all business tenants"],

    // System Status
    ["সকল সিস্টেম স্বাভাবিক রয়েছে", "All Systems Operational"],
    ["প্ল্যাটফর্ম উপাদান স্বাস্থ্য", "Platform Component Health"],
    ["অপারেশনাল", "Operational"],
    ["আপটাইম ৯৯.৯৮%", "Uptime 99.98%"],

    // Legal & Company
    ["প্রাইভেসি পলিসি", "Privacy Policy"],
    ["শর্তাবলী", "Terms of Service"],
    ["ব্যবহারের গ্রহণযোগ্য শর্তাবলী", "Acceptable Use Policy"],
    ["রিফান্ড পলিসি", "Refund Policy"],
    ["সিস্টেম স্ট্যাটাস", "System Status"],
    ["আমাদের মিশন", "OUR MISSION"],
    ["অটোনোমাস হোয়াটসঅ্যাপ কমার্স ক্ষমতায়ন", "Powering Autonomous WhatsApp Commerce"],

    // Stats & Metrics
    ["সফল ব্যবসা", "Active Businesses"],
    ["অটোমেটেড মেসেজ", "Automated Messages"],
    ["প্ল্যাটফর্ম আপটাইম", "Platform Uptime"],
    ["AI অটোমেশন", "Autonomous AI"],
    ["১০,০০০+", "10,000+"],
    ["৫০M+", "50M+"],
    ["৯৯.৯%", "99.9%"],
    ["২৪/৭", "24/7"],
    ["০১", "01"],
    ["০২", "02"],
    ["০৩", "03"],
    ["০৪", "04"],
    ["২,৮৪৭", "2,847"],
    ["১৮৪", "184"],
    ["৯৮", "98"],
    ["মেসেজ", "Messages"],
    ["লিড", "Leads"],
    ["AI রিপ্লাই", "AI Replies"],
    ["সাপ্তাহিক মেসেজ ভলিউম", "Weekly Message Volume"],
    // Features & How It Works Detailed
    ["ইউনিফাইড হোয়াটসঅ্যাপ ইনবক্স", "Unified WhatsApp Inbox"],
    ["অটোনোমাস AI এজেন্টস ও RAG", "Autonomous AI Agents & RAG"],
    ["ভিজ্যুয়াল ফ্লো অটোমেশন", "Visual Flow Automation"],
    ["স্মার্ট CRM ও পাইপলাইন", "Smart CRM & Pipeline"],
    ["অ্যান্টি-ব্যান বাল্ক ব্রডকাস্ট", "Anti-Ban Bulk Broadcasts"],
    ["হোয়াটসঅ্যাপ কমার্স ও চেকআউট", "WhatsApp Commerce & Checkout"],
    ["ইমেইল মার্কেটিং ও ব্লাস্টার ইঞ্জিন", "Email Marketing & Blast Engine"],
    ["রেভিনিউ বৃদ্ধির জন্য তৈরি", "BUILT FOR REVENUE"],
    ["হোয়াটসঅ্যাপে স্কেল করার সব প্রযুক্তি", "Everything You Need to Scale on WhatsApp"],
    ["আপনার হোয়াটসঅ্যাপ সেলস অটোমেট করতে প্রস্তুত?", "Ready to Automate Your WhatsApp Sales?"],
    ["২,৪০০+ সফল ব্যবসার সাথে যুক্ত হোন এবং কথোপকথনকে রূপান্তর করুন উচ্চ-মুনাফার বিক্রয়ে।", "Join 2,400+ businesses turning conversations into high-margin revenue."],
    ["১৪ দিনের ফ্রি ট্রায়াল শুরু করুন 🚀", "Start 14-Day Free Trial 🚀"],
    ["সহজ ৪-ধাপের অনবোর্ডিং", "SIMPLE 4-STEP ONBOARDING"],
    ["৫ মিনিটের মধ্যে লাইভ শুরু করুন", "Go Live in Under 5 Minutes"],
    ["কোনো জটিল ডেভেলপার সেটআপ নেই। আপনার ফোন নম্বর যুক্ত করুন, ফাইল ড্রপ করুন এবং AI কে আপনার কাস্টমার চ্যাট পরিচালনা করতে দিন।", "No complicated developer setup. Connect your existing phone number, drop your documents, and let AI handle your customer chats."],
    ["ধাপ ০১", "STEP 01"],
    ["ধাপ ০২", "STEP 02"],
    ["ধাপ ০৩", "STEP 03"],
    ["ধাপ ০৪", "STEP 04"],
    ["৬০ সেকেন্ডে হোয়াটসঅ্যাপ কানেক্ট করুন", "Connect WhatsApp in 60 Seconds"],
    ["আপনার ফোন দিয়ে আমাদের নিরাপদ QR কোড স্ক্যান করুন অথবা অফিসিয়াল মেটা হোয়াটসঅ্যাপ বিজনেস ক্লাউড API কানেক্ট করুন। শূন্য ডাউনটাইম, কোনো মিসড মেসেজ নয়।", "Simply scan our secure QR code with your phone or link your official Meta WhatsApp Business Cloud API account. Zero downtime, zero missed messages."],
    ["✓ ডুয়াল-ইঞ্জিন সাপোর্ট (ক্লাউড API ও QR গেটওয়ে)", "✓ Dual-engine support (Cloud API & QR Gateway)"],
    ["WhatsApp > Linked Devices দিয়ে স্ক্যান করুন", "Scan with WhatsApp > Linked Devices"],
    ["সকেট: শুনছে", "Socket: Listening"],
    ["আপনার ব্যবসায়িক তথ্য ও নলেজ আপলোড করুন", "Drop Your Business Knowledge"],
    ["আপনার প্রোডাক্ট ক্যাটালগ PDF আপলোড করুন, ওয়েবসাইটের URL দিন অথবা সাধারণ প্রশ্নোত্তর লিখুন। আমাদের RAG ইঞ্জিন স্বয়ংক্রিয়ভাবে আপনার তথ্য ভেক্টর ডাটাবেজে যুক্ত করে।", "Upload your product catalog PDFs, paste your website URL, or write your FAQs. Our RAG engine automatically chunks and embeds your data into a dedicated vector knowledge store."],
    ["✓ নির্ভুল উত্তর ও শূন্য বিভ্রান্তি", "✓ Accurate answers with zero hallucinations"],
    ["৪১২টি চাঙ্কস এমবেডেড", "412 chunks embedded"],
    ["৮৬টি ওয়েব চাঙ্কস ইনডেক্সড", "86 web chunks indexed"],
    ["AI পার্সোনা ও অটোমেশন ফ্লো কাস্টমাইজ করুন", "Customize AI Persona & Flows"],
    ["আপনার বটের ব্যক্তিত্ব, ভাষার সেটিংস (বাংলা বা ইংরেজি), অফিস সময় এবং স্বয়ংক্রিয় CRM কোয়ালিফিকেশন সেট করুন।", "Configure your bot's personality, language settings (Bengali or English), office hours, and automatic CRM qualification triggers."],
    ["✓ যেকোনো সময় সরাসরি মানব এজেন্টের কাছে হ্যান্ডঅফ", "✓ Seamless human agent handoff anytime"],
    ["আসসালামু আলাইকুম! আজ আপনাকে কীভাবে সাহায্য করতে পারি?", "Assalamu Alaikum! How can I assist you with our services today?"],
    ["বাৎসরিক সাবস্ক্রিপশনের প্রাইসিং কি জানতে পারি?", "Can I get the pricing for annual subscription?"],
    ["অবশ্যই! আমাদের প্রো প্ল্যান $১৪৯/মাস (বাৎসরিক বিলে ২০% ছাড়)। আপনি কি ফিচার তালিকা দেখতে চান?", "Certainly! Our Pro Plan is $149/mo (or 20% off billed annually). Would you like to view our feature sheet?"],
    ["লিড ও রেভিনিউ বাড়তে দেখুন", "Watch Leads & Revenue Multiply"],
    ["কোয়ালিফাইড কন্টাক্ট সরাসরি কানবান পাইপলাইনে যুক্ত হয়, অর্ডার চেকআউট সিস্টেমে সিঙ্ক হয় এবং আপনার সেলস টিম শুধু ক্লোজিংয়ে সময় দেয়।", "Qualified contacts appear live in your Kanban pipeline, orders sync to your checkout systems, and your agents only handle high-value closing conversations."],
    ["প্রথম রেসপন্স টাইম", "First Response Time"],
    ["বট রেজোলিউশন রেট", "Bot Resolution Rate"],
    ["আজই আপনার হোয়াটসঅ্যাপ অটোমেট করা শুরু করুন", "Start Automating Your WhatsApp Today"],
    ["১৪ দিনের ফ্রি ট্রায়াল। ক্রেডিট কার্ডের প্রয়োজন নেই।", "14-day free trial. No credit card required."],
    ["আপনার ফ্রি অ্যাকাউন্ট শুরু করুন 🚀", "Claim Your Free Account 🚀"],
    ["ওয়ার্কফ্লো ও লাইভ ট্রিগার তৈরি করুন", "Build Workflows & Live Triggers"],
    ["AI কে ২৪/৭ সেলস ও সাপোর্ট দিতে দিন", "Let AI Sell & Support 24/7"],

    // Features Page Specific
    ["একটি সমন্বিত প্ল্যাটফর্ম যাতে রয়েছে এন্টারপ্রাইজ হোয়াটসঅ্যাপ কানেক্টিভিটি, সর্বাধুনিক LLM, CRM লিড ম্যানেজমেন্ট এবং ভিজ্যুয়াল ওয়ার্কফ্লো অটোমেশন।", "A unified platform combining enterprise WhatsApp connectivity, cutting-edge LLMs, CRM lead management, and visual workflow automation."],
    ["একটি সমন্বিত ইন্টারফেসে একাধিক হোয়াটসঅ্যাপ নম্বরের চ্যাট পরিচালনা করুন। স্ট্যাটাস ফিল্টার, এজেন্ট অ্যাসাইন, কন্টাক্ট ট্যাগ এবং সম্পূর্ণ বায়িং হিস্ট্রি দেখুন।", "Handle chats from multiple WhatsApp numbers in one synchronized interface. Filter by status, assign agents, tag contacts, and view complete buyer history."],
    ["১-ক্লিক AI সাজেশন সহ কো-পাইলট মোড", "Co-pilot mode with 1-click AI suggestions"],
    ["একাধিক এজেন্টের একসাথে চ্যাট হ্যান্ডলিং", "Multi-agent concurrent chat assignment"],
    ["টিম এজেন্টদের নিজস্ব অভ্যন্তরীণ নোট", "Internal agent private notes"],
    ["আপনার নির্দিষ্ট ক্যাটালগ, FAQ ও PDF ডকুমেন্টে ট্রেইন্ড বিশেষায়িত GPT-4o এবং Claude 3.5 পার্সোনা। স্বাভাবিক বাংলা, ইংরেজি ও বাংলিশে তাৎক্ষণিক উত্তর দেয়।", "Deploy specialized GPT-4o and Claude 3.5 personas trained on your exact catalogs, FAQs, and PDF docs. Responds in natural Bangla, English, or Romanized text."],
    ["এক সেকেন্ডেরও কম সময়ে তাৎক্ষণিক উত্তর", "Instant sub-second response latency"],
    ["ভ্রান্তিমুক্ত (জিরো হ্যালুসিনেশন) ভেক্টর এমবেডিং", "Hallucination-free vector embedding retrieval"],
    ["স্বয়ংক্রিয় হিউম্যান এজেন্ট হ্যান্ডঅফ", "Automatic human fallback handoff"],
    ["নো-কোড ক্যানভাস বিল্ডারে মাল্টি-ব্রাঞ্চ কাস্টমার জার্নি ডিজাইন করুন। কিওয়ার্ড ম্যাচ, সময়সূচী বা ওয়েবহুক ইভেন্টের ভিত্তিতে স্বয়ংক্রিয় অ্যাকশন পরিচালনা করুন।", "Design multi-branch customer journeys with no-code canvas builder. Trigger actions based on keyword matches, schedule hours, or external webhook events."],
    ["কাস্টম ড্র্যাগ-অ্যান্ড-ড্রপ নোড লজিক", "Custom drag-and-drop node logic"],
    ["ওয়েবহুক ও Zapier/n8n ইন্টিগ্রেশন", "Webhooks & Zapier/n8n triggers"],
    ["টাইম-বেসড মেসেজ সিকোয়েন্স ও ড্রিপ", "Time-based sequences & drip campaigns"],
    ["লিড কোয়ালিফাই করুন এবং কাস্টম কানবান কলামে মুভ করুন। অটোমেটিক লাইফসাইকেল ট্র্যাকিং এবং টিম কোল্যাবরেশন।", "Qualify inbound leads and move through Kanban deal stages. Real-time lifecycle tracking, auto-tagging, and high-value deal alerts."],
    ["অফিসিয়াল ক্লাউড API দিয়ে বাল্ক মেসেজিং করুন। অপ্ট-ইন ভেরিফিকেশন এবং স্মার্ট রেট-লিমিটিং যাতে কোনো ব্যান না হয়।", "Broadcast personalized marketing and utility notifications with official Cloud API or smart delay pacing. Zero risk of account bans."],
    ["চ্যাটের ভেতর সরাসরি প্রোডাক্ট ক্যাটালগ দেখান এবং পেমেন্ট লিংক পাঠান। ইনকমপ্লিট কার্ট রিকভারিতে ৭৫%+ কনভার্সন।", "Share product catalogs, generate instant payment links, and recover dropped cart checkouts directly within customer chats."],
    ["হাই-কনভার্টিং ইমেইল ক্যাম্পেইন পাঠান এবং সরাসরি রিপ্লাই ট্র্যাক করুন। একসাথে মাল্টি-চ্যানেল আউটরিচ।", "High-deliverability SMTP relay engine. Launch scheduled blasts, track open rates, and nurture leads across WhatsApp and email simultaneously."],

    // Documentation & Help
    ["ডকুমেন্টেশন ও ডেভেলপার গাইড", "Documentation & Developer Guides"],
    ["NEXORAAI প্ল্যাটফর্মের সম্পূর্ণ সেটআপ, API রেফারেন্স ও অটোমেশন গাইড।", "Complete setup guides, API references, and automation walk-throughs for the NEXORAAI platform."],
    ["জনপ্রিয় আর্টিকেলে ব্রাউজ করুন", "Browse Popular Articles"],
    ["কীভাবে হোয়াটসঅ্যাপ ক্লাউড API কানেক্ট করবেন", "How to connect WhatsApp Cloud API"],
    ["৫ মিনিটের মধ্যে আপনার অফিসিয়াল হোয়াটসঅ্যাপ বিজনেস অ্যাকাউন্ট যুক্ত করার সম্পূর্ণ গাইড।", "Step-by-step walkthrough to get your official Meta WhatsApp Business Cloud API active in under 5 minutes."],
    ["আপনার ক্যাটালগ দিয়ে AI বট ট্রেনিং", "Training your AI agent with business catalogs"],
    ["PDF আপলোড ও ওয়েবসাইট ক্রলিং করে কীভাবে বটকে নিখুঁত তথ্য শেখাবেন।", "Learn how vector chunking and embeddings give your AI chatbot accurate answers with zero hallucinations."],
    ["ড্রপ-অফ অর্ডার রিকভারি সেটআপ", "Setting up abandoned checkout recovery"],
    ["ওয়েবসাইট থেকে অসমাপ্ত অর্ডার স্বয়ংক্রিয়ভাবে হোয়াটসঅ্যাপ মেসেজে রূপান্তর করার পদ্ধতি।", "Automatically capture dropped customer numbers and send high-converting discount recovery sequences."],
    ["ওয়েবহুক ও n8n অটোমেশন ওয়ার্কফ্লো", "Webhooks & n8n automation workflows"],
    ["যেকোনো বাহ্যিক সফটওয়্যার বা CRM-এর সাথে NEXORAAI রিয়েল-টাইমে যুক্ত করার উপায়।", "Connect external apps, Google Sheets, WooCommerce, and custom webhooks seamlessly."],
    ["সহায়তা প্রয়োজন? আমাদের টিম প্রস্তুত", "Need direct assistance? Our team is standing by"],
    ["২৪/৭ সার্বক্ষণিক হোয়াটসঅ্যাপ সহায়তা ও ডেডিকেটেড একাউন্ট ম্যানেজার।", "24/7 dedicated support via WhatsApp, live chat, and scheduled onboarding calls."],

    // FAQ & Help
    ["সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর", "Frequently Asked Questions"],
    ["প্রশ্ন বা বিষয় লিখে সার্চ করুন...", "Search articles, guides, or questions..."],
    ["সব ক্যাটাগরি", "All Categories"],
    ["শুরু করার নির্দেশিকা", "Getting Started"],
    ["হোয়াটসঅ্যাপ API ও সেশন", "WhatsApp API & Sessions"],
    ["AI এজেন্ট ও ট্রেনিং", "AI Agents & Training"],
    ["বিলিং ও প্রাইসিং", "Billing & Pricing"],
    ["নিরাপত্তা ও কমপ্লায়েন্স", "Security & Compliance"],
    ["আরও প্রশ্ন আছে?", "Still have questions?"],
    ["হোয়াটসঅ্যাপে সরাসরি আমাদের ইঞ্জিনিয়ার ও প্রোডাক্ট টিমের সাথে কথা বলুন অথবা একটি ডেমো বুক করুন।", "Talk to our engineering & product team directly on WhatsApp or book a custom walkthrough demo."],
    ["হোয়াটসঅ্যাপে চ্যাট করুন", "Chat on WhatsApp"],
    ["একটি ডেমো বুক করুন", "Book a Demo"],

    // Contact
    ["যোগাযোগ করুন", "GET IN TOUCH"],
    ["আপনার হোয়াটসঅ্যাপ স্ট্র্যাটেজি নিয়ে আলোচনা করি", "Let’s Talk About Your WhatsApp Strategy"],
    ["আপনার পুরো নাম", "Your Full Name"],
    ["ব্যবসায়িক ইমেইল", "Business Email"],
    ["হোয়াটসঅ্যাপ নম্বর", "WhatsApp Number"],
    ["কোম্পানির নাম", "Company Name"],
    ["মাসিক আনুমানিক ভলিউম", "Estimated Monthly Volume"],
    ["আপনার মেসেজ বা রিকোয়ারমেন্ট", "Your Message or Requirements"],
    ["মেসেজ পাঠান", "Send Message"],
    ["সরাসরি সাপোর্ট লাইন", "Direct Support Line"],
    ["এন্টারপ্রাইজ সেলস", "Enterprise Sales"],
    ["রেসপন্স SLA", "Response SLA"],
    ["অফিস চলাকালীন ১৫ মিনিটের মধ্যে", "Under 15 minutes during business hours"],
    ["অফিসের ঠিকানা", "Office Location"],
    ["ঢাকা, বাংলাদেশ এবং গ্লোবাল ক্লাউড ইনফ্রাস্ট্রাকচার", "Dhaka, Bangladesh & Cloud Infrastructure Global"],

    // Auth & Accounts
    ["স্বাগতম", "Welcome back"],
    ["আপনার অ্যাকাউন্টে সাইন ইন করুন", "Sign in to your NEXORAAI account"],
    ["গুগল দিয়ে প্রবেশ করুন", "Continue with Google"],
    ["অথবা ইমেইল দিয়ে", "Or continue with email"],
    ["ইমেইল অ্যাড্রেস", "Email Address"],
    ["পাসওয়ার্ড", "Password"],
    ["পাসওয়ার্ড নিশ্চিত করুন", "Confirm Password"],
    ["মনে রাখুন", "Remember me"],
    ["পাসওয়ার্ড ভুলে গেছেন?", "Forgot password?"],
    ["অ্যাকাউন্ট নেই? শুরু করুন ফ্রি", "Don't have an account? Start Free Trial"],
    ["ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন", "Already have an account? Sign in"],
    ["আপনার অ্যাকাউন্টটি অনুমোদনের অপেক্ষায় রয়েছে", "Your account is pending approval"],
    ["পাসওয়ার্ড রিসেট করুন", "Reset Password"],
    ["রিসেট লিংক পাঠান", "Send Reset Link"],
    ["লগইনে ফিরে যান", "Back to Login"],
    ["নতুন পাসওয়ার্ড সেট করুন", "Set New Password"],
    ["পাসওয়ার্ড পরিবর্তন করুন", "Update Password"]
  ];

  // Build bidirectional lookup maps
  const bnToEnMap = new Map();
  const enToBnMap = new Map();

  PHRASE_PAIRS.forEach(([bn, en]) => {
    const cleanBn = bn.trim().toLowerCase();
    const cleanEn = en.trim().toLowerCase();
    bnToEnMap.set(cleanBn, en.trim());
    enToBnMap.set(cleanEn, bn.trim());
  });

  // Current language state
  let currentLang = 'bn';
  try {
    currentLang = localStorage.getItem(STORAGE_KEY) || 'bn';
  } catch (e) {
    currentLang = 'bn';
  }

  /**
   * Translates a single text string losslessly based on target language
   */
  /**
   * Translates a single text string losslessly based on target language
   */
  function translatePhrase(text, targetLang) {
    if (!text || typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (!trimmed) return null;
    const lower = trimmed.toLowerCase();

    // 1. Never convert IP addresses (IPv4 or IPv6, e.g. 118.67.214.12, 103.145.23.4)
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/\d+)?$/.test(trimmed)) {
      return null;
    }

    // 2. Never convert emails, domains, API keys, hashes, transaction IDs (e.g. ch_3OqF..., key_live_...)
    if (
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(trimmed) ||
      /^https?:\/\//i.test(trimmed) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed) ||
      /^(ch_|key_|sk_|pk_|sb_|api_|wh_)[a-zA-Z0-9_-]+$/i.test(trimmed)
    ) {
      return null;
    }

    const isEn = enToBnMap.has(lower);
    const isBn = bnToEnMap.has(lower);

    if (targetLang === 'en') {
      if (isEn) return trimmed; // already English
      if (isBn) return bnToEnMap.get(lower);
      if (/^[০-৯,\.৳\+\/\%\s\-\:\(\)\>\✓\🚀\🤖\⚡\💬\📄\🌐]+$/.test(trimmed)) {
        return toEnDigits(trimmed);
      }
    } else {
      if (isBn) return trimmed; // already Bengali
      if (isEn) return enToBnMap.get(lower);
      // Only convert plain display prices, counts or percentages (not IP addresses or versions)
      if (
        /^([0-9]{1,3}(,[0-9]{3})*|[0-9]+)(\s*(৳|\$|%|\/mo|\/month|\/মাস|\/বছর|\+))?$/.test(trimmed) ||
        /^(৳|\$)\s*[0-9,]+(\.[0-9]+)?$/.test(trimmed)
      ) {
        return toBnDigits(trimmed);
      }
    }
    return null;
  }

  /**
   * Applies translations to all [data-i18n] elements
   */
  function applyDataI18n(lang) {
    const dict = Object.assign({}, I18N_MASTER[lang] || {}, (window.I18N_DICT && window.I18N_DICT[lang]) || {});

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

    // Special handlers for specific pricing and numerical values
    const starterPrice = document.getElementById('starterPrice');
    const proPrice = document.getElementById('proPrice');
    const busPrice = document.getElementById('busPrice');
    const billingCycle = document.getElementById('billingCycle');
    const isAnnual = billingCycle && billingCycle.checked;

    if (starterPrice) {
      starterPrice.innerText = lang === 'bn' ? (isAnnual ? '৳ ৫৫৯' : '৳ ৬৯৯') : (isAnnual ? '৳ 559' : '৳ 699');
    }
    if (proPrice) {
      proPrice.innerText = lang === 'bn' ? (isAnnual ? '৳ ২,৩৯৯' : '৳ ২,৯৯৯') : (isAnnual ? '৳ 2,399' : '৳ 2,999');
    }
    if (busPrice) {
      busPrice.innerText = lang === 'bn' ? (isAnnual ? '৳ ৩,৯৯৯' : '৳ ৪,৯৯৯') : (isAnnual ? '৳ 3,999' : '৳ 4,999');
    }
  }

  /**
   * Walks DOM text nodes and UI elements to translate phrases not covered by data-i18n
   */
  function autoTranslateDOM(lang) {
    const selectors = 'h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, .badge, .plan-name, .price-num, .price-amount, .price-period, .stat-number, .mini-stat-value, .mini-stat-label, .sidebar-item-label, .sidebar-group-label, .step-number';
    
    document.querySelectorAll(selectors).forEach(el => {
      if (el.getAttribute('data-i18n')) return;

      // Skip elements that should never be translated (code, monospace, IP addresses, etc.)
      if (
        el.hasAttribute('data-no-translate') ||
        el.closest('[data-no-translate]') ||
        el.closest('code, pre, .font-mono') ||
        (el.style && el.style.fontFamily && el.style.fontFamily.includes('mono'))
      ) {
        return;
      }

      // When element has no child element tags (plain text container)
      if (el.children.length === 0) {
        const raw = el.textContent;
        const trimmed = raw.trim();
        if (!trimmed) return;

        if (!el._origText) {
          el._origText = trimmed;
        }

        const trans = translatePhrase(el._origText, lang);
        if (trans !== null && trans !== trimmed) {
          el.textContent = trans;
        }
        return;
      }

      // When element has child elements/spans, translate individual text nodes safely
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const raw = node.nodeValue;
          const trimmed = raw.trim();
          if (!trimmed) return;

          if (!node._origText) {
            node._origText = trimmed;
          }

          const trans = translatePhrase(node._origText, lang);
          if (trans !== null && trans !== trimmed) {
            node.nodeValue = raw.replace(trimmed, trans);
          }
        }
      });
    });

    // Also translate input placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
      if (input.getAttribute('data-i18n')) return;
      const origPh = input.getAttribute('data-orig-ph') || input.placeholder;
      if (!input.hasAttribute('data-orig-ph')) {
        input.setAttribute('data-orig-ph', origPh);
      }
      const transPh = translatePhrase(origPh, lang);
      if (transPh !== null) {
        input.placeholder = transPh;
      }
    });
  }

  /**
   * Ensures every page has an accessible, elegant EN / BN toggle button
   */
  function ensureLanguageToggleUI(lang) {
    let existingToggles = document.querySelectorAll('#langBtnEN, #langBtnBN, #langMobileBtnEN, #langMobileBtnBN');

    if (existingToggles.length === 0) {
      // Find suitable insertion target
      const targetHeaderActions = document.querySelector('.header-actions');
      const targetTopbarRight = document.querySelector('.dash-topbar .topbar-right');
      const targetSiteNav = document.querySelector('.site-nav');
      const targetSiteHeaderInner = document.querySelector('.site-header .header-inner');

      const toggleHTML = `
        <div class="lang-toggle-wrap" id="langToggleWrap" role="group" aria-label="Language selection" style="margin-right:8px">
          <button type="button" class="lang-pill-btn ${lang === 'en' ? 'active' : ''}" id="langBtnEN" onclick="switchSiteLang('en')" title="Switch to English">EN</button>
          <button type="button" class="lang-pill-btn ${lang === 'bn' ? 'active' : ''}" id="langBtnBN" onclick="switchSiteLang('bn')" title="বাংলায় পরিবর্তন করুন">BN</button>
        </div>
      `;

      if (targetHeaderActions) {
        targetHeaderActions.insertAdjacentHTML('afterbegin', toggleHTML);
      } else if (targetTopbarRight) {
        targetTopbarRight.insertAdjacentHTML('afterbegin', toggleHTML);
      } else if (targetSiteHeaderInner) {
        const wrap = document.createElement('div');
        wrap.className = 'header-actions';
        wrap.innerHTML = toggleHTML;
        targetSiteHeaderInner.appendChild(wrap);
      } else if (targetSiteNav) {
        targetSiteNav.insertAdjacentHTML('afterend', toggleHTML);
      } else {
        // Floating toggle fallback on bottom-right
        const floatToggle = document.createElement('div');
        floatToggle.id = 'floatingLangToggle';
        floatToggle.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;background:var(--bg-card,#12181B);padding:6px 10px;border-radius:24px;border:1px solid var(--border,#263339);box-shadow:0 8px 24px rgba(0,0,0,0.5);display:flex;align-items:center;gap:6px;';
        floatToggle.innerHTML = toggleHTML;
        document.body.appendChild(floatToggle);
      }
    }

    // Synchronize active states
    document.querySelectorAll('#langBtnBN, #langMobileBtnBN').forEach(btn => {
      btn.classList.toggle('active', lang === 'bn');
    });
    document.querySelectorAll('#langBtnEN, #langMobileBtnEN').forEach(btn => {
      btn.classList.toggle('active', lang === 'en');
    });
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  /**
   * Main language switch handler
   */
  function switchSiteLang(lang, showToast = true) {
    const targetLang = lang === 'en' ? 'en' : 'bn';
    currentLang = targetLang;

    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
    } catch (e) {
      console.warn('LocalStorage not available for i18n:', e);
    }

    document.documentElement.lang = targetLang;

    // 1. Update toggle UI
    ensureLanguageToggleUI(targetLang);

    // 2. Apply [data-i18n] attributes
    applyDataI18n(targetLang);

    // 3. Apply DOM phrase translations
    autoTranslateDOM(targetLang);

    // 4. Update title if needed
    if (targetLang === 'en' && document.title.includes('— হোয়াটসঅ্যাপ API')) {
      document.title = 'NEXORAAI — WhatsApp Cloud API, AI Automations & Lead Management Platform';
    } else if (targetLang === 'bn' && document.title.includes('— WhatsApp Cloud API')) {
      document.title = 'NEXORAAI — হোয়াটসঅ্যাপ API + AI অটোমেশন + স্মার্ট লিড ও ড্রপ-অফ অর্ডার রিকভারি';
    }

    // 5. Toast feedback
    if (showToast) {
      const msg = targetLang === 'en' ? 'Switched to English' : 'বাংলা ভাষায় পরিবর্তিত হয়েছে';
      if (window.Toast && typeof window.Toast.show === 'function') {
        window.Toast.show(msg, 'info');
      } else if (typeof window.showToast === 'function') {
        window.showToast(msg, 'info');
      }
    }

    // 6. Broadcast event
    window.dispatchEvent(new CustomEvent('nexora-lang-change', { detail: { lang: targetLang } }));
  }

  // Initialize on script execution or DOM ready
  function init() {
    ensureLanguageToggleUI(currentLang);
    switchSiteLang(currentLang, false);

    // Attach click listeners to all buttons
    document.querySelectorAll('#langBtnBN, #langMobileBtnBN').forEach(btn => {
      btn.onclick = (e) => { e.preventDefault(); switchSiteLang('bn'); };
    });
    document.querySelectorAll('#langBtnEN, #langMobileBtnEN').forEach(btn => {
      btn.onclick = (e) => { e.preventDefault(); switchSiteLang('en'); };
    });

    // Listen for storage changes across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue && e.newValue !== currentLang) {
        switchSiteLang(e.newValue, false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to window
  window.switchSiteLang = switchSiteLang;
  window.I18N_MASTER = I18N_MASTER;
  window.LanguageManager = {
    init,
    setLanguage: switchSiteLang,
    applyLang: (l) => switchSiteLang(l, false),
    getLang: () => currentLang
  };

})();
