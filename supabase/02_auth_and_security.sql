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
