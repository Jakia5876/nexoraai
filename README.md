# NEXORAAI — WhatsApp API + AI Automation + Lead Management SaaS

<div align="center">
  <h3>The All-in-One WhatsApp API, AI Conversational Automation, CRM & Workflow Platform</h3>
</div>

---

## ⚡ Overview

**NEXORAAI** is a complete, multi-tenant B2B SaaS platform engineered for modern businesses to connect WhatsApp, automate intelligent customer conversations with grounded AI personas, manage CRM pipelines, and build visual automation workflows.

- **Brand Name**: NEXORAAI
- **Primary Color**: Lemon Green (`#D9F000`)
- **Theme**: Dark-first SaaS aesthetic (`#06090B`)

---

## 🚀 Key Features

1. **Multi-Session WhatsApp Management**: Connect and monitor multiple WhatsApp numbers with real-time health checks and QR generation.
2. **Unified Omnichannel Inbox**: 3-column desktop layout with rich media messages, audio playback, document viewer, and AI Co-Pilot response suggestions.
3. **AI Personas & RAG Knowledge Base**: Grounded autonomous responders using GPT-4o, Claude 3.5, and vector embeddings with strict fallback guardrails.
4. **CRM & Visual Pipeline**: Interactive Kanban board (New, Contacted, Qualified, Proposal, Won, Lost) with deal value calculations.
5. **AI Lead Intelligence & Research**: Query verified B2B leads by location and industry without scraping bans or anti-bot violations.
6. **Visual Workflow Canvas**: Node-based automation engine supporting Triggers, Conditions, Delays, AI Actions, and Webhooks.
7. **First-Class n8n Integration**: Dedicated bi-directional integration with downloadable JSON workflows and instant webhook dispatchers.
8. **WhatsApp Commerce & Invoicing**: Product catalog synchronized with Meta Commerce and multi-gateway order management (bKash, Nagad, Stripe).
9. **Developer REST API & Webhooks**: 3-column interactive developer portal (`/pages/api-docs.html`) with code snippets in cURL, JavaScript, Python, and PHP.
10. **Super Admin Control Center**: Macro analytics, tenant suspension/activation, dynamic plan pricing editor, and audit logs.

---

## 📁 Repository Structure

```
├── assets/
│   ├── css/
│   │   ├── design-system.css    # Complete CSS tokens, color system, and components
│   │   ├── dashboard.css        # Multi-panel layouts, Kanban, and sidebar styles
│   │   └── homepage.css         # Hero animations and landing page layout
│   ├── js/
│   │   ├── app.js               # Theme switcher, modals, and toasts
│   │   ├── dashboard.js         # Shared shell & Global Command Palette (Ctrl + K)
│   │   ├── homepage.js          # Interactive landing page widgets
│   │   └── supabase-config.js   # Client-safe Supabase configuration
│   └── images/
│       └── README.md            # Official logo drop location
├── pages/                       # 45 standalone application routes
│   ├── dashboard*.html          # 21 User Dashboard modules
│   ├── admin.html               # Super Admin Control Center
│   ├── onboarding.html          # 6-step interactive wizard
│   ├── login.html               # Authentication login
│   ├── register.html            # 14-day free trial registration
│   ├── forgot-password.html     # Secure password recovery
│   ├── api-docs.html            # 3-column Developer API Documentation
│   └── ...                      # Public marketing and compliance pages
├── supabase/
│   ├── full_setup.sql           # ONE FILE: paste this into the SQL Editor (schema + auth + security)
│   ├── schema.sql               # (part 1) Tables + indexes
│   └── 02_auth_and_security.sql # 2) Sign-up trigger, super admin, RLS on every table
├── index.html                   # Public Homepage & interactive simulator
└── .gitignore                   # Excludes secrets, credentials, and temp files
```

---

## 🗄️ Database Setup (Supabase)

Easiest: paste all of `supabase/full_setup.sql` into the Supabase **SQL Editor** and click Run (safe to run twice). It is schema.sql + 02_auth_and_security.sql combined. Or run them separately, in order:
1. `supabase/schema.sql` — creates all tables and indexes.
2. `supabase/02_auth_and_security.sql` — sign-up trigger (profile + workspace + owner membership), `super_admins` table, Row Level Security on every table, anonymous access removed. Safe to re-run.
3. Register on the site with your admin email, confirm it, then run the commented `INSERT INTO public.super_admins ...` block at the bottom of file 2 once. That is what unlocks `admin.html`. No admin password lives in this code.

In **Supabase → Authentication → URL Configuration**, set the Site URL to your Vercel domain and add `https://YOUR-DOMAIN/pages/login.html` and `https://YOUR-DOMAIN/pages/reset-password.html` to Redirect URLs.

---

## 🔒 Security Best Practices

- Frontend assets use client-safe anonymous keys (`VITE_SUPABASE_ANON_KEY`) strictly governed by PostgreSQL RLS.
- Sensitive credentials (`SUPABASE_SERVICE_ROLE_KEY`, Database Passwords, JWT Secrets) are strictly isolated in local `.env` files and never committed to git.

---

## 📄 License & Compliance

© 2026 NEXORAAI. All rights reserved.
Built in compliance with the Meta WhatsApp Business Solution Provider policies and regional data privacy standards.
