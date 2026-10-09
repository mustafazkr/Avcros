// Avcros — Auth-aware site header
//
// Renders the header ONCE, then updates only the auth slot when
// the signed-in state changes. Uses onAuthStateChange as the single
// source of truth to avoid race conditions.

(function () {
  'use strict';

  const state = {
    config: null,
    container: null,
    currentUser: null,
    themeObserver: null,
    authSubscription: null
  };

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isDark() {
    if (document.body.classList.contains('dark-theme')) return true;
    if (document.body.classList.contains('light-theme')) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function logoPath() {
    return isDark()
      ? state.config.base + 'images/branding/olkvaj-light.png'
      : state.config.base + 'images/branding/olkvaj-dark.png';
  }

  /* ---------- Auth slot fragments ---------- */

  function signedOutSlot() {
    return `<a href="${state.config.base}auth/signin.html" class="login-link">Log in</a>`;
  }

  function signedInSlot(user) {
    const meta = user.user_metadata || {};
    const username =
      meta.username ||
      meta.display_name ||
      (user.email || '').split('@')[0];
    const initial = (username || '?').charAt(0).toUpperCase();

    return `
      <div class="header-user" data-user-menu>
        <button type="button" class="header-user-btn"
                aria-haspopup="menu" aria-expanded="false">
          <span class="header-user-avatar">${esc(initial)}</span>
          <span class="header-user-name">@${esc(username)}</span>
          <svg class="header-user-chevron" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="header-user-dropdown" role="menu" hidden>
          <div class="header-user-dropdown-head">
            <div class="header-user-dropdown-name">@${esc(username)}</div>
            <div class="header-user-dropdown-email">${esc(user.email || '')}</div>
          </div>
          <a href="${state.config.base}main/settings.html"
             class="header-user-dropdown-item" role="menuitem">Settings</a>
          <button type="button"
                  class="header-user-dropdown-item header-user-signout"
                  role="menuitem" data-signout>Sign out</button>
        </div>
      </div>
    `;
  }

  /* ---------- Frame: rendered once ---------- */

  function renderFrame() {
    const cfg = state.config;

    state.container.innerHTML = `
      <header>
        <div class="header-left">
          <a href="${cfg.base}main/index.html" class="brand" aria-label="Avcros home">
            <img src="${logoPath()}" alt="Avcros" class="brand-logo" data-brand-logo>
          </a>
          <nav>
            <a href="${cfg.base}main/index.html">Home</a>
            <a href="#">About</a>
            <a href="${cfg.base}main/settings.html">Settings</a>
          </nav>
        </div>
        <div class="header-actions">
          <span data-auth-slot>${signedOutSlot()}</span>
          <a href="${cfg.base}sports/football/profiles/players/"
             class="btn btn-primary">Browse Players</a>
        </div>
      </header>
    `;

    watchTheme();
  }

  /* ---------- Auth slot: updated in place ---------- */

  function updateAuthSlot(user) {
    const slot = state.container.querySelector('[data-auth-slot]');
    if (!slot) return;

    const was = state.currentUser;
    const isNow = user || null;

    // Skip if unchanged
    if (!was && !isNow) return;
    if (was && isNow && was.id === isNow.id) return;

    slot.innerHTML = isNow ? signedInSlot(isNow) : signedOutSlot();
    state.currentUser = isNow;
    wireDropdown();
    wireSignOut();
  }

  /* ---------- Interactions ---------- */

  function wireDropdown() {
    const btn = state.container.querySelector('.header-user-btn');
    const dropdown = state.container.querySelector('.header-user-dropdown');
    if (!btn || !dropdown) return;

    // Remove any prior listeners by cloning
    const freshBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(freshBtn, btn);

    freshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      freshBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!state.container.contains(e.target)) {
        dropdown.hidden = true;
        freshBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dropdown.hidden) {
        dropdown.hidden = true;
        freshBtn.setAttribute('aria-expanded', 'false');
        freshBtn.focus();
      }
    });
  }

  function wireSignOut() {
    const btn = state.container.querySelector('[data-signout]');
    if (!btn) return;
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await AvcrosAuth.signOut();
        updateAuthSlot(null);
      } catch (err) {
        console.error('[site-header] Sign out failed:', err);
      }
    });
  }

  function watchTheme() {
    if (state.themeObserver) return;
    state.themeObserver = new MutationObserver(() => {
      const logo = state.container.querySelector('[data-brand-logo]');
      if (logo) logo.src = logoPath();
    });
    state.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* ---------- Mount ---------- */

  async function mount(mountId, opts) {
    const id = mountId || 'site-header';
    const container = document.getElementById(id);
    if (!container) {
      console.warn('[site-header] Element #' + id + ' not found');
      return;
    }

    state.config = Object.assign({ base: './' }, opts || {});
    state.container = container;

    // 1. Render the frame immediately with signed-out state
    renderFrame();

    // 2. Read the session from localStorage (no network) and hydrate
    try {
      const session = await AvcrosAuth.getSession();
      if (session && session.user) {
        updateAuthSlot(session.user);
      }
    } catch (e) {
      // no session or network blocked — stay signed out
    }

    // 3. Subscribe to auth state as the source of truth
    try {
      state.authSubscription = await AvcrosAuth.onAuthChange((event, session) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' ||
            event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          const user = (session && session.user) ? session.user : null;
          updateAuthSlot(user);
        }
      });
    } catch (e) {
      // subscription failed — header still works with what we have
    }
  }

  window.AvcrosHeader = { mount };
})();
