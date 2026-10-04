-- ============================================================
-- NEXORAAI — FULL SETUP (paste this whole file into Supabase SQL Editor and click Run)
-- = schema.sql (tables) + 02_auth_and_security.sql (auth trigger, RLS, super admin)
-- Safe to run more than once.
-- ============================================================

-- ============================================================
-- NEXORAAI — COMPLETE PRODUCTION POSTGRESQL DATABASE SCHEMA
-- MULTI-TENANT ARCHITECTURE WITH ROW LEVEL SECURITY (RLS)
-- VERSION: 1.0
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES (Extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Dhaka',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ORGANIZATIONS (Multi-Tenant Workspaces)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  owner_id UUID NOT NULL,
  country TEXT DEFAULT 'BD',
  timezone TEXT DEFAULT 'Asia/Dhaka',
  industry TEXT,
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trialing')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. ORGANIZATION MEMBERS & RBAC
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'manager', 'agent', 'support', 'viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============================================================
-- 4. PLANS (Dynamic Pricing & Quotas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  monthly_price NUMERIC(10,2) NOT NULL,
  yearly_price NUMERIC(10,2) NOT NULL,
  trial_days INTEGER DEFAULT 14,
  whatsapp_limit INTEGER DEFAULT 1,
  message_limit INTEGER DEFAULT 5000,
  contact_limit INTEGER DEFAULT 2500,
  lead_limit INTEGER DEFAULT 1000,
  campaign_limit INTEGER DEFAULT 20,
  automation_limit INTEGER DEFAULT 5,
  ai_limit INTEGER DEFAULT 500000,
  team_member_limit INTEGER DEFAULT 2,
  storage_limit BIGINT DEFAULT 1073741824, -- 1 GB
  api_access BOOLEAN DEFAULT FALSE,
  webhook_access BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  provider TEXT DEFAULT 'manual' CHECK (provider IN ('stripe', 'bkash', 'nagad', 'sslcommerz', 'manual')),
  provider_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. USAGE (Quotas & Telemetry)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  ai_requests INTEGER DEFAULT 0,
  contacts INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  campaigns INTEGER DEFAULT 0,
  automation_runs INTEGER DEFAULT 0,
  api_requests INTEGER DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, date)
);

-- ============================================================
-- 7. WHATSAPP SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  phone_number TEXT,
  provider TEXT NOT NULL DEFAULT 'meta_cloud' CHECK (provider IN ('meta_cloud', 'baileys_qr', 'wppconnect')),
  provider_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'connecting', 'disconnected', 'expired', 'error')),
  qr_code TEXT,
  last_connected_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CONTACTS & TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  company TEXT,
  website TEXT,
  address TEXT,
  source TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'blocked')),
  assigned_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#D9F000',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_tag_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.contact_tags(id) ON DELETE CASCADE,
  UNIQUE(contact_id, tag_id)
);

-- ============================================================
-- 9. CONVERSATIONS & MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  whatsapp_session_id UUID REFERENCES public.whatsapp_sessions(id) ON DELETE SET NULL,
  assigned_user_id UUID,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('contact', 'agent', 'bot', 'system')),
  sender_id UUID,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'location', 'contact', 'button', 'list', 'template')),
  content TEXT,
  media_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
  external_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. LEADS & PIPELINE (CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  company TEXT,
  website TEXT,
  address TEXT,
  category TEXT,
  rating NUMERIC(2,1) DEFAULT 0.0,
  source TEXT DEFAULT 'whatsapp',
  pipeline_stage TEXT NOT NULL DEFAULT 'new' CHECK (pipeline_stage IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  assigned_user_id UUID,
  value NUMERIC(12,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. AI AGENTS & KNOWLEDGE BASE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  system_prompt TEXT NOT NULL,
  tone TEXT DEFAULT 'helpful',
  language TEXT DEFAULT 'en,bn',
  model TEXT DEFAULT 'gpt-4o',
  temperature NUMERIC(2,1) DEFAULT 0.3,
  max_response_length INTEGER DEFAULT 300,
  human_handoff_enabled BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  knowledge_base_id UUID NOT NULL REFERENCES public.knowledge_bases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  content TEXT,
  status TEXT DEFAULT 'indexed' CHECK (status IN ('processing', 'indexed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. CAMPAIGNS & BROADCASTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'sms')),
  audience_type TEXT DEFAULT 'tag',
  message TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed', 'failed')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaign_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS public.broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT DEFAULT 'whatsapp',
  message TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. AUTOMATIONS & FLOW NODES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automation_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL,
  node_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  position_x NUMERIC(10,2) DEFAULT 0,
  position_y NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
  trigger_data JSONB DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- 14. PRODUCTS & COMMERCE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  sale_price NUMERIC(12,2),
  stock INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) DEFAULT 0,
  shipping NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL
);

-- ============================================================
-- 15. API KEYS & WEBHOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- SHA-256 / bcrypt hash
  permissions JSONB DEFAULT '["*"]'::jsonb,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_hash TEXT NOT NULL,
  events TEXT[] NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  retry_count INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. PAYMENTS & INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'bkash', 'nagad', 'sslcommerz', 'manual')),
  provider_payment_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'BDT',
  status TEXT NOT NULL CHECK (status IN ('successful', 'pending', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'BDT',
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'void')),
  invoice_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- ============================================================
-- 17. NOTIFICATIONS & SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  assigned_to UUID,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  internal_note BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 18. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 19. PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON public.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_conversations_org ON public.conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_conv ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_orders_org ON public.orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);

-- ============================================================
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to verify organization membership
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample RLS Policy for Organizations
DROP POLICY IF EXISTS "Users can view their member organizations" ON public.organizations;
CREATE POLICY "Users can view their member organizations"
ON public.organizations FOR SELECT
USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));

-- Sample RLS Policy for Contacts
DROP POLICY IF EXISTS "Tenant isolation for contacts" ON public.contacts;
CREATE POLICY "Tenant isolation for contacts"
ON public.contacts FOR ALL
USING (public.is_org_member(organization_id))
WITH CHECK (public.is_org_member(organization_id));

-- Sample RLS Policy for Leads
DROP POLICY IF EXISTS "Tenant isolation for leads" ON public.leads;
CREATE POLICY "Tenant isolation for leads"
ON public.leads FOR ALL
USING (public.is_org_member(organization_id))
WITH CHECK (public.is_org_member(organization_id));

-- ============================================================
-- 21. DEFAULT SUPER ADMIN SEED (jakiadantal@gmail.com)
-- ============================================================
-- Primary System Administrator:
-- Email: jakiadantal@gmail.com
-- Role: Owner & Super Administrator
-- To link after Supabase auth registration:
-- INSERT INTO public.profiles (user_id, full_name, email)
-- VALUES (auth.uid(), 'Jakia Dantal', 'jakiadantal@gmail.com')
-- ON CONFLICT (user_id) DO UPDATE SET email = 'jakiadantal@gmail.com', full_name = 'Jakia Dantal';



-- ============================================================
-- NEXORAAI — 02: AUTH + SECURITY MIGRATION
-- Run AFTER schema.sql in the Supabase SQL Editor. Safe to re-run.
--
-- What this does:
--   1. Super-admin table + helper functions (no passwords in code)
--   2. Auto-create profile + organization + owner membership on sign-up
--   3. Row Level Security ON for every table, with tenant-isolation policies
--   4. Removes all anonymous access except reading active plans
--
-- Client-side writes to subscriptions / payments / invoices / usage are
-- intentionally NOT allowed: do those from a server using the service-role key.
-- ============================================================

-- ------------------------------------------------------------
-- 1. SUPER ADMINS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.super_admins WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid() AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
      AND status = 'active' AND role IN ('owner', 'admin')
  );
$$;

-- ------------------------------------------------------------
-- 2. NEW USER TRIGGER (profile + organization + owner membership)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), split_part(NEW.email, '@', 1));
  v_business TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'business_name', ''), v_name || ' Workspace');
  v_country TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'country', ''), 'BD');
  v_org UUID;
  v_plan UUID;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone)
  VALUES (NEW.id, v_name, NEW.email, NULLIF(NEW.raw_user_meta_data->>'phone', ''))
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.organizations (name, slug, owner_id, country, status)
  VALUES (
    v_business,
    COALESCE(NULLIF(trim(both '-' from lower(regexp_replace(v_business, '[^a-zA-Z0-9]+', '-', 'g'))), ''), 'workspace')
      || '-' || substr(replace(NEW.id::text, '-', ''), 1, 6),
    NEW.id, left(v_country, 2), 'trialing'
  )
  RETURNING id INTO v_org;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (v_org, NEW.id, 'owner');

  SELECT id INTO v_plan FROM public.plans WHERE active ORDER BY monthly_price ASC LIMIT 1;
  IF v_plan IS NOT NULL THEN
    INSERT INTO public.subscriptions (organization_id, plan_id, status, trial_end)
    VALUES (v_org, v_plan, 'trialing', NOW() + INTERVAL '14 days');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY: ENABLE ON EVERY TABLE
-- ------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Drop the old sample policies from schema.sql
DROP POLICY IF EXISTS "Users can view their member organizations" ON public.organizations;
DROP POLICY IF EXISTS "Tenant isolation for contacts" ON public.contacts;
DROP POLICY IF EXISTS "Tenant isolation for leads" ON public.leads;

-- ------------------------------------------------------------
-- 4. POLICIES: IDENTITY TABLES
-- ------------------------------------------------------------
-- super_admins: a user may only see their own row; no client writes.
DROP POLICY IF EXISTS "super_admins self read" ON public.super_admins;
CREATE POLICY "super_admins self read" ON public.super_admins
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- profiles
DROP POLICY IF EXISTS "profiles own read" ON public.profiles;
DROP POLICY IF EXISTS "profiles own update" ON public.profiles;
CREATE POLICY "profiles own read" ON public.profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "profiles own update" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- organizations
DROP POLICY IF EXISTS "orgs member read" ON public.organizations;
DROP POLICY IF EXISTS "orgs admin update" ON public.organizations;
DROP POLICY IF EXISTS "orgs superadmin all" ON public.organizations;
CREATE POLICY "orgs member read" ON public.organizations
  FOR SELECT TO authenticated USING (public.is_org_member(id) OR public.is_super_admin());
CREATE POLICY "orgs admin update" ON public.organizations
  FOR UPDATE TO authenticated USING (public.is_org_admin(id)) WITH CHECK (public.is_org_admin(id));
CREATE POLICY "orgs superadmin all" ON public.organizations
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- organization_members
DROP POLICY IF EXISTS "members read" ON public.organization_members;
DROP POLICY IF EXISTS "members admin write" ON public.organization_members;
CREATE POLICY "members read" ON public.organization_members
  FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR user_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "members admin write" ON public.organization_members
  FOR ALL TO authenticated
  USING (public.is_org_admin(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_admin(organization_id) OR public.is_super_admin());

-- plans: anyone can read active plans (pricing page); only super admin edits
DROP POLICY IF EXISTS "plans public read" ON public.plans;
DROP POLICY IF EXISTS "plans superadmin write" ON public.plans;
CREATE POLICY "plans public read" ON public.plans
  FOR SELECT TO anon, authenticated USING (active OR public.is_super_admin());
CREATE POLICY "plans superadmin write" ON public.plans
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- notifications: own, or org-wide (user_id IS NULL) for members
DROP POLICY IF EXISTS "notifications own" ON public.notifications;
CREATE POLICY "notifications own" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR (user_id IS NULL AND public.is_org_member(organization_id)))
  WITH CHECK (user_id = auth.uid() OR (user_id IS NULL AND public.is_org_member(organization_id)));

-- audit_logs: org admins read; members may append their own entries
DROP POLICY IF EXISTS "audit admin read" ON public.audit_logs;
DROP POLICY IF EXISTS "audit member insert" ON public.audit_logs;
CREATE POLICY "audit admin read" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_org_admin(organization_id) OR public.is_super_admin());
CREATE POLICY "audit member insert" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_org_member(organization_id) AND user_id = auth.uid());

-- ------------------------------------------------------------
-- 5. POLICIES: TENANT DATA (members read + write)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "contacts tenant isolation" ON public.contacts;
CREATE POLICY "contacts tenant isolation" ON public.contacts FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "contact_tags tenant isolation" ON public.contact_tags;
CREATE POLICY "contact_tags tenant isolation" ON public.contact_tags FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "conversations tenant isolation" ON public.conversations;
CREATE POLICY "conversations tenant isolation" ON public.conversations FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "conversation_messages tenant isolation" ON public.conversation_messages;
CREATE POLICY "conversation_messages tenant isolation" ON public.conversation_messages FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "leads tenant isolation" ON public.leads;
CREATE POLICY "leads tenant isolation" ON public.leads FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "lead_activities tenant isolation" ON public.lead_activities;
CREATE POLICY "lead_activities tenant isolation" ON public.lead_activities FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "ai_agents tenant isolation" ON public.ai_agents;
CREATE POLICY "ai_agents tenant isolation" ON public.ai_agents FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "knowledge_bases tenant isolation" ON public.knowledge_bases;
CREATE POLICY "knowledge_bases tenant isolation" ON public.knowledge_bases FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "knowledge_documents tenant isolation" ON public.knowledge_documents;
CREATE POLICY "knowledge_documents tenant isolation" ON public.knowledge_documents FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "campaigns tenant isolation" ON public.campaigns;
CREATE POLICY "campaigns tenant isolation" ON public.campaigns FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "campaign_recipients tenant isolation" ON public.campaign_recipients;
CREATE POLICY "campaign_recipients tenant isolation" ON public.campaign_recipients FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "broadcasts tenant isolation" ON public.broadcasts;
CREATE POLICY "broadcasts tenant isolation" ON public.broadcasts FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "automations tenant isolation" ON public.automations;
CREATE POLICY "automations tenant isolation" ON public.automations FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "products tenant isolation" ON public.products;
CREATE POLICY "products tenant isolation" ON public.products FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "orders tenant isolation" ON public.orders;
CREATE POLICY "orders tenant isolation" ON public.orders FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "order_items tenant isolation" ON public.order_items;
CREATE POLICY "order_items tenant isolation" ON public.order_items FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "whatsapp_sessions tenant isolation" ON public.whatsapp_sessions;
CREATE POLICY "whatsapp_sessions tenant isolation" ON public.whatsapp_sessions FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "support_tickets tenant isolation" ON public.support_tickets;
CREATE POLICY "support_tickets tenant isolation" ON public.support_tickets FOR ALL TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_member(organization_id) OR public.is_super_admin());

-- ------------------------------------------------------------
-- 6. POLICIES: SYSTEM-WRITTEN DATA (members read only)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "subscriptions member read" ON public.subscriptions;
CREATE POLICY "subscriptions member read" ON public.subscriptions FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "usage member read" ON public.usage;
CREATE POLICY "usage member read" ON public.usage FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "payments member read" ON public.payments;
CREATE POLICY "payments member read" ON public.payments FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "invoices member read" ON public.invoices;
CREATE POLICY "invoices member read" ON public.invoices FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "automation_runs member read" ON public.automation_runs;
CREATE POLICY "automation_runs member read" ON public.automation_runs FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "webhook_events member read" ON public.webhook_events;
CREATE POLICY "webhook_events member read" ON public.webhook_events FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());

-- ------------------------------------------------------------
-- 7. POLICIES: SENSITIVE (owner/admin manage, members read)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "api_keys member read" ON public.api_keys;
CREATE POLICY "api_keys member read" ON public.api_keys FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "api_keys admin write" ON public.api_keys;
CREATE POLICY "api_keys admin write" ON public.api_keys FOR ALL TO authenticated
  USING (public.is_org_admin(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_admin(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "webhooks member read" ON public.webhooks;
CREATE POLICY "webhooks member read" ON public.webhooks FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR public.is_super_admin());
DROP POLICY IF EXISTS "webhooks admin write" ON public.webhooks;
CREATE POLICY "webhooks admin write" ON public.webhooks FOR ALL TO authenticated
  USING (public.is_org_admin(organization_id) OR public.is_super_admin())
  WITH CHECK (public.is_org_admin(organization_id) OR public.is_super_admin());

-- ------------------------------------------------------------
-- 8. POLICIES: CHILD TABLES (inherit access from parent)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "contact_tag_relations via parent" ON public.contact_tag_relations;
CREATE POLICY "contact_tag_relations via parent" ON public.contact_tag_relations FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.contacts p WHERE p.id = contact_tag_relations.contact_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.contacts p WHERE p.id = contact_tag_relations.contact_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())));
DROP POLICY IF EXISTS "automation_nodes via parent" ON public.automation_nodes;
CREATE POLICY "automation_nodes via parent" ON public.automation_nodes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.automations p WHERE p.id = automation_nodes.automation_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.automations p WHERE p.id = automation_nodes.automation_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())));
DROP POLICY IF EXISTS "support_messages via parent" ON public.support_messages;
CREATE POLICY "support_messages via parent" ON public.support_messages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.support_tickets p WHERE p.id = support_messages.ticket_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.support_tickets p WHERE p.id = support_messages.ticket_id AND (public.is_org_member(p.organization_id) OR public.is_super_admin())));

-- ------------------------------------------------------------
-- 9. LOCK DOWN ANONYMOUS ACCESS
-- ------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
GRANT SELECT ON public.plans TO anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_org_admin(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID) TO authenticated;

-- ------------------------------------------------------------
-- 10. MAKE YOURSELF SUPER ADMIN (run ONCE, after you have registered
--     on the site with that email and confirmed it)
-- ------------------------------------------------------------
-- INSERT INTO public.super_admins (user_id)
-- SELECT id FROM auth.users WHERE email = 'jakiadantal@gmail.com'
-- ON CONFLICT DO NOTHING;
