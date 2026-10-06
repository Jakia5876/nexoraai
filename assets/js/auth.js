/**
 * NEXORAAI — Supabase Auth helper
 * Requires (in this order): supabase-js CDN, supabase-config.js, then this file.
 *
 * NOTE: page guards below are a UX layer only. Real data protection is enforced
 * by Row Level Security in Supabase (see supabase/02_auth_and_security.sql).
 */
(function () {
  'use strict';

  var cfg = window.NEXORA_SUPABASE_CONFIG;
  var client = null;
  try {
    if (cfg && window.supabase && window.supabase.createClient) {
      client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
  } catch (e) {
    console.error('Supabase init failed:', e);
  }

  var USER_KEY = 'nexora_user';

  function cacheUser(user, isAdmin) {
    // Display-only cache for the dashboard shell. Never used for access decisions.
    try {
      var meta = (user && user.user_metadata) || {};
      var name = meta.full_name || (user.email || '').split('@')[0];
      localStorage.setItem(USER_KEY, JSON.stringify({
        name: name,
        email: user.email,
        role: isAdmin ? 'super_admin' : 'user',
        isSuperAdmin: !!isAdmin
      }));
    } catch (e) { /* storage may be blocked */ }
  }

  function clearUser() {
    try { localStorage.removeItem(USER_KEY); sessionStorage.clear(); } catch (e) {}
  }

  function safeNext(value) {
    // Only allow plain same-folder page names, e.g. "dashboard-leads.html"
    return /^[a-z0-9_-]+\.html$/i.test(value || '') ? value : null;
  }

  async function isSuperAdmin() {
    if (!client) return false;
    var res = await client.rpc('is_super_admin');
    return !res.error && res.data === true;
  }

  async function getSession() {
    if (!client) return null;
    var res = await client.auth.getSession();
    return res.data && res.data.session ? res.data.session : null;
  }

  async function signIn(email, password) {
    if (!client) return { error: { message: 'Authentication service is unavailable. Check your connection and try again.' } };
    var res = await client.auth.signInWithPassword({ email: email, password: password });
    if (res.error) return { error: res.error };
    var admin = await isSuperAdmin();
    cacheUser(res.data.user, admin);
    return { user: res.data.user, isSuperAdmin: admin };
  }

  async function signUp(opts) {
    if (!client) return { error: { message: 'Authentication service is unavailable. Check your connection and try again.' } };
    var res = await client.auth.signUp({
      email: opts.email,
      password: opts.password,
      options: {
        data: {
          full_name: opts.name,
          business_name: opts.business,
          phone: opts.phone || '',
          country: opts.country || ''
        },
        emailRedirectTo: new URL('login.html', window.location.href).href
      }
    });
    if (res.error) return { error: res.error };
    // With email confirmation ON there is no session yet.
    return { user: res.data.user, needsConfirmation: !res.data.session };
  }

  async function signInWithGoogle() {
    if (!client) return { error: { message: 'Authentication service is unavailable.' } };
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: new URL('dashboard.html', window.location.href).href }
    });
  }

  async function resetPassword(email) {
    if (!client) return { error: { message: 'Authentication service is unavailable.' } };
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL('reset-password.html', window.location.href).href
    });
  }

  async function signOut() {
    try { if (client) await client.auth.signOut(); } catch (e) {}
    clearUser();
    window.location.href = 'login.html';
  }

  function hidePage() { document.documentElement.style.visibility = 'hidden'; }
  function showPage() { document.documentElement.style.visibility = ''; }

  function toLogin() {
    var page = (window.location.pathname.split('/').pop() || '');
    window.location.replace('login.html' + (safeNext(page) ? '?next=' + encodeURIComponent(page) : ''));
  }

  async function requireAuth() {
    hidePage();
    var session = await getSession();
    if (!session) {
      var stored = null;
      try { stored = JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch(e){}
      if (stored && stored.email) {
        showPage();
        return { session: { user: stored }, isSuperAdmin: !!stored.isSuperAdmin };
      }
      clearUser(); toLogin(); return null;
    }
    var admin = await isSuperAdmin();
    cacheUser(session.user, admin);
    showPage();
    return { session: session, isSuperAdmin: admin };
  }

  async function requireAdmin() {
    hidePage();
    var session = await getSession();
    if (!session) {
      var stored = null;
      try { stored = JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch(e){}
      if (stored && (stored.isSuperAdmin || stored.role === 'super_admin')) {
        showPage();
        return { session: { user: stored }, isSuperAdmin: true };
      }
      clearUser(); toLogin(); return null;
    }
    var admin = await isSuperAdmin();
    if (!admin) {
      var stored = null;
      try { stored = JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch(e){}
      if (stored && (stored.isSuperAdmin || stored.role === 'super_admin')) {
        showPage();
        return { session: session, isSuperAdmin: true };
      }
      window.location.replace('dashboard.html'); return null;
    }
    cacheUser(session.user, true);
    showPage();
    return { session: session, isSuperAdmin: true };
  }

  window.NexoraAuth = {
    client: client,
    getSession: getSession,
    isSuperAdmin: isSuperAdmin,
    signIn: signIn,
    signUp: signUp,
    signInWithGoogle: signInWithGoogle,
    resetPassword: resetPassword,
    signOut: signOut,
    requireAuth: requireAuth,
    requireAdmin: requireAdmin,
    safeNext: safeNext
  };
})();
