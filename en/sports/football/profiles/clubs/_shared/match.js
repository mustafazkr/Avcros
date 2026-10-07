/* ============================================================
   OLKVAJ — MATCH PAGE ENGINE
   Location: sports/football/profiles/clubs/_shared/match.js
   ============================================================ */

   (function () {
    'use strict';
  
    const CLUB = window.__MATCH_CLUB__ || '';
    const ID   = window.__MATCH_ID__   || '';
    const FILE = window.__MATCH_FILE__ || '';
  
    if (!CLUB || !ID || !FILE) {
      renderError('Missing match parameters. The URL must include <code>?club=</code>, <code>&amp;id=</code>, and <code>&amp;file=</code>.');
      return;
    }
  
    /* ---- Shared state ---- */
  
    let CURRENT_MATCH = null;
  
    /* ============================================================
       SETTINGS READERS
       ============================================================ */
  
    function isResearchModeOn() {
      return localStorage.getItem('olkvaj_research_mode') === 'on';
    }
  
    function isKeybindsAllowed() {
      return localStorage.getItem('olkvaj_keybinds') !== 'off';
    }
  
    function isShortcutsUnlocked() {
      return isKeybindsAllowed() && isResearchModeOn();
    }
  
    /* ---- Calendar / date ---- */
  
    const CALENDAR = localStorage.getItem('olkvaj_calendar') || 'gregorian';
    const MONTHS_GREG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const MONTHS_HIJRI = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'];
    const MONTHS_PERSIAN = ['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar','Mehr','Aban','Azar','Dey','Bahman','Esfand'];
    const STEMS = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
    const BRANCHES = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
  
    function gregToJDN(y, m, d) {
      const a = Math.floor((14 - m) / 12);
      const y2 = y + 4800 - a;
      const m2 = m + 12 * a - 3;
      return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    }
    function gregToHijri(y, m, d) {
      const jdn = gregToJDN(y, m, d);
      const l0 = jdn - 1948440 + 10632;
      const n = Math.floor((l0 - 1) / 10631);
      let l = l0 - 10631 * n + 354;
      const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
      l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
      const month = Math.floor((24 * l) / 709);
      const day = l - Math.floor((709 * month) / 24);
      const year = 30 * n + j - 30;
      return { year, month, day };
    }
    function gregToPersian(gy, gm, gd) {
      const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
      let jy = (gy <= 1600) ? 0 : 979;
      gy -= (gy <= 1600) ? 621 : 1600;
      const gy2 = (gm > 2) ? (gy + 1) : gy;
      let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
      jy += 33 * Math.floor(days / 12053);
      days %= 12053;
      jy += 4 * Math.floor(days / 1461);
      days %= 1461;
      if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
      const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
      const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
      return { year: jy, month: jm, day: jd };
    }
    function gregToChineseYear(gy) { return `${STEMS[(gy - 4) % 10]}${BRANCHES[(gy - 4) % 12]}`; }
  
    function formatDate(y, m, d) {
      if (CALENDAR === 'gregorian') return `${d} ${MONTHS_GREG[m - 1]} ${y}`;
      if (CALENDAR === 'islamic') { const h = gregToHijri(y, m, d); return `${h.day} ${MONTHS_HIJRI[h.month - 1]} ${h.year} AH`; }
      if (CALENDAR === 'persian') { const p = gregToPersian(y, m, d); return `${p.day} ${MONTHS_PERSIAN[p.month - 1]} ${p.year} SH`; }
      if (CALENDAR === 'chinese') return `${gregToChineseYear(y)} (${y} CE)`;
      return `${d} ${MONTHS_GREG[m - 1]} ${y}`;
    }
    function formatDateISO(iso) {
      if (!iso) return '';
      const [y, m, d] = iso.split('-').map(Number);
      return formatDate(y, m, d);
    }
    function parseMin(minStr) {
      if (minStr === undefined || minStr === null) return 0;
      const s = String(minStr).replace(/[^0-9+]/g, '');
      if (s.indexOf('+') !== -1) {
        const parts = s.split('+').map(n => parseInt(n, 10) || 0);
        return parts[0] + parts[1];
      }
      return parseInt(s, 10) || 0;
    }
  
    /* ---- Utils ---- */
  
    function esc(s) {
      if (s === null || s === undefined) return '';
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function initials(name) {
      if (!name) return '';
      return name.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
    }
    function clubLogo(slug) { return `../../clubs-img/${slug}.png`; }
    function flagImgPath(flag) { return `../../../../images/flags/${flag}.png`; }
    function brandLogoLight() { return `../../../../images/branding/olkvaj-dark.png`; }
    function brandLogoDark()  { return `../../../../images/branding/olkvaj-light.png`; }
    function slugify(name) {
      if (!name) return '';
      return String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load: ' + src));
        document.head.appendChild(s);
      });
    }
  
    /* ============================================================
       SESSION MEMORY
       ============================================================ */
  
    const SESSION_KEY = `olkvaj_match_session:${ID}`;
  
    function loadSession() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) || {}) : {};
      } catch (e) { return {}; }
    }
  
    function saveSession(patch) {
      try {
        const cur = loadSession();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...cur, ...patch }));
      } catch (e) {}
    }
  
    function restoreSession() {
      const s = loadSession();
      if (s.sTab) {
        const tab = document.querySelector(`.match-modal-tab[data-mtab="${s.sTab}"]`);
        if (tab) tab.click();
      }
      if (s.sOpen) document.body.classList.add('s-toggled');
      if (s.notesOpen) document.body.classList.add('notes-panel-open');
    }
  
    /* ============================================================
       ARIA ANNOUNCER
       ============================================================ */
  
    let _announceTimer = null;
  
    function announce(text) {
      const el = document.getElementById('ariaAnnouncer');
      if (!el) return;
      el.textContent = '';
      clearTimeout(_announceTimer);
      _announceTimer = setTimeout(() => { el.textContent = text; }, 30);
    }
  
    const ANNOUNCE_MAP = {
      'alt-held':              ['Compare mode on',  'Compare mode off'],
      'crosshair-held':        ['Crosshair mode on','Crosshair mode off'],
      'xray-held':             ['X-ray mode on',    'X-ray mode off'],
      's-toggled':             ['Mini scorecard shown', 'Mini scorecard hidden'],
      'shortcuts-open':        ['Research mode panel open', 'Research mode panel closed'],
      'notes-panel-open':      ['Notes panel open', 'Notes panel closed'],
      'annotation-modal-open': ['Annotation dialog open', 'Annotation dialog closed'],
      'note-pick-mode':        ['Note pick mode on — click anywhere to annotate', 'Note pick mode off'],
      'chart-fullscreen':      ['Shot map fullscreen on', 'Shot map fullscreen off']
    };
  
    function wireAriaAnnouncer() {
      const body = document.body;
      let prev = new Set(body.classList);
  
      const obs = new MutationObserver(() => {
        const cur = new Set(body.classList);
  
        Object.entries(ANNOUNCE_MAP).forEach(([cls, [onMsg, offMsg]]) => {
          const was = prev.has(cls);
          const now = cur.has(cls);
          if (was === now) return;
          announce(now ? onMsg : offMsg);
        });
  
        if (prev.has('s-toggled') !== cur.has('s-toggled')) {
          saveSession({ sOpen: cur.has('s-toggled') });
        }
        if (prev.has('notes-panel-open') !== cur.has('notes-panel-open')) {
          saveSession({ notesOpen: cur.has('notes-panel-open') });
        }
  
        prev = cur;
      });
  
      obs.observe(body, { attributes: true, attributeFilter: ['class'] });
    }
  
    /* ============================================================
       SITE CHROME  — header, footer, cookies popup
       ============================================================ */
  
    function buildSiteHeader() {
      const isDark = document.body.classList.contains('dark-theme');
      const logoSrc = isDark ? brandLogoDark() : brandLogoLight();
      return `
        <div class="container">
          <header class="site-header">
            <div class="site-header-left">
              <a href="../../../../main/index.html" class="site-brand" aria-label="Olkvaj home">
                <img src="${logoSrc}"
                     data-logo-light="${brandLogoLight()}"
                     data-logo-dark="${brandLogoDark()}"
                     alt="Olkvaj"
                     class="site-brand-logo">
              </a>
              <nav class="site-nav">
                <a href="../../../../main/index.html">Home</a>
                <a href="#">About</a>
                <a href="../../../../main/settings.html">Settings</a>
              </nav>
            </div>
            <div class="site-header-actions">
              <a href="#" class="login-link">Log in</a>
              <a href="../players/" class="btn btn-primary">Browse Players</a>
            </div>
          </header>
        </div>
      `;
    }
  
    function buildSiteFooter() {
      return `
        <footer class="site-footer">
          <div class="site-footer-inner">
            <div class="site-footer-grid">
  
              <div class="site-footer-col">
                <h2 class="site-footer-heading">Providing Detailed<br>Analytics</h2>
                <a href="mailto:olkvajdata@gmail.com" class="site-footer-cta">
                  <span class="site-footer-cta-main">Get in Touch</span>
                  <span class="site-footer-cta-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </span>
                </a>
              </div>
  
              <div class="site-footer-col">
                <div class="site-footer-block">
                  <span class="site-footer-block-label">Contact Mail</span>
                  <a href="mailto:olkvajdata@gmail.com" class="site-footer-block-value">olkvajdata@gmail.com</a>
                </div>
                <div class="site-footer-block">
                  <span class="site-footer-block-label">Address</span>
                  <span class="site-footer-block-value">Kabul, Afghanistan</span>
                </div>
              </div>
  
              <div class="site-footer-col">
                <span class="site-footer-col-label">Menu</span>
                <div class="site-footer-col-links">
                  <a href="../../../../main/index.html">Home</a>
                  <a href="#">About</a>
                  <a href="mailto:olkvajdata@gmail.com">Contact</a>
                </div>
              </div>
  
              <div class="site-footer-col">
                <span class="site-footer-col-label">Social</span>
                <div class="site-footer-socials">
                  <a href="https://x.com/Olkvaj" class="site-footer-social-icon"
                     aria-label="X" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@Olkvaj" class="site-footer-social-icon"
                     aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com/Olkvaj" class="site-footer-social-icon"
                     aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://discord.gg/n3hhNfHdHG" class="site-footer-social-icon"
                     aria-label="Discord" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                  </a>
                </div>
              </div>
  
            </div>
  
            <div class="site-footer-bottom">
              <div class="site-footer-bottom-left">
                <a href="../../../../main/privacy.html">Privacy Policy</a>
                <a href="../../../../main/cookies.html">Cookies</a>
                <a href="../../../../main/terms.html">Terms of Service</a>
              </div>
              <div class="site-footer-bottom-right">
                2026 Olkvaj. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      `;
    }
  
    function buildCookiesBanner() {
      return `
        <div class="cookies-popup" id="cookiesBanner" role="dialog" aria-modal="false" aria-label="Cookie consent">
          <button class="cookies-popup-close" type="button" aria-label="Dismiss"
                  data-cookie-action="essential">&times;</button>
          <div class="cookies-popup-title">Cookies</div>
          <div class="cookies-popup-text">
            We use a small number of essential cookies to remember your preferences —
            theme, calendar, research mode. See our
            <a href="../../../../main/cookies.html">cookie policy</a> and
            <a href="../../../../main/privacy.html">privacy policy</a> for details.
          </div>
          <div class="cookies-popup-actions">
            <button type="button" class="cookies-btn cookies-btn-secondary"
                    data-cookie-action="essential">Essential only</button>
            <button type="button" class="cookies-btn cookies-btn-primary"
                    data-cookie-action="accept">Accept all</button>
          </div>
        </div>
      `;
    }
  
    function wireCookiesBanner() {
      const banner = document.getElementById('cookiesBanner');
      if (!banner) return;
  
      const consent = localStorage.getItem('olkvaj_cookies');
      if (!consent) {
        document.body.classList.add('cookies-open');
        setTimeout(() => banner.classList.add('visible'), 500);
      }
  
      banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-cookie-action');
          localStorage.setItem('olkvaj_cookies', action);
          banner.classList.remove('visible');
          document.body.classList.remove('cookies-open');
          announce(action === 'accept' ? 'Cookies accepted' : 'Only essential cookies');
        });
      });
    }
  
    /* ============================================================
       ANNOTATIONS
       ============================================================ */
  
    const NOTES_KEY = `olkvaj_annotations:${ID}`;
  
    function loadAnnotations() {
      try {
        const raw = localStorage.getItem(NOTES_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(arr)) return [];
        return arr.map(n => ({ ...n, type: n.type || 'shot' }));
      } catch (e) { return []; }
    }
  
    function saveAnnotations(list) {
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(list));
      } catch (e) {}
    }
  
    const ANCHOR_SELECTOR = [
      '.name-tip-trigger',
      '.match-scorer-name-text',
      '.match-pitch-name',
      '.match-modal-score',
      '.msb-score',
      '.msb-team-name',
      '.msb-venue',
      '.msb-competition',
      '.match-info-value',
      '.match-info-label',
      '.match-stat-label',
      '.match-stat-home-value',
      '.match-stat-away-value',
      '.match-modal-subline',
      '.match-modal-team-name',
      '.match-lineup-name',
      '.match-sub-name'
    ].join(',');
  
    function buildAnchorSelector(el) {
      if (!el || !el.tagName) return '';
      if (el.id) return '#' + el.id;
      const parts = [];
      let cur = el;
      let depth = 0;
      while (cur && cur !== document.body && depth < 8) {
        let tag = cur.tagName.toLowerCase();
        if (cur.parentElement) {
          const sibs = Array.from(cur.parentElement.children).filter(c => c.tagName === cur.tagName);
          if (sibs.length > 1) tag += ':nth-of-type(' + (sibs.indexOf(cur) + 1) + ')';
        }
        parts.unshift(tag);
        cur = cur.parentElement;
        depth++;
      }
      return parts.join(' > ');
    }
  
    function describeAnchor(el) {
      if (!el) return 'Element';
      const txt = (el.textContent || '').trim().slice(0, 60);
      if (el.classList.contains('name-tip-trigger')) return txt || 'Name';
      if (el.classList.contains('match-scorer-name-text')) return 'Goal · ' + txt;
      if (el.classList.contains('match-pitch-name')) return 'Pitch · ' + txt;
      if (el.classList.contains('match-modal-score')) return 'Scoreline · ' + txt;
      if (el.classList.contains('msb-score')) return 'Scoreline · ' + txt;
      if (el.classList.contains('msb-team-name')) return 'Team · ' + txt;
      if (el.classList.contains('msb-venue')) return 'Stadium · ' + txt;
      if (el.classList.contains('msb-competition')) return 'Competition · ' + txt;
      if (el.classList.contains('match-modal-team-name')) return 'Team · ' + txt;
      if (el.classList.contains('match-info-value')) return 'Info · ' + txt;
      if (el.classList.contains('match-info-label')) return 'Field · ' + txt;
      if (el.classList.contains('match-stat-label')) return 'Stat · ' + txt;
      if (el.classList.contains('match-stat-home-value') || el.classList.contains('match-stat-away-value')) {
        return 'Value · ' + txt;
      }
      if (el.classList.contains('match-modal-subline')) return 'Competition · ' + txt;
      if (el.classList.contains('match-lineup-name')) return 'Lineup · ' + txt;
      if (el.classList.contains('match-sub-name')) return 'Sub · ' + txt;
      return txt || el.tagName.toLowerCase();
    }
  
    function findAnchorElement(n) {
      if (!n) return null;
      if (n.selector) {
        try {
          const el = document.querySelector(n.selector);
          if (el) return el;
        } catch (e) {}
      }
      if (n.textSnapshot) {
        const candidates = document.querySelectorAll(ANCHOR_SELECTOR);
        for (const el of candidates) {
          if ((el.textContent || '').trim().includes(n.textSnapshot)) return el;
        }
      }
      return null;
    }
  
    function applyAnnotationMarkers() {
      const list = loadAnnotations();
      const shotIdx = new Set(list.filter(a => a.type === 'shot').map(a => a.shotIdx));
      document.querySelectorAll('.shot-marker, .xg-shot-dot').forEach(el => {
        const idx = parseInt(el.getAttribute('data-shot-idx'), 10);
        el.classList.toggle('is-annotated', shotIdx.has(idx));
      });
    }
  
    function applyAnchorNoteMarkers() {
      document.querySelectorAll('.has-anchor-note').forEach(el => el.classList.remove('has-anchor-note'));
      loadAnnotations().filter(n => n.type === 'anchor').forEach(n => {
        const el = findAnchorElement(n);
        if (el) el.classList.add('has-anchor-note');
      });
    }
  
    function updateAnnotationChip() {
      const chip = document.getElementById('annotationChip');
      if (!chip) return;
      const count = loadAnnotations().length;
      chip.hidden = count === 0;
      const counter = chip.querySelector('.annotation-chip-count');
      if (counter) counter.textContent = String(count);
    }
  
    function buildAnnotationChip() {
      return `
        <button class="annotation-chip" id="annotationChip" type="button" hidden
                aria-label="Open notes panel">
          <span class="annotation-chip-icon" aria-hidden="true">&#9998;</span>
          <span class="annotation-chip-count">0</span>
          <span class="annotation-chip-label">notes</span>
        </button>
      `;
    }
  
    function buildAnnotationModal() {
      return `
        <div class="annotation-modal" id="annotationModal" role="dialog" aria-modal="true"
             aria-label="Add note" data-mode="shot">
          <div class="annotation-modal-backdrop" data-close-annotation></div>
          <div class="annotation-modal-panel">
            <button class="annotation-modal-close" type="button" aria-label="Close"
                    data-close-annotation>&times;</button>
            <div class="annotation-modal-title">Add note</div>
            <div class="annotation-modal-context" id="annotationContext"></div>
            <textarea class="annotation-modal-textarea" id="annotationText"
                      placeholder="Add your note…"
                      aria-label="Note text" maxlength="600"></textarea>
            <div class="annotation-modal-actions">
              <button class="annotation-btn danger" id="annotationDelete" type="button" hidden>Delete</button>
              <div class="annotation-modal-spacer"></div>
              <button class="annotation-btn ghost" type="button" data-close-annotation>Cancel</button>
              <button class="annotation-btn primary" id="annotationSave" type="button">Save</button>
            </div>
          </div>
        </div>
      `;
    }
  
    function buildNotesPanel() {
      return `
        <div class="notes-panel" id="notesPanel">
          <div class="notes-panel-backdrop" data-close-notes></div>
          <aside class="notes-panel-sheet" role="dialog" aria-modal="true" aria-label="Match notes">
            <button class="notes-panel-close" type="button" aria-label="Close"
                    data-close-notes>&times;</button>
            <div class="notes-panel-header">
              <div class="notes-panel-title">Match Notes</div>
              <div class="notes-panel-subtitle">Private to this device</div>
            </div>
            <ul class="notes-panel-list" id="notesPanelList"></ul>
            <div class="notes-panel-empty" id="notesPanelEmpty">
              No notes yet. Click any shot, or hold Shift + N and click anywhere to annotate.
            </div>
          </aside>
        </div>
      `;
    }
  
    function openAnnotationModal(opts) {
      const modal = document.getElementById('annotationModal');
      const ctx = document.getElementById('annotationContext');
      const ta = document.getElementById('annotationText');
      const del = document.getElementById('annotationDelete');
      const title = modal && modal.querySelector('.annotation-modal-title');
      if (!modal || !ctx || !ta || !del || !title) return;
  
      const shotTip = document.getElementById('shotTooltip');
      const xgTip = document.getElementById('xgTooltip');
      if (shotTip) shotTip.classList.remove('active');
      if (xgTip) xgTip.classList.remove('active');
  
      if (opts.mode === 'shot') {
        const shotIdx = opts.shotIdx;
        const shot = CURRENT_MATCH && CURRENT_MATCH.shots ? CURRENT_MATCH.shots[shotIdx] : null;
        if (!shot) return;
        const teamName = shot.team === 'away' ? CURRENT_MATCH.away.name : CURRENT_MATCH.home.name;
  
        modal.dataset.mode = 'shot';
        modal.dataset.shotIdx = String(shotIdx);
        modal.removeAttribute('data-anchor-key');
  
        title.textContent = 'Note on this shot';
        ctx.innerHTML = `
          <div class="annotation-context-row">
            <span class="annotation-context-min">${esc(shot.min || '')}</span>
            <span class="annotation-context-player">${esc(shot.player || '')}</span>
          </div>
          <div class="annotation-context-sub">
            ${esc(teamName)}
            &middot; xG ${Number(shot.xg || 0).toFixed(2)}
            &middot; ${esc(shot.outcome || '')}
          </div>
        `;
  
        const existing = loadAnnotations().find(a => a.type === 'shot' && a.shotIdx === shotIdx);
        ta.value = existing ? existing.text : '';
        del.hidden = !existing;
      } else if (opts.mode === 'anchor') {
        modal.dataset.mode = 'anchor';
        modal.dataset.anchorKey = opts.selector;
        modal.removeAttribute('data-shot-idx');
  
        title.textContent = 'Note on this element';
        ctx.innerHTML = `
          <div class="annotation-context-row">
            <span class="annotation-context-badge">ELEMENT</span>
            <span class="annotation-context-player">${esc(opts.label || 'Element')}</span>
          </div>
          <div class="annotation-context-sub">${esc((opts.textSnapshot || '').slice(0, 80))}</div>
        `;
  
        const existing = loadAnnotations().find(a => a.type === 'anchor' && a.selector === opts.selector);
        ta.value = existing ? existing.text : '';
        del.hidden = !existing;
      }
  
      document.body.classList.add('annotation-modal-open');
      setTimeout(() => ta.focus(), 40);
    }
  
    function closeAnnotationModal() {
      document.body.classList.remove('annotation-modal-open');
    }
  
    function commitAnnotation() {
      const modal = document.getElementById('annotationModal');
      const ta = document.getElementById('annotationText');
      if (!modal || !ta) return;
      const mode = modal.dataset.mode || 'shot';
      const text = ta.value.trim();
  
      if (mode === 'shot') {
        const idx = parseInt(modal.dataset.shotIdx, 10);
        if (!isFinite(idx)) return;
        const shot = CURRENT_MATCH && CURRENT_MATCH.shots ? CURRENT_MATCH.shots[idx] : null;
        if (!shot) return;
  
        const list = loadAnnotations();
        const pos = list.findIndex(a => a.type === 'shot' && a.shotIdx === idx);
  
        if (!text) {
          if (pos >= 0) list.splice(pos, 1);
          saveAnnotations(list);
          closeAnnotationModal();
          applyAnnotationMarkers();
          applyAnchorNoteMarkers();
          updateAnnotationChip();
          renderNotesPanelList();
          announce('Note deleted');
          return;
        }
  
        const payload = {
          type: 'shot',
          shotIdx: idx,
          min: shot.min || '',
          player: shot.player || '',
          team: shot.team || 'home',
          xg: shot.xg,
          outcome: shot.outcome || '',
          text,
          createdAt: pos >= 0 ? list[pos].createdAt : Date.now(),
          updatedAt: Date.now()
        };
        if (pos >= 0) list[pos] = payload;
        else list.push(payload);
        saveAnnotations(list);
        closeAnnotationModal();
        applyAnnotationMarkers();
        applyAnchorNoteMarkers();
        updateAnnotationChip();
        renderNotesPanelList();
        announce('Note saved');
      } else if (mode === 'anchor') {
        const selector = modal.dataset.anchorKey;
        if (!selector) return;
  
        const list = loadAnnotations();
        const pos = list.findIndex(a => a.type === 'anchor' && a.selector === selector);
  
        if (!text) {
          if (pos >= 0) list.splice(pos, 1);
          saveAnnotations(list);
          closeAnnotationModal();
          applyAnnotationMarkers();
          applyAnchorNoteMarkers();
          updateAnnotationChip();
          renderNotesPanelList();
          announce('Note deleted');
          return;
        }
  
        const el = findAnchorElement({ selector });
        const label = el ? describeAnchor(el) : (pos >= 0 ? list[pos].label : 'Element');
        const textSnapshot = el ? (el.textContent || '').trim().slice(0, 120) : '';
  
        const payload = {
          type: 'anchor',
          selector,
          label,
          textSnapshot,
          text,
          createdAt: pos >= 0 ? list[pos].createdAt : Date.now(),
          updatedAt: Date.now()
        };
        if (pos >= 0) list[pos] = payload;
        else list.push(payload);
        saveAnnotations(list);
        closeAnnotationModal();
        applyAnnotationMarkers();
        applyAnchorNoteMarkers();
        updateAnnotationChip();
        renderNotesPanelList();
        announce('Note saved');
      }
    }
  
    function deleteAnnotationShot(shotIdx) {
      const list = loadAnnotations().filter(a => !(a.type === 'shot' && a.shotIdx === shotIdx));
      saveAnnotations(list);
      applyAnnotationMarkers();
      applyAnchorNoteMarkers();
      updateAnnotationChip();
      renderNotesPanelList();
      announce('Note deleted');
    }
  
    function deleteAnnotationAnchor(selector) {
      const list = loadAnnotations().filter(a => !(a.type === 'anchor' && a.selector === selector));
      saveAnnotations(list);
      applyAnnotationMarkers();
      applyAnchorNoteMarkers();
      updateAnnotationChip();
      renderNotesPanelList();
      announce('Note deleted');
    }
  
    function renderNotesPanelList() {
      const listEl = document.getElementById('notesPanelList');
      const emptyEl = document.getElementById('notesPanelEmpty');
      if (!listEl || !emptyEl) return;
  
      const match = CURRENT_MATCH;
      const all = loadAnnotations();
      const shotNotes = all.filter(n => n.type === 'shot')
        .sort((a, b) => parseMin(a.min) - parseMin(b.min));
      const anchorNotes = all.filter(n => n.type === 'anchor');
  
      if (!all.length) {
        listEl.innerHTML = '';
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
  
      let html = '';
  
      if (shotNotes.length) {
        html += `<li class="notes-panel-section">Shot notes</li>`;
        html += shotNotes.map(n => {
          const teamName = match
            ? (n.team === 'away' ? match.away.name : match.home.name)
            : (n.team === 'away' ? 'Away' : 'Home');
          return `
            <li class="notes-panel-item">
              <button class="notes-panel-item-main" type="button" data-jump-shot="${n.shotIdx}">
                <span class="notes-panel-item-head">
                  <span class="notes-panel-item-min">${esc(n.min || '')}</span>
                  <span class="notes-panel-item-player">${esc(n.player || '')}</span>
                  <span class="notes-panel-item-team">${esc(teamName)}</span>
                </span>
                <span class="notes-panel-item-text">${esc(n.text)}</span>
              </button>
              <button class="notes-panel-item-delete" type="button"
                      data-delete-shot="${n.shotIdx}"
                      aria-label="Delete note">&times;</button>
            </li>
          `;
        }).join('');
      }
  
      if (anchorNotes.length) {
        html += `<li class="notes-panel-section">Element notes</li>`;
        html += anchorNotes.map(n => `
          <li class="notes-panel-item">
            <button class="notes-panel-item-main" type="button"
                    data-jump-anchor="${esc(n.selector)}">
              <span class="notes-panel-item-head">
                <span class="notes-panel-item-badge">ELEMENT</span>
                <span class="notes-panel-item-player">${esc(n.label || 'Element')}</span>
              </span>
              <span class="notes-panel-item-text">${esc(n.text)}</span>
            </button>
            <button class="notes-panel-item-delete" type="button"
                    data-delete-anchor="${esc(n.selector)}"
                    aria-label="Delete note">&times;</button>
          </li>
        `).join('');
      }
  
      listEl.innerHTML = html;
    }
  
    function jumpToShot(shotIdx) {
      const shotsTab = document.querySelector('.match-modal-tab[data-mtab="shots"]');
      if (shotsTab && !shotsTab.classList.contains('active')) shotsTab.click();
      document.body.classList.remove('notes-panel-open');
  
      setTimeout(() => {
        const marker = document.querySelector(`.shot-marker[data-shot-idx="${shotIdx}"]`);
        if (!marker) return;
        try { marker.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        marker.classList.add('flash');
        setTimeout(() => marker.classList.remove('flash'), 1600);
      }, 120);
    }
  
    function jumpToAnchor(selector) {
      document.body.classList.remove('notes-panel-open');
      const el = findAnchorElement({ selector });
      if (!el) { announce('Element not found'); return; }
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      el.classList.add('flash-anchor');
      setTimeout(() => el.classList.remove('flash-anchor'), 1700);
    }
  
    function wireNotePick() {
      document.addEventListener('keydown', e => {
        if (!isShortcutsUnlocked()) return;
        if (e.shiftKey && (e.key === 'N' || e.key === 'n') && !e.ctrlKey && !e.metaKey) {
          const t = e.target;
          const tag = t ? (t.tagName || '').toUpperCase() : '';
          const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable);
          if (isTyping) return;
          document.body.classList.add('note-pick-mode');
        }
      });
  
      window.addEventListener('keyup', e => {
        if (e.key === 'Shift') {
          document.body.classList.remove('note-pick-mode');
          document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
        }
      });
      window.addEventListener('blur', () => {
        document.body.classList.remove('note-pick-mode');
        document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
      });
  
      document.addEventListener('mousemove', e => {
        if (!document.body.classList.contains('note-pick-mode')) {
          document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
          return;
        }
        const target = e.target.closest(ANCHOR_SELECTOR);
        document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
        if (target) target.classList.add('note-pick-hover');
      });
  
      document.addEventListener('click', e => {
        if (!document.body.classList.contains('note-pick-mode')) return;
        if (e.target.closest('.annotation-modal, .notes-panel, .annotation-chip')) return;
  
        e.preventDefault();
        e.stopPropagation();
  
        const picked = e.target.closest(ANCHOR_SELECTOR) || e.target;
        const selector = buildAnchorSelector(picked);
        const label = describeAnchor(picked);
        const textSnapshot = (picked.textContent || '').trim().slice(0, 120);
  
        document.body.classList.remove('note-pick-mode');
        document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
  
        openAnnotationModal({ mode: 'anchor', selector, label, textSnapshot });
      }, true);
    }
  
    function wireAnnotations() {
      document.querySelectorAll('[data-close-annotation]').forEach(el => {
        el.addEventListener('click', () => closeAnnotationModal());
      });
  
      const saveBtn = document.getElementById('annotationSave');
      if (saveBtn) saveBtn.addEventListener('click', commitAnnotation);
  
      const delBtn = document.getElementById('annotationDelete');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          const modal = document.getElementById('annotationModal');
          if (!modal) return;
          const mode = modal.dataset.mode || 'shot';
          if (mode === 'shot') {
            const idx = parseInt(modal.dataset.shotIdx, 10);
            if (isFinite(idx)) { deleteAnnotationShot(idx); closeAnnotationModal(); }
          } else {
            const key = modal.dataset.anchorKey;
            if (key) { deleteAnnotationAnchor(key); closeAnnotationModal(); }
          }
        });
      }
  
      const ta = document.getElementById('annotationText');
      if (ta) {
        ta.addEventListener('keydown', e => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            commitAnnotation();
          }
        });
      }
  
      const chip = document.getElementById('annotationChip');
      if (chip) {
        chip.addEventListener('click', e => {
          e.preventDefault();
          document.body.classList.toggle('notes-panel-open');
        });
      }
  
      document.querySelectorAll('[data-close-notes]').forEach(el => {
        el.addEventListener('click', () => document.body.classList.remove('notes-panel-open'));
      });
  
      const listEl = document.getElementById('notesPanelList');
      if (listEl) {
        listEl.addEventListener('click', e => {
          const jumpShot = e.target.closest('[data-jump-shot]');
          if (jumpShot) {
            e.preventDefault();
            const idx = parseInt(jumpShot.getAttribute('data-jump-shot'), 10);
            if (isFinite(idx)) jumpToShot(idx);
            return;
          }
          const jumpAnchor = e.target.closest('[data-jump-anchor]');
          if (jumpAnchor) {
            e.preventDefault();
            jumpToAnchor(jumpAnchor.getAttribute('data-jump-anchor'));
            return;
          }
          const delShot = e.target.closest('[data-delete-shot]');
          if (delShot) {
            e.preventDefault();
            const idx = parseInt(delShot.getAttribute('data-delete-shot'), 10);
            if (isFinite(idx)) deleteAnnotationShot(idx);
            return;
          }
          const delAnchor = e.target.closest('[data-delete-anchor]');
          if (delAnchor) {
            e.preventDefault();
            deleteAnnotationAnchor(delAnchor.getAttribute('data-delete-anchor'));
            return;
          }
        });
      }
  
      document.querySelectorAll('.shot-marker, .xg-shot-dot').forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(el.getAttribute('data-shot-idx'), 10);
          if (isFinite(idx)) openAnnotationModal({ mode: 'shot', shotIdx: idx });
        });
      });
  
      applyAnnotationMarkers();
      applyAnchorNoteMarkers();
      updateAnnotationChip();
      renderNotesPanelList();
      wireNotePick();
    }
  
    /* ---- Name tooltip helpers ---- */
  
    function playerTip(name, p) {
      const slug = (p && (p.playerSlug || p.slug)) || slugify(name);
      const url = `../players/${esc(slug)}.html`;
      const pos = p && p.pos;
      const rating = p && p.rating;
      const hasRating = rating !== undefined && rating !== null && isFinite(Number(rating));
  
      return `
        <span class="name-tip-wrap">
          <span class="name-tip-trigger">${esc(name)}</span>
          <span class="name-tip" role="tooltip">
            <span class="name-tip-header">${esc(name)}</span>
            <span class="name-tip-divider"></span>
            ${pos ? `<span class="name-tip-row"><span class="name-tip-label">Position</span><span class="name-tip-value">${esc(pos)}</span></span>` : ''}
            ${hasRating ? `<span class="name-tip-row"><span class="name-tip-label">Rating</span><span class="name-tip-value">${Number(rating).toFixed(1)}</span></span>` : ''}
            <a href="${url}" class="name-tip-btn">More About Player &rarr;</a>
          </span>
        </span>
      `;
    }
  
    function clubTip(name, slug) {
      if (!slug) return esc(name);
      const url = `../${esc(slug)}.html`;
      return `
        <span class="name-tip-wrap">
          <span class="name-tip-trigger">${esc(name)}</span>
          <span class="name-tip" role="tooltip">
            <span class="name-tip-header">${esc(name)}</span>
            <span class="name-tip-divider"></span>
            <span class="name-tip-row"><span class="name-tip-label">Type</span><span class="name-tip-value">Club Profile</span></span>
            <a href="${url}" class="name-tip-btn">More About Club &rarr;</a>
          </span>
        </span>
      `;
    }
  
    function findPlayerInLineups(match, name) {
      if (!match.lineups || !name) return null;
      const key = String(name).trim().toLowerCase();
      for (const side of ['home', 'away']) {
        const lu = match.lineups[side];
        if (!lu) continue;
        for (const group of ['starters', 'subs']) {
          for (const p of (lu[group] || [])) {
            if (p.name && p.name.trim().toLowerCase() === key) return p;
          }
        }
      }
      return null;
    }
  
    function findTeamSlugByName(match, name) {
      if (!name) return null;
      const key = String(name).trim().toLowerCase();
      if (match.home && match.home.name.toLowerCase() === key) return match.home.slug;
      if (match.away && match.away.name.toLowerCase() === key) return match.away.slug;
      return null;
    }
  
    /* ---- Boot ---- */
  
    async function boot() {
      let clubData = null;
      try {
        await loadScript(`_shared/data/clubs/${CLUB}-club-data.js`);
        clubData = window.__CLUB_DATA__;
      } catch (e) {
        console.warn('[match.js] Could not load club data for', CLUB);
      }
  
      try {
        await loadScript(`_shared/data/matches/${FILE}.js`);
      } catch (e) {
        renderError(`Could not load match data file <code>${esc(FILE)}</code>.`);
        return;
      }
  
      const matches = window.__MATCHES__;
      if (!matches) {
        renderError('Match data file loaded, but no <code>window.__MATCHES__</code> object was created.');
        return;
      }
  
      const match = matches[ID];
      if (!match) {
        renderError(`No match found with ID <code>${esc(ID)}</code>. It may have been removed or the URL is incorrect.`);
        return;
      }
  
      renderPage(clubData, match);
    }
  
    function renderError(msg) {
      document.title = 'Match not available | Olkvaj';
      document.body.innerHTML = `
        <div class="container">
          <div style="max-width: 600px; margin: 80px auto; padding: 40px 32px; text-align: center; background: var(--surface); border: 1px solid var(--border-color); font-family: Inter, sans-serif;">
            <div style="font-size: 2rem; margin-bottom: 16px;">&#9917;</div>
            <h1 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main);">Match not available</h1>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">${msg}</p>
            <a href="javascript:history.back()" style="display: inline-block; padding: 10px 20px; background: var(--btn-black); color: var(--btn-white); text-decoration: none; font-size: 0.85rem; font-weight: 500;">&larr; Go back</a>
          </div>
        </div>
      `;
    }
  
    /* ---- Main render ---- */
  
    function renderPage(clubData, match) {
      CURRENT_MATCH = match;
  
      const selfName = (clubData && clubData.name) || CLUB;
      const leftTeam  = match.home;
      const rightTeam = match.away;
      const leftInits  = initials(leftTeam.name);
      const rightInits = initials(rightTeam.name);
      const hasLineups = match.lineups && match.lineups.home && match.lineups.away;
      const hasShots   = Array.isArray(match.shots) && match.shots.length > 0;
  
      const tabs = [
        { key: 'overview', label: 'Overview' },
        hasShots ? { key: 'shots', label: 'Shots' } : null,
        hasLineups ? { key: 'lineup', label: 'Lineup' } : null,
        { key: 'additional', label: 'Additional Information' }
      ].filter(Boolean);
  
      document.title = `${leftTeam.name} ${leftTeam.score}-${rightTeam.score} ${rightTeam.name} | Olkvaj`;
  
      const html = `
        ${buildSiteHeader()}
  
        ${buildMiniScoreboard(match)}
        ${buildAnnotationChip()}
        ${buildNotesPanel()}
        ${buildAnnotationModal()}
  
        <main class="match-main">
          <div class="match-modal-backdrop">
            <div class="match-modal">
              <div class="match-topbar">
                <a href="${esc(CLUB)}.html" class="match-topbar-back">&larr; Back to ${esc(selfName)}</a>
                <span class="match-topbar-brand">O L K V A J &middot; M A T C H</span>
              </div>
  
              <div class="match-modal-header">
                <div class="match-modal-scoreline">
                  <div class="match-modal-team match-modal-team-home">
                    <div class="match-modal-team-logo">
                      <img src="${clubLogo(leftTeam.slug)}" alt="${esc(leftTeam.name)}"
                           onerror="this.parentElement.textContent='${leftInits}';" />
                    </div>
                    <div class="match-modal-team-name">${clubTip(leftTeam.name, leftTeam.slug)}</div>
                    <div class="match-modal-team-scorers">${buildTeamScorers(match.homeScorers)}</div>
                  </div>
  
                  <div class="match-modal-center">
                    <div class="match-modal-score">
                      <span>${leftTeam.score}</span>
                      <span>${rightTeam.score}</span>
                    </div>
                  </div>
  
                  <div class="match-modal-team match-modal-team-away">
                    <div class="match-modal-team-logo">
                      <img src="${clubLogo(rightTeam.slug)}" alt="${esc(rightTeam.name)}"
                           onerror="this.parentElement.textContent='${rightInits}';" />
                    </div>
                    <div class="match-modal-team-name">${clubTip(rightTeam.name, rightTeam.slug)}</div>
                    <div class="match-modal-team-scorers">${buildTeamScorers(match.awayScorers)}</div>
                  </div>
                </div>
                <div class="match-modal-subline">${esc(match.compLabel || '')}</div>
                ${buildMOTM(match)}
              </div>
  
              <div class="match-modal-tabs" id="matchTabs">
                ${tabs.map((t, i) =>
                  `<button class="match-modal-tab${i === 0 ? ' active' : ''}" data-mtab="${t.key}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}">${t.label}</button>`
                ).join('')}
              </div>
  
              <div class="match-modal-body">
                <div class="match-modal-panel active" data-mpanel="overview">${buildOverviewTab(match)}</div>
                ${hasShots ? `<div class="match-modal-panel" data-mpanel="shots">${buildShotsTab(match)}</div>` : ''}
                ${hasLineups ? `<div class="match-modal-panel" data-mpanel="lineup">${buildLineupTab(match)}</div>` : ''}
                <div class="match-modal-panel" data-mpanel="additional">${buildAdditionalTab(match)}</div>
              </div>
            </div>
          </div>
        </main>
  
        ${buildSiteFooter()}
        ${buildCookiesBanner()}
        ${buildShortcutsModal()}
        <div id="ariaAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
      `;
  
      document.getElementById('app').outerHTML = html;
  
      // Wire tabs — belt-and-braces: direct binding + delegation.
      function activateTab(key) {
        document.body.classList.remove('chart-fullscreen');
        document.querySelectorAll('.match-modal-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.match-modal-panel').forEach(p => p.classList.remove('active'));
  
        const tab = document.querySelector(`.match-modal-tab[data-mtab="${key}"]`);
        const panel = document.querySelector(`.match-modal-panel[data-mpanel="${key}"]`);
        if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
        if (panel) panel.classList.add('active');
        saveSession({ sTab: key });
      }
  
      const tabsContainer = document.getElementById('matchTabs');
      if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
          const tab = e.target.closest('.match-modal-tab');
          if (!tab) return;
          const key = tab.dataset.mtab;
          if (!key) return;
          activateTab(key);
        });
      }
  
      // Direct binding as fallback
      document.querySelectorAll('.match-modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const key = tab.dataset.mtab;
          if (key) activateTab(key);
        });
      });
  
      wireStatsToggle(match);
      wireShotTooltips(match);
      wireXgTooltips(match);
      wireKeyModes();
      wireClickToPin();
      wireCompareMode(match);
      wireCrosshair(match);
      wireShortcutsModal();
      wireMiniScoreboard();
      wireAnnotations();
      wireFullscreenButton();
      wireCookiesBanner();
      wireAriaAnnouncer();
      injectCloseButtons();
  
      restoreSession();
      refreshShortcutsModalState();
    }
  
    /* ============================================================
       MINI SCOREBOARD CARD (toggled with S)
       ============================================================ */
  
    function buildMiniScoreboard(match) {
      const homeScorers = match.homeScorers || [];
      const awayScorers = match.awayScorers || [];
      const homeInits = initials(match.home.name);
      const awayInits = initials(match.away.name);
  
      function scorerRow(s) {
        return `
          <div class="msb-scorer-row">
            <span class="msb-scorer-min">${esc(s.min || '')}</span>
            <span class="msb-scorer-name">${esc(s.name || '')}</span>
            ${s.note ? `<span class="msb-scorer-note">(${esc(s.note)})</span>` : ''}
          </div>
        `;
      }
  
      function scorersBlock(scorers, teamName) {
        if (!scorers.length) {
          return `
            <div class="msb-scorers-team">
              <div class="msb-scorers-team-name">${esc(teamName)}</div>
              <div class="msb-no-scorers">No goals</div>
            </div>
          `;
        }
        return `
          <div class="msb-scorers-team">
            <div class="msb-scorers-team-name">${esc(teamName)}</div>
            ${scorers.map(scorerRow).join('')}
          </div>
        `;
      }
  
      const hasMeta = match.compLabel || match.venue;
  
      return `
        <div class="mini-scoreboard" id="miniScoreboard" aria-hidden="true">
          <button class="msb-close" type="button" aria-label="Close">&times;</button>
  
          <div class="msb-score-row">
            <div class="msb-team home">
              <span class="msb-team-name">${esc(match.home.name)}</span>
              <span class="msb-team-logo-wrap">
                <span class="msb-team-initials">${homeInits}</span>
                <img class="msb-team-logo" src="${clubLogo(match.home.slug)}" alt=""
                     onerror="this.style.display='none';" />
              </span>
            </div>
            <span class="msb-score">${match.home.score} &ndash; ${match.away.score}</span>
            <div class="msb-team away">
              <span class="msb-team-logo-wrap">
                <span class="msb-team-initials">${awayInits}</span>
                <img class="msb-team-logo" src="${clubLogo(match.away.slug)}" alt=""
                     onerror="this.style.display='none';" />
              </span>
              <span class="msb-team-name">${esc(match.away.name)}</span>
            </div>
          </div>
  
          ${hasMeta ? `
            <div class="msb-meta">
              ${match.compLabel ? `<span class="msb-competition">${esc(match.compLabel)}</span>` : ''}
              ${match.compLabel && match.venue ? `<span class="msb-dot">&middot;</span>` : ''}
              ${match.venue ? `<span class="msb-venue">${esc(match.venue)}</span>` : ''}
            </div>
          ` : ''}
  
          <div class="msb-scorers">
            ${scorersBlock(homeScorers, match.home.name)}
            ${scorersBlock(awayScorers, match.away.name)}
          </div>
        </div>
      `;
    }
  
    function wireMiniScoreboard() {
      const closeBtn = document.querySelector('.msb-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          document.body.classList.remove('s-toggled');
        });
      }
    }
  
    /* ---- Fullscreen button ---- */
  
    function wireFullscreenButton() {
      const btn = document.querySelector('.shot-map-fs-btn');
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        document.body.classList.toggle('chart-fullscreen');
      });
    }
  
    /* ---- Goalscorers (header list) ---- */
  
    function buildTeamScorers(scorers) {
      if (!scorers || !scorers.length) return '';
      return scorers.map(s => {
        const slug = s.playerSlug || slugify(s.name);
        const playerUrl = `../players/${esc(slug)}.html`;
        const hasAssist = s.assist && String(s.assist).trim().length > 0;
        return `
          <div class="match-scorer">
            <span class="match-scorer-min">${esc(s.min)}</span>
            <span class="match-scorer-name">
              <span class="match-scorer-name-text">${esc(s.name)}</span>
              ${s.note ? `<span class="match-scorer-note">(${esc(s.note)})</span>` : ''}
              <span class="match-scorer-tooltip" role="tooltip">
                <span class="match-scorer-tooltip-header">${esc(s.name)}</span>
                <span class="match-scorer-tooltip-row">
                  <span class="match-scorer-tooltip-label">Assist</span>
                  <span class="match-scorer-tooltip-value${hasAssist ? '' : ' muted'}">${hasAssist ? esc(s.assist) : 'None'}</span>
                </span>
                <a href="${playerUrl}" class="match-scorer-tooltip-btn">More About Player &rarr;</a>
              </span>
            </span>
          </div>
        `;
      }).join('');
    }
  
    /* ---- MOTM band ---- */
  
    function buildMOTM(match) {
      const motm = match.manOfTheMatch;
      if (!motm || !motm.name) return '';
      const ratingHtml = (motm.rating !== undefined && motm.rating !== null)
        ? `<div class="match-motm-rating">${esc(motm.rating)}</div>` : '';
      const motmPlayer = findPlayerInLineups(match, motm.name);
      const motmTeamSlug = findTeamSlugByName(match, motm.team);
  
      return `
        <div class="match-motm">
          <div class="match-motm-star" aria-hidden="true">&#9733;</div>
          <div class="match-motm-body">
            <div class="match-motm-label">Man of the Match</div>
            <div class="match-motm-name-row">
              <span class="match-motm-name">${playerTip(motm.name, motmPlayer)}</span>
              ${motm.team ? `<span class="match-motm-team">${clubTip(motm.team, motmTeamSlug)}</span>` : ''}
            </div>
            ${motm.blurb ? `<div class="match-motm-blurb">${esc(motm.blurb)}</div>` : ''}
          </div>
          ${ratingHtml}
        </div>
      `;
    }
  
    /* ============================================================
       OVERVIEW TAB
       ============================================================ */
  
    function buildOverviewTab(match) {
      const poss = match.possession;
      const hasPoss = poss && typeof poss.home === 'number' && typeof poss.away === 'number';
      const hasStats = (Array.isArray(match.stats) && match.stats.length > 0)
                    || (Array.isArray(match.statsFirstHalf) && match.statsFirstHalf.length > 0);
      const hasRadar = Array.isArray(match.stats) && match.stats.length > 0;
      const hasPerformers = match.lineups && match.lineups.home && match.lineups.away;
  
      if (!hasPoss && !hasStats && !hasPerformers) {
        return '<div class="match-no-data">No additional data available for this match.</div>';
      }
  
      return `
        ${hasPoss ? `
          <div class="match-possession">
            <div class="match-section-label">Possession</div>
            <div class="match-possession-bar">
              <div class="match-possession-seg home" style="width: ${poss.home}%;"><span class="match-possession-pct">${poss.home}%</span></div>
              <div class="match-possession-seg away" style="width: ${poss.away}%;"><span class="match-possession-pct">${poss.away}%</span></div>
            </div>
            <div class="match-possession-labels">
              <span class="match-possession-team">${esc(match.home.name)}</span>
              <span class="match-possession-team">${esc(match.away.name)}</span>
            </div>
          </div>
        ` : ''}
  
        ${hasRadar ? buildRadarChart(match) : ''}
        ${hasPerformers ? buildTopPerformers(match) : ''}
        ${hasStats ? buildStatsBlock(match) : ''}
      `;
    }
  
    /* ---- Radar chart ---- */
  
    function formatRadarValue(value, stat) {
      if (!isFinite(value)) return '—';
      if (stat && stat.decimals !== undefined) return Number(value).toFixed(stat.decimals);
      if (stat && stat.unit === '%') return Math.round(value) + '%';
      if (stat && stat.unit) return value + stat.unit;
      return String(Math.round(value * 100) / 100);
    }
  
    function buildRadarChart(match) {
      const stats = match.stats || [];
      if (!stats.length) return '';
  
      const statMap = {};
      stats.forEach(s => { statMap[s.label] = s; });
  
      const axes = [
        { label: 'Shots',       key: 'Shots' },
        { label: 'On Target',   key: 'Shots on Target' },
        { label: 'xG',          key: 'Expected Goals (xG)' },
        { label: 'Pass %',      key: 'Pass Accuracy' },
        { label: 'Duels %',     key: 'Duels Won' },
        { label: 'Big Chances', key: 'Big Chances Created' }
      ];
  
      const data = axes.map(a => {
        const s = statMap[a.key];
        const h  = s ? (Number(s.home) || 0) : 0;
        const aw = s ? (Number(s.away) || 0) : 0;
        const max = Math.max(h, aw, 0.001);
        return {
          label: a.label,
          stat: s || null,
          homeRaw: h,
          awayRaw: aw,
          home: h / max,
          away: aw / max
        };
      });
  
      const W = 400, H = 360;
      const CX = W / 2, CY = H / 2;
      const R = 110;
      const N = data.length;
      const step = (Math.PI * 2) / N;
      const startAngle = -Math.PI / 2;
  
      const pt = (i, r) => {
        const a = startAngle + i * step;
        return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
      };
  
      const rings = [0.25, 0.5, 0.75, 1].map(f => {
        const pts = [];
        for (let i = 0; i < N; i++) {
          const p = pt(i, R * f);
          pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width="1" opacity="${f === 1 ? 0.9 : 0.4}" />`;
      }).join('');
  
      let spokes = '';
      for (let i = 0; i < N; i++) {
        const p = pt(i, R);
        spokes += `<line x1="${CX}" y1="${CY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="var(--border-color)" stroke-width="1" opacity="0.5" />`;
      }
  
      const homePts = data.map((v, i) => {
        const p = pt(i, R * v.home);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ');
  
      const awayPts = data.map((v, i) => {
        const p = pt(i, R * v.away);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ');
  
      // Build visible dots + invisible hit areas + tooltip titles + value labels
      let dotMarkup = '';
      let valueLabels = '';
      data.forEach((v, i) => {
        const a = startAngle + i * step;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
  
        // Home
        const hp = pt(i, R * v.home);
        const homeValText = formatRadarValue(v.homeRaw, v.stat);
        dotMarkup += `
          <circle class="radar-hit" data-team="home" data-axis="${esc(v.label)}"
                  cx="${hp.x.toFixed(1)}" cy="${hp.y.toFixed(1)}" r="12">
            <title>${esc(match.home.name)} — ${esc(v.label)}: ${esc(homeValText)}</title>
          </circle>
          <circle class="radar-dot home" cx="${hp.x.toFixed(1)}" cy="${hp.y.toFixed(1)}" r="3.5" pointer-events="none" />
        `;
        // Value label offset radially outward, avoids overlap with axis label
        const hLabelOffset = v.home > 0.85 ? -14 : 14;
        const hLx = hp.x + cos * hLabelOffset;
        const hLy = hp.y + sin * hLabelOffset;
        valueLabels += `<text class="radar-value-label home"
                              x="${hLx.toFixed(1)}" y="${hLy.toFixed(1)}"
                              text-anchor="middle" dominant-baseline="middle"
                              pointer-events="none">${esc(homeValText)}</text>`;
  
        // Away
        const ap = pt(i, R * v.away);
        const awayValText = formatRadarValue(v.awayRaw, v.stat);
        dotMarkup += `
          <circle class="radar-hit" data-team="away" data-axis="${esc(v.label)}"
                  cx="${ap.x.toFixed(1)}" cy="${ap.y.toFixed(1)}" r="12">
            <title>${esc(match.away.name)} — ${esc(v.label)}: ${esc(awayValText)}</title>
          </circle>
          <circle class="radar-dot away" cx="${ap.x.toFixed(1)}" cy="${ap.y.toFixed(1)}" r="3.5" pointer-events="none" />
        `;
        const aLabelOffset = v.away > 0.85 ? -14 : 14;
        const aLx = ap.x + cos * aLabelOffset;
        const aLy = ap.y + sin * aLabelOffset;
        valueLabels += `<text class="radar-value-label away"
                              x="${aLx.toFixed(1)}" y="${aLy.toFixed(1)}"
                              text-anchor="middle" dominant-baseline="middle"
                              pointer-events="none">${esc(awayValText)}</text>`;
      });
  
      const axisLabels = data.map((v, i) => {
        const p = pt(i, R + 26);
        return `<text class="radar-axis-label" x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${esc(v.label)}</text>`;
      }).join('');
  
      return `
        <div class="match-radar">
          <div class="match-radar-header">
            <div class="match-radar-title">Team Comparison</div>
            <div class="match-radar-hint">Hover a dot for values · hold <kbd>X</kbd> to reveal all</div>
          </div>
          <div class="match-radar-svg-wrap">
            <svg class="match-radar-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
                 role="img" aria-label="Radar chart comparing both teams across six metrics">
              ${rings}
              ${spokes}
              <polygon class="radar-poly home" points="${homePts}" />
              <polygon class="radar-poly away" points="${awayPts}" />
              ${valueLabels}
              ${dotMarkup}
              ${axisLabels}
            </svg>
          </div>
          <div class="match-radar-legend">
            <span class="radar-legend-item">
              <span class="radar-swatch home"></span>
              <span class="radar-legend-team">${esc(match.home.name)}</span>
            </span>
            <span class="radar-legend-item">
              <span class="radar-swatch away"></span>
              <span class="radar-legend-team">${esc(match.away.name)}</span>
            </span>
          </div>
        </div>
      `;
    }
  
    /* ---- Top performers ---- */
  
    function buildTopPerformers(match) {
      if (!match.lineups || !match.lineups.home || !match.lineups.away) return '';
  
      function getTopRated(lineup) {
        if (!lineup) return null;
        const all = [...(lineup.starters || []), ...(lineup.subs || [])];
        let best = null;
        all.forEach(p => {
          if (p.rating === undefined || p.rating === null) return;
          const r = Number(p.rating);
          if (!isFinite(r)) return;
          if (!best || r > best.rating) best = { name: p.name, rating: r };
        });
        return best;
      }
  
      function getTopScorer(scorers) {
        if (!scorers || !scorers.length) return null;
        const counts = {};
        const order = [];
        scorers.forEach(s => {
          const name = s.name;
          if (!counts[name]) { counts[name] = { name, goals: 0 }; order.push(name); }
          counts[name].goals++;
        });
        let best = null;
        order.forEach(name => {
          const c = counts[name];
          if (!best || c.goals > best.goals) best = c;
        });
        return best;
      }
  
      function getTopXg(side) {
        const shots = (match.shots || []).filter(s => s.team === side);
        if (!shots.length) return null;
        const totals = {};
        shots.forEach(s => {
          const key = s.player || s.name || 'Unknown';
          totals[key] = (totals[key] || 0) + (Number(s.xg) || 0);
        });
        let best = null;
        Object.entries(totals).forEach(([name, xg]) => {
          if (!best || xg > best.xg) best = { name, xg };
        });
        return best;
      }
  
      function renderCard(label, value, subtext) {
        return `
          <div class="tp-card">
            <div class="tp-label">${esc(label)}</div>
            <div class="tp-value">${esc(value || '—')}</div>
            ${subtext ? `<div class="tp-sub">${subtext}</div>` : ''}
          </div>
        `;
      }
  
      function renderTeamSide(teamName, rated, scorer, xg) {
        const cards = [];
  
        if (rated) {
          cards.push(renderCard('Top Rated', Number(rated.rating).toFixed(1), esc(rated.name)));
        } else {
          cards.push(renderCard('Top Rated', '—', 'No rating'));
        }
  
        if (scorer) {
          const word = scorer.goals === 1 ? 'goal' : 'goals';
          cards.push(renderCard('Top Scorer', String(scorer.goals), `${esc(scorer.name)} · ${scorer.goals} ${word}`));
        } else {
          cards.push(renderCard('Top Scorer', '—', 'No goals'));
        }
  
        if (xg) {
          cards.push(renderCard('Top xG', Number(xg.xg).toFixed(2), esc(xg.name)));
        } else {
          cards.push(renderCard('Top xG', '—', 'No shots'));
        }
  
        return `
          <div class="tp-team">
            <div class="tp-team-header">${esc(teamName)}</div>
            <div class="tp-grid">${cards.join('')}</div>
          </div>
        `;
      }
  
      const homeRated   = getTopRated(match.lineups.home);
      const homeScorer  = getTopScorer(match.homeScorers);
      const homeXg      = getTopXg('home');
      const awayRated   = getTopRated(match.lineups.away);
      const awayScorer  = getTopScorer(match.awayScorers);
      const awayXg      = getTopXg('away');
  
      return `
        <div class="top-performers">
          <div class="match-section-label">Top Performers</div>
          <div class="tp-columns">
            ${renderTeamSide(match.home.name, homeRated, homeScorer, homeXg)}
            ${renderTeamSide(match.away.name, awayRated, awayScorer, awayXg)}
          </div>
        </div>
      `;
    }
  
    /* ---- Stats block ---- */
  
    function buildStatsBlock(match) {
      const hasFull   = Array.isArray(match.stats) && match.stats.length > 0;
      const hasFirst  = Array.isArray(match.statsFirstHalf) && match.statsFirstHalf.length > 0;
      const hasSecond = Array.isArray(match.statsSecondHalf) && match.statsSecondHalf.length > 0;
      const hasSplits = hasFirst && hasSecond;
      const initial = hasFull ? match.stats : match.statsFirstHalf;
  
      const toggleHtml = hasSplits && hasFull ? `
        <div class="match-stats-toggle" id="matchStatsToggle">
          <button class="match-stats-toggle-btn active" data-view="full">Full Match</button>
          <button class="match-stats-toggle-btn" data-view="first">1st Half</button>
          <button class="match-stats-toggle-btn" data-view="second">2nd Half</button>
        </div>
      ` : '';
  
      return `
        <div class="match-stats">
          <div class="match-stats-teams">
            <span class="match-stats-team">${esc(match.home.name)}</span>
            <span class="match-stats-team">${esc(match.away.name)}</span>
          </div>
          ${toggleHtml}
          <div class="match-stats-rows" id="matchStatsRows">${renderStatsRows(initial)}</div>
        </div>
      `;
    }
  
    function renderStatsRows(stats) {
      if (!Array.isArray(stats) || !stats.length) return '';
      return stats.map(s => {
        const h = Number(s.home) || 0;
        const a = Number(s.away) || 0;
        const total = h + a;
        const empty = total === 0;
        const hp = empty ? 0 : (h / total) * 100;
        const ap = empty ? 0 : (a / total) * 100;
        function fmt(val) {
          if (val === undefined || val === null) return '&mdash;';
          const n = Number(val);
          if (!isFinite(n)) return esc(String(val));
          if (s.decimals !== undefined) return n.toFixed(s.decimals);
          if (s.unit) return `${n}${s.unit}`;
          return String(n);
        }
        return `
          <div class="match-stat-row">
            <div class="match-stat-header">
              <span class="match-stat-home-value">${fmt(s.home)}</span>
              <span class="match-stat-label">${esc(s.label)}</span>
              <span class="match-stat-away-value">${fmt(s.away)}</span>
            </div>
            <div class="match-stat-bar">
              ${empty ? '' : `<div class="match-stat-fill home" style="width: ${hp}%;"></div><div class="match-stat-fill away" style="width: ${ap}%;"></div>`}
            </div>
          </div>
        `;
      }).join('');
    }
  
    function wireStatsToggle(match) {
      const toggle = document.getElementById('matchStatsToggle');
      const rowsEl = document.getElementById('matchStatsRows');
      if (!toggle || !rowsEl) return;
      const views = { full: match.stats, first: match.statsFirstHalf, second: match.statsSecondHalf };
      toggle.querySelectorAll('.match-stats-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const v = views[btn.dataset.view];
          if (!Array.isArray(v)) return;
          toggle.querySelectorAll('.match-stats-toggle-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          rowsEl.innerHTML = renderStatsRows(v);
        });
      });
    }
  
    /* ============================================================
       KEYBOARD MODES  (gated by settings)
       ============================================================ */
  
    function wireKeyModes() {
      const body = document.body;
  
      const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = (el.tagName || '').toUpperCase();
        return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
      };
  
      function syncModifiers(e) {
        if (!isShortcutsUnlocked()) {
          body.classList.remove('shift-held', 'alt-held');
          return;
        }
        body.classList.toggle('shift-held', !!e.shiftKey);
        body.classList.toggle('alt-held', !!e.altKey);
      }
  
      function keyDown(e) {
        if (isTypingTarget(e.target)) return;
  
        if (!isKeybindsAllowed()) return;
  
        if (e.key === 'Escape') {
          if (body.classList.contains('note-pick-mode')) {
            body.classList.remove('note-pick-mode');
          } else if (body.classList.contains('annotation-modal-open')) {
            body.classList.remove('annotation-modal-open');
          } else if (body.classList.contains('notes-panel-open')) {
            body.classList.remove('notes-panel-open');
          } else if (body.classList.contains('shortcuts-open')) {
            body.classList.remove('shortcuts-open');
          } else {
            resetAllStates();
          }
          return;
        }
  
        if ((e.key === 'q' || e.key === 'Q') && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
          e.preventDefault();
          body.classList.toggle('shortcuts-open');
          return;
        }
  
        if (!isResearchModeOn()) return;
  
        if (e.key === 'Shift' || e.shiftKey) body.classList.add('shift-held');
        if (e.key === 'Alt'   || e.altKey)   body.classList.add('alt-held');
  
        if (body.classList.contains('shortcuts-open')) return;
        if (body.classList.contains('annotation-modal-open')) return;
  
        const plain = !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  
        if (plain && !e.repeat) {
          if (e.key === 'c' || e.key === 'C') { body.classList.toggle('crosshair-held'); return; }
          if (e.key === 'x' || e.key === 'X') { body.classList.add('xray-held'); return; }
          if (e.key === 's' || e.key === 'S') { body.classList.toggle('s-toggled'); return; }
          if (e.key === 'n' || e.key === 'N') { body.classList.toggle('notes-panel-open'); return; }
  
          // Tab navigation — 1 / 2 / 3 / 4
          const digitMap = { '1': 'overview', '2': 'shots', '3': 'lineup', '4': 'additional' };
          if (digitMap[e.key]) {
            const btn = document.querySelector(`.match-modal-tab[data-mtab="${digitMap[e.key]}"]`);
            if (btn) btn.click();
            return;
          }
  
          if (e.key === 'h' || e.key === 'H') {
            const wasHome = body.classList.contains('shot-filter-home');
            body.classList.remove('shot-filter-home', 'shot-filter-away');
            if (!wasHome) body.classList.add('shot-filter-home');
            announce(wasHome ? 'Showing all shots' : 'Showing home shots only');
            return;
          }
          if (e.key === 'a' || e.key === 'A') {
            const wasAway = body.classList.contains('shot-filter-away');
            body.classList.remove('shot-filter-home', 'shot-filter-away');
            if (!wasAway) body.classList.add('shot-filter-away');
            announce(wasAway ? 'Showing all shots' : 'Showing away shots only');
            return;
          }
          if (e.key === 'b' || e.key === 'B') {
            body.classList.remove('shot-filter-home', 'shot-filter-away');
            announce('Showing all shots');
            return;
          }
  
          if (e.key === 'g' || e.key === 'G') {
            const on = body.classList.toggle('shot-filter-goals');
            announce(on ? 'Showing goals only' : 'Showing all outcomes');
            return;
          }
  
          if (e.key === 'f' || e.key === 'F') {
            if (body.classList.contains('chart-fullscreen')) {
              body.classList.remove('chart-fullscreen');
              return;
            }
            const shotsBtn = document.querySelector('.match-modal-tab[data-mtab="shots"]');
            if (!shotsBtn) return;
            if (!shotsBtn.classList.contains('active')) shotsBtn.click();
            body.classList.add('chart-fullscreen');
            return;
          }
        }
      }
  
      function keyUp(e) {
        if (e.key === 'Shift') body.classList.remove('shift-held');
        if (e.key === 'Alt')   body.classList.remove('alt-held');
        if (e.key === 'x' || e.key === 'X') body.classList.remove('xray-held');
      }
  
      function releaseAll() {
        body.classList.remove('shift-held', 'alt-held', 'xray-held', 'compare-active', 'note-pick-mode');
        clearCompareHighlights();
      }
  
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);
      window.addEventListener('blur', releaseAll);
      window.addEventListener('mousemove', syncModifiers);
    }
  
    function resetAllStates() {
      document.querySelectorAll('.pinned').forEach(el => el.classList.remove('pinned'));
      document.body.classList.remove(
        'compare-active', 'crosshair-held', 'xray-held',
        's-toggled', 'notes-panel-open', 'note-pick-mode',
        'chart-fullscreen'
      );
      clearCompareHighlights();
      document.querySelectorAll('.chart-crosshair-h, .chart-crosshair-v').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.chart-crosshair-readout').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.note-pick-hover').forEach(el => el.classList.remove('note-pick-hover'));
    }
  
    /* ============================================================
       CLICK-TO-PIN TOOLTIPS
       ============================================================ */
  
    function injectCloseButtons() {
      document.querySelectorAll('.name-tip, .match-scorer-tooltip, .match-pitch-tooltip').forEach(tip => {
        if (tip.querySelector('.tooltip-pin-close')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tooltip-pin-close';
        btn.setAttribute('aria-label', 'Close');
        btn.innerHTML = '&times;';
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          unpinAll();
        });
        tip.appendChild(btn);
      });
    }
  
    function togglePin(el) {
      const wasPinned = el.classList.contains('pinned');
      unpinAll();
      if (!wasPinned) el.classList.add('pinned');
    }
  
    function unpinAll() {
      document.querySelectorAll('.pinned').forEach(el => el.classList.remove('pinned'));
    }
  
    function wireClickToPin() {
      document.querySelectorAll('.name-tip-trigger').forEach(trigger => {
        trigger.addEventListener('click', e => {
          if (document.body.classList.contains('note-pick-mode')) return;
          if (!isShortcutsUnlocked()) return;
          e.preventDefault();
          e.stopPropagation();
          const wrap = trigger.closest('.name-tip-wrap');
          if (wrap) togglePin(wrap);
        });
      });
  
      document.querySelectorAll('.match-scorer-name').forEach(el => {
        el.addEventListener('click', e => {
          if (document.body.classList.contains('note-pick-mode')) return;
          if (!isShortcutsUnlocked()) return;
          e.preventDefault();
          e.stopPropagation();
          togglePin(el);
        });
      });
  
      document.querySelectorAll('.match-pitch-player').forEach(el => {
        el.addEventListener('click', e => {
          if (document.body.classList.contains('note-pick-mode')) return;
          if (!isShortcutsUnlocked()) return;
          e.preventDefault();
          e.stopPropagation();
          togglePin(el);
        });
      });
  
      document.addEventListener('click', e => {
        if (document.body.classList.contains('note-pick-mode')) return;
        if (e.target.closest('.pinned')) return;
        if (e.target.closest('.shortcuts-modal')) return;
        if (e.target.closest('.mini-scoreboard')) return;
        if (e.target.closest('.annotation-modal')) return;
        if (e.target.closest('.notes-panel')) return;
        if (e.target.closest('.annotation-chip')) return;
        if (e.target.closest('.cookies-popup')) return;
        unpinAll();
      });
    }
  
    /* ============================================================
       ALT — COMPARE MODE
       ============================================================ */
  
    const COMPARE_TARGETS = [
      '.name-tip-trigger',
      '.match-scorer-name-text',
      '.match-pitch-name',
      '.name-tip-header',
      '.match-scorer-tooltip-header',
      '.match-pitch-tooltip-header',
      '.match-shot-tooltip-player',
      '.xg-goal-label'
    ];
  
    function triggerName(el) {
      if (!el) return null;
      if (el.classList.contains('name-tip-trigger')) return el.textContent.trim();
      if (el.classList.contains('match-scorer-name')) {
        const t = el.querySelector('.match-scorer-name-text');
        return t ? t.textContent.trim() : null;
      }
      if (el.classList.contains('match-pitch-player')) {
        const t = el.querySelector('.match-pitch-name');
        return t ? t.textContent.trim() : null;
      }
      return null;
    }
  
    function clearCompareHighlights() {
      document.querySelectorAll('.compare-match, .compare-dim').forEach(el => {
        el.classList.remove('compare-match', 'compare-dim');
      });
    }
  
    function applyCompareHighlight(name) {
      if (!name) return;
      const key = name.toLowerCase();
      document.body.classList.add('compare-active');
      COMPARE_TARGETS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const n = el.textContent.trim();
          if (n && n.toLowerCase() === key) el.classList.add('compare-match');
          else el.classList.add('compare-dim');
        });
      });
    }
  
    function wireCompareMode(match) {
      document.addEventListener('mouseover', e => {
        if (!isShortcutsUnlocked()) return;
        if (!document.body.classList.contains('alt-held')) return;
        const el = e.target.closest('.name-tip-trigger, .match-scorer-name, .match-pitch-player');
        if (!el) return;
        const name = triggerName(el);
        if (!name) return;
        applyCompareHighlight(name);
      });
  
      document.addEventListener('mouseout', e => {
        const el = e.target.closest('.name-tip-trigger, .match-scorer-name, .match-pitch-player');
        if (!el) return;
        if (!document.body.classList.contains('alt-held')) return;
        clearCompareHighlights();
        document.body.classList.remove('compare-active');
      });
  
      if (match && Array.isArray(match.shots)) {
        document.querySelectorAll('.shot-marker, .xg-shot-dot').forEach(dot => {
          dot.addEventListener('mouseenter', () => {
            if (!isShortcutsUnlocked()) return;
            if (!document.body.classList.contains('alt-held')) return;
            const idx = parseInt(dot.getAttribute('data-shot-idx'), 10);
            const shot = match.shots[idx];
            if (!shot || !shot.player) return;
            applyCompareHighlight(shot.player);
          });
          dot.addEventListener('mouseleave', () => {
            if (!document.body.classList.contains('alt-held')) return;
            clearCompareHighlights();
            document.body.classList.remove('compare-active');
          });
        });
      }
    }
  
    /* ============================================================
       C — CROSSHAIR MODE  (toggle)
       ============================================================ */
  
    function wireCrosshair(match) {
      if (!match || !Array.isArray(match.shots) || !match.shots.length) return;
  
      document.querySelectorAll('.crosshair-host').forEach(host => {
        const hLine = host.querySelector('.chart-crosshair-h');
        const vLine = host.querySelector('.chart-crosshair-v');
        const readout = host.querySelector('.chart-crosshair-readout');
        if (!hLine || !vLine || !readout) return;
  
        host.addEventListener('mousemove', e => {
          if (!isShortcutsUnlocked() || !document.body.classList.contains('crosshair-held') || document.body.classList.contains('note-pick-mode')) {
            hLine.classList.remove('active');
            vLine.classList.remove('active');
            readout.classList.remove('active');
            return;
          }
  
          const rect = host.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
  
          vLine.style.left = x + 'px';
          hLine.style.top = y + 'px';
          vLine.classList.add('active');
          hLine.classList.add('active');
  
          const nearest = nearestShot(host, e.clientX, e.clientY, match);
          if (!nearest) {
            readout.classList.remove('active');
            return;
          }
  
          const s = nearest.shot;
          const dist = Math.round(nearest.dist);
          const outcome = (s.outcome || '').replace(/-/g, ' ');
          const teamName = s.team === 'away' ? match.away.name : match.home.name;
  
          readout.innerHTML = `
            <div class="ccr-head">
              <span class="ccr-min">${esc(s.min || '')}</span>
              <span class="ccr-player">${esc(s.player || s.name || '')}</span>
            </div>
            <div class="ccr-sub">${esc(teamName)}</div>
            <div class="ccr-divider"></div>
            <div class="ccr-row"><span>xG</span><span>${Number(s.xg || 0).toFixed(2)}</span></div>
            <div class="ccr-row"><span>Outcome</span><span>${esc(outcome)}</span></div>
            <div class="ccr-row ccr-dim"><span>Distance</span><span>${dist}px</span></div>
          `;
          readout.classList.add('active');
        });
  
        host.addEventListener('mouseleave', () => {
          hLine.classList.remove('active');
          vLine.classList.remove('active');
          readout.classList.remove('active');
        });
      });
    }
  
    function nearestShot(host, mouseX, mouseY, match) {
      let best = null;
      let bestDist = Infinity;
      host.querySelectorAll('[data-shot-idx]').forEach(el => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestDist) {
          bestDist = d;
          const idx = parseInt(el.getAttribute('data-shot-idx'), 10);
          best = { shot: match.shots[idx], dist: d };
        }
      });
      return best;
    }
  
    /* ============================================================
       RESEARCH MODE PANEL  ( Q )
       ============================================================ */
  
    function buildShortcutsModal() {
      const rows = [
        { keys: ['Shift', '+ hover'],       desc: 'Reveal player and club tooltips' },
        { keys: ['click a name'],           desc: 'Pin tooltip open — click again or press Esc to close' },
        { keys: ['Alt', '+ hover'],         desc: 'Highlight every instance of that name on the page' },
        { keys: ['C'],                      desc: 'Toggle crosshair mode on charts — press C again or Esc to exit' },
        { keys: ['X'],                      desc: 'X-ray: reveal inline ratings, xG values, and radar values' },
        { keys: ['S'],                      desc: 'Toggle the mini scorecard in the corner' },
        { keys: ['N'],                      desc: 'Toggle the notes panel' },
        { keys: ['Shift', '+', 'N', '+ click'], desc: 'Pick any element on the page to annotate' },
        { keys: ['click a shot'],           desc: 'Add or edit a private note on that shot' },
        { keys: ['1', '2', '3', '4'], sep: '', desc: 'Switch between tabs' },
        { keys: ['F'],                      desc: 'Toggle fullscreen shot map' },
        { keys: ['H'],                      desc: 'Home shots only — press again for both teams' },
        { keys: ['A'],                      desc: 'Away shots only — press again for both teams' },
        { keys: ['B'],                      desc: 'Show both teams\' shots' },
        { keys: ['G'],                      desc: 'Goals only — press again to show all outcomes' },
        { keys: ['Q'],                      desc: 'Open or close the Research Mode Panel' },
        { keys: ['Esc'],                    desc: 'Reset all active modes and pinned tooltips' }
      ];
  
      const rowsHtml = rows.map(r => {
        const separator = r.sep !== undefined ? r.sep : '<span class="shortcut-plus">+</span>';
        const keysHtml = r.keys.map(k => {
          const lower = k.toLowerCase();
          if (lower.includes('hover') || lower.includes('click')) {
            return `<span class="shortcut-hint">${esc(k)}</span>`;
          }
          return `<kbd>${esc(k)}</kbd>`;
        }).join(separator);
  
        return `
          <li class="shortcut-row">
            <span class="shortcut-keys">${keysHtml}</span>
            <span class="shortcut-desc">${esc(r.desc)}</span>
          </li>
        `;
      }).join('');
  
      const keybindsOff = !isKeybindsAllowed();
      const researchOff = !isResearchModeOn();
  
      let bannerHtml;
      if (keybindsOff) {
        bannerHtml = `
          <div class="shortcuts-notice shortcuts-notice-warn">
            <div class="shortcuts-notice-title">Keyboard shortcuts are disabled</div>
            <div class="shortcuts-notice-desc">
              Turn them back on in <strong>Settings &rarr; Accessibility &rarr; Keyboard Shortcuts</strong>
              to use them on this page.
            </div>
          </div>
        `;
      } else {
        const onCls = researchOff ? '' : ' shortcuts-research-row-on';
        bannerHtml = `
          <div class="shortcuts-research-row${onCls}" id="shortcutsResearchRow">
            <div class="shortcuts-research-text">
              <div class="shortcuts-research-label">
                Research Mode
                <span class="shortcuts-on-pill" aria-hidden="true">ON</span>
              </div>
              <div class="shortcuts-research-desc">
                ${researchOff
                  ? 'Enable to unlock keyboard shortcuts on this page.'
                  : 'Keyboard shortcuts are active on this page.'}
              </div>
            </div>
            <label class="toggle-switch" aria-label="Toggle research mode">
              <input type="checkbox" id="researchModeToggle"${researchOff ? '' : ' checked'}>
              <span class="slider"></span>
            </label>
          </div>
        `;
      }
  
      const listCls = isShortcutsUnlocked() ? '' : ' is-locked';
  
      return `
        <div class="shortcuts-modal" id="shortcutsModal" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Research mode panel">
          <div class="shortcuts-modal-backdrop" data-close-shortcuts></div>
          <div class="shortcuts-modal-panel">
            <button class="shortcuts-modal-close" type="button" aria-label="Close" data-close-shortcuts>&times;</button>
            <div class="shortcuts-modal-title">Research Mode Panel</div>
            <div class="shortcuts-modal-subtitle">Toggle research mode and browse available keyboard shortcuts.</div>
            ${bannerHtml}
            <ul class="shortcuts-list${listCls}" id="shortcutsList">${rowsHtml}</ul>
          </div>
        </div>
      `;
    }
  
    function wireShortcutsModal() {
      document.querySelectorAll('[data-close-shortcuts]').forEach(el => {
        el.addEventListener('click', () => {
          document.body.classList.remove('shortcuts-open');
        });
      });
  
      const toggle = document.getElementById('researchModeToggle');
      if (toggle) {
        toggle.addEventListener('change', () => {
          const on = toggle.checked;
          localStorage.setItem('olkvaj_research_mode', on ? 'on' : 'off');
  
          if (!on) {
            document.body.classList.remove(
              'shift-held', 'alt-held', 'crosshair-held', 'xray-held', 'note-pick-mode'
            );
            clearCompareHighlights();
            document.body.classList.remove('compare-active');
          }
  
          refreshShortcutsModalState();
  
          announce(on
            ? 'Research mode on — keyboard shortcuts enabled'
            : 'Research mode off — keyboard shortcuts disabled');
        });
      }
    }
  
    function refreshShortcutsModalState() {
      const row = document.getElementById('shortcutsResearchRow');
      const list = document.getElementById('shortcutsList');
      const toggle = document.getElementById('researchModeToggle');
      const unlocked = isShortcutsUnlocked();
  
      if (row) row.classList.toggle('shortcuts-research-row-on', isResearchModeOn());
      if (list) list.classList.toggle('is-locked', !unlocked);
      if (toggle) toggle.checked = isResearchModeOn();
    }
  
    /* ---- Shots tab ---- */
  
    function buildShotsTab(match) {
      return `${buildShotMap(match)}${buildXgFlow(match)}`;
    }
  
    function buildShotMap(match) {
      const shots = match.shots;
      if (!Array.isArray(shots) || !shots.length) {
        return '<div class="match-no-data">Shot data not available.</div>';
      }
  
      const markers = shots.map((s, i) => {
        const x = Number(s.x) || 50;
        const y = (Number(s.y) || 50) * 0.6;
        const teamCls = s.team === 'away' ? 'away' : 'home';
        const outcome = (s.outcome || 'off-target').toLowerCase().replace(/\s+/g, '-');
        const outcomeCls = 'shot-outcome-' + outcome;
        return `<circle class="shot-marker ${teamCls} ${outcomeCls}"
                 data-shot-idx="${i}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="0.75" />`;
      }).join('');
  
      const xrayLabels = shots.map(s => {
        const x = Number(s.x) || 50;
        const y = (Number(s.y) || 50) * 0.6;
        return `<text class="shot-xg-label"
                      x="${(x + 1.4).toFixed(2)}"
                      y="${(y + 0.4).toFixed(2)}"
                      font-size="1.1" font-weight="700"
                      fill="var(--text-main)">${Number(s.xg || 0).toFixed(2)}</text>`;
      }).join('');
  
      return `
        <div class="match-shot-map">
          <div class="match-shot-map-header">
            <span class="match-shot-map-team home">${esc(match.home.name)}</span>
            <span class="match-shot-map-title">Shot Map</span>
            <span class="match-shot-map-team away">${esc(match.away.name)}</span>
            <button class="shot-map-fs-btn" type="button" aria-label="Toggle fullscreen" title="Fullscreen (F)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <g class="fs-icon-expand">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </g>
                <g class="fs-icon-collapse">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </g>
              </svg>
            </button>
          </div>
  
          <div class="shot-map-filters" id="shotMapFilters" aria-live="polite">
            <span class="shot-map-filters-item" data-filter="home">Home shots</span>
            <span class="shot-map-filters-item" data-filter="away">Away shots</span>
            <span class="shot-map-filters-item" data-filter="goals">Goals only</span>
          </div>
  
          <div class="match-shot-map-svg-wrap crosshair-host">
            <svg class="match-shot-map-svg" viewBox="40 6 60 48" preserveAspectRatio="xMidYMid meet">
              <rect x="40" y="6" width="60" height="48" fill="var(--surface)" stroke="var(--border-color)" stroke-width="0.2" />
              <rect x="68" y="12" width="32" height="36" fill="none" stroke="var(--border-color)" stroke-width="0.25" />
              <rect x="88" y="22" width="12" height="16" fill="none" stroke="var(--border-color)" stroke-width="0.25" />
              <line x1="100" y1="6" x2="100" y2="54" stroke="var(--border-color)" stroke-width="0.25" />
              <rect x="99.2" y="27" width="1.6" height="6" fill="var(--text-main)" />
              <circle cx="79" cy="30" r="0.5" fill="var(--text-main)" />
              <path d="M 68 22.5 A 12 12 0 0 0 68 37.5" fill="none" stroke="var(--border-color)" stroke-width="0.25" />
              <g class="shot-markers">${markers}</g>
              <g class="shot-xray-labels">${xrayLabels}</g>
            </svg>
            <div class="match-shot-tooltip" id="shotTooltip" role="tooltip"></div>
            <div class="chart-crosshair-h"></div>
            <div class="chart-crosshair-v"></div>
            <div class="chart-crosshair-readout"></div>
          </div>
          <div class="match-shot-map-legend">
            <span class="match-shot-legend-item"><span class="shot-swatch goal"></span>Goal</span>
            <span class="match-shot-legend-item"><span class="shot-swatch on-target"></span>On Target</span>
            <span class="match-shot-legend-item"><span class="shot-swatch off-target"></span>Off Target</span>
            <span class="match-shot-legend-item"><span class="shot-swatch blocked"></span>Blocked</span>
            <span class="match-shot-legend-divider"></span>
            <span class="match-shot-legend-item"><span class="shot-team-dot home"></span>${esc(match.home.name)}</span>
            <span class="match-shot-legend-item"><span class="shot-team-dot away"></span>${esc(match.away.name)}</span>
          </div>
        </div>
      `;
    }
  
    function wireShotTooltips(match) {
      const shots = match && match.shots;
      if (!Array.isArray(shots) || !shots.length) return;
  
      const svg = document.querySelector('.match-shot-map-svg');
      const tooltip = document.getElementById('shotTooltip');
      const wrapper = document.querySelector('.match-shot-map-svg-wrap');
      if (!svg || !tooltip || !wrapper) return;
  
      const playerFlags = buildPlayerFlagLookup(match);
  
      svg.querySelectorAll('.shot-marker').forEach(circle => {
        const idx = parseInt(circle.getAttribute('data-shot-idx'), 10);
        const shot = shots[idx];
        if (!shot) return;
  
        circle.addEventListener('mouseenter', () => {
          if (document.body.classList.contains('crosshair-held')) return;
          if (document.body.classList.contains('note-pick-mode')) return;
          if (document.body.classList.contains('annotation-modal-open')) return;
          tooltip.innerHTML = buildShotTooltipContent(shot, match, playerFlags);
          tooltip.classList.add('active');
        });
        circle.addEventListener('mousemove', (e) => positionTooltip(e, wrapper, tooltip));
        circle.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
      });
    }
  
    function buildPlayerFlagLookup(match) {
      const map = {};
      if (!match.lineups) return map;
      ['home', 'away'].forEach(side => {
        const lu = match.lineups[side];
        if (!lu) return;
        ['starters', 'subs'].forEach(group => {
          (lu[group] || []).forEach(p => { if (p.name && p.flag) map[p.name] = p.flag; });
        });
      });
      return map;
    }
  
    function buildShotTooltipContent(shot, match, playerFlags) {
      const teamName = shot.team === 'away' ? match.away.name : match.home.name;
      const xg = Number(shot.xg || 0).toFixed(2);
      const flag = playerFlags[shot.player];
      const flagHtml = flag
        ? `<img class="match-shot-tooltip-flag" src="${flagImgPath(flag)}" alt="" onerror="this.style.display='none';" />`
        : '';
  
      return `
        <div class="match-shot-tooltip-player-row">
          <span class="match-shot-tooltip-player">${esc(shot.player)}</span>
          ${flagHtml}
        </div>
        <div class="match-shot-tooltip-team">${esc(teamName)}</div>
        <div class="match-shot-tooltip-divider"></div>
        <div class="match-shot-tooltip-row"><span class="match-shot-tooltip-label">Minute</span><span class="match-shot-tooltip-value">${esc(shot.min || '')}</span></div>
        <div class="match-shot-tooltip-row"><span class="match-shot-tooltip-label">xG</span><span class="match-shot-tooltip-value">${xg}</span></div>
        <div class="match-shot-tooltip-row"><span class="match-shot-tooltip-label">Outcome</span><span class="match-shot-tooltip-value">${esc(shot.outcome || '')}</span></div>
        ${shot.situation ? `<div class="match-shot-tooltip-row"><span class="match-shot-tooltip-label">Situation</span><span class="match-shot-tooltip-value">${esc(shot.situation)}</span></div>` : ''}
        ${shot.bodyPart ? `<div class="match-shot-tooltip-row"><span class="match-shot-tooltip-label">Body Part</span><span class="match-shot-tooltip-value">${esc(shot.bodyPart)}</span></div>` : ''}
        <div class="match-shot-tooltip-hint">Click to add a note</div>
      `;
    }
  
    function positionTooltip(e, wrapper, tooltip) {
      const wrapRect = wrapper.getBoundingClientRect();
      const cx = e.clientX - wrapRect.left;
      const cy = e.clientY - wrapRect.top;
      const below = cy < 140;
      tooltip.classList.toggle('below', below);
      tooltip.style.left = cx + 'px';
      tooltip.style.top = cy + 'px';
    }
  
    /* ---- xG flow chart ---- */
  
    function buildXgFlow(match) {
      const shots = match.shots;
      if (!Array.isArray(shots) || !shots.length) return '';
  
      const sorted = shots.slice().sort((a, b) => parseMin(a.min) - parseMin(b.min));
  
      const points = [{ min: 0, home: 0, away: 0, shot: null }];
      let hx = 0, ax = 0;
      sorted.forEach(s => {
        const xg = Number(s.xg) || 0;
        if (s.team === 'away') ax += xg; else hx += xg;
        points.push({ min: parseMin(s.min), home: hx, away: ax, shot: s });
      });
      points.push({ min: 90, home: hx, away: ax, shot: null });
  
      const maxXg = Math.max(hx, ax, 0.4);
      const W = 800, H = 320;
      const PAD = { l: 60, r: 20, t: 30, b: 40 };
      const PW = W - PAD.l - PAD.r;
      const PH = H - PAD.t - PAD.b;
  
      function toX(min) { return PAD.l + (Math.min(min, 90) / 90) * PW; }
      function toY(xg)  { return PAD.t + PH - (xg / maxXg) * PH; }
  
      let homePath = '', awayPath = '';
      points.forEach((p, i) => {
        const x = toX(p.min).toFixed(2);
        const yh = toY(p.home).toFixed(2);
        const ya = toY(p.away).toFixed(2);
        if (i === 0) { homePath = `M ${x} ${yh}`; awayPath = `M ${x} ${ya}`; }
        else { homePath += ` L ${x} ${yh}`; awayPath += ` L ${x} ${ya}`; }
      });
  
      const areaSegs = points.map(p => `${toX(p.min).toFixed(2)} ${toY(p.home).toFixed(2)}`);
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        areaSegs.push(`${toX(p.min).toFixed(2)} ${toY(p.away).toFixed(2)}`);
      }
      const areaPath = 'M ' + areaSegs.join(' L ') + ' Z';
  
      const htX = toX(45).toFixed(2);
  
      const yGrid = [0.25, 0.5, 0.75, 1].map(f => {
        const y = PAD.t + PH - f * PH;
        const label = (f * maxXg).toFixed(1);
        return `<line x1="${PAD.l}" y1="${y.toFixed(1)}" x2="${W - PAD.r}" y2="${y.toFixed(1)}"
                      stroke="var(--border-color)" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
                <text x="${PAD.l - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end"
                      font-size="12" font-weight="600" fill="var(--text-muted)">${label}</text>`;
      }).join('');
  
      const xTicks = [0, 15, 30, 45, 60, 75, 90].map(m =>
        `<text x="${toX(m).toFixed(1)}" y="${H - 12}" text-anchor="middle"
               font-size="12" font-weight="600" fill="var(--text-muted)">${m}'</text>`
      ).join('');
  
      const shotPoints = points.filter(p => p.shot);
  
      function dotHtml(p) {
        const s = p.shot;
        const originalIdx = shots.indexOf(s);
        const x = toX(p.min).toFixed(2);
        const y = toY(s.team === 'away' ? p.away : p.home).toFixed(2);
        const isGoal = (s.outcome || '').toLowerCase() === 'goal';
        const cls = 'xg-shot-dot ' + (s.team === 'away' ? 'away' : 'home') + (isGoal ? ' is-goal' : '');
        return `<circle class="${cls}" data-shot-idx="${originalIdx}" cx="${x}" cy="${y}" r="4" />`;
      }
  
      function xrayHtml(p) {
        const s = p.shot;
        const x = parseFloat(toX(p.min)) + 6;
        const y = parseFloat(toY(s.team === 'away' ? p.away : p.home)) + 4;
        return `<text class="xg-xg-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}"
                      font-size="11" font-weight="700" fill="var(--text-main)">${Number(s.xg || 0).toFixed(2)}</text>`;
      }
  
      const regularDots = shotPoints.filter(p => (p.shot.outcome || '').toLowerCase() !== 'goal').map(dotHtml).join('');
      const goalDots = shotPoints.filter(p => (p.shot.outcome || '').toLowerCase() === 'goal').map(dotHtml).join('');
      const xrayLabels = shotPoints.map(xrayHtml).join('');
  
      const goalLabels = shotPoints
        .filter(p => (p.shot.outcome || '').toLowerCase() === 'goal')
        .map(p => {
          const s = p.shot;
          const isAway = s.team === 'away';
          const x = toX(p.min).toFixed(1);
          const yBase = toY(isAway ? p.away : p.home);
          const y = isAway ? yBase + 16 : yBase - 12;
          return `<text class="xg-goal-label ${isAway ? 'away' : 'home'}"
                       x="${x}" y="${y.toFixed(1)}" text-anchor="middle"
                       font-size="11" font-weight="700">${esc(s.name)}</text>`;
        }).join('');
  
      return `
        <div class="match-xg-flow">
          <div class="match-xg-flow-header">
            <div class="match-xg-flow-title">Expected Goals Flow</div>
            <div class="match-xg-flow-totals">
              <span class="match-xg-total home">${esc(match.home.name)} <strong>${hx.toFixed(2)}</strong></span>
              <span class="match-xg-total away">${esc(match.away.name)} <strong>${ax.toFixed(2)}</strong></span>
            </div>
          </div>
          <div class="match-xg-flow-svg-wrap crosshair-host" id="xgFlowWrap">
            <svg class="match-xg-flow-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
              <line x1="${PAD.l}" y1="${PAD.t + PH}" x2="${W - PAD.r}" y2="${PAD.t + PH}"
                    stroke="var(--text-main)" stroke-width="1.5" opacity="0.7" />
              <line x1="${PAD.l}" y1="${PAD.t}" x2="${PAD.l}" y2="${PAD.t + PH}"
                    stroke="var(--border-color)" stroke-width="1" />
              ${yGrid}
              <path class="xg-flow-area" d="${areaPath}" />
              <line class="xg-ht-line" x1="${htX}" y1="${PAD.t}" x2="${htX}" y2="${PAD.t + PH}" />
              <text class="xg-ht-label" x="${htX}" y="${PAD.t - 8}" text-anchor="middle"
                    font-size="10" font-weight="700">HT</text>
              <path d="${homePath}" fill="none" stroke="var(--rm-color)" stroke-width="3"
                    stroke-linejoin="round" stroke-linecap="round" />
              <path d="${awayPath}" fill="none" stroke="var(--opp-color)" stroke-width="3"
                    stroke-linejoin="round" stroke-linecap="round" />
              <g class="xg-shot-dots">${regularDots}</g>
              <g class="xg-shot-dots">${goalDots}</g>
              <g class="xg-xray-labels">${xrayLabels}</g>
              <g class="xg-goal-labels">${goalLabels}</g>
              ${xTicks}
            </svg>
            <div class="match-shot-tooltip" id="xgTooltip" role="tooltip"></div>
            <div class="chart-crosshair-h"></div>
            <div class="chart-crosshair-v"></div>
            <div class="chart-crosshair-readout"></div>
          </div>
        </div>
      `;
    }
  
    function wireXgTooltips(match) {
      const shots = match && match.shots;
      if (!Array.isArray(shots) || !shots.length) return;
  
      const svg = document.querySelector('.match-xg-flow-svg');
      const tooltip = document.getElementById('xgTooltip');
      const wrapper = document.getElementById('xgFlowWrap');
      if (!svg || !tooltip || !wrapper) return;
  
      const playerFlags = buildPlayerFlagLookup(match);
  
      svg.querySelectorAll('.xg-shot-dot').forEach(circle => {
        const idx = parseInt(circle.getAttribute('data-shot-idx'), 10);
        const shot = shots[idx];
        if (!shot) return;
  
        circle.addEventListener('mouseenter', () => {
          if (document.body.classList.contains('crosshair-held')) return;
          if (document.body.classList.contains('note-pick-mode')) return;
          if (document.body.classList.contains('annotation-modal-open')) return;
          tooltip.innerHTML = buildShotTooltipContent(shot, match, playerFlags);
          tooltip.classList.add('active');
        });
        circle.addEventListener('mousemove', (e) => positionTooltip(e, wrapper, tooltip));
        circle.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
      });
    }
  
    /* ---- Lineup tab ---- */
  
    function buildLineupTab(match) {
      if (!match.lineups || !match.lineups.home || !match.lineups.away) {
        return '<div class="match-no-data">Lineup data not available for this match.</div>';
      }
      return `
        ${buildPitchView(match)}
        ${buildFormationChanges(match)}
        ${buildSubstitutionImpact(match)}
        ${buildLineupTables(match)}
      `;
    }
  
    function parseFormation(formation) {
      const lines = String(formation || '').split('-').map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n > 0);
      if (!lines.length) return [];
      const positions = [{ x: 50, y: 138, role: 'GK' }];
      const numLines = lines.length;
      const depthStart = 118, depthEnd = 22;
      const step = numLines > 1 ? (depthStart - depthEnd) / (numLines - 1) : 0;
      lines.forEach((count, i) => {
        const y = depthStart - i * step;
        const spacing = count > 1 ? 80 / (count - 1) : 0;
        for (let j = 0; j < count; j++) {
          const x = count > 1 ? 10 + j * spacing : 50;
          positions.push({ x, y, role: 'OUT' });
        }
      });
      return positions;
    }
  
    function buildPitchView(match) {
      return `<div class="match-pitch-view">${buildPitch(match.home, match.lineups.home)}${buildPitch(match.away, match.lineups.away)}</div>`;
    }
  
    function buildPitch(team, lineup) {
      const positions = parseFormation(lineup.formation);
      const starters = lineup.starters || [];
      const players = positions.map((pos, i) => {
        const p = starters[i];
        if (!p) return '';
        const slug = p.playerSlug || slugify(p.name);
        const playerUrl = `../players/${esc(slug)}.html`;
  
        const ratingRow = (p.rating !== undefined && p.rating !== null && isFinite(Number(p.rating)))
          ? `<span class="match-pitch-tooltip-row">
               <span class="match-pitch-tooltip-label">Rating</span>
               <span class="match-pitch-tooltip-value">${Number(p.rating).toFixed(1)}</span>
             </span>`
          : '';
  
        const xrayLabel = (p.rating !== undefined && p.rating !== null && isFinite(Number(p.rating)))
          ? `<div class="match-pitch-xray">${Number(p.rating).toFixed(1)}</div>`
          : '';
  
        return `
          <div class="match-pitch-player" style="left: ${pos.x}%; top: ${(pos.y / 150) * 100}%;">
            <div class="match-pitch-num">${p.num || ''}</div>
            <div class="match-pitch-name">${esc(p.name)}</div>
            ${xrayLabel}
            <span class="match-pitch-tooltip" role="tooltip">
              <span class="match-pitch-tooltip-header">${esc(p.name)}</span>
              <span class="match-pitch-tooltip-divider"></span>
              ${p.pos ? `
                <span class="match-pitch-tooltip-row">
                  <span class="match-pitch-tooltip-label">Position</span>
                  <span class="match-pitch-tooltip-value">${esc(p.pos)}</span>
                </span>
              ` : ''}
              ${ratingRow}
              <a href="${playerUrl}" class="match-pitch-tooltip-btn">More About Player &rarr;</a>
            </span>
          </div>
        `;
      }).join('');
  
      return `
        <div class="match-pitch">
          <div class="match-pitch-header">
            <span class="match-pitch-team">${esc(team.name)}</span>
            <span class="match-pitch-formation">${esc(lineup.formation || '')}</span>
          </div>
          <div class="match-pitch-field">
            <svg class="match-pitch-svg" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid meet">
              <rect x="0" y="0" width="100" height="150" fill="var(--surface)" stroke="var(--border-color)" stroke-width="0.4" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border-color)" stroke-width="0.4" />
              <circle cx="50" cy="75" r="13.5" fill="none" stroke="var(--border-color)" stroke-width="0.4" />
              <circle cx="50" cy="75" r="0.8" fill="var(--border-color)" />
              <rect x="20.5" y="0" width="59" height="24" fill="none" stroke="var(--border-color)" stroke-width="0.4" />
              <rect x="36.5" y="0" width="27" height="8" fill="none" stroke="var(--border-color)" stroke-width="0.4" />
              <circle cx="50" cy="16" r="0.6" fill="var(--border-color)" />
              <rect x="20.5" y="126" width="59" height="24" fill="none" stroke="var(--border-color)" stroke-width="0.4" />
              <rect x="36.5" y="142" width="27" height="8" fill="none" stroke="var(--border-color)" stroke-width="0.4" />
              <circle cx="50" cy="134" r="0.6" fill="var(--border-color)" />
              <rect x="44.5" y="-1" width="11" height="1" fill="var(--text-main)" />
              <rect x="44.5" y="150" width="11" height="1" fill="var(--text-main)" />
            </svg>
            <div class="match-pitch-players">${players}</div>
          </div>
        </div>
      `;
    }
  
    function buildFormationChanges(match) {
      const changes = match.formationChanges;
      if (!Array.isArray(changes) || !changes.length) return '';
  
      const homeChanges = changes.filter(c => c.team === 'home');
      const awayChanges = changes.filter(c => c.team === 'away');
  
      function renderCol(list, teamName) {
        if (!list.length) return '';
        const items = list.map(c => `
          <div class="formation-change-item">
            <span class="formation-change-min">${esc(c.min)}</span>
            <span class="formation-change-shape">
              <span class="formation-shape-old">${esc(c.from)}</span>
              <span class="formation-shape-arrow">&rarr;</span>
              <span class="formation-shape-new">${esc(c.to)}</span>
            </span>
            ${c.reason ? `<span class="formation-change-reason">${esc(c.reason)}</span>` : ''}
          </div>
        `).join('');
        return `
          <div class="formation-change-col">
            <div class="formation-change-col-header">${esc(teamName)}</div>
            <div class="formation-change-list">${items}</div>
          </div>
        `;
      }
  
      return `
        <div class="match-formation-changes">
          <div class="match-section-label">Formation Changes</div>
          <div class="formation-change-grid">
            ${renderCol(homeChanges, match.home.name)}
            ${renderCol(awayChanges, match.away.name)}
          </div>
        </div>
      `;
    }
  
    function buildSubstitutionImpact(match) {
      const subs = match.substitutions;
      if (!Array.isArray(subs) || !subs.length) return '';
  
      const homeSubs = subs.filter(s => s.team === 'home');
      const awaySubs = subs.filter(s => s.team === 'away');
  
      function renderCol(list, teamName) {
        if (!list.length) return '';
        const items = list.map(s => {
          const impactCls = (s.impact || '').toLowerCase().replace(/[^a-z]/g, '') || 'neutral';
          return `
            <div class="match-sub-card">
              <div class="match-sub-min">${esc(s.min)}</div>
              <div class="match-sub-players">
                <div class="match-sub-line">
                  <span class="match-sub-arrow in">&#9650;</span>
                  <span class="match-sub-name">${playerTip(s.in, findPlayerInLineups(match, s.in))}</span>
                </div>
                <div class="match-sub-line">
                  <span class="match-sub-arrow out">&#9660;</span>
                  <span class="match-sub-name muted">${playerTip(s.out, findPlayerInLineups(match, s.out))}</span>
                </div>
              </div>
              ${s.impact ? `
                <div class="match-sub-impact match-sub-impact-${impactCls}">
                  <span class="match-sub-impact-label">${esc(s.impact)}</span>
                  ${s.impactDesc ? `<span class="match-sub-impact-desc">${esc(s.impactDesc)}</span>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
        return `
          <div class="match-sub-col">
            <div class="match-sub-col-header">${esc(teamName)}</div>
            <div class="match-sub-list">${items}</div>
          </div>
        `;
      }
  
      return `
        <div class="match-subs">
          <div class="match-section-label">Substitution Impact</div>
          <div class="match-subs-grid">
            ${renderCol(homeSubs, match.home.name)}
            ${renderCol(awaySubs, match.away.name)}
          </div>
        </div>
      `;
    }
  
    function buildLineupTables(match) {
      const homeLU = match.lineups.home;
      const awayLU = match.lineups.away;
  
      function renderList(starters, subs) {
        return `
          <div class="match-lineup-list">
            ${(starters || []).map(p => renderLineupPlayer(p, false)).join('')}
          </div>
          ${(subs || []).length ? `
            <div class="match-lineup-team-header" style="margin-top: 22px; font-size: 0.68rem;">
              <span>Substitutes</span>
            </div>
            <div class="match-lineup-list">
              ${(subs || []).map(p => renderLineupPlayer(p, true)).join('')}
            </div>
          ` : ''}
        `;
      }
  
      return `
        <div class="match-lineup-columns">
          <div>
            <div class="match-lineup-team-header">
              <span>${esc(match.home.name)}</span>
              <span class="match-lineup-formation">${esc(homeLU.formation || '')}</span>
            </div>
            ${renderList(homeLU.starters, homeLU.subs)}
          </div>
          <div>
            <div class="match-lineup-team-header">
              <span>${esc(match.away.name)}</span>
              <span class="match-lineup-formation">${esc(awayLU.formation || '')}</span>
            </div>
            ${renderList(awayLU.starters, awayLU.subs)}
          </div>
        </div>
      `;
    }
  
    function renderLineupPlayer(p, isSub) {
      const goalMark = p.note && p.note.toLowerCase().includes('goal')
        ? '<span class="match-lineup-goal-icon"></span>' : '';
      let ratingHtml = '';
      if (p.rating !== undefined && p.rating !== null && isFinite(Number(p.rating))) {
        const r = Number(p.rating);
        const cls = r >= 7 ? 'high' : (r < 6 ? 'low' : 'mid');
        ratingHtml = `<span class="match-lineup-rating ${cls}">${r.toFixed(1)}</span>`;
      }
      return `
        <div class="match-lineup-player${isSub ? ' is-sub' : ''}">
          <div class="match-lineup-num">${p.num || ''}</div>
          <div><div class="match-lineup-name">${playerTip(p.name, p)}${goalMark}</div></div>
          <div class="match-lineup-meta">
            <span class="match-lineup-meta-text">
              ${esc(p.pos || '')}${p.note ? ` &middot; ${esc(p.note)}` : ''}
            </span>
            ${ratingHtml}
          </div>
        </div>
      `;
    }
  
    function buildAdditionalTab(match) {
      const rows = [
        { label: 'Competition',                value: match.compLabel },
        { label: 'Round',                      value: match.round },
        { label: 'Season',                     value: match.season },
        { label: 'Venue',                      value: match.venue },
        { label: 'Date',                       value: match.date ? formatDateISO(match.date) : null },
        { label: 'Referee',                    value: match.referee },
        { label: `${match.home.name} Manager`, value: match.home.manager },
        { label: `${match.away.name} Manager`, value: match.away.manager },
        { label: 'Attendance',                 value: match.attendance }
      ].filter(r => r.value);
  
      if (!rows.length) return '<div class="match-no-data">No additional information available for this match.</div>';
  
      return `
        <div class="match-info-table">
          ${rows.map(r => `
            <div class="match-info-row">
              <div class="match-info-label">${esc(r.label)}</div>
              <div class="match-info-value">${esc(r.value)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  
    /* ---- Start ---- */
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  
  })();