/**
 * NEXORAAI — Core Application JavaScript
 * Handles: Theme, Mobile Nav, Toast, Modal, Tabs, Global Search, Keyboard shortcuts
 */

'use strict';

// ============================================
// THEME MANAGER
// ============================================
const ThemeManager = (() => {
  const STORAGE_KEY = 'nexoraai-theme';
  const THEMES = { DARK: 'dark', LIGHT: 'light', SYSTEM: 'system' };

  // Default to light theme (clean white background)
  let currentTheme = localStorage.getItem(STORAGE_KEY);
  if (!currentTheme || currentTheme === THEMES.DARK) {
    currentTheme = THEMES.LIGHT;
    try { localStorage.setItem(STORAGE_KEY, THEMES.LIGHT); } catch (e) {}
  }

  function applyTheme(theme) {
    const isDark = theme === THEMES.DARK ||
      (theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);

    // Update toggle icons
    document.querySelectorAll('.icon-moon').forEach(el => {
      el.style.display = isDark ? 'block' : 'none';
    });
    document.querySelectorAll('.icon-sun').forEach(el => {
      el.style.display = isDark ? 'none' : 'block';
    });
  }

  function toggle() {
    currentTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    localStorage.setItem(STORAGE_KEY, currentTheme);
    applyTheme(currentTheme);
  }

  function init() {
    applyTheme(currentTheme);

    document.querySelectorAll('#themeToggle, [data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });

    // System preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme === THEMES.SYSTEM) applyTheme(THEMES.SYSTEM);
    });
  }

  return { init, toggle, getTheme: () => currentTheme };
})();

// ============================================
// MOBILE NAV
// ============================================
const MobileNav = (() => {
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    const nav = document.getElementById('mobileNav');
    const toggle = document.getElementById('mobileMenuToggle');

    if (nav) {
      nav.classList.toggle('open', isOpen);
      nav.setAttribute('aria-hidden', String(!isOpen));
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function close() {
    isOpen = false;
    const nav = document.getElementById('mobileNav');
    if (nav) {
      nav.classList.remove('open');
      nav.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function init() {
    const btn = document.getElementById('mobileMenuToggle');
    if (btn) btn.addEventListener('click', toggle);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !e.target.closest('#mobileNav') && !e.target.closest('#mobileMenuToggle')) {
        close();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  return { init, toggle, close };
})();

// ============================================
// STICKY HEADER
// ============================================
const StickyHeader = (() => {
  function init() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let lastScroll = 0;
    const handler = () => {
      const scroll = window.scrollY;
      header.classList.toggle('scrolled', scroll > 20);
      lastScroll = scroll;
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }
  return { init };
})();

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const Toast = (() => {
  const ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#35D879" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B5B" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD43B" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  };

  function show({ title, message = '', type = 'info', duration = 4000 }) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismiss(toast));

    container.appendChild(toast);

    // Auto dismiss
    const timer = setTimeout(() => dismiss(toast), duration);
    toast._timer = timer;

    return toast;
  }

  function dismiss(toast) {
    clearTimeout(toast._timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400);
  }

  function success(title, message) { return show({ title, message, type: 'success' }); }
  function error(title, message) { return show({ title, message, type: 'error' }); }
  function warning(title, message) { return show({ title, message, type: 'warning' }); }
  function info(title, message) { return show({ title, message, type: 'info' }); }

  return { show, success, error, warning, info };
})();

// ============================================
// MODAL SYSTEM
// ============================================
const Modal = (() => {
  const openModals = [];

  function open(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    openModals.push(modalId);

    // Focus trap
    const focusable = backdrop.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function close(modalId) {
    const backdrop = modalId
      ? document.getElementById(modalId)
      : document.querySelector('.modal-backdrop.open');

    if (!backdrop) return;

    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');

    const idx = openModals.indexOf(modalId);
    if (idx > -1) openModals.splice(idx, 1);
    if (openModals.length === 0) document.body.style.overflow = '';
  }

  function init() {
    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        close(e.target.id);
      }
    });

    // Close button
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal-backdrop');
        if (modal) close(modal.id);
      }
    });

    // Open button
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) open(openBtn.dataset.modalOpen);
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openModals.length) {
        close(openModals[openModals.length - 1]);
      }
    });
  }

  return { open, close, init };
})();

// ============================================
// TAB SYSTEM
// ============================================
const Tabs = (() => {
  function init(container) {
    const tabs = (container || document).querySelectorAll('[data-tabs]');
    tabs.forEach(tabGroup => {
      const buttons = tabGroup.querySelectorAll('.tab-btn');
      const panels = document.querySelectorAll(`[data-tab-group="${tabGroup.dataset.tabs}"]`);

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          if (panels[i]) panels[i].classList.add('active');
        });
      });
    });
  }
  return { init };
})();

// ============================================
// GLOBAL SEARCH (Ctrl+K)
// ============================================
const GlobalSearch = (() => {
  let isOpen = false;

  function open() {
    isOpen = true;
    let overlay = document.getElementById('globalSearchOverlay');
    if (!overlay) {
      overlay = createSearchOverlay();
      document.body.appendChild(overlay);
    }
    overlay.classList.add('open');
    const input = overlay.querySelector('#globalSearchInput');
    if (input) setTimeout(() => input.focus(), 50);
  }

  function close() {
    isOpen = false;
    const overlay = document.getElementById('globalSearchOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  function createSearchOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'globalSearchOverlay';
    overlay.className = 'global-search-overlay';
    overlay.innerHTML = `
      <div class="global-search-modal">
        <div class="global-search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#91A0A8" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="globalSearchInput" placeholder="Search contacts, leads, orders, messages..." autocomplete="off" />
          <kbd>Esc</kbd>
        </div>
        <div class="global-search-results" id="globalSearchResults">
          <div class="search-suggestions">
            <div class="search-suggestion-group">
              <div class="search-group-label">Quick Links</div>
              <a href="pages/dashboard.html" class="search-result-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Dashboard
              </a>
              <a href="pages/dashboard-inbox.html" class="search-result-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Inbox
              </a>
              <a href="pages/dashboard-leads.html" class="search-result-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line></svg>
                Leads
              </a>
              <a href="pages/dashboard-contacts.html" class="search-result-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                Contacts
              </a>
              <a href="pages/dashboard-analytics.html" class="search-result-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9F000" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Analytics
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add styles
    if (!document.getElementById('globalSearchStyles')) {
      const style = document.createElement('style');
      style.id = 'globalSearchStyles';
      style.textContent = `
        .global-search-overlay {
          position: fixed; inset: 0;
          background: rgba(7,11,13,0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 16px 16px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .global-search-overlay.open { opacity: 1; pointer-events: all; }
        .global-search-modal {
          background: var(--bg-elevated);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .global-search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        #globalSearchInput {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 18px;
          color: var(--text-primary);
          font-family: var(--font-sans);
        }
        #globalSearchInput::placeholder { color: var(--text-muted); }
        .global-search-results { max-height: 400px; overflow-y: auto; padding: 12px; }
        .search-group-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 8px 12px 6px;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .search-result-item:hover { background: var(--bg-card-hover); color: var(--text-primary); }
      `;
      document.head.appendChild(style);
    }

    // Events
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    overlay.querySelector('#globalSearchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    return overlay;
  }

  function init() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
      }
    });

    document.querySelectorAll('[data-action="global-search"]').forEach(btn => {
      btn.addEventListener('click', open);
    });
  }

  return { init, open, close };
})();

// ============================================
// DROPDOWN SYSTEM
// ============================================
const Dropdown = (() => {
  function init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown]');
      if (trigger) {
        const dropdown = trigger.closest('.dropdown');
        const isOpen = dropdown.classList.contains('open');

        // Close all
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));

        if (!isOpen) dropdown.classList.add('open');
        e.stopPropagation();
      } else {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
  }
  return { init };
})();

// ============================================
// COPY TO CLIPBOARD
// ============================================
const Clipboard = (() => {
  function copy(text, feedbackEl) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showCopied(feedbackEl);
      }).catch(() => fallbackCopy(text, feedbackEl));
    } else {
      fallbackCopy(text, feedbackEl);
    }
  }

  function fallbackCopy(text, feedbackEl) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); showCopied(feedbackEl); } catch (e) {}
    document.body.removeChild(el);
  }

  function showCopied(el) {
    if (!el) return;
    const original = el.innerHTML;
    el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
    el.style.color = 'var(--success)';
    setTimeout(() => { el.innerHTML = original; el.style.color = ''; }, 2000);
  }

  function init() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy]');
      if (btn) {
        const text = btn.dataset.copy || document.querySelector(btn.dataset.copyTarget)?.textContent?.trim();
        if (text) copy(text, btn);
      }
    });
  }

  return { init, copy };
})();

// ============================================
// SCROLL ANIMATIONS
// ============================================
const ScrollAnimations = (() => {
  function init() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
  return { init };
})();

// ============================================
// SIDEBAR (Dashboard)
// ============================================
const DashSidebar = (() => {
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar) sidebar.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function close() {
    isOpen = false;
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function init() {
    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });

    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-item[href]').forEach(link => {
      const linkFile = link.getAttribute('href').split('/').pop();
      if (linkFile === currentPath) {
        link.classList.add('active');
      }
    });
  }

  return { init, toggle, close };
})();

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function formatNumber(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}

function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ============================================
// CONFIRMATION DIALOG
// ============================================
function confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
  return new Promise((resolve) => {
    const existing = document.getElementById('confirmDialogBackdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'confirmDialogBackdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div class="modal-header">
          <div class="modal-title">${escapeHtml(title)}</div>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary);font-size:0.9375rem">${escapeHtml(message)}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="confirmCancel">${escapeHtml(cancelText)}</button>
          <button class="btn btn-${type}" id="confirmOk">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('open'));

    backdrop.querySelector('#confirmOk').addEventListener('click', () => {
      backdrop.remove();
      resolve(true);
    });

    backdrop.querySelector('#confirmCancel').addEventListener('click', () => {
      backdrop.remove();
      resolve(false);
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) { backdrop.remove(); resolve(false); }
    });
  });
}

// ============================================
// DEMO DATA (marked as demo)
// ============================================
const DemoData = {
  isDemoMode: true,

  contacts: [
    { id: '1', name: 'Rahul Ahmed', phone: '+880 1712-345678', email: 'rahul@example.com', company: 'TechCorp BD', status: 'Customer', tags: ['VIP', 'Dhaka'], lastContact: '2024-01-15' },
    { id: '2', name: 'Sarah Islam', phone: '+880 1834-567890', email: 'sarah@example.com', company: 'Creative Agency', status: 'Lead', tags: ['New'], lastContact: '2024-01-14' },
    { id: '3', name: 'Karim Hassan', phone: '+880 1945-678901', email: 'karim@example.com', company: 'StartupXYZ', status: 'Prospect', tags: ['Hot Lead'], lastContact: '2024-01-13' },
    { id: '4', name: 'Fatima Begum', phone: '+880 1556-789012', email: 'fatima@example.com', company: 'Retail Plus', status: 'Customer', tags: ['Returning'], lastContact: '2024-01-12' },
    { id: '5', name: 'Mohammed Ali', phone: '+880 1667-890123', email: 'ali@example.com', company: 'Food Express', status: 'Lead', tags: ['Chittagong'], lastContact: '2024-01-11' },
  ],

  leads: [
    { id: 'L001', name: 'Rahul Ahmed', company: 'TechCorp BD', value: 45000, stage: 'new', source: 'WhatsApp', assignee: 'Agent 1' },
    { id: 'L002', name: 'Sarah Islam', company: 'Creative Agency', value: 28000, stage: 'contacted', source: 'Website', assignee: 'Agent 2' },
    { id: 'L003', name: 'Karim Hassan', company: 'StartupXYZ', value: 75000, stage: 'qualified', source: 'Referral', assignee: 'Agent 1' },
    { id: 'L004', name: 'Fatima Begum', company: 'Retail Plus', value: 32000, stage: 'proposal', source: 'Campaign', assignee: 'Agent 3' },
    { id: 'L005', name: 'Mohammed Ali', company: 'Food Express', value: 18000, stage: 'won', source: 'WhatsApp', assignee: 'Agent 2' },
    { id: 'L006', name: 'Nadia Chowdhury', company: 'Fashion Hub', value: 55000, stage: 'lost', source: 'LinkedIn', assignee: 'Agent 1' },
  ],

  messages: [
    { id: 'M1', from: 'Rahul Ahmed', content: 'Hi, I need help with my order', time: '10:32 AM', status: 'read', type: 'inbound' },
    { id: 'M2', from: 'NEXORAAI AI', content: 'Hello! I\'m happy to help with your order. Could you please provide your order ID?', time: '10:33 AM', status: 'delivered', type: 'outbound', ai: true },
    { id: 'M3', from: 'Rahul Ahmed', content: 'Order #ORD-2024-0512', time: '10:34 AM', status: 'read', type: 'inbound' },
    { id: 'M4', from: 'NEXORAAI AI', content: 'I found your order! Order #ORD-2024-0512 is currently being processed and will be shipped within 24 hours. You\'ll receive a tracking number via WhatsApp. Is there anything else I can help you with?', time: '10:34 AM', status: 'delivered', type: 'outbound', ai: true },
  ],

  analytics: {
    messages: { today: 2847, week: 18432, month: 72156 },
    leads: { today: 23, week: 156, month: 612 },
    aiReplies: { today: 1893, week: 12847, month: 51203 },
    revenue: { today: 45200, week: 287500, month: 1124000 },
    chartData: [42, 65, 58, 80, 67, 91, 75, 88, 72, 95, 83, 90, 78, 85, 93],
  },

  sessions: [
    { id: 'S1', phone: '+880 1712-345678', name: 'Main Business', status: 'connected', lastActive: new Date(), messagesSent: 12847, messagesReceived: 8932 },
    { id: 'S2', phone: '+880 1834-567890', name: 'Support Line', status: 'disconnected', lastActive: new Date(Date.now() - 3600000), messagesSent: 3421, messagesReceived: 2109 },
  ],
};

// ============================================
// INITIALIZE ALL MODULES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  StickyHeader.init();
  Modal.init();
  Tabs.init();
  GlobalSearch.init();
  Dropdown.init();
  Clipboard.init();
  ScrollAnimations.init();
  DashSidebar.init();

  // Make toast and other utilities globally available
  window.Toast = Toast;
  window.Modal = Modal;
  window.DemoData = DemoData;
  window.confirm = confirm;

  console.log('%c NEXORAAI ', 'background:#D9F000;color:#070B0D;font-weight:bold;padding:4px 8px;border-radius:4px;', 'Platform loaded');
});
