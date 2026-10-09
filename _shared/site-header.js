// Avcros — Auth-aware site header
//
// Renders the site header with a signed-in / signed-out state.
// Depends on AvcrosAuth (auth.js) and the page already including
// supabase-config.js before this file.
//
// Usage:
//   <div id="site-header"></div>
//   ...
//   <script src="../_shared/supabase-config.js"></script>
//   <script src="../_shared/auth.js"></script>
//   <script src="../_shared/site-header.js"></script>
//   <script>AvcrosHeader.mount('site-header', { base: '../' });</script>
//
// `base` is the relative path from the current page back to the `en/` folder.
//   en/main/index.html                    →  '../'
//   en/auth/signup.html                   →  '../'
//   en/sports/football/profiles/clubs/... →  '../../../../'

(function () {
  'use strict';

  const state = {
    config: null,
    container: null,
    currentUser: null,
    themeObserver: null
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

  /* ---------- Fragments ---------- */

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

  /* ---------- Render ---------- */

  function renderHeader(user) {
    const cfg = state.config;
    const authSlot = user ? signedInSlot(user) : signedOutSlot();

    state.container.innerHTML = `
      <header class="site-header">
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
          ${authSlot}
          <a href="${cfg.base}sports/football/profiles/players/"
             class="btn btn-primary">Browse Players</a>
        </div>
      </header>
    `;

    state.currentUser = user || null;
    wireDropdown();
    wireSignOut();
    watchTheme();
  }

  /* ---------- Interactions ---------- */

  function wireDropdown() {
    const btn = state.container.querySelector('.header-user-btn');
    const dropdown = state.container.querySelector('.header-user-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!state.container.contains(e.target)) {
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dropdown.hidden) {
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
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
        renderHeader(null);
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

  /* ---------- Refresh from auth state ---------- */

  async function refresh() {
    if (!state.container) return;
    try {
      const user = await AvcrosAuth.getUser();
      const was = state.currentUser;
      const isNow = user || null;

      if ((!was && isNow) || (was && !isNow) || (was && isNow && was.id !== isNow.id)) {
        renderHeader(isNow);
      } else if (isNow) {
        state.currentUser = isNow;
      }
    } catch (e) {
      // Network failure — if we were showing a signed-in state, drop it
      if (state.currentUser) renderHeader(null);
    }
  }

  /* ---------- Public API ---------- */

  async function mount(mountId, opts) {
    const id = mountId || 'site-header';
    const container = document.getElementById(id);
    if (!container) {
      console.warn('[site-header] Element #' + id + ' not found');
      return;
    }

    state.config = Object.assign({ base: './' }, opts || {});
    state.container = container;

    // Render signed-out state instantly (no network needed)
    renderHeader(null);

    // Then check the actual auth state
    try {
      const user = await AvcrosAuth.getUser();
      if (user) renderHeader(user);
    } catch (e) {
      // Network failure — stay signed out visually
    }

    // React to sign-in / sign-out from other tabs
    try {
      if (AvcrosAuth.onAuthChange) {
        await AvcrosAuth.onAuthChange((event) => {
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
            refresh();
          }
        });
      }
    } catch (e) { /* ignore */ }
  }

  window.AvcrosHeader = { mount, refresh };
})();
