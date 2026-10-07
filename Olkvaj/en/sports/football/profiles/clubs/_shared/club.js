/* ============================================================
   OLKVAJ — CLUB PROFILE SHARED ENGINE
   Location: sports/football/profiles/clubs/_shared/club.js

   Requires:
     - window.CLUB_SLUG set before this script loads
     - window.__CLUB_DATA__  (from <slug>-club-data.js)
     - window.__H2H_DATA__   (from <slug>-h2h-data.js, optional)

   Fixture cards navigate to match.html?club=X&id=Y&file=Z

   Works via file:// — no server required.
   ============================================================ */

   (function () {
    'use strict';
  
    /* ============================================================
       1. CONFIGURATION
       ============================================================ */
  
    const SLUG = window.CLUB_SLUG || detectSlugFromUrl();
  
    function detectSlugFromUrl() {
      const path = window.location.pathname;
      const file = path.substring(path.lastIndexOf('/') + 1);
      return file.replace(/\.html?$/, '');
    }
  
    if (!SLUG) {
      console.error('[club.js] No CLUB_SLUG set and could not detect from URL.');
      return;
    }
  
    /* ============================================================
       2. CALENDAR / DATE FORMATTING
       ============================================================ */
  
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
  
    function gregToChineseYear(gy) {
      return `${STEMS[(gy - 4) % 10]}${BRANCHES[(gy - 4) % 12]}`;
    }
  
    function formatDate(y, m, d) {
      if (CALENDAR === 'gregorian') return `${d} ${MONTHS_GREG[m - 1]} ${y}`;
      if (CALENDAR === 'islamic') { const h = gregToHijri(y, m, d); return `${h.day} ${MONTHS_HIJRI[h.month - 1]} ${h.year} AH`; }
      if (CALENDAR === 'persian') { const p = gregToPersian(y, m, d); return `${p.day} ${MONTHS_PERSIAN[p.month - 1]} ${p.year} SH`; }
      if (CALENDAR === 'chinese') return `${gregToChineseYear(y)} (${y} CE)`;
      return `${d} ${MONTHS_GREG[m - 1]} ${y}`;
    }
  
    function formatYear(gy) {
      if (CALENDAR === 'gregorian') return String(gy);
      if (CALENDAR === 'islamic') return String(gy - 622);
      if (CALENDAR === 'persian') return String(gy - 621);
      if (CALENDAR === 'chinese') return gregToChineseYear(gy);
      return String(gy);
    }
  
    function formatDateISO(iso) {
      if (!iso) return '';
      const [y, m, d] = iso.split('-').map(Number);
      return formatDate(y, m, d);
    }
  
    /* ============================================================
       3. UTILITIES
       ============================================================ */
  
    function esc(s) {
      if (s === null || s === undefined) return '';
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  
    function stripDiacritics(s) {
      return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
  
    function initials(name) {
      if (!name) return '';
      return name.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
    }
  
    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  
    function clubLogo(slug) { return `../../clubs-img/${slug}.png`; }
    function flagPath(country) { return `../../../../images/flags/${country}.png`; }
  
    /* ============================================================
       4. DATA LOADING
       ============================================================ */
  
    function loadAllData() {
      const club = window.__CLUB_DATA__ || null;
      const h2h  = window.__H2H_DATA__  || null;
  
      if (!club) {
        console.error('[club.js] window.__CLUB_DATA__ is not set.');
      }
      if (!h2h) {
        console.warn('[club.js] window.__H2H_DATA__ is not set. H2H will be unavailable.');
      }
  
      return { club, h2h };
    }
  
    /* ============================================================
       5. HEADER + FOOTER
       ============================================================ */
  
    function renderHeader() {
      return `
        <div class="container">
          <header>
            <nav>
              <a href="../../../../main/index.html">Home</a>
              <a href="#">About</a>
              <a href="../../../../main/settings.html">Settings</a>
            </nav>
            <div class="header-actions">
              <a href="#" class="login-link">Log in</a>
              <a href="../players/" class="btn btn-primary">Browse Players</a>
            </div>
          </header>
        </div>
      `;
    }
  
    function renderFooter() {
      return `
        <div class="container">
          <footer>
            <div class="footer-inner">
              <div>&copy; 2026 Olkvaj &middot; Data for informational purposes only.</div>
              <div>
                <a href="../../../../main/privacy.html">Privacy</a>
                <a href="../../../../main/cookies.html">Cookies</a>
                <a href="../../../../main/terms.html">Terms</a>
              </div>
            </div>
          </footer>
        </div>
      `;
    }
  
    /* ============================================================
       6. HERO
       ============================================================ */
  
    function renderHero(club) {
      const logoHtml = club.logoSlug
        ? `<img src="${clubLogo(club.logoSlug)}" alt="${esc(club.name)}"
                onerror="this.replaceWith('${esc(initials(club.name))}')" />`
        : esc(initials(club.name));
  
      const flagHtml = club.country
        ? `<img src="${flagPath(club.country)}" alt="" class="flag" onerror="this.style.display='none'" />`
        : '';
  
      const locationLine = [club.city, club.countryName || ''].filter(Boolean).join(', ');
      const leagueLine = club.league ? ` &middot; ${esc(club.league)}` : '';
  
      return `
        <a href="../../../../main/football-cl.html" class="btn-back">&larr; Back</a>
  
        <div class="hero">
          <div class="hero-image">${logoHtml}</div>
          <div class="hero-text">
            <div class="hero-fullname">${esc(club.fullName || club.name)}</div>
            <h1>${esc(club.name)}</h1>
            <div class="hero-meta">
              ${flagHtml}
              <span>${esc(locationLine)}${leagueLine}</span>
            </div>
          </div>
        </div>
      `;
    }
  
    /* ============================================================
       7. TAB BAR
       ============================================================ */
  
    const TABS = [
      { key: 'overview', label: 'Overview' },
      { key: 'finance',  label: 'Finance' },
      { key: 'stadium',  label: 'Stadium' },
      { key: 'staff',    label: 'Staff' },
      { key: 'records',  label: 'Records' },
      { key: 'players',  label: 'Players' },
      { key: 'info',     label: 'Info' }
    ];
  
    function renderTabBar() {
      return `
        <div class="tab-bar-wrap">
          <div class="tab-bar">
            ${TABS.map((t, i) =>
              `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${t.key}">${t.label}</button>`
            ).join('')}
          </div>
        </div>
      `;
    }
  
    /* ============================================================
       8. OVERVIEW
       ============================================================ */
  
    function renderOverview(club) {
      const stats = (club.overview && club.overview.stats) || [];
      const statsHtml = stats.map(s => {
        const valueHtml = s.year
          ? `<div class="stat-value" data-year="${s.year}">${formatYear(s.year)}</div>`
          : `<div class="stat-value">${esc(s.value)}</div>`;
        return `
          <div class="stat-cell">
            ${valueHtml}
            <div class="stat-label">${s.label}</div>
          </div>
        `;
      }).join('');
  
      const intro = (club.overview && club.overview.paragraphs) || [];
      const introHtml = intro.map(p => `<p>${p}</p>`).join('');
  
      const honours = club.honours || [];
      const honourTiles = honours.map(h => `
        <div class="trophy-tile${h.hero ? ' hero' : ''}">
          <div class="trophy-count">${esc(h.count)}</div>
          <div class="trophy-name">${esc(h.competition)}</div>
          <div class="trophy-sub">${esc(h.note || '')}</div>
        </div>
      `).join('');
  
      const totalTrophies = club.totalTrophies || honours.reduce((s, h) => s + (parseInt(h.count, 10) || 0), 0);
  
      return `
        <div class="stats-strip">${statsHtml}</div>
        ${introHtml}
        ${honours.length ? `
          <div class="section-title">Major Honours Snapshot</div>
          <div class="trophy-cabinet">${honourTiles}</div>
          <div class="trophy-cabinet-summary">
            <div class="trophy-summary-left">
              <span class="trophy-summary-total">${totalTrophies}</span>
              <span class="trophy-summary-label">Official Trophies</span>
            </div>
          </div>
        ` : ''}
      `;
    }
  
    /* ============================================================
       9. FINANCE
       ============================================================ */
  
    const FINANCE_SUBTABS = [
      { key: 'fin-overview',  label: 'Overview' },
      { key: 'fin-revenue',   label: 'Revenue' },
      { key: 'fin-expenses',  label: 'Expenses' },
      { key: 'fin-sponsors',  label: 'Sponsors' },
      { key: 'fin-history',   label: 'History' }
    ];
  
    function renderFinance(club) {
      const f = club.finance || {};
  
      return `
        <p>${esc(f.intro || "Financial overview — revenue streams, expense breakdown, commercial partnerships, and historical net profit/loss.")}</p>
  
        <div class="subtab-bar-wrap">
          <div class="subtab-bar">
            ${FINANCE_SUBTABS.map((t, i) =>
              `<button class="subtab-btn${i === 0 ? ' active' : ''}" data-subtab="${t.key}">${t.label}</button>`
            ).join('')}
          </div>
        </div>
  
        <div class="subtab-panel active" id="subtab-fin-overview">${renderFinanceOverview(f)}</div>
        <div class="subtab-panel" id="subtab-fin-revenue">${renderFinanceRevenue(f)}</div>
        <div class="subtab-panel" id="subtab-fin-expenses">${renderFinanceExpenses(f)}</div>
        <div class="subtab-panel" id="subtab-fin-sponsors">${renderFinanceSponsors(f)}</div>
        <div class="subtab-panel" id="subtab-fin-history">${renderFinanceHistory(f)}</div>
      `;
    }
  
    function renderFinanceOverview(f) {
      const rev = f.revenue || {};
      const exp = f.expenses || {};
  
      const revLegend = (rev.streams || []).map(s => `
        <div class="finance-legend-item">
          <span class="finance-swatch" style="background: ${s.color};"></span>
          <span class="finance-legend-label">${esc(s.label)}</span>
          <span class="finance-legend-value">${esc(s.amount)} <span class="finance-legend-pct">${esc(s.pct)}</span></span>
        </div>
      `).join('');
  
      const expLegend = (exp.categories || []).map(c => `
        <div class="finance-legend-item">
          <span class="finance-swatch" style="background: ${c.color};"></span>
          <span class="finance-legend-label">${esc(c.label)}</span>
          <span class="finance-legend-value">${esc(c.amount)} <span class="finance-legend-pct">${esc(c.pct)}</span></span>
        </div>
      `).join('');
  
      const netStartsWithMinus = (f.netProfit || '').startsWith('-') || (f.netProfit || '').startsWith('\u2212');
  
      return `
        <div class="finance-grid">
          <div class="finance-card">
            <div class="finance-card-header">
              <div class="finance-card-title">Revenue</div>
              <div class="finance-card-tag revenue">Income</div>
            </div>
            <div class="pie-chart" style="background: ${rev.pieGradient || 'conic-gradient(#16a34a 0deg 360deg)'};">
              <div class="pie-chart-hole">
                <div class="chart-total">${esc(rev.total || '\u2014')}</div>
                <div class="chart-total-label">Total</div>
              </div>
            </div>
            <div class="finance-legend">${revLegend}</div>
          </div>
  
          <div class="finance-card">
            <div class="finance-card-header">
              <div class="finance-card-title">Expenses</div>
              <div class="finance-card-tag expenses">Outflow</div>
            </div>
            <div class="pie-chart" style="background: ${exp.pieGradient || 'conic-gradient(#dc2626 0deg 360deg)'};">
              <div class="pie-chart-hole">
                <div class="chart-total">${esc(exp.total || '\u2014')}</div>
                <div class="chart-total-label">Total</div>
              </div>
            </div>
            <div class="finance-legend">${expLegend}</div>
          </div>
        </div>
  
        <div class="net-profit">
          <div class="net-profit-cell">
            <div class="net-profit-label">Total Revenue</div>
            <div class="net-profit-value positive">${esc(rev.total || '\u2014')}</div>
          </div>
          <div class="net-profit-operator">&minus;</div>
          <div class="net-profit-cell">
            <div class="net-profit-label">Total Expenses</div>
            <div class="net-profit-value negative">${esc(exp.total || '\u2014')}</div>
          </div>
          <div class="net-profit-operator">=</div>
          <div class="net-profit-cell highlight">
            <div class="net-profit-label">Net Profit</div>
            <div class="net-profit-value ${netStartsWithMinus ? 'negative' : 'positive'}">${esc(f.netProfit || '\u2014')}</div>
          </div>
        </div>
      `;
    }
  
    function renderFinanceRevenue(f) {
      const r = f.revenue || {};
      const streams = r.streams || [];
      const summary = r.summary || {};
  
      const mixBar = streams.map(s =>
        `<div class="revenue-mix-seg ${s.className || ''}" style="width: ${s.pctWidth || s.pct};">${esc(s.pct)}</div>`
      ).join('');
  
      const mixLegend = streams.map(s => `
        <div class="revenue-mix-legend-item">
          <span class="revenue-mix-legend-swatch ${s.className || ''}"></span>
          <span class="revenue-mix-legend-label">${esc(s.label)}</span>
        </div>
      `).join('');
  
      const summaryCells = [
        { label: 'Total Revenue',      value: r.total || '\u2014',          desc: summary.season || '' },
        { label: 'Largest Stream',     value: summary.largest || '\u2014',  desc: summary.largestDesc || '' },
        { label: 'Fastest Growing',    value: summary.fastest || '\u2014',  desc: summary.fastestDesc || '' },
        { label: 'Revenue per Stream', value: summary.perStream || '\u2014',desc: summary.perStreamDesc || '' }
      ].map(c => `
        <div class="revenue-summary-cell">
          <div class="revenue-summary-label">${esc(c.label)}</div>
          <div class="revenue-summary-value">${esc(c.value)}</div>
          <div class="revenue-summary-desc">${esc(c.desc)}</div>
        </div>
      `).join('');
  
      const tableRows = streams.map(s => `
        <tr>
          <td>
            <span class="revenue-name">
              ${esc(s.label)}
              ${s.tooltip ? `<button class="revenue-info" data-tooltip="${esc(s.tooltip)}">i</button>` : ''}
            </span>
          </td>
          <td>${esc(s.description || '')}</td>
          <td class="share-cell"><div class="revenue-share-bar"><div class="revenue-share-fill ${s.className || ''}" style="width: ${s.pctWidth || s.pct};"></div></div></td>
          <td class="amount">${esc(s.amount)}</td>
          <td class="pct">${esc(s.pct)}</td>
          <td class="revenue-yoy ${s.yoyDir === 'up' ? 'up' : s.yoyDir === 'down' ? 'down' : 'neutral'}">
            ${s.yoyDir === 'up' ? '<span class="arrow">&#9650;</span>' : s.yoyDir === 'down' ? '<span class="arrow">&#9660;</span>' : ''}
            ${esc(s.yoy || '')}
          </td>
        </tr>
      `).join('');
  
      const notes = (r.notes || []).map(n => `
        <div class="revenue-note"><strong>${esc(n.title)}</strong> ${n.body}</div>
      `).join('');
  
      return `
        <div class="section-title">Revenue Breakdown (${esc(summary.season || '')})</div>
  
        <div class="revenue-mix-wrap">
          <div class="revenue-mix-title">Revenue mix &mdash; ${esc(r.total || '\u2014')} total</div>
          <div class="revenue-mix-bar">${mixBar}</div>
          <div class="revenue-mix-legend">${mixLegend}</div>
        </div>
  
        <div class="revenue-summary">${summaryCells}</div>
  
        <table class="revenue-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Description</th>
              <th class="share-col">Share</th>
              <th class="amount">Amount</th>
              <th class="pct">%</th>
              <th>YoY</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Revenue</td>
              <td class="amount">${esc(r.total || '\u2014')}</td>
              <td class="pct">100%</td>
              <td class="revenue-yoy up"><span class="arrow">&#9650;</span>${esc(r.totalYoy || '')}</td>
            </tr>
          </tfoot>
        </table>
  
        ${notes ? `<div class="revenue-notes"><div class="revenue-notes-title">Notes &amp; Context</div>${notes}</div>` : ''}
      `;
    }
  
    function renderFinanceExpenses(f) {
      const e = f.expenses || {};
      const categories = e.categories || [];
      const summary = e.summary || {};
  
      const mixBar = categories.map(c =>
        `<div class="expense-mix-seg ${c.className || ''}" style="width: ${c.pctWidth || c.pct};">${esc(c.pct)}</div>`
      ).join('');
  
      const mixLegend = categories.map(c => `
        <div class="expense-mix-legend-item">
          <span class="expense-mix-legend-swatch ${c.className || ''}"></span>
          <span class="expense-mix-legend-label">${esc(c.label)}</span>
        </div>
      `).join('');
  
      const summaryCells = [
        { label: 'Total Expenses',       value: e.total || '\u2014',         desc: summary.season || '' },
        { label: 'Largest Category',     value: summary.largest || '\u2014', desc: summary.largestDesc || '' },
        { label: 'Fastest Growing',      value: summary.fastest || '\u2014', desc: summary.fastestDesc || '' },
        { label: 'Expense per Category', value: summary.perCategory || '\u2014', desc: summary.perCategoryDesc || '' }
      ].map(c => `
        <div class="revenue-summary-cell">
          <div class="revenue-summary-label">${esc(c.label)}</div>
          <div class="revenue-summary-value">${esc(c.value)}</div>
          <div class="revenue-summary-desc">${esc(c.desc)}</div>
        </div>
      `).join('');
  
      const tableRows = categories.map(c => `
        <tr>
          <td>
            <span class="revenue-name">
              ${esc(c.label)}
              ${c.tooltip ? `<button class="revenue-info" data-tooltip="${esc(c.tooltip)}">i</button>` : ''}
            </span>
          </td>
          <td>${esc(c.description || '')}</td>
          <td class="share-cell"><div class="revenue-share-bar"><div class="expense-share-fill ${c.className || ''}" style="width: ${c.pctWidth || c.pct};"></div></div></td>
          <td class="amount">${esc(c.amount)}</td>
          <td class="pct">${esc(c.pct)}</td>
          <td class="revenue-yoy ${c.yoyDir === 'up' ? 'up' : c.yoyDir === 'down' ? 'down' : 'neutral'}">
            ${c.yoyDir === 'up' ? '<span class="arrow">&#9650;</span>' : c.yoyDir === 'down' ? '<span class="arrow">&#9660;</span>' : ''}
            ${esc(c.yoy || '')}
          </td>
        </tr>
      `).join('');
  
      const notes = (e.notes || []).map(n => `
        <div class="revenue-note"><strong>${esc(n.title)}</strong> ${n.body}</div>
      `).join('');
  
      return `
        <div class="section-title">Expense Breakdown (${esc(summary.season || '')})</div>
  
        <div class="expense-mix-wrap">
          <div class="expense-mix-title">Expense mix &mdash; ${esc(e.total || '\u2014')} total</div>
          <div class="expense-mix-bar">${mixBar}</div>
          <div class="expense-mix-legend">${mixLegend}</div>
        </div>
  
        <div class="revenue-summary">${summaryCells}</div>
  
        <table class="revenue-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th class="share-col">Share</th>
              <th class="amount">Amount</th>
              <th class="pct">%</th>
              <th>YoY</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Expenses</td>
              <td class="amount">${esc(e.total || '\u2014')}</td>
              <td class="pct">100%</td>
              <td class="revenue-yoy up"><span class="arrow">&#9650;</span>${esc(e.totalYoy || '')}</td>
            </tr>
          </tfoot>
        </table>
  
        ${notes ? `<div class="revenue-notes"><div class="revenue-notes-title">Notes &amp; Context</div>${notes}</div>` : ''}
      `;
    }
  
    function renderFinanceSponsors(f) {
      const sp = f.sponsors || {};
      const list = sp.list || [];
      const summary = sp.summary || {};
      const timeline = sp.timeline || {};
  
      const tabs = [
        { key: 'all',        label: 'All Partners' },
        { key: 'sportswear', label: 'Sportswear' },
        { key: 'shirt',      label: 'Shirt & Sleeve' },
        { key: 'technology', label: 'Technology' },
        { key: 'automotive', label: 'Automotive' },
        { key: 'beverage',   label: 'Beverage' },
        { key: 'service',    label: 'Services' }
      ];
      const tabsHtml = tabs.map((t, i) =>
        `<button class="sponsor-tab${i === 0 ? ' active' : ''}" data-category="${t.key}">${t.label}</button>`
      ).join('');
  
      const years = (timeline.years || []).map(y =>
        `<span class="sponsor-timeline-year" style="left: ${y.left};">${y.label}</span>`
      ).join('');
  
      const rows = (timeline.rows || []).map(r => `
        <div class="sponsor-timeline-row">
          <div class="sponsor-timeline-name">${esc(r.name)}</div>
          <div class="sponsor-timeline-track">
            <div class="sponsor-timeline-bar ${r.className || ''}" style="left: ${r.left}; width: ${r.width};" title="${esc(r.title || '')}"></div>
          </div>
        </div>
      `).join('');
  
      const summaryCells = [
        { label: 'Total Partners',      value: summary.totalPartners || '\u2014', desc: summary.totalPartnersDesc || '' },
        { label: 'Longest Partnership', value: summary.longest || '\u2014',       desc: summary.longestDesc || '' },
        { label: 'Newest Partner',      value: summary.newest || '\u2014',        desc: summary.newestDesc || '' },
        { label: 'Total Annual Value',  value: summary.totalValue || '\u2014',    desc: summary.totalValueDesc || '' }
      ].map(c => `
        <div class="sponsor-summary-cell">
          <div class="sponsor-summary-label">${esc(c.label)}</div>
          <div class="sponsor-summary-value">${esc(c.value)}</div>
          <div class="sponsor-summary-desc">${esc(c.desc)}</div>
        </div>
      `).join('');
  
      const partnerRows = list.map(p => `
        <tr data-category="${esc(p.category)}">
          <td>
            <div class="sponsor-cell-wrap">
              <div class="sponsor-logo">${esc(p.logo || initials(p.name))}</div>
              <div class="sponsor-info">
                <div class="sponsor-name">${esc(p.name)}${p.scope ? `<span class="sponsor-scope-tag${p.scope === 'Global' ? ' global' : ''}">${esc(p.scope)}</span>` : ''}</div>
                <div class="sponsor-category">${esc(p.subCategory || '')}</div>
              </div>
            </div>
          </td>
          <td class="duration-cell"${p.durationWidth ? ` style="width: 160px;"` : ''}>
            ${p.durationWidth ? `<div class="sponsor-duration-bar"><div class="sponsor-duration-fill ${p.className || ''}" style="width: ${p.durationWidth};"></div></div>` : ''}
          </td>
          <td><span class="sponsor-duration">${esc(p.since || '')}</span></td>
          <td class="sponsor-amount">${esc(p.value || '')}</td>
        </tr>
      `).join('');
  
      const notes = (sp.notes || []).map(n => `
        <div class="revenue-note"><strong>${esc(n.title)}</strong> ${n.body}</div>
      `).join('');
  
      return `
        <div class="section-title">Commercial Partners (${esc(summary.season || '')})</div>
  
        <div class="sponsor-tabs" id="sponsorTabs">${tabsHtml}</div>
  
        ${timeline.rows ? `
          <div class="sponsor-timeline-wrap">
            <div class="sponsor-timeline-title">${esc(timeline.title || 'Partnership timeline')}</div>
            <div class="sponsor-timeline">
              <div class="sponsor-timeline-labels">${years}</div>
              <div class="sponsor-timeline-axis"></div>
              <div class="sponsor-timeline-rows">${rows}</div>
            </div>
          </div>
        ` : ''}
  
        <div class="sponsor-summary">${summaryCells}</div>
  
        <table class="sponsor-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th class="duration-col">Duration</th>
              <th>Since</th>
              <th class="amount">Est. Annual Value</th>
            </tr>
          </thead>
          <tbody id="sponsorTableBody">${partnerRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Estimated Annual Commercial Value</td>
              <td class="sponsor-amount">${esc(summary.totalEstValue || '\u2014')}</td>
            </tr>
          </tfoot>
        </table>
  
        ${notes ? `<div class="revenue-notes"><div class="revenue-notes-title">Notes &amp; Context</div>${notes}</div>` : ''}
      `;
    }
  
    function renderFinanceHistory(f) {
      const h = f.history || {};
      const seasons = h.seasons || [];
      const summary = h.summary || {};
      const analytics = h.analytics || {};
      const decades = h.decades || [];
  
      const chartSvg = renderHistoryChartSVG(seasons);
      const xAxis = seasons.map(s => `<span class="stock-x-label">${esc(s.shortLabel || s.season)}</span>`).join('');
  
      const summaryStats = [
        { label: summary.totalProfitLabel || 'Total Profit', value: summary.totalProfit, positive: true, tooltip: summary.totalProfitTooltip },
        { label: summary.bestYearLabel || 'Best Year',       value: summary.bestYear,    positive: true, tooltip: summary.bestYearTooltip },
        { label: summary.worstYearLabel || 'Worst Year',     value: summary.worstYear,   positive: false, tooltip: summary.worstYearTooltip },
        { label: summary.avgLabel || 'Avg Net Profit',       value: summary.avgProfit,   positive: true, tooltip: summary.avgTooltip },
        { label: summary.profitableLabel || 'Profitable Seasons', value: summary.profitable, positive: true, tooltip: summary.profitableTooltip }
      ].map(s => `
        <div class="summary-stat">
          ${s.tooltip ? `<button class="summary-stat-info" data-tooltip="${esc(s.tooltip)}">i</button>` : ''}
          <div class="summary-stat-value ${s.positive ? 'positive' : 'negative'}">${esc(s.value || '\u2014')}</div>
          <div class="summary-stat-label">${s.label}</div>
        </div>
      `).join('');
  
      const analyticsCells = [
        { label: 'Revenue CAGR',    value: analytics.revenueCagr,  positive: true,  desc: analytics.revenueCagrDesc },
        { label: 'Expenses CAGR',   value: analytics.expensesCagr, positive: false, desc: analytics.expensesCagrDesc },
        { label: 'Wage-to-Revenue', value: analytics.wageRevenue,  positive: true,  desc: analytics.wageRevenueDesc },
        { label: 'Profit Margin',   value: analytics.profitMargin, positive: true,  desc: analytics.profitMarginDesc }
      ].map(c => `
        <div class="analytics-cell">
          <div class="analytics-label">${esc(c.label)}</div>
          <div class="analytics-value ${c.positive ? 'positive' : 'negative'}">${esc(c.value || '\u2014')}</div>
          <div class="analytics-desc">${esc(c.desc || '')}</div>
        </div>
      `).join('');
  
      const decadesHtml = decades.map(d => renderDecade(d)).join('');
  
      return `
        <div class="section-title">Net Profit / Loss by Season</div>
  
        <div class="history-chart-wrap">
          <div class="history-chart-title">Net Profit &mdash; ${esc(h.chartTitle || 'Season Trend')}</div>
  
          <div class="stock-chart">
            <div class="stock-y-axis">
              <span>+125M</span>
              <span>+100M</span>
              <span>+75M</span>
              <span>+50M</span>
              <span>+25M</span>
              <span>0</span>
              <span>-25M</span>
            </div>
  
            <div class="stock-plot" id="stockPlot">
              <div class="stock-gridline" style="top: 0%;"></div>
              <div class="stock-gridline" style="top: 16.67%;"></div>
              <div class="stock-gridline" style="top: 33.33%;"></div>
              <div class="stock-gridline" style="top: 50%;"></div>
              <div class="stock-gridline" style="top: 66.67%;"></div>
              <div class="stock-gridline zero" style="top: 83.33%;"></div>
              <div class="stock-gridline" style="top: 100%;"></div>
  
              <div class="stock-hover-guide" id="stockHoverGuide"></div>
  
              <svg class="stock-svg" viewBox="0 0 1040 300" preserveAspectRatio="none">
                ${chartSvg}
              </svg>
  
              <div class="stock-tooltip" id="stockTooltip">
                <div class="stock-tooltip-season" id="ttSeason">&mdash;</div>
                <div class="stock-tooltip-row">
                  <span class="stock-tooltip-label">Revenue</span>
                  <span class="stock-tooltip-value positive" id="ttRevenue">&mdash;</span>
                </div>
                <div class="stock-tooltip-row">
                  <span class="stock-tooltip-label">Expenses</span>
                  <span class="stock-tooltip-value negative" id="ttExpenses">&mdash;</span>
                </div>
                <div class="stock-tooltip-divider"></div>
                <div class="stock-tooltip-row">
                  <span class="stock-tooltip-label">Net Profit</span>
                  <span class="stock-tooltip-value" id="ttProfit">&mdash;</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="stock-x-axis">${xAxis}</div>
        </div>
  
        ${summaryStats ? `
          <div class="section-title">${esc(summary.title || 'Season Summary')}</div>
          <div class="summary-stats">${summaryStats}</div>
        ` : ''}
  
        ${analyticsCells ? `<div class="analytics-bar">${analyticsCells}</div>` : ''}
  
        ${decades.length ? `
          <div class="section-title">Financial History by Decade</div>
  
          <div class="season-sort-bar" id="seasonSortBar">
            <span class="season-sort-label">Sort by:</span>
            <button class="season-sort-btn active" data-sort="latest">Latest</button>
            <button class="season-sort-btn" data-sort="oldest">Oldest</button>
            <button class="season-sort-btn" data-sort="highest">Highest Profit</button>
            <button class="season-sort-btn" data-sort="least">Least Profit</button>
          </div>
  
          ${decadesHtml}
        ` : ''}
      `;
    }
  
    function renderHistoryChartSVG(seasons) {
      if (!seasons.length) return '';
  
      const cols = seasons.length;
      const colWidth = 1040 / (cols - 1 || 1);
  
      const points = seasons.map((s, i) => {
        const x = i * colWidth;
        const y = 250 - (s.profit / 25) * 50;
        return { x, y, season: s };
      });
  
      let linePath = '';
      for (let i = 0; i < points.length - 1; i++) {
        const color = points[i].season.profit < 0 ? '#dc2626' : '#16a34a';
        linePath += `<path d="M ${points[i].x} ${points[i].y} L ${points[i+1].x} ${points[i+1].y}"
                      fill="none" stroke="${color}" stroke-width="2.5"
                      stroke-linejoin="round" stroke-linecap="round" />`;
      }
  
      const areaPath = 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ') +
                       ` L ${points[points.length-1].x} 300 L ${points[0].x} 300 Z`;
  
      const dots = points.map((p, i) =>
        `<circle class="stock-dot" data-idx="${i}" cx="${p.x}" cy="${p.y}" r="${p.season.profit < 0 ? 5 : 4}"
                fill="${p.season.profit < 0 ? '#dc2626' : '#16a34a'}"
                stroke="#ffffff" stroke-width="1.5" />`
      ).join('');
  
      return `
        <path d="${areaPath}" fill="rgba(22, 163, 74, 0.08)" />
        ${linePath}
        <g id="stockDots">${dots}</g>
      `;
    }
  
    function renderDecade(d) {
      const seasonsHtml = (d.seasons || []).map(s => renderSeasonRow(s)).join('');
  
      return `
        <div class="decade-group" data-decade="${esc(d.title)}">
          <div class="decade-header">
            <span class="decade-title">${esc(d.title)}</span>
            <span></span>
            <span class="decade-total ${(d.total || '').startsWith('+') ? 'positive' : 'negative'}">${esc(d.total || '')}</span>
            <span class="decade-toggle"></span>
          </div>
          <div class="decade-body">${seasonsHtml}</div>
        </div>
      `;
    }
  
    function renderSeasonRow(s) {
      const p = s.profit || 0;
      const barWidth = Math.min(Math.abs(p) / 120 * 100, 100);
  
      const details = [
        { label: 'Revenue',    value: s.revenue,        cls: 'revenue' },
        { label: 'Expenses',   value: s.expenses,       cls: 'expenses' },
        { label: 'Net Profit', value: s.profitDisplay,  cls: 'profit' + (p < 0 ? ' negative' : '') }
      ].map(d => `
        <div class="season-detail">
          <span class="season-detail-label">${d.label}</span>
          <div class="season-detail-bar">
            <div class="season-detail-bar-fill ${d.cls}" style="width: ${barWidth}%;"></div>
          </div>
          <span class="season-detail-value">${esc(d.value || '')}</span>
        </div>
      `).join('');
  
      const metrics = [
        { label: 'Profit Margin', value: s.profitMargin, positive: !(s.profitMargin || '').startsWith('\u2212') && !(s.profitMargin || '').startsWith('-') },
        { label: 'Revenue Growth', value: s.revenueGrowth, positive: !(s.revenueGrowth || '').startsWith('\u2212') && !(s.revenueGrowth || '').startsWith('-') },
        { label: '3-Yr Rolling Avg', value: s.rollingAvg, positive: true }
      ].map(m => `
        <div class="season-metric">
          <span class="season-metric-label">${m.label}</span>
          <span class="season-metric-value${m.positive ? '' : ' negative'}">${esc(m.value || '')}</span>
        </div>
      `).join('');
  
      return `
        <div class="season-row" data-season="${esc(s.season)}" data-profit="${p}">
          <div class="season-row-header">
            <span class="season-row-season">${esc(s.season)}</span>
            <div class="season-row-bar"><div class="season-row-bar-fill${p < 0 ? ' negative' : ''}" style="width: ${barWidth}%;"></div></div>
            <div class="season-row-profit-wrap">
              <span class="season-row-profit${p < 0 ? ' negative' : ''}">${esc(s.profitDisplay || '')}</span>
              <span class="season-row-trend ${p < 0 ? 'down' : 'up'}"><span class="arrow">${p < 0 ? '&#9660;' : '&#9650;'}</span>${esc(s.trend || '')}</span>
            </div>
            <span class="season-row-yoy ${p < 0 ? 'down' : 'up'}">${p < 0 ? '&#9660;' : '&#9650;'} ${esc(s.yoy || '')}</span>
            <span class="season-row-toggle"></span>
          </div>
          <div class="season-row-body">
            ${details}
            <div class="season-metrics">${metrics}</div>
          </div>
        </div>
      `;
    }
  
    /* ============================================================
       10. STADIUM
       ============================================================ */
  
    function renderStadium(club) {
      const s = club.stadium || {};
      const intro = s.intro || `${esc(club.name)} play their home matches at ${esc(s.name || 'their stadium')}.`;
  
      const stadiumFacts = [
        { label: 'Stadium Name',  value: s.name },
        { label: 'Opened',        value: s.openedDate ? formatDateISO(s.openedDate) : s.opened },
        { label: 'Capacity',      value: s.capacity },
        { label: 'Location',      value: s.location },
        { label: 'Renovation',    value: s.renovation },
        { label: 'UEFA Category', value: s.uefaCategory },
        { label: 'Nickname',      value: s.nickname },
        { label: 'Tenants',       value: s.tenants }
      ].filter(f => f.value);
  
      const factsHtml = stadiumFacts.map(f => `
        <div class="info-card">
          <div class="label">${esc(f.label)}</div>
          <div class="value">${esc(f.value)}</div>
        </div>
      `).join('');
  
      const tg = s.trainingGround || {};
      const tgFacts = [
        { label: 'Facility', value: tg.facility },
        { label: 'Location', value: tg.location },
        { label: 'Opened',   value: tg.openedYear ? formatYear(tg.openedYear) : tg.opened },
        { label: 'Size',     value: tg.size }
      ].filter(f => f.value);
  
      const tgHtml = tgFacts.length ? `
        <div class="section-title">Training Ground</div>
        <div class="info-grid">
          ${tgFacts.map(f => `
            <div class="info-card">
              <div class="label">${esc(f.label)}</div>
              <div class="value">${esc(f.value)}</div>
            </div>
          `).join('')}
        </div>
      ` : '';
  
      return `
        <p>${intro}</p>
  
        <div class="section-title">Stadium Facts</div>
        <div class="info-grid">${factsHtml}</div>
  
        ${tgHtml}
      `;
    }
  
    /* ============================================================
       11. STAFF
       ============================================================ */
  
    const STAFF_SUBTABS = [
      { key: 'current-staff', label: 'Current Staff' },
      { key: 'managers',      label: 'Managers' },
      { key: 'presidents',    label: 'Presidents' }
    ];
  
    function renderStaff(club) {
      const s = club.staff || {};
  
      return `
        <p>${esc(s.intro || "Current and historical staff — coaches, leadership, and past presidents.")}</p>
  
        <div class="subtab-bar-wrap">
          <div class="subtab-bar">
            ${STAFF_SUBTABS.map((t, i) =>
              `<button class="subtab-btn${i === 0 ? ' active' : ''}" data-subtab="${t.key}">${t.label}</button>`
            ).join('')}
          </div>
        </div>
  
        <div class="subtab-panel active" id="subtab-current-staff">${renderCurrentStaff(s)}</div>
        <div class="subtab-panel" id="subtab-managers">${renderManagers(s)}</div>
        <div class="subtab-panel" id="subtab-presidents">${renderPresidents(s)}</div>
      `;
    }
  
    function renderCurrentStaff(s) {
      const cur = s.current || {};
      const summary = cur.summary || {};
  
      const summaryHtml = [
        { label: 'Head Coach',     value: summary.headCoach,     desc: summary.headCoachDesc },
        { label: 'Coaching Staff', value: summary.coachingStaff, desc: summary.coachingStaffDesc },
        { label: 'President',      value: summary.president,     desc: summary.presidentDesc },
        { label: 'Board Members',  value: summary.boardMembers,  desc: summary.boardMembersDesc }
      ].filter(c => c.value).map(c => `
        <div class="staff-summary-cell">
          <div class="staff-summary-label">${esc(c.label)}</div>
          <div class="staff-summary-value">${esc(c.value)}</div>
          <div class="staff-summary-desc">${esc(c.desc || '')}</div>
        </div>
      `).join('');
  
      const coachingRows = (cur.coaching || []).map(m => `
        <tr>
          <td>
            <div class="manager-cell">
              ${m.flag ? `<span class="manager-flag-wrap"><img src="${flagPath(m.flag)}" alt="" class="manager-flag" /><span class="flag-tooltip">${esc(m.country || '')}</span></span>` : ''}
              <span>${esc(m.name)}</span>
              ${m.current ? '<span class="current-tag">Current</span>' : ''}
            </div>
          </td>
          <td>${esc(m.role)}</td>
          <td>${m.sinceDate ? `<span class="period-tooltip" data-tooltip="${esc(m.sinceDate)}">${esc(m.since)}</span>` : esc(m.since || '')}</td>
        </tr>
      `).join('');
  
      const leadershipRows = (cur.leadership || []).map(m => `
        <tr>
          <td>
            <div class="manager-cell">
              ${m.flag ? `<span class="manager-flag-wrap"><img src="${flagPath(m.flag)}" alt="" class="manager-flag" /><span class="flag-tooltip">${esc(m.country || '')}</span></span>` : ''}
              <span>${esc(m.name)}</span>
              ${m.current ? '<span class="current-tag">Current</span>' : ''}
            </div>
          </td>
          <td>${esc(m.role)}</td>
          <td>${m.sinceDate ? `<span class="period-tooltip" data-tooltip="${esc(m.sinceDate)}">${esc(m.since)}</span>` : esc(m.since || '')}</td>
        </tr>
      `).join('');
  
      return `
        <div class="staff-summary">${summaryHtml}</div>
  
        ${coachingRows ? `
          <div class="staff-subsection-title">Coaching Staff</div>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Since</th></tr></thead>
            <tbody>${coachingRows}</tbody>
          </table>
        ` : ''}
  
        ${leadershipRows ? `
          <div class="staff-subsection-title">Club Leadership</div>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Since</th></tr></thead>
            <tbody>${leadershipRows}</tbody>
          </table>
        ` : ''}
      `;
    }
  
    function renderManagers(s) {
      const m = s.managers || {};
      const list = m.list || [];
      const summary = m.summary || {};
  
      const summaryHtml = [
        { label: 'Total Managers',  value: summary.total },
        { label: 'Most Decorated',  value: summary.mostDecorated,  desc: summary.mostDecoratedDesc },
        { label: 'Longest Tenure',  value: summary.longestTenure,  desc: summary.longestTenureDesc },
        { label: 'Current Manager', value: summary.current,        desc: summary.currentDesc }
      ].filter(c => c.value).map(c => `
        <div class="staff-summary-cell">
          <div class="staff-summary-label">${esc(c.label)}</div>
          <div class="staff-summary-value">${esc(c.value)}</div>
          <div class="staff-summary-desc">${esc(c.desc || '')}</div>
        </div>
      `).join('');
  
      const chips = list.map(mgr => `
        <div class="manager-chip${mgr.current ? ' current' : ''}">
          <div class="manager-chip-header">
            <span class="manager-chip-order">${esc(mgr.period)}</span>
            ${mgr.current ? '<span class="current-tag">Current</span>' : ''}
          </div>
          <div class="manager-chip-info">
            ${mgr.flag ? `<img src="${flagPath(mgr.flag)}" alt="" class="manager-chip-flag" />` : ''}
            <span class="manager-chip-name">${esc(mgr.name)}</span>
          </div>
          <div class="manager-chip-period">${esc(mgr.note || '')}</div>
          <div class="manager-chip-trophies">
            <span class="manager-chip-trophy-count${!mgr.trophies ? ' zero' : ''}">${mgr.trophies || 0}</span>
            <span class="manager-chip-trophy-label">${mgr.trophies === 1 ? 'Trophy' : 'Trophies'}</span>
          </div>
        </div>
      `).join('');
  
      const rows = list.map(mgr => `
        <div class="manager-list-row${mgr.current ? ' current' : ''}">
          <div class="manager-list-info">
            <div class="manager-list-name">
              ${mgr.flag ? `<span class="manager-flag-wrap"><img src="${flagPath(mgr.flag)}" alt="" class="manager-flag" /><span class="flag-tooltip">${esc(mgr.country || '')}</span></span>` : ''}
              <span>${esc(mgr.name)}</span>
              ${mgr.current ? '<span class="current-tag">Current</span>' : ''}
            </div>
            <div class="manager-list-period">${esc(mgr.period)}${mgr.note ? ` &middot; ${esc(mgr.note)}` : ''}</div>
          </div>
          <div class="manager-list-trophies">
            <div class="manager-trophy-number${!mgr.trophies ? ' zero' : ''}">${mgr.trophies || 0}</div>
            <div class="manager-trophy-label">${mgr.trophies === 1 ? 'Trophy' : 'Trophies'}</div>
          </div>
        </div>
      `).join('');
  
      return `
        <div class="staff-summary">${summaryHtml}</div>
  
        ${chips ? `
          <div class="manager-scroll-wrap">
            <div class="manager-scroll-header">
              <div class="manager-scroll-title">Managerial history &mdash; current back to first</div>
              <div class="manager-scroll-hint"><span class="arrow">&larr;</span> Scroll <span class="arrow">&rarr;</span></div>
            </div>
            <div class="manager-scroll">${chips}</div>
          </div>
        ` : ''}
  
        ${rows ? `
          <div class="section-title">All Managers</div>
          <div class="manager-list">${rows}</div>
        ` : ''}
      `;
    }
  
    function renderPresidents(s) {
      const p = s.presidents || {};
      const list = p.list || [];
      const summary = p.summary || {};
  
      const summaryHtml = [
        { label: 'Total Presidents',  value: summary.total },
        { label: 'Longest-Serving',   value: summary.longest, desc: summary.longestDesc },
        { label: 'Current President', value: summary.current, desc: summary.currentDesc },
        { label: 'Most Trophies',     value: summary.mostTrophies, desc: summary.mostTrophiesDesc }
      ].filter(c => c.value).map(c => `
        <div class="staff-summary-cell">
          <div class="staff-summary-label">${esc(c.label)}</div>
          <div class="staff-summary-value">${esc(c.value)}</div>
          <div class="staff-summary-desc">${esc(c.desc || '')}</div>
        </div>
      `).join('');
  
      const rows = list.map(pres => `
        <tr>
          <td>
            <div class="manager-cell">
              ${pres.flag ? `<span class="manager-flag-wrap"><img src="${flagPath(pres.flag)}" alt="" class="manager-flag" /><span class="flag-tooltip">${esc(pres.country || '')}</span></span>` : ''}
              <span>${esc(pres.name)}</span>
              ${pres.current ? '<span class="current-tag">Current</span>' : ''}
            </div>
          </td>
          <td>${pres.periodDate ? `<span class="period-tooltip" data-tooltip="${esc(pres.periodDate)}">${esc(pres.period)}</span>` : esc(pres.period || '')}</td>
          <td>${esc(pres.achievements || '')}</td>
        </tr>
      `).join('');
  
      return `
        <div class="staff-summary">${summaryHtml}</div>
        <table>
          <thead><tr><th>President</th><th>Period</th><th>Notable Achievements</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  
    /* ============================================================
       12. RECORDS
       ============================================================ */
  
    const RECORDS_SUBTABS = [
      { key: 'records-overview', label: 'Overview' },
      { key: 'h2h',              label: 'Head-to-Head' }
    ];
  
    function renderRecords(club, h2h) {
      const records = club.records || [];
  
      const rowsHtml = records.map(r => `
        <tr><td>${esc(r.label)}</td><td>${esc(r.value)}</td></tr>
      `).join('');
  
      return `
        <p>
          ${esc(club.name)}'s records and head-to-head history. Use the Overview tab for a quick reference of club records, or open Head-to-Head for a full analytical breakdown of every competitive fixture against a selected opponent.
        </p>
  
        <div class="subtab-bar-wrap">
          <div class="subtab-bar">
            ${RECORDS_SUBTABS.map((t, i) =>
              `<button class="subtab-btn${i === 0 ? ' active' : ''}" data-subtab="${t.key}">${t.label}</button>`
            ).join('')}
          </div>
        </div>
  
        <div class="subtab-panel active" id="subtab-records-overview">
          <div class="section-title">Club Records</div>
          <table>
            <thead><tr><th>Record</th><th>Holder / Value</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
  
        <div class="subtab-panel" id="subtab-h2h">
          ${h2h ? renderH2H(h2h) : '<p style="color: var(--text-muted); font-style: italic;">No head-to-head data available for this club.</p>'}
        </div>
      `;
    }
  
    /* ============================================================
       13. HEAD-TO-HEAD — structure
       ============================================================ */
  
    function renderH2H(h2h) {
      const oppCount = (h2h.opponents || []).length;
  
      return `
        <div class="h2h-stage active" id="h2h-stage-grid">
          <div class="h2h-controls-wrap">
            <div class="h2h-search-box">
              <svg class="h2h-search-icon" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" class="h2h-search-input" id="h2h-search"
                     placeholder="Search clubs by name..." autocomplete="off"
                     aria-label="Search clubs" />
            </div>
            <div class="h2h-search-count" id="h2h-search-count">
              Showing ${oppCount} of ${oppCount} clubs
            </div>
          </div>
  
          <div class="h2h-clubs-grid" id="h2h-clubs-grid"></div>
  
          <div class="h2h-empty-state" id="h2h-empty-state" hidden>
            No clubs match your search.
          </div>
        </div>
  
        <div class="h2h-stage" id="h2h-stage-stats">
          <button class="h2h-back-btn" id="h2h-back-btn">&larr; Back to clubs</button>
  
          <div class="h2h-versus">
            <div class="h2h-team">
              <div class="h2h-team-logo">
                <img src="${clubLogo(h2h.self.logoSlug || SLUG)}" alt="${esc(h2h.self.name)}"
                     onerror="this.parentElement.textContent='${esc(initials(h2h.self.name))}';" />
              </div>
              <div class="h2h-team-name">${esc(h2h.self.name)}</div>
              <div class="h2h-team-sub">${esc(h2h.self.sub || '')}</div>
            </div>
            <div class="h2h-vs">VS</div>
            <div class="h2h-team">
              <div class="h2h-team-logo" id="h2h-opp-logo"></div>
              <div class="h2h-team-name" id="h2h-opp-name">&mdash;</div>
              <div class="h2h-team-sub" id="h2h-opp-sub">&mdash;</div>
            </div>
          </div>
  
          <div class="h2h-split-wrap">
            <div class="h2h-split-title">Result split &mdash; <span id="h2h-total-matches">0</span> competitive matches</div>
            <div class="h2h-split-bar" id="h2h-split-bar"></div>
            <div class="h2h-split-legend">
              <div class="h2h-split-legend-item">
                <span class="h2h-split-legend-swatch wins"></span>
                <span class="h2h-split-legend-label">${esc(h2h.self.name)} wins</span>
                <span class="h2h-split-legend-value" id="h2h-legend-wins">0</span>
              </div>
              <div class="h2h-split-legend-item">
                <span class="h2h-split-legend-swatch draws"></span>
                <span class="h2h-split-legend-label">Draws</span>
                <span class="h2h-split-legend-value" id="h2h-legend-draws">0</span>
              </div>
              <div class="h2h-split-legend-item">
                <span class="h2h-split-legend-swatch losses"></span>
                <span class="h2h-split-legend-label">Opponent wins</span>
                <span class="h2h-split-legend-value" id="h2h-legend-losses">0</span>
              </div>
            </div>
          </div>
  
          <div class="h2h-metrics">
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="Points per game — 3 pts for a win, 1 for a draw, 0 for a loss.">i</button>
              <div class="h2h-metric-label">Points / Game</div>
              <div class="h2h-metric-value positive" id="h2h-ppg">&mdash;</div>
              <div class="h2h-metric-desc">3-1-0 system</div>
            </div>
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="Win percentage — the proportion of matches in this fixture that ended in a victory.">i</button>
              <div class="h2h-metric-label">Win Rate</div>
              <div class="h2h-metric-value positive" id="h2h-winrate">&mdash;</div>
              <div class="h2h-metric-desc" id="h2h-winrate-desc">&mdash;</div>
            </div>
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="Goals scored vs conceded. Goal difference is a stronger indicator of dominance than raw wins alone.">i</button>
              <div class="h2h-metric-label">Goals (For&ndash;Against)</div>
              <div class="h2h-metric-value" id="h2h-goals">&mdash;</div>
              <div class="h2h-metric-desc" id="h2h-goals-desc">&mdash;</div>
            </div>
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="Goals scored per match in this fixture.">i</button>
              <div class="h2h-metric-label">Goals / Match</div>
              <div class="h2h-metric-value" id="h2h-gpm">&mdash;</div>
              <div class="h2h-metric-desc" id="h2h-gpm-desc">&mdash;</div>
            </div>
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="Home vs away win percentage. A large gap suggests a strong home advantage.">i</button>
              <div class="h2h-metric-label">Home / Away Win %</div>
              <div class="h2h-metric-value" id="h2h-homeaway">&mdash;</div>
              <div class="h2h-metric-desc">Home vs away</div>
            </div>
            <div class="h2h-metric">
              <button class="h2h-metric-info" data-tooltip="The current streak — consecutive wins, draws, or losses in this fixture.">i</button>
              <div class="h2h-metric-label">Current Streak</div>
              <div class="h2h-metric-value" id="h2h-streak">&mdash;</div>
              <div class="h2h-metric-desc" id="h2h-streak-desc">&mdash;</div>
            </div>
          </div>
  
          <div class="h2h-comp-tabs" id="h2h-comp-tabs"></div>
  
          <div class="section-title">Recent Fixtures</div>
          <div class="h2h-fixtures-grid" id="h2h-fixtures-grid"></div>
  
          <p style="font-size: 0.78rem;">
            <em>Showing the most recent fixtures against <span id="h2h-opp-name-inline">&mdash;</span>. Click any fixture to open the full match report.</em>
          </p>
        </div>
      `;
    }
  
    /* ============================================================
       14. PLAYERS (Squad + Transfers)
       ============================================================ */
  
    function renderPlayers(club) {
      const hasTransfers = club.transfers
        && club.transfers.latest
        && club.transfers.latest.length > 0;
  
      if (!hasTransfers) {
        return `
          <p>${esc(club.name)} legends and current stars.</p>
          ${renderSquad(club)}
        `;
      }
  
      return `
        <p>${esc(club.name)} legends, current stars, and recent transfer activity.</p>
  
        <div class="subtab-bar-wrap">
          <div class="subtab-bar">
            <button class="subtab-btn active" data-subtab="players-squad">Squad</button>
            <button class="subtab-btn" data-subtab="players-transfers">Transfers</button>
          </div>
        </div>
  
        <div class="subtab-panel active" id="subtab-players-squad">
          ${renderSquad(club)}
        </div>
  
        <div class="subtab-panel" id="subtab-players-transfers">
          ${renderTransfers(club)}
        </div>
      `;
    }
  
    function renderSquad(club) {
      const players = club.players || [];
      const total = players.length;
  
      const badgesHtml = players.map(p => {
        const avatarHtml = p.image
          ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.replaceWith('${esc(initials(p.name))}')" />`
          : esc(initials(p.name));
        const yearsHtml = p.yearsData
          ? `${formatYear(p.yearsData[0])}&ndash;${p.yearsData[1] ? formatYear(p.yearsData[1]) : 'present'}`
          : esc(p.years || '');
  
        return `
          <a href="../players/${esc(p.slug)}.html" class="player-badge" data-player="${esc(p.name)}">
            <div class="player-avatar">${avatarHtml}</div>
            <div class="player-name">${esc(p.name)}</div>
            <div class="player-years">${yearsHtml}</div>
            ${p.flag ? `<span class="player-nation"><img src="${flagPath(p.flag)}" alt="" class="player-flag" /><span class="flag-tooltip">${esc(p.country || '')}</span></span>` : ''}
          </a>
        `;
      }).join('');
  
      return `
        <div class="player-search-wrap">
          <div class="player-search-box">
            <svg class="player-search-icon" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="player-search-input" id="player-search"
                   placeholder="Search players by name..." autocomplete="off"
                   aria-label="Search players" />
          </div>
          <div class="player-search-count" id="player-search-count">
            Showing ${total} of ${total} players
          </div>
        </div>
  
        <div class="players-grid" id="players-grid">${badgesHtml}</div>
  
        <div class="player-empty-state" id="player-empty-state" hidden>
          No players match your search.
        </div>
      `;
    }
  
    function renderTransfers(club) {
      const t = club.transfers || {};
      const summary = t.summary || {};
      const list = t.latest || [];
  
      const netPositive = !(summary.netSpend || '').startsWith('\u2212') && !(summary.netSpend || '').startsWith('-');
  
      const summaryHtml = `
        <div class="transfers-summary">
          <div class="transfers-summary-cell">
            <div class="transfers-summary-label">Total In (recent)</div>
            <div class="transfers-summary-value negative">${esc(summary.totalIn || '\u2014')}</div>
            <div class="transfers-summary-desc">Sum of incoming fees</div>
          </div>
          <div class="transfers-summary-cell">
            <div class="transfers-summary-label">Total Out (recent)</div>
            <div class="transfers-summary-value positive">${esc(summary.totalOut || '\u2014')}</div>
            <div class="transfers-summary-desc">Sum of outgoing fees</div>
          </div>
          <div class="transfers-summary-cell">
            <div class="transfers-summary-label">Net Spend</div>
            <div class="transfers-summary-value ${netPositive ? 'positive' : 'negative'}">${esc(summary.netSpend || '\u2014')}</div>
            <div class="transfers-summary-desc">In minus out</div>
          </div>
          <div class="transfers-summary-cell">
            <div class="transfers-summary-label">Latest Transfer</div>
            <div class="transfers-summary-value">${esc(summary.latestPlayer || '\u2014')}</div>
            <div class="transfers-summary-desc">${esc(summary.latestDesc || '')}</div>
          </div>
        </div>
      `;
  
      const cardsHtml = list.map(tr => {
        const isIn = tr.direction === 'in';
  
        const playerName = tr.playerSlug
          ? `<a href="../players/${esc(tr.playerSlug)}.html">${esc(tr.player)}</a>`
          : esc(tr.player);
  
        const flagHtml = tr.flag
          ? `<img src="${flagPath(tr.flag)}" alt="" class="transfer-flag" onerror="this.style.display='none';" />`
          : '';
  
        const fromLogo = tr.fromSlug
          ? `<img src="${clubLogo(tr.fromSlug)}" alt="" class="transfer-club-logo" onerror="this.style.display='none';" />`
          : '';
        const toLogo = tr.toSlug
          ? `<img src="${clubLogo(tr.toSlug)}" alt="" class="transfer-club-logo" onerror="this.style.display='none';" />`
          : '';
  
        const dateHtml = tr.date ? formatDateISO(tr.date) : '';
  
        return `
          <div class="transfer-card">
            <div class="transfer-card-header">
              <div class="transfer-direction-tag ${isIn ? 'in' : 'out'}">${isIn ? 'IN' : 'OUT'}</div>
  
              <div class="transfer-main">
                <div class="transfer-player-row">
                  <span class="transfer-player-name">${playerName}</span>
                  ${flagHtml}
                  <span class="transfer-type-tag">${esc(tr.type || '')}</span>
                </div>
  
                <div class="transfer-clubs-row">
                  <span class="transfer-club">${fromLogo}${esc(tr.from || '')}</span>
                  <span class="transfer-arrow">&rarr;</span>
                  <span class="transfer-club">${toLogo}${esc(tr.to || '')}</span>
                </div>
  
                <div class="transfer-meta-row">
                  ${tr.position ? `<span class="transfer-meta-item"><span class="transfer-meta-label">Position</span><span class="transfer-meta-value">${esc(tr.position)}</span></span>` : ''}
                  ${dateHtml ? `<span class="transfer-meta-item"><span class="transfer-meta-label">Date</span><span class="transfer-meta-value">${esc(dateHtml)}</span></span>` : ''}
                </div>
              </div>
  
              <div class="transfer-fee-block">
                <div class="transfer-fee ${isIn ? 'in' : 'out'}">${esc(tr.fee || '\u2014')}</div>
                <div class="transfer-fee-label">Fee</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
  
      return `
        ${summaryHtml}
        <div class="section-title">Latest Transfers</div>
        ${cardsHtml}
      `;
    }
  
    /* ============================================================
       15. INFO
       ============================================================ */
  
    function renderInfo(club) {
      const facts = [
        { label: 'Full Name', value: club.fullName || club.name },
        { label: 'Founded',   value: club.founded ? formatYear(club.founded) : '' },
        { label: 'City',      value: club.city },
        { label: 'Country',   value: club.countryName || '' },
        { label: 'Stadium',   value: club.stadium && club.stadium.name },
        { label: 'Capacity',  value: club.stadium && club.stadium.capacity },
        { label: 'League',    value: club.league },
        { label: 'Nickname',  value: (club.nicknames || []).join(' / ') },
        { label: 'Colours',   value: (club.colours || []).join(', ') }
      ].filter(f => f.value);
  
      const factsHtml = facts.map(f => `
        <div class="info-card">
          <div class="label">${esc(f.label)}</div>
          <div class="value">${esc(f.value)}</div>
        </div>
      `).join('');
  
      const ownership = club.ownership || {};
      const ownershipHtml = ownership.title ? `
        <div class="section-title">Ownership</div>
        <div class="ownership-card">
          <div class="ownership-icon">&#128101;</div>
          <div class="ownership-text">
            <h3>${esc(ownership.title)}</h3>
            ${(ownership.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>
      ` : '';
  
      return `
        <p>Key facts about ${esc(club.name)}.</p>
        <div class="info-grid">${factsHtml}</div>
        ${ownershipHtml}
      `;
    }
  
    /* ============================================================
       16. MAIN RENDER
       ============================================================ */
  
    function renderPage(club, h2h) {
      const html = `
        ${renderHeader()}
  
        <main>
          <div class="container">
            <div class="page-wrap">
              ${renderHero(club)}
              ${renderTabBar()}
  
              <div class="tab-panel active" id="tab-overview">${renderOverview(club)}</div>
              <div class="tab-panel" id="tab-finance">${renderFinance(club)}</div>
              <div class="tab-panel" id="tab-stadium">${renderStadium(club)}</div>
              <div class="tab-panel" id="tab-staff">${renderStaff(club)}</div>
              <div class="tab-panel" id="tab-records">${renderRecords(club, h2h)}</div>
              <div class="tab-panel" id="tab-players">${renderPlayers(club)}</div>
              <div class="tab-panel" id="tab-info">${renderInfo(club)}</div>
  
              <div class="last-updated">Last updated: <span id="last-updated-date">${esc(club.lastUpdated || '')}</span></div>
            </div>
          </div>
        </main>
  
        ${renderFooter()}
      `;
  
      document.body.innerHTML = html;
    }
  
    /* ============================================================
       17. WIRE — TABS / SUBTABS
       ============================================================ */
  
    function wireTabs() {
      qsa('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          qsa('.tab-btn').forEach(b => b.classList.remove('active'));
          qsa('.tab-panel').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = document.getElementById('tab-' + target);
          if (panel) panel.classList.add('active');
        });
      });
  
      qsa('.subtab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.subtab;
          const parent = btn.closest('.tab-panel') || document;
          qsa('.subtab-btn', parent).forEach(b => b.classList.remove('active'));
          qsa('.subtab-panel', parent).forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = parent.querySelector('#subtab-' + target);
          if (panel) panel.classList.add('active');
        });
      });
    }
  
    /* ============================================================
       18. WIRE — PLAYERS SEARCH
       ============================================================ */
  
    function wirePlayersSearch() {
      const input = document.getElementById('player-search');
      const grid = document.getElementById('players-grid');
      const count = document.getElementById('player-search-count');
      const empty = document.getElementById('player-empty-state');
      if (!input || !grid) return;
  
      const badges = qsa('.player-badge', grid);
      const total = badges.length;
  
      function update(visible) {
        if (count) count.textContent = visible === total
          ? `Showing ${total} of ${total} players`
          : `Showing ${visible} of ${total} players`;
        if (empty) empty.hidden = visible !== 0;
      }
  
      input.addEventListener('input', () => {
        const q = stripDiacritics(input.value.trim());
        let visible = 0;
        badges.forEach(b => {
          const name = stripDiacritics(b.dataset.player || '');
          const match = q === '' || name.includes(q);
          b.style.display = match ? '' : 'none';
          if (match) visible++;
        });
        update(visible);
      });
    }
  
    /* ============================================================
       19. WIRE — SPONSORS FILTER
       ============================================================ */
  
    function wireSponsorTabs() {
      const tabs = qsa('.sponsor-tab');
      const rows = qsa('#sponsorTableBody tr');
      if (!tabs.length) return;
  
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const cat = tab.dataset.category;
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          rows.forEach(r => {
            r.style.display = (cat === 'all' || r.dataset.category === cat) ? '' : 'none';
          });
        });
      });
    }
  
    /* ============================================================
       20. WIRE — FINANCE HISTORY CHART
       ============================================================ */
  
    function wireHistoryChart(seasons) {
      const plot = document.getElementById('stockPlot');
      const guide = document.getElementById('stockHoverGuide');
      const tooltip = document.getElementById('stockTooltip');
      const dots = qsa('#stockDots .stock-dot');
  
      if (!plot || !seasons || !seasons.length) return;
  
      const totalCols = seasons.length;
  
      function handleMove(e) {
        const rect = plot.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const colWidth = rect.width / totalCols;
        let idx = Math.floor(x / colWidth);
        idx = Math.max(0, Math.min(totalCols - 1, idx));
  
        const d = seasons[idx];
        const colCenterPx = colWidth * (idx + 0.5);
        guide.style.left = colCenterPx + 'px';
        guide.classList.add('active');
  
        tooltip.classList.remove('edge-left', 'edge-right');
        let transformX = '-50%';
        if (idx <= 2) { transformX = '0%'; tooltip.classList.add('edge-left'); }
        else if (idx >= totalCols - 3) { transformX = '-100%'; tooltip.classList.add('edge-right'); }
  
        tooltip.style.left = colCenterPx + 'px';
        tooltip.style.top = y + 'px';
        tooltip.style.transform = `translate(${transformX}, -100%) translateY(-14px)`;
        tooltip.classList.add('active');
  
        document.getElementById('ttSeason').textContent = d.season;
        document.getElementById('ttRevenue').textContent = d.revenue || '\u2014';
        document.getElementById('ttExpenses').textContent = d.expenses || '\u2014';
        const profitEl = document.getElementById('ttProfit');
        profitEl.textContent = d.profitDisplay || '\u2014';
        const positive = d.profit >= 0;
        profitEl.classList.toggle('positive', positive);
        profitEl.classList.toggle('negative', !positive);
  
        dots.forEach(dot => {
          const dotIdx = parseInt(dot.getAttribute('data-idx'), 10);
          if (dotIdx === idx) {
            dot.classList.add('highlighted');
            dot.classList.remove('dimmed');
          } else {
            dot.classList.remove('highlighted');
            dot.classList.add('dimmed');
          }
        });
      }
  
      function handleLeave() {
        guide.classList.remove('active');
        tooltip.classList.remove('active', 'edge-left', 'edge-right');
        dots.forEach(dot => {
          dot.classList.remove('dimmed');
          dot.classList.remove('highlighted');
        });
      }
  
      plot.addEventListener('mousemove', handleMove);
      plot.addEventListener('mouseleave', handleLeave);
    }
  
    /* ============================================================
       21. WIRE — DECADE / SEASON EXPANSION
       ============================================================ */
  
    function wireDecadeExpansion() {
      qsa('.decade-header').forEach(h => {
        h.addEventListener('click', () => {
          const g = h.closest('.decade-group');
          if (g) g.classList.toggle('open');
        });
      });
  
      qsa('.season-row').forEach(row => {
        const header = row.querySelector('.season-row-header');
        if (!header) return;
        header.addEventListener('click', () => row.classList.toggle('open'));
      });
    }
  
    /* ============================================================
       22. WIRE — SEASON SORT
       ============================================================ */
  
    function wireSeasonSort() {
      const sortBar = document.getElementById('seasonSortBar');
      if (!sortBar) return;
  
      const sortBtns = qsa('.season-sort-btn', sortBar);
      const decadeGroups = qsa('.decade-group');
  
      function getProfit(row) { return parseFloat(row.getAttribute('data-profit')) || 0; }
      function getSeasonStart(row) {
        const s = row.getAttribute('data-season') || '2000-01';
        return parseInt(s.split('-')[0], 10);
      }
  
      function sortSeasons(mode) {
        const decades = decadeGroups.map(g => ({
          group: g,
          title: g.querySelector('.decade-title').textContent.trim()
        }));
  
        const container = decades[0].group.parentElement;
  
        if (mode === 'latest') decades.sort((a, b) => b.title.localeCompare(a.title));
        else if (mode === 'oldest') decades.sort((a, b) => a.title.localeCompare(b.title));
  
        decades.forEach(d => container.appendChild(d.group));
  
        decades.forEach(d => {
          const body = d.group.querySelector('.decade-body');
          const rows = Array.from(body.querySelectorAll('.season-row'));
  
          if (mode === 'latest') rows.sort((a, b) => getSeasonStart(b) - getSeasonStart(a));
          else if (mode === 'oldest') rows.sort((a, b) => getSeasonStart(a) - getSeasonStart(b));
          else if (mode === 'highest') rows.sort((a, b) => getProfit(b) - getProfit(a));
          else if (mode === 'least') rows.sort((a, b) => getProfit(a) - getProfit(b));
  
          rows.forEach(r => body.appendChild(r));
        });
      }
  
      sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-sort');
          sortBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          sortSeasons(mode);
        });
      });
    }
  
    /* ============================================================
       23. WIRE — HEAD-TO-HEAD
       Fixture cards navigate to match.html — no modal.
       ============================================================ */
  
    function wireH2H(h2h) {
      if (!h2h || !h2h.opponents || !h2h.opponents.length) return;
  
      const els = {
        stageGrid:   document.getElementById('h2h-stage-grid'),
        stageStats:  document.getElementById('h2h-stage-stats'),
        backBtn:     document.getElementById('h2h-back-btn'),
        grid:        document.getElementById('h2h-clubs-grid'),
        searchInput: document.getElementById('h2h-search'),
        searchCount: document.getElementById('h2h-search-count'),
        emptyState:  document.getElementById('h2h-empty-state'),
        oppLogo:       document.getElementById('h2h-opp-logo'),
        oppName:       document.getElementById('h2h-opp-name'),
        oppSub:        document.getElementById('h2h-opp-sub'),
        oppNameInline: document.getElementById('h2h-opp-name-inline'),
        totalMatches:  document.getElementById('h2h-total-matches'),
        legendWins:    document.getElementById('h2h-legend-wins'),
        legendDraws:   document.getElementById('h2h-legend-draws'),
        legendLosses:  document.getElementById('h2h-legend-losses'),
        splitBar:      document.getElementById('h2h-split-bar'),
        ppg:           document.getElementById('h2h-ppg'),
        winrate:       document.getElementById('h2h-winrate'),
        winrateDesc:   document.getElementById('h2h-winrate-desc'),
        goals:         document.getElementById('h2h-goals'),
        goalsDesc:     document.getElementById('h2h-goals-desc'),
        gpm:           document.getElementById('h2h-gpm'),
        gpmDesc:       document.getElementById('h2h-gpm-desc'),
        homeaway:      document.getElementById('h2h-homeaway'),
        streak:        document.getElementById('h2h-streak'),
        streakDesc:    document.getElementById('h2h-streak-desc'),
        compTabsWrap:  document.getElementById('h2h-comp-tabs'),
        fixturesGrid:  document.getElementById('h2h-fixtures-grid')
      };
  
      if (!els.grid) return;
  
      const state = { current: null, competition: 'all' };
  
      function renderGrid(filter) {
        const q = stripDiacritics((filter || '').trim());
        let visible = 0;
  
        els.grid.innerHTML = h2h.opponents.map(c => {
          const name = stripDiacritics(c.name);
          const key = stripDiacritics(c.key);
          const match = q === '' || name.includes(q) || key.includes(q);
          if (match) visible++;
  
          const logoPath = clubLogo(c.logoSlug);
          const flagSrc = c.flag ? flagPath(c.flag) : '';
          const inits = initials(c.name);
  
          return `
            <button class="h2h-club-badge" data-club="${esc(c.key)}" style="${match ? '' : 'display:none;'}">
              <div class="h2h-club-logo">
                <img src="${logoPath}" alt="${esc(c.name)}"
                     onerror="this.parentElement.innerHTML='<div class=\\'h2h-club-logo-fallback\\'>${inits}</div>';" />
              </div>
              <div class="h2h-club-name">${esc(c.name)}</div>
              <span class="h2h-club-flag-wrap">
                ${flagSrc ? `<img src="${flagSrc}" alt="" class="h2h-club-flag" onerror="this.style.display='none';" />` : ''}
                <span class="flag-tooltip">${esc(c.countryName || c.country || '')}</span>
              </span>
            </button>
          `;
        }).join('');
  
        els.grid.querySelectorAll('.h2h-club-badge').forEach(btn => {
          btn.addEventListener('click', () => openStats(btn.dataset.club));
        });
  
        const total = h2h.opponents.length;
        els.searchCount.textContent = visible === total
          ? `Showing ${total} of ${total} clubs`
          : `Showing ${visible} of ${total} clubs`;
        els.emptyState.hidden = visible !== 0;
      }
  
      function formatDateShort(iso) {
        const [y, m, d] = iso.split('-').map(Number);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${d} ${months[m - 1]} ${y}`;
      }
  
      function renderSplitBar(w, d, l) {
        const total = w + d + l;
        if (total === 0) { els.splitBar.innerHTML = ''; return; }
        els.splitBar.innerHTML = `
          <div class="h2h-split-seg wins" style="width: ${(w/total)*100}%;">${w}</div>
          <div class="h2h-split-seg draws" style="width: ${(d/total)*100}%;">${d}</div>
          <div class="h2h-split-seg losses" style="width: ${(l/total)*100}%;">${l}</div>
        `;
      }
  
      function renderMetrics(d) {
        const total = d.matches;
        const ppg = total > 0 ? ((d.wins * 3 + d.draws) / total).toFixed(2) : '0.00';
        const winrate = total > 0 ? ((d.wins / total) * 100).toFixed(1) : '0.0';
        const gpm = total > 0 ? (d.goalsFor / total).toFixed(2) : '0.00';
        const gd = d.goalsFor - d.goalsAgainst;
        const gdStr = gd >= 0 ? `+${gd}` : `${gd}`;
  
        els.ppg.textContent = ppg;
        els.winrate.textContent = winrate + '%';
        els.winrateDesc.textContent = `${d.wins} of ${total} matches`;
        els.goals.textContent = `${d.goalsFor}\u2013${d.goalsAgainst}`;
        els.goalsDesc.textContent = `${gdStr} goal difference`;
        els.gpm.textContent = gpm;
        els.gpmDesc.textContent = `${d.goalsFor} in ${total} matches`;
        els.homeaway.textContent = `${d.homeWinPct}% / ${d.awayWinPct}%`;
        els.streak.textContent = d.streak;
        els.streakDesc.textContent = d.streakDesc || '';
  
        els.goals.className = 'h2h-metric-value ' + (gd >= 0 ? 'positive' : 'negative');
        els.streak.className = 'h2h-metric-value ' + (
          d.streak && d.streak.startsWith('W') ? 'positive' :
          d.streak && d.streak.startsWith('L') ? 'negative' : ''
        );
      }
  
      function renderCompTabs(country) {
        const tabs = country === 'spain'
          ? [
              { key: 'all',       label: 'All Competitions' },
              { key: 'laliga',    label: 'La Liga' },
              { key: 'ucl',       label: 'Champions League' },
              { key: 'copa',      label: 'Copa del Rey' },
              { key: 'supercopa', label: 'Supercopa' },
              { key: 'other',     label: 'Other' }
            ]
          : [
              { key: 'all',   label: 'All Competitions' },
              { key: 'ucl',   label: 'Champions League' },
              { key: 'other', label: 'Other' }
            ];
  
        els.compTabsWrap.innerHTML = tabs.map(t =>
          `<button class="h2h-comp-tab${t.key === state.competition ? ' active' : ''}" data-comp="${t.key}">${t.label}</button>`
        ).join('');
  
        els.compTabsWrap.querySelectorAll('.h2h-comp-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            const comp = tab.dataset.comp;
            els.compTabsWrap.querySelectorAll('.h2h-comp-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.competition = comp;
            if (state.current) renderFixtures(H2H_DATA[state.current]);
          });
        });
      }
  
      function teamLogo(slug, name) {
        const inits = initials(name);
        return `
          <div class="fixture-team-logo">
            <img src="${clubLogo(slug)}" alt="${esc(name)}"
                 onerror="this.parentElement.textContent='${inits}';" />
          </div>
        `;
      }
  
      function renderFixtureCard(m, d) {
        const [rm, opp] = m.score.split('\u2013');
        const outcomeLabel = m.outcome === 'win' ? 'W' : m.outcome === 'draw' ? 'D' : 'L';
        const homeIsSelf = m.home;
  
        const leftTeam  = homeIsSelf
          ? { name: h2h.self.name, slug: h2h.self.logoSlug || SLUG, score: rm, isSelf: true }
          : { name: d.name,        slug: d.logoSlug,                score: opp, isSelf: false };
        const rightTeam = homeIsSelf
          ? { name: d.name,        slug: d.logoSlug,                score: opp, isSelf: false }
          : { name: h2h.self.name, slug: h2h.self.logoSlug || SLUG, score: rm, isSelf: true };
  
        const rmNum = parseInt(rm, 10);
        const oppNum = parseInt(opp, 10);
        let leftWinner = false, rightWinner = false;
        if (rmNum > oppNum) { if (homeIsSelf) leftWinner = true; else rightWinner = true; }
        else if (oppNum > rmNum) { if (homeIsSelf) rightWinner = true; else leftWinner = true; }
  
        return `
          <div class="fixture-card" data-comp="${esc(m.comp)}">
            <div class="fixture-card-header">
              <div class="fixture-team${leftWinner ? ' winner' : ''}">
                ${teamLogo(leftTeam.slug, leftTeam.name)}
                <div class="fixture-team-name">${esc(leftTeam.name)}</div>
              </div>
              <div class="fixture-center">
                <div class="fixture-outcome ${m.outcome}">${outcomeLabel}</div>
                <div class="fixture-score">${leftTeam.score}<span class="dash">&ndash;</span>${rightTeam.score}</div>
              </div>
              <div class="fixture-team${rightWinner ? ' winner' : ''}">
                ${teamLogo(rightTeam.slug, rightTeam.name)}
                <div class="fixture-team-name">${esc(rightTeam.name)}</div>
              </div>
            </div>
            <div class="fixture-meta">
              <span class="fixture-comp">${esc(m.compLabel)}</span>
              <span class="fixture-date">${formatDateShort(m.date)}</span>
            </div>
          </div>
        `;
      }
  
      function renderFixtures(d) {
        let matches = d.recent || [];
        if (state.competition !== 'all') {
          matches = matches.filter(m => m.comp === state.competition);
        }
  
        if (matches.length === 0) {
          els.fixturesGrid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 40px 20px; text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.85rem; border: 1px dashed var(--border-color); background: var(--surface);">
              No matches in this competition within the recent fixture window.
            </div>
          `;
          return;
        }
  
        els.fixturesGrid.innerHTML = matches.map(m => renderFixtureCard(m, d)).join('');
  
        els.fixturesGrid.querySelectorAll('.fixture-card').forEach((card, idx) => {
          card.addEventListener('click', () => {
            const m = matches[idx];
            if (!m.id || !m.file) {
              console.warn('[club.js] Fixture is missing id/file:', m);
              return;
            }
            const url = `match.html?club=${encodeURIComponent(SLUG)}&id=${encodeURIComponent(m.id)}&file=${encodeURIComponent(m.file)}`;
            window.location.href = url;
          });
        });
      }
  
      const H2H_DATA = h2h.opponents.reduce((acc, opp) => {
        acc[opp.key] = opp;
        return acc;
      }, {});
  
      function renderStats(key) {
        const d = H2H_DATA[key];
        if (!d) return;
  
        const inits = initials(d.name);
        els.oppLogo.innerHTML = `<img src="${clubLogo(d.logoSlug)}" alt="${esc(d.name)}"
            onerror="this.parentElement.textContent='${inits}';" />`;
        els.oppName.textContent = d.name;
        els.oppSub.textContent = d.sub || '';
        els.oppNameInline.textContent = d.name;
  
        els.totalMatches.textContent = d.matches;
        els.legendWins.textContent = d.wins;
        els.legendDraws.textContent = d.draws;
        els.legendLosses.textContent = d.losses;
  
        renderSplitBar(d.wins, d.draws, d.losses);
        renderMetrics(d);
        renderCompTabs(d.country);
        renderFixtures(d);
      }
  
      function openStats(key) {
        state.current = key;
        state.competition = 'all';
        renderStats(key);
  
        els.stageGrid.classList.remove('active');
        els.stageStats.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  
      function backToGrid() {
        state.current = null;
        state.competition = 'all';
        els.stageStats.classList.remove('active');
        els.stageGrid.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  
      els.backBtn.addEventListener('click', backToGrid);
      els.searchInput.addEventListener('input', () => renderGrid(els.searchInput.value));
  
      renderGrid();
    }
  
    /* ============================================================
       24. THEME
       ============================================================ */
  
    function applyTheme() {
      if (localStorage.getItem('olkvaj_theme') === 'dark') {
        document.body.classList.add('dark-theme');
      }
    }
  
    /* ============================================================
       25. BOOT
       ============================================================ */
  
    function boot() {
      applyTheme();
  
      const { club, h2h } = loadAllData();
  
      if (!club) {
        document.body.innerHTML = `
          <div style="padding: 60px 20px; text-align: center; font-family: Inter, sans-serif;">
            <h1 style="font-size: 1.5rem; margin-bottom: 12px;">Club data not loaded</h1>
            <p style="color: #666;">window.__CLUB_DATA__ is not set. Make sure you included the data &lt;script&gt; tag before club.js.</p>
          </div>
        `;
        return;
      }
  
      renderPage(club, h2h);
      document.title = `${club.name} \u2014 Club Profile | Olkvaj`;
  
      wireTabs();
      wirePlayersSearch();
      wireSponsorTabs();
      wireDecadeExpansion();
      wireSeasonSort();
      wireHistoryChart((club.finance && club.finance.history && club.finance.history.seasons) || []);
      wireH2H(h2h);
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  
  })();