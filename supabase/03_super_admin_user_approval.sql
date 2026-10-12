-- ============================================================
-- NEXORAAI — 03: SUPER ADMIN USER APPROVAL WORKFLOW MIGRATION
-- Run in the Supabase SQL Editor (Safe to re-run multiple times)
-- ============================================================
-- 
-- Business Logic:
-- 1. All new regular user registrations default to 'pending' approval status.
-- 2. New users CANNOT access the dashboard or tenant records until Super Admin approves them.
-- 3. Root Super Admin (jakiadantal@gmail.com) is always auto-approved and has full access.
-- 4. Super Admin can view pending users, approve them, reject them, or suspend them.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ADD APPROVAL COLUMNS TO PROFILES & ORGANIZATIONS
-- ------------------------------------------------------------
DO $$
BEGIN
  -- Add approval_status to profiles if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending';
  END IF;

  -- Add approved_at timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN approved_at TIMESTAMPTZ;
  END IF;

  -- Add approved_by admin UUID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add rejection_reason text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN rejection_reason TEXT;
  END IF;
END $$;

-- Ensure check constraint on profiles.approval_status
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_profiles_approval_status;
ALTER TABLE public.profiles ADD CONSTRAINT check_profiles_approval_status
  CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Ensure organizations status supports pending_approval
ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_status_check;
ALTER TABLE public.organizations ADD CONSTRAINT organizations_status_check
  CHECK (status IN ('active', 'suspended', 'trialing', 'pending_approval'));

-- Ensure organization_members status supports pending
ALTER TABLE public.organization_members DROP CONSTRAINT IF EXISTS organization_members_status_check;
ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_status_check
  CHECK (status IN ('active', 'invited', 'suspended', 'pending'));

-- Ensure audit_logs table exists
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. ENSURE SUPER ADMIN SETUP (Root Super Admin: jakiadantal@gmail.com)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatically link root admin if already signed up in auth.users
INSERT INTO public.super_admins (user_id)
SELECT id FROM auth.users 
WHERE lower(email) = 'jakiadantal@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Auto-approve existing super admin profile if it exists
UPDATE public.profiles 
SET approval_status = 'approved', approved_at = NOW()
WHERE lower(email) = 'jakiadantal@gmail.com';

-- ------------------------------------------------------------
-- 3. HELPER FUNCTIONS: APPROVAL & PERMISSION CHECKS
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins WHERE user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND lower(email) = 'jakiadantal@gmail.com'
  );
$$;

-- Function to check if a user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
  v_is_super BOOLEAN;
BEGIN
  -- Super admins are always approved
  SELECT public.is_super_admin() INTO v_is_super;
  IF v_is_super THEN
    RETURN TRUE;
  END IF;

  SELECT approval_status INTO v_status
  FROM public.profiles
  WHERE user_id = check_user_id;

  RETURN (v_status = 'approved');
END;
$$;

-- ------------------------------------------------------------
-- 4. UPDATE USER SIGNUP TRIGGER (Defaults new users to 'pending')
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_business TEXT;
  v_country TEXT;
  v_phone TEXT;
  v_avatar TEXT;
  v_is_root_admin BOOLEAN;
  v_initial_status TEXT;
  v_org_status TEXT;
  v_member_status TEXT;
  v_org UUID;
  v_plan UUID;
BEGIN
  -- Safe name resolution (supports Google OAuth "name" / "full_name" and email)
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
    'User'
  );

  v_business := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'business_name'), ''),
    v_name || ' Workspace'
  );

  v_country := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''),
    'BD'
  );

  v_phone := NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), '');

  v_avatar := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
  );

  v_is_root_admin := (lower(COALESCE(NEW.email, '')) = 'jakiadantal@gmail.com');
  v_initial_status := CASE WHEN v_is_root_admin THEN 'approved' ELSE 'pending' END;
  v_org_status := CASE WHEN v_is_root_admin THEN 'active' ELSE 'pending_approval' END;
  v_member_status := CASE WHEN v_is_root_admin THEN 'active' ELSE 'pending' END;

  -- 1. Insert Profile
  INSERT INTO public.profiles (
    user_id, full_name, email, phone, avatar_url, approval_status, approved_at
  )
  VALUES (
    NEW.id, v_name, COALESCE(NEW.email, ''), v_phone, v_avatar,
    v_initial_status, 
    CASE WHEN v_is_root_admin THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);

  -- 2. If Root Admin, ensure record in public.super_admins
  IF v_is_root_admin THEN
    BEGIN
      INSERT INTO public.super_admins (user_id)
      VALUES (NEW.id)
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'super_admins insert warning: %', SQLERRM;
    END;
  END IF;

  -- 3. Create Organization Workspace
  BEGIN
    INSERT INTO public.organizations (name, slug, owner_id, country, status)
    VALUES (
      v_business,
      COALESCE(NULLIF(trim(both '-' from lower(regexp_replace(v_business, '[^a-zA-Z0-9]+', '-', 'g'))), ''), 'workspace')
        || '-' || substr(replace(NEW.id::text, '-', ''), 1, 6),
      NEW.id, left(v_country, 2), v_org_status
    )
    RETURNING id INTO v_org;
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.organizations (name, slug, owner_id, country, status)
    VALUES (
      v_business,
      'workspace-' || substr(replace(NEW.id::text, '-', ''), 1, 8),
      NEW.id, 'BD', v_org_status
    )
    RETURNING id INTO v_org;
  END;

  -- 4. Create Organization Member entry
  IF v_org IS NOT NULL THEN
    BEGIN
      INSERT INTO public.organization_members (organization_id, user_id, role, status)
      VALUES (v_org, NEW.id, 'owner', v_member_status)
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'organization_members insert warning: %', SQLERRM;
    END;

    -- 5. Attach initial subscription plan
    BEGIN
      SELECT id INTO v_plan FROM public.plans WHERE active ORDER BY monthly_price ASC LIMIT 1;
      IF v_plan IS NOT NULL THEN
        INSERT INTO public.subscriptions (organization_id, plan_id, status, trial_end)
        VALUES (
          v_org, 
          v_plan, 
          CASE WHEN v_is_root_admin THEN 'active' ELSE 'trialing' END, 
          NOW() + INTERVAL '14 days'
        );
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'subscriptions insert warning: %', SQLERRM;
    END;

    -- 6. Log Registration Audit Event (safe try-catch prevents blocking signup)
    BEGIN
      INSERT INTO public.audit_logs (user_id, organization_id, action, resource, metadata)
      VALUES (
        NEW.id, v_org, 
        CASE WHEN v_is_root_admin THEN 'super_admin_registered' ELSE 'user_registration_pending_approval' END,
        'users',
        jsonb_build_object('email', NEW.email, 'full_name', v_name, 'status', v_initial_status)
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 5. SUPER ADMIN RPC: APPROVE USER ACCOUNT
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.approve_user(
  target_user_id UUID,
  assigned_role TEXT DEFAULT 'owner',
  assigned_plan_slug TEXT DEFAULT 'starter'
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_user_email TEXT;
  v_org_id UUID;
  v_plan_id UUID;
BEGIN
  -- Strict Super Admin Security Check
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Only Super Admins can approve users.';
  END IF;

  -- 1. Fetch user info
  SELECT email INTO v_user_email FROM public.profiles WHERE user_id = target_user_id;
  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', target_user_id;
  END IF;

  -- 2. Update Profile to Approved
  UPDATE public.profiles
  SET 
    approval_status = 'approved',
    approved_at = NOW(),
    approved_by = v_admin_id,
    rejection_reason = NULL,
    updated_at = NOW()
  WHERE user_id = target_user_id;

  -- 3. Activate Organization
  UPDATE public.organizations
  SET 
    status = 'active',
    updated_at = NOW()
  WHERE owner_id = target_user_id
  RETURNING id INTO v_org_id;

  -- 4. Activate Organization Members
  UPDATE public.organization_members
  SET 
    status = 'active',
    role = COALESCE(assigned_role, 'owner')
  WHERE user_id = target_user_id;

  -- 5. Activate or Upgrade Plan Subscription
  IF assigned_plan_slug IS NOT NULL AND v_org_id IS NOT NULL THEN
    SELECT id INTO v_plan_id FROM public.plans WHERE slug = assigned_plan_slug AND active LIMIT 1;
    IF v_plan_id IS NOT NULL THEN
      UPDATE public.subscriptions
      SET plan_id = v_plan_id, status = 'active', trial_end = NOW() + INTERVAL '30 days'
      WHERE organization_id = v_org_id;
    ELSE
      UPDATE public.subscriptions
      SET status = 'active', trial_end = NOW() + INTERVAL '30 days'
      WHERE organization_id = v_org_id;
    END IF;
  END IF;

  -- 6. Log to Audit Table
  INSERT INTO public.audit_logs (user_id, organization_id, action, resource, metadata)
  VALUES (
    v_admin_id, v_org_id, 'user_account_approved', 'profiles',
    jsonb_build_object('approved_user_id', target_user_id, 'user_email', v_user_email, 'assigned_role', assigned_role)
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User account approved successfully',
    'user_id', target_user_id,
    'email', v_user_email,
    'status', 'approved'
  );
END;
$$;

-- ------------------------------------------------------------
-- 6. SUPER ADMIN RPC: REJECT USER ACCOUNT
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reject_user(
  target_user_id UUID,
  reason TEXT DEFAULT 'Account application declined by Super Admin.'
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_user_email TEXT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Only Super Admins can reject users.';
  END IF;

  SELECT email INTO v_user_email FROM public.profiles WHERE user_id = target_user_id;

  -- Update Profile
  UPDATE public.profiles
  SET 
    approval_status = 'rejected',
    rejection_reason = reason,
    updated_at = NOW()
  WHERE user_id = target_user_id;

  -- Suspend Organization & Members
  UPDATE public.organizations
  SET status = 'suspended', updated_at = NOW()
  WHERE owner_id = target_user_id;

  UPDATE public.organization_members
  SET status = 'suspended'
  WHERE user_id = target_user_id;

  -- Audit log
  INSERT INTO public.audit_logs (user_id, action, resource, metadata)
  VALUES (
    v_admin_id, 'user_account_rejected', 'profiles',
    jsonb_build_object('rejected_user_id', target_user_id, 'email', v_user_email, 'reason', reason)
  );

  RETURN jsonb_build_object('success', true, 'status', 'rejected', 'user_id', target_user_id);
END;
$$;

-- ------------------------------------------------------------
-- 7. SUPER ADMIN RPC: SUSPEND & REACTIVATE USER
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.suspend_user(target_user_id UUID, reason TEXT DEFAULT 'Account suspended by administrator')
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Super Admin only.';
  END IF;

  UPDATE public.profiles SET approval_status = 'suspended', rejection_reason = reason, updated_at = NOW() WHERE user_id = target_user_id;
  UPDATE public.organizations SET status = 'suspended', updated_at = NOW() WHERE owner_id = target_user_id;
  UPDATE public.organization_members SET status = 'suspended' WHERE user_id = target_user_id;

  RETURN jsonb_build_object('success', true, 'status', 'suspended');
END;
$$;

CREATE OR REPLACE FUNCTION public.reactivate_user(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Super Admin only.';
  END IF;

  UPDATE public.profiles SET approval_status = 'approved', rejection_reason = NULL, updated_at = NOW() WHERE user_id = target_user_id;
  UPDATE public.organizations SET status = 'active', updated_at = NOW() WHERE owner_id = target_user_id;
  UPDATE public.organization_members SET status = 'active' WHERE user_id = target_user_id;

  RETURN jsonb_build_object('success', true, 'status', 'approved');
END;
$$;

-- ------------------------------------------------------------
-- 8. SUPER ADMIN RPC: GET PENDING USERS QUEUE
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_pending_approvals()
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  business_name TEXT,
  country TEXT,
  created_at TIMESTAMPTZ,
  approval_status TEXT
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Only Super Admins can list pending users.';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id,
    p.full_name,
    p.email,
    p.phone,
    COALESCE(o.name, 'Workspace') AS business_name,
    COALESCE(o.country, 'BD') AS country,
    p.created_at,
    p.approval_status
  FROM public.profiles p
  LEFT JOIN public.organizations o ON o.owner_id = p.user_id
  WHERE p.approval_status = 'pending'
  ORDER BY p.created_at DESC;
END;
$$;

-- ------------------------------------------------------------
-- 9. USER SELF-CHECK: GET MY APPROVAL STATUS
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_approval_status()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_is_super BOOLEAN;
  v_status TEXT;
  v_name TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_business TEXT;
  v_created TIMESTAMPTZ;
  v_reason TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('authenticated', false);
  END IF;

  SELECT public.is_super_admin() INTO v_is_super;
  IF v_is_super THEN
    RETURN jsonb_build_object(
      'authenticated', true,
      'is_super_admin', true,
      'approval_status', 'approved',
      'can_access_dashboard', true
    );
  END IF;

  SELECT 
    p.approval_status, p.full_name, p.email, p.phone, p.created_at, p.rejection_reason,
    COALESCE(o.name, 'My Workspace')
  INTO 
    v_status, v_name, v_email, v_phone, v_created, v_reason, v_business
  FROM public.profiles p
  LEFT JOIN public.organizations o ON o.owner_id = p.user_id
  WHERE p.user_id = v_uid;

  RETURN jsonb_build_object(
    'authenticated', true,
    'is_super_admin', false,
    'approval_status', COALESCE(v_status, 'pending'),
    'can_access_dashboard', (v_status = 'approved'),
    'full_name', v_name,
    'email', v_email,
    'phone', v_phone,
    'business_name', v_business,
    'created_at', v_created,
    'rejection_reason', v_reason
  );
END;
$$;

-- ------------------------------------------------------------
-- 10. GRANTS & SECURITY
-- ------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_user_approved(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_approval_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_approvals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_user(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_user(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.suspend_user(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reactivate_user(UUID) TO authenticated;

-- Ensure profiles read policy permits users to check their own profile and Super Admin to read all
DROP POLICY IF EXISTS "profiles own read" ON public.profiles;
CREATE POLICY "profiles own read" ON public.profiles
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR public.is_super_admin());

-- Super Admin can update any profile (e.g., approve/reject)
DROP POLICY IF EXISTS "profiles superadmin update" ON public.profiles;
CREATE POLICY "profiles superadmin update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_super_admin() OR user_id = auth.uid())
  WITH CHECK (public.is_super_admin() OR user_id = auth.uid());
