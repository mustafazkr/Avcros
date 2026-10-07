/* ============================================================
   OLKVAJ — PLAYER PROFILE SHARED ENGINE
   Location: sports/football/profiles/players/_shared/player.js

   Requires:
     - window.PLAYER_SLUG set before this script loads
     - window.__PLAYER_DATA__ (from <slug>-player-data.js)

   Works via file:// — no server required.
   ============================================================ */

   (function () {
    'use strict';
  
    /* ============================================================
       1. CONFIG
       ============================================================ */
  
    const SLUG = window.PLAYER_SLUG || detectSlugFromUrl();
  
    function detectSlugFromUrl() {
      const path = window.location.pathname;
      const file = path.substring(path.lastIndexOf('/') + 1);
      return file.replace(/\.html?$/, '');
    }
  
    if (!SLUG) {
      console.error('[player.js] No PLAYER_SLUG set and could not detect from URL.');
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
       3. UTILS
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
  
    function initials(name) {
      if (!name) return '';
      return name.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
    }
  
    function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  
    /* Club logo path — same as club.js (two levels up to sports/football/, then clubs-img/) */
    function clubLogo(slug) { return `../../clubs-img/${slug}.png`; }
  
    /* Flag path — same as club.js */
    function flagPath(country) { return `../../../../images/flags/${country}.png`; }
  
    /* ============================================================
       4. HEADER + FOOTER
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
       5. HERO
       ============================================================ */
  
    function renderHero(player) {
      const initialsHtml = esc(initials(player.name));
  
      const avatarHtml = player.image
        ? `<img src="${esc(player.image)}" alt="${esc(player.name)}"
                onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'initials',textContent:'${initialsHtml}'}))" />`
        : `<div class="initials">${initialsHtml}</div>`;
  
      const flagHtml = player.country
        ? `<img src="${flagPath(player.country)}" alt="" class="flag" onerror="this.style.display='none'" />`
        : '';
  
      const locationLine = [player.birthPlace, player.countryName || ''].filter(Boolean).join(', ');
      const positionLine = player.position ? ` &middot; ${esc(player.position)}` : '';
      const bornLine = player.bornDate ? `Born ${esc(formatDateISO(player.bornDate))}` : '';
  
      const metaParts = [
        flagHtml,
        `<span>${esc(locationLine)}${positionLine}</span>`,
        bornLine ? `<span class="sep">&middot;</span><span>${bornLine}</span>` : ''
      ].filter(Boolean);
  
      return `
        <a href="../../../../main/football-cl.html" class="btn-back">&larr; Back</a>
  
        <div class="hero">
          <div class="hero-image">${avatarHtml}</div>
          <div class="hero-text">
            <div class="hero-fullname">${esc(player.fullName || player.name)}</div>
            <h1>${esc(player.name)}</h1>
            ${player.nickname ? `<div class="hero-nickname">&ldquo;${esc(player.nickname)}&rdquo;</div>` : ''}
            <div class="hero-meta">
              ${metaParts.join(' ')}
            </div>
          </div>
        </div>
      `;
    }
  
    /* ============================================================
       6. TAB BAR
       ============================================================ */
  
    const TABS = [
      { key: 'overview',    label: 'Overview' },
      { key: 'senior',      label: 'Senior Career' },
      { key: 'youth',       label: 'Youth Career' },
      { key: 'background',  label: 'Background' }
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
       7. OVERVIEW
       ============================================================ */
  
    function renderOverview(player) {
      const ov = player.overview || {};
      const stats = ov.stats || [];
  
      const statsHtml = stats.map(s => `
        <div class="stat-cell">
          <div class="stat-value">${esc(s.value)}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join('');
  
      const introHtml = (ov.paragraphs || []).map(p => `<p>${p}</p>`).join('');
  
      const honours = ov.honours || [];
      const honoursHtml = honours.length ? `
        <div class="section-title">Major Honours</div>
        <div class="honours-grid">
          ${honours.map(h => `
            <div class="honour-tile${h.hero ? ' hero' : ''}">
              <div class="honour-count">${esc(h.count)}</div>
              <div class="honour-name">${esc(h.competition)}</div>
              ${h.note ? `<div class="honour-note">${esc(h.note)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : '';
  
      return `
        ${statsHtml ? `<div class="stats-strip">${statsHtml}</div>` : ''}
        ${introHtml}
        ${honoursHtml}
      `;
    }
  
    /* ============================================================
       8. SENIOR CAREER
       ============================================================ */
  
    function renderSeniorCareer(player) {
      const sc = player.seniorCareer || {};
      const clubs = sc.clubs || [];
  
      const rows = clubs.map(c => `
        <tr>
          <td>
            <div class="club-cell">
              <div class="club-cell-logo">
                ${c.clubSlug
                  ? `<img src="${clubLogo(c.clubSlug)}" alt="${esc(c.club)}"
                          onerror="this.parentElement.textContent='${esc(initials(c.club))}';" />`
                  : esc(initials(c.club))
                }
              </div>
              <div class="club-cell-info">
                <span class="club-cell-name">${esc(c.club)}</span>
                ${c.note ? `<span class="club-cell-note">${esc(c.note)}</span>` : ''}
              </div>
            </div>
          </td>
          <td class="period">${esc(c.period || '')}</td>
          <td class="num">${esc(c.apps)}</td>
          <td class="goals">${esc(c.goals)}</td>
        </tr>
      `).join('');
  
      const totals = sc.totals || {};
  
      const notes = (sc.notes || []).map(n => `
        <div class="note"><strong>${esc(n.title)}</strong> ${n.body}</div>
      `).join('');
  
      return `
        <p>${esc(sc.intro || `${player.name}'s senior club career.`)}</p>
  
        <div class="section-title">Club Career</div>
        <table>
          <thead>
            <tr>
              <th>Club</th>
              <th>Period</th>
              <th class="num">Apps</th>
              <th class="goals">Goals</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          ${totals.apps ? `
            <tfoot>
              <tr>
                <td colspan="2">Total</td>
                <td class="num">${esc(totals.apps)}</td>
                <td class="goals">${esc(totals.goals)}</td>
              </tr>
            </tfoot>
          ` : ''}
        </table>
  
        ${sc.international ? renderInternational(sc.international) : ''}
  
        ${notes ? `<div class="notes"><div class="notes-title">Career Notes</div>${notes}</div>` : ''}
      `;
    }
  
    function renderInternational(intl) {
      const rows = (intl.rows || []).map(r => `
        <tr>
          <td>${esc(r.label)}</td>
          <td class="period">${esc(r.period || '')}</td>
          <td class="num">${esc(r.apps)}</td>
          <td class="goals">${esc(r.goals)}</td>
        </tr>
      `).join('');
  
      return `
        <div class="section-title">International Career</div>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Period</th>
              <th class="num">Caps</th>
              <th class="goals">Goals</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  
    /* ============================================================
       9. YOUTH CAREER
       ============================================================ */
  
    function renderYouthCareer(player) {
      const yc = player.youthCareer || {};
      const clubs = yc.clubs || [];
  
      const rows = clubs.map(c => `
        <tr>
          <td>
            <div class="club-cell">
              <div class="club-cell-logo">
                ${c.clubSlug
                  ? `<img src="${clubLogo(c.clubSlug)}" alt="${esc(c.club)}"
                          onerror="this.parentElement.textContent='${esc(initials(c.club))}';" />`
                  : esc(initials(c.club))
                }
              </div>
              <div class="club-cell-info">
                <span class="club-cell-name">${esc(c.club)}</span>
                ${c.note ? `<span class="club-cell-note">${esc(c.note)}</span>` : ''}
              </div>
            </div>
          </td>
          <td class="period">${esc(c.period || '')}</td>
        </tr>
      `).join('');
  
      const facts = (yc.facts || []).map(f => `
        <div class="info-card">
          <div class="label">${esc(f.label)}</div>
          <div class="value">${esc(f.value)}</div>
        </div>
      `).join('');
  
      const notes = (yc.notes || []).map(n => `
        <div class="note"><strong>${esc(n.title)}</strong> ${n.body}</div>
      `).join('');
  
      return `
        <p>${esc(yc.intro || `${player.name}'s development before turning professional.`)}</p>
  
        ${clubs.length ? `
          <div class="section-title">Youth Clubs</div>
          <table>
            <thead>
              <tr>
                <th>Club</th>
                <th>Period</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        ` : ''}
  
        ${facts ? `
          <div class="section-title">Youth Snapshot</div>
          <div class="info-grid">${facts}</div>
        ` : ''}
  
        ${notes ? `<div class="notes"><div class="notes-title">Development Notes</div>${notes}</div>` : ''}
      `;
    }
  
    /* ============================================================
       10. BACKGROUND
       ============================================================ */
  
    function renderBackground(player) {
      const bg = player.background || {};
      const sections = bg.sections || [];
  
      if (!sections.length) {
        return '<p>Background information is not available for this player.</p>';
      }
  
      const html = sections.map(s => `
        <div class="bg-section">
          <div class="bg-section-title">${esc(s.title)}</div>
          ${(s.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
        </div>
      `).join('');
  
      return html;
    }
  
    /* ============================================================
       11. MAIN RENDER
       ============================================================ */
  
    function renderPage(player) {
      const html = `
        ${renderHeader()}
  
        <main>
          <div class="container">
            <div class="page-wrap">
              ${renderHero(player)}
              ${renderTabBar()}
  
              <div class="tab-panel active" id="tab-overview">${renderOverview(player)}</div>
              <div class="tab-panel" id="tab-senior">${renderSeniorCareer(player)}</div>
              <div class="tab-panel" id="tab-youth">${renderYouthCareer(player)}</div>
              <div class="tab-panel" id="tab-background">${renderBackground(player)}</div>
  
              <div class="last-updated">Last updated: <span id="last-updated-date">${esc(player.lastUpdated || '')}</span></div>
            </div>
          </div>
        </main>
  
        ${renderFooter()}
      `;
  
      document.body.innerHTML = html;
    }
  
    /* ============================================================
       12. WIRE — TABS
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
    }
  
    /* ============================================================
       13. THEME
       ============================================================ */
  
    function applyTheme() {
      if (localStorage.getItem('olkvaj_theme') === 'dark') {
        document.body.classList.add('dark-theme');
      }
    }
  
    /* ============================================================
       14. BOOT
       ============================================================ */
  
    function boot() {
      applyTheme();
  
      const player = window.__PLAYER_DATA__ || null;
  
      if (!player) {
        document.body.innerHTML = `
          <div style="padding: 60px 20px; text-align: center; font-family: Inter, sans-serif;">
            <h1 style="font-size: 1.5rem; margin-bottom: 12px;">Player data not loaded</h1>
            <p style="color: #666;">window.__PLAYER_DATA__ is not set. Make sure you included the data &lt;script&gt; tag before player.js.</p>
          </div>
        `;
        return;
      }
  
      renderPage(player);
      document.title = `${player.name} \u2014 Player Profile | Olkvaj`;
  
      wireTabs();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  
  })();