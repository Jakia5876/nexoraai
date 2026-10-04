/**
 * NEXORAAI — Shared Sidebar HTML Generator
 * Creates consistent sidebar for all dashboard pages
 */

function createDashboardShell(activePage, pageTitle) {
  let activeUser = {
    name: 'Jakia Dantal',
    email: 'jakiadantal@gmail.com',
    role: 'super_admin',
    isSuperAdmin: true
  };
  try {
    const storedUser = localStorage.getItem('nexora_user');
    if (storedUser) {
      activeUser = Object.assign({}, activeUser, JSON.parse(storedUser));
    }
  } catch (e) {
    console.error('Error loading session:', e);
  }

  const initial = (activeUser.name || 'J').charAt(0).toUpperCase();
  const roleBadge = (activeUser.isSuperAdmin || activeUser.role === 'super_admin' || activeUser.email === 'jakiadantal@gmail.com') ? ' (Admin)' : '';

  const sidebarHTML = `
  <div class="sidebar-overlay" id="sidebarOverlay"></div>
  <aside class="dash-sidebar" id="dashSidebar">
    <div class="sidebar-header">
      <a href="../index.html" class="logo">
        <img src="../assets/images/logo.png" alt="NEXORAAI" class="brand-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="display:none;height:28px;width:auto;object-fit:contain" onload="this.style.display='block'; if(this.nextElementSibling) this.nextElementSibling.style.display='none';" />
        <div class="logo-icon"><svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#D9F000" fill-opacity="0.15"/><path d="M8 24L14 8H16L10 24H8Z" fill="#D9F000"/><path d="M16 8L22 24H20L14 8H16Z" fill="#D9F000" fill-opacity="0.6"/><circle cx="22" cy="10" r="3" fill="#9BE600"/><circle cx="22" cy="10" r="1.5" fill="#D9F000"/></svg></div>
        <span class="logo-text">NEXORA<span class="logo-accent">AI</span></span>
      </a>
    </div>
    <div class="workspace-selector"><div class="workspace-icon">N</div><div class="workspace-info"><div class="workspace-name">My Business</div><div class="workspace-plan">Professional Plan</div></div></div>
    <nav class="sidebar-nav">
      <div class="sidebar-group">
        <a href="dashboard.html" class="sidebar-item ${activePage==='dashboard'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg><span class="sidebar-item-label">Overview</span></a>
        <a href="dashboard-inbox.html" class="sidebar-item ${activePage==='inbox'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span class="sidebar-item-label">Inbox</span><span class="sidebar-item-badge badge-red">12</span></a>
      </div>
      <span class="sidebar-group-label">WhatsApp</span>
      <div class="sidebar-group"><a href="dashboard-whatsapp.html" class="sidebar-item ${activePage==='whatsapp'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg><span class="sidebar-item-label">Sessions</span></a></div>
      <span class="sidebar-group-label">CRM</span>
      <div class="sidebar-group">
        <a href="dashboard-contacts.html" class="sidebar-item ${activePage==='contacts'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg><span class="sidebar-item-label">Contacts</span></a>
        <a href="dashboard-leads.html" class="sidebar-item ${activePage==='leads'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line></svg><span class="sidebar-item-label">Leads</span></a>
        <a href="dashboard-lead-research.html" class="sidebar-item ${activePage==='lead-research'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span class="sidebar-item-label">Lead Research</span></a>
      </div>
      <span class="sidebar-group-label">Marketing & Broadcast</span>
      <div class="sidebar-group">
        <a href="dashboard-broadcasts.html" class="sidebar-item ${activePage==='broadcasts'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg><span class="sidebar-item-label">WhatsApp Bulk SMS</span><span class="badge badge-accent" style="font-size:9px;padding:1px 5px;margin-left:auto">PRO</span></a>
        <a href="dashboard-email.html" class="sidebar-item ${activePage==='email'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><span class="sidebar-item-label">Bulk Email Blaster</span><span class="badge badge-green" style="font-size:9px;padding:1px 5px;margin-left:auto">NEW</span></a>
        <a href="dashboard-campaigns.html" class="sidebar-item ${activePage==='campaigns'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg><span class="sidebar-item-label">Campaigns & Templates</span></a>
      </div>
      <span class="sidebar-group-label">AI & Automation</span>
      <div class="sidebar-group">
        <a href="dashboard-automations.html" class="sidebar-item ${activePage==='automations'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg><span class="sidebar-item-label">Automations</span></a>
        <a href="dashboard-ai-agents.html" class="sidebar-item ${activePage==='ai-agents'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg><span class="sidebar-item-label">AI Agents</span></a>
        <a href="dashboard-knowledge.html" class="sidebar-item ${activePage==='knowledge'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg><span class="sidebar-item-label">Knowledge Base</span></a>
      </div>
      <span class="sidebar-group-label">Commerce</span>
      <div class="sidebar-group">
        <a href="dashboard-products.html" class="sidebar-item ${activePage==='products'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg><span class="sidebar-item-label">Products</span></a>
        <a href="dashboard-orders.html" class="sidebar-item ${activePage==='orders'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V22H4V12"></path><path d="M22 7H2v5h20V7z"></path></svg><span class="sidebar-item-label">Orders</span></a>
      </div>
      <span class="sidebar-group-label">Analytics & Dev</span>
      <div class="sidebar-group">
        <a href="dashboard-analytics.html" class="sidebar-item ${activePage==='analytics'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg><span class="sidebar-item-label">Analytics</span></a>
        <a href="dashboard-api.html" class="sidebar-item ${activePage==='api'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg><span class="sidebar-item-label">API & Keys</span></a>
        <a href="dashboard-webhooks.html" class="sidebar-item ${activePage==='webhooks'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg><span class="sidebar-item-label">Webhooks</span></a>
        <a href="dashboard-integrations.html" class="sidebar-item ${activePage==='integrations'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg><span class="sidebar-item-label">Integrations</span></a>
        <a href="dashboard-n8n.html" class="sidebar-item ${activePage==='n8n'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg><span class="sidebar-item-label">n8n Automation</span><span class="badge badge-accent" style="font-size:9px;padding:1px 4px;margin-left:auto">PRO</span></a>
      </div>
      <span class="sidebar-group-label">Account</span>
      <div class="sidebar-group">
        <a href="dashboard-team.html" class="sidebar-item ${activePage==='team'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path></svg><span class="sidebar-item-label">Team</span></a>
        <a href="dashboard-billing.html" class="sidebar-item ${activePage==='billing'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg><span class="sidebar-item-label">Billing</span></a>
        <a href="dashboard-support.html" class="sidebar-item ${activePage==='support'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><span class="sidebar-item-label">Support</span></a>
        <a href="dashboard-settings.html" class="sidebar-item ${activePage==='settings'?'active':''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"></path></svg><span class="sidebar-item-label">Settings</span></a>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user-card" onclick="window.location.href='admin.html'" style="cursor:pointer" title="Switch to Admin Center">
        <div class="avatar avatar-md" style="background:linear-gradient(135deg,#D9F000,#9BE600);color:#070B0D;font-weight:800">${initial}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${activeUser.name}</div>
          <div class="sidebar-user-email">${activeUser.email}${roleBadge}</div>
        </div>
      </div>
    </div>
  </aside>
  <header class="dash-topbar">
    <div class="topbar-left">
      <button class="btn-icon sidebar-toggle" data-action="toggle-sidebar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
      <span style="font-size:15px;font-weight:700;color:var(--text-primary)">${pageTitle}</span>
      <button class="btn btn-secondary btn-sm" onclick="openCommandPalette()" style="margin-left:14px;font-size:12px;padding:4px 10px;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>Quick Search</span><kbd style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:3px;font-size:10px">Ctrl K</kbd></button>
    </div>
    <div class="topbar-right">
      <button class="btn-icon" id="themeToggle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sun" style="display:none"><circle cx="12" cy="12" r="5"></circle></svg></button>
      <div class="dropdown">
        <button class="user-profile-btn" data-dropdown>
          <div class="avatar avatar-sm" style="background:linear-gradient(135deg,#D9F000,#9BE600);color:#070B0D;font-weight:800">${initial}</div>
          <svg class="user-profile-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="dropdown-menu">
          <div class="dropdown-item" onclick="window.location.href='admin.html'">⚡ Admin Control Center</div>
          <div class="dropdown-item" onclick="window.location.href='onboarding.html'">🚀 Setup Wizard</div>
          <div class="dropdown-item" onclick="window.location.href='dashboard-settings.html'">Settings</div>
          <div class="dropdown-item" onclick="window.location.href='dashboard-billing.html'">Billing</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item danger" onclick="localStorage.removeItem('nexora_user'); window.location.href='login.html'">Sign Out</div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Global Command Palette Modal (Ctrl + K) -->
  <div class="modal-overlay" id="cmdPalette" style="display:none;z-index:99999;align-items:flex-start;padding-top:10vh">
    <div class="modal" style="max-width:580px;background:#0C1114;border:1px solid var(--border);border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,0.8)">
      <div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="cmdInput" placeholder="Search pages, contacts, deals, automations... (Esc to close)" style="flex:1;background:transparent;border:none;color:#F5F7F8;font-size:15px;outline:none" oninput="filterCmdPalette()" />
        <span style="font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px">ESC</span>
      </div>
      <div id="cmdResults" style="max-height:360px;overflow-y:auto;padding:8px">
        <div style="font-size:11px;color:var(--text-muted);padding:8px 12px;font-weight:700;text-transform:uppercase">Jump to Navigation</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-inbox.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>💬</span> Unified WhatsApp Inbox</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-leads.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>📊</span> Sales Lead Pipeline (Kanban)</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-lead-research.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>🔍</span> AI Lead Intelligence & Research</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-automations.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>⚡</span> Workflow Automations & Visual Canvas</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-ai-agents.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>🤖</span> AI Agent Personas (GPT-4o & Claude)</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-broadcasts.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>📢</span> WhatsApp Bulk SMS & Broadcast Dispatcher</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-email.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>✉️</span> Bulk Email Blaster & SMTP Dispatcher</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-n8n.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>⚡</span> n8n Workflow Automation Hub</div>
        <div class="cmd-item" onclick="window.location.href='dashboard-api.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>🔑</span> Developer API & Webhook Keys</div>
        <div class="cmd-item" onclick="window.location.href='admin.html'" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;color:#F5F7F8;font-size:13.5px"><span>🛡️</span> Super Admin Control Center</div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Command Palette Keyboard Shortcut Listener
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });
}

function openCommandPalette() {
  const p = document.getElementById('cmdPalette');
  if (p) {
    p.style.display = 'flex';
    setTimeout(() => document.getElementById('cmdInput').focus(), 50);
  }
}

function closeCommandPalette() {
  const p = document.getElementById('cmdPalette');
  if (p) p.style.display = 'none';
}

function filterCmdPalette() {
  const q = document.getElementById('cmdInput').value.toLowerCase();
  document.querySelectorAll('.cmd-item').forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
  });
}

window.createDashboardShell = createDashboardShell;
window.openCommandPalette = openCommandPalette;
window.closeCommandPalette = closeCommandPalette;
