# Architectural Decisions

Chronological log. Every entry: date, decision, reasoning, alternatives considered.

---

## 2026-10-07 — Vanilla HTML/CSS/JS, no framework

**Decision:** The site uses plain HTML, CSS, and JavaScript with no build step.

**Reasoning:**
- Works from `file://` — no server needed for local development
- Zero dependency management
- Fast load times (no framework overhead)
- The site's interactivity is well within what vanilla JS handles

**Alternatives considered:**
- React/Next.js — overkill for a content site; adds build complexity
- Astro — good for static content, but requires a build step
- Svelte — same reasons as React

**Consequences:**
- Shared code is managed by loading the same `.js` files across pages
- No state management library — state lives in `localStorage` or in closures
- When the backend arrives, we do NOT rewrite the frontend

---

## 2026-10-07 — `localStorage` for user state

**Decision:** User preferences and per-match notes live in `localStorage`.

**Reasoning:**
- No backend yet
- Preferences are per-device which is acceptable for pre-auth usage
- Notes are per-match and per-device — analysts using the same laptop benefit

**Consequences:**
- Data does not sync across devices
- Data is lost if the user clears browser storage
- Migration path: when auth exists, move to Supabase with optional sync

---

## 2026-10-07 — Session memory uses `sessionStorage`

**Decision:** Per-match UI state (active tab, mini scorecard open) uses
`sessionStorage`, not `localStorage`.

**Reasoning:**
- Session state should not persist across browser closes
- Opening the same match in a new tab should start fresh
- `localStorage` would preserve stale state indefinitely

---

## 2026-10-07 — Multi-calendar date display

**Decision:** Dates render in one of four calendar systems based on user
preference: Gregorian, Hijri (Islamic), Persian (Solar Hijri), Chinese.

**Reasoning:**
- Audience includes analysts from different regions
- Conversion functions are pure JS, no dependencies
- Implemented in both `match.js` and `club.js` (duplicated — should be
  extracted to a shared module when convenient)

**Alternatives considered:**
- Library like `moment-hijri` — adds dependency for something we can do in 40 lines

---

## 2026-10-07 — Research Mode gates most keyboard shortcuts

**Decision:** Keyboard shortcuts on the match page are locked behind
`olkvaj_research_mode === 'on'`. Master kill switch is `olkvaj_keybinds`.

**Reasoning:**
- Shortcuts are powerful but can conflict with browser defaults
- Analysts who don't want them can disable entirely
- Casual readers don't accidentally trigger modes

**Behavior:**
- If `olkvaj_keybinds === 'off'`: no shortcuts work, not even `Q` or `Esc`
- If `olkvaj_keybinds === 'on'` but research mode off: `Q` and `Esc` work,
  everything else is locked. `Q` opens the Research Mode Panel with an
  inline toggle to enable research mode.
- If both on: all shortcuts work.

---

## 2026-10-07 — Two terminals, one vocabulary

**Decision:** The project will have two terminal interfaces:

1. **Web Terminal** — embedded in `match.html`, ~15 commands, wraps existing
   UI shortcuts. Small, focused, low-risk.
2. **Terminal Workspace** — separate app (`workspace.html`), canvas-based,
   ~40 commands, cards, notes, images, export. Large, standalone.

They share:
- The same command vocabulary (see TERMINAL.md)
- The same parser (`command-parser.js`)
- The same visual shell (`terminal-shell.css`)

They do NOT share execution logic.

**Reasoning:**
- The match page has fixed chrome and 8+ active keyboard shortcuts. A canvas
  cannot live inside it without breaking everything.
- The workspace needs a blank, keyboard-free surface.
- Shared vocabulary means analysts learn commands once.
- Two small products are easier to maintain than one giant conditional.

**Alternatives considered:**
- One terminal with conditional behavior — rejected, leads to unmaintainable code
- Only the workspace terminal — rejected, loses the low-cost quick win

---

## 2026-10-07 — Backend: Supabase

**Decision:** When the backend is built, it will use Supabase
(Postgres + Auth + Storage + Realtime).

**Reasoning:**
- Solo developer, 12-month timeline
- Auth, file storage, and realtime collaboration out of the box
- Postgres is portable — no lock-in
- Free tier is generous ($0 until thousands of users)
- Alternative: raw Express + Postgres would add 2-3 months of undifferentiated work

**Alternatives considered:**
- Next.js + Vercel — high vendor lock-in, forces frontend rewrite
- Firebase — NoSQL, worse fit for structured football data
- Self-hosted — infrastructure overhead not justified

**Consequences:**
- The static site stays static. Only the workspace app and auth touch the backend.
- Database schema drafted in SCHEMA.md

---

## 2026-10-07 — Language folder structure (`en/`)

**Decision:** Each language gets a folder at the repo root. Currently only
`en/` exists. Structure is:

olkvaj/
└── en/
├── main/
├── images/
└── sports/


**Reasoning:**
- Allows subdomain routing later: `en.olkvaj.com`, `es.olkvaj.com`
- Simple to reason about
- Adding a language is `mkdir es/` and translating content

**Known issue:**
- Images are duplicated per language. When a second language is added, we
  should migrate to shared images at root and update paths.
- Currently deferred because it requires editing every image reference in
  every file.

---

## 2026-10-07 — Hosting: GitHub Pages now, Cloudflare Pages later

**Decision:** Serve the site from GitHub Pages for now. When a custom domain
is purchased, migrate to Cloudflare Pages.

**Reasoning:**
- GitHub Pages works immediately, free, zero config
- GitHub Pages does not support subdomain routing
  (`en.olkvaj.com` vs `es.olkvaj.com` from one repo)
- Cloudflare Pages does, at the same price (free)
- Migration is a config change, not a code rewrite

**Consequences:**
- Until migration, site lives at `mustafazkr.github.io/olkvaj/`
- Root `index.html` redirects to `/en/main/` for the Pages URL
- When subdomains are ready, the root redirect becomes a language picker
  or is removed entirely

---

## 2026-10-07 — No build tools, no bundlers

**Decision:** The project does not use Webpack, Vite, Rollup, or any bundler.

**Reasoning:**
- Works from `file://`
- No `node_modules`
- No build artifacts to manage
- Shared code is loaded via multiple `<script>` tags

**Consequences:**
- Multiple HTTP requests on page load (acceptable — HTTP/2 handles this)
- No tree-shaking (acceptable — files are small)
- No TypeScript (acceptable — JSDoc comments serve the same purpose)

**If this changes:** Only if the workspace app grows beyond what vanilla JS
comfortably handles. That's a Phase 3+ discussion.
