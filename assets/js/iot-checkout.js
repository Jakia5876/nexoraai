/**
 * NEXORAAI - Incomplete Orders & Abandoned Checkout Tracker (iot-checkout.js)
 * Real-time keystroke and input listener for WooCommerce, Shopify, and Custom Checkouts.
 * Automatically captures customer phone, name, email, and cart value before they exit.
 */
(function(window, document) {
  'use strict';

  const scriptTag = document.currentScript || document.querySelector('script[data-tenant-key]');
  const TENANT_KEY = scriptTag ? scriptTag.getAttribute('data-tenant-key') || 'ORG_NEXORA_LIVE' : 'ORG_NEXORA_LIVE';
  const API_ENDPOINT = scriptTag ? scriptTag.getAttribute('data-endpoint') || 'https://api.nexoraai.com/v1/track/incomplete' : 'https://api.nexoraai.com/v1/track/incomplete';

  // Session state
  const session = {
    sessionId: 'INC-' + Math.floor(1000 + Math.random() * 9000),
    tenantKey: TENANT_KEY,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    cartTotal: '0',
    cartItems: [],
    lastStep: 'Checkout Form',
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCompleted: false
  };

  let pushTimeout = null;
  let hasPushed = false;

  // Detect input fields across platforms (WooCommerce, Shopify, Custom HTML)
  function detectFieldType(input) {
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const type = (input.type || '').toLowerCase();

    if (type === 'tel' || name.includes('phone') || id.includes('phone') || placeholder.includes('phone') || name.includes('billing_phone') || id.includes('billing_phone')) {
      return 'phone';
    }
    if (type === 'email' || name.includes('email') || id.includes('email') || placeholder.includes('email') || name.includes('billing_email')) {
      return 'email';
    }
    if (name.includes('name') || id.includes('name') || placeholder.includes('name') || name.includes('billing_first_name') || id.includes('billing_first_name')) {
      return 'name';
    }
    if (name.includes('address') || id.includes('address') || placeholder.includes('address') || name.includes('billing_address_1')) {
      return 'address';
    }
    return null;
  }

  // Sanitize and extract values
  function handleInput(e) {
    const input = e.target;
    if (!input || !input.value) return;
    const val = input.value.trim();
    const field = detectFieldType(input);

    if (field === 'phone' && val.length >= 7) {
      session.customerPhone = val;
      schedulePush();
    } else if (field === 'name' && val.length >= 2) {
      session.customerName = val;
      schedulePush();
    } else if (field === 'email' && val.includes('@') && val.includes('.')) {
      session.customerEmail = val;
      schedulePush();
    } else if (field === 'address' && val.length >= 5) {
      session.customerAddress = val;
      schedulePush();
    }
  }

  // Scrape cart / total if available
  function detectCart() {
    const totalEl = document.querySelector('.order-total .amount, .wc-block-components-totals-item__value, #order_total, .cart-total, [data-checkout-total]');
    if (totalEl) {
      session.cartTotal = totalEl.textContent.trim();
    }
  }

  // Debounced push to avoid flooding
  function schedulePush() {
    if (session.isCompleted) return;
    if (!session.customerPhone && !session.customerEmail) return;

    session.updatedAt = new Date().toISOString();
    detectCart();

    clearTimeout(pushTimeout);
    pushTimeout = setTimeout(sendBeaconData, 2000);
  }

  // Send payload to Nexora AI Tracker
  function sendBeaconData() {
    if (session.isCompleted || (!session.customerPhone && !session.customerEmail)) return;

    const payload = JSON.stringify(session);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_ENDPOINT, payload);
    } else {
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(function(err) {
        console.debug('[NEXORAAI Tracker] Sync', err);
      });
    }
    hasPushed = true;
  }

  // Listen for order completion
  function markCompleted() {
    session.isCompleted = true;
    clearTimeout(pushTimeout);
  }

  // Attach event listeners
  document.addEventListener('input', handleInput, { passive: true });
  document.addEventListener('change', handleInput, { passive: true });
  document.addEventListener('blur', handleInput, true);

  window.addEventListener('beforeunload', function() {
    if (!session.isCompleted && (session.customerPhone || session.customerEmail)) {
      sendBeaconData();
    }
  });

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && !session.isCompleted) {
      sendBeaconData();
    }
  });

  // Intercept checkout submit buttons
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && (form.classList.contains('checkout') || form.id === 'checkout' || form.action.includes('checkout'))) {
      markCompleted();
    }
  });

  console.log('[NEXORAAI] Incomplete Orders & Checkout Tracker initialized. Session:', session.sessionId);
})(window, document);
