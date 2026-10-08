# Roadmap

12 months to public launch. Aggressive but achievable if scope is cut.

## Current status

- ✅ Static site built and live (GitHub Pages)
- ✅ Match pages, club pages, settings, index — all working
- ✅ Repo set up, documentation started
- ⬜ Backend not started
- ⬜ Auth not started
- ⬜ Workspace app not started

---

## Phase 0 — Foundation (Months 1–2)

**Goal:** Accounts work on the public site.

- Supabase project setup
- Database schema (see SCHEMA.md)
- Auth: email magic link + Google OAuth + GitHub OAuth
- Sign up / sign in / password reset pages
- Header on all existing pages becomes auth-aware
- User profile (email, name, avatar)
- Deploy static site to Cloudflare Pages (once domain purchased)
- Domain setup with subdomain routing for languages

**Deliverable:** A user can create an account and log in on the live site.

**Cut list (things NOT in this phase):**
- No workspace yet
- No terminal yet
- No notes migration to backend

---

## Phase 1 — Web Terminal (Months 3–4)

**Goal:** Analysts get a command-driven interface on `match.html`.

- Extract `command-parser.js`
- Build `terminal-shell.css` and `terminal.js`
- Command registry with ~15 commands (see TERMINAL.md)
- Backtick toggle, history, autocomplete
- Add to `match.html` — one `<link>`, one `<script>`, one `init()` call

**Deliverable:** Backtick opens a terminal on the match page. Analysts can
navigate, filter, and control modes via typed commands.

**Not touched:** Backend. Storage. The workspace.

---

## Phase 2 — Charts Extraction (Month 5)

**Goal:** Chart renderers become a shared module so the workspace can use them.

- Move `buildShotMap`, `buildXgFlow`, `buildRadarChart`, `renderStatsRows`,
  `buildPitch` from `match.js` into `charts.js`
- Expose via `window.OlkvajCharts`
- `match.js` imports them
- Verify no behavior change on `match.html`

**Deliverable:** Same site behavior, less duplication, workspace can use the
same renderers.

**Risk:** Refactor touches working code. Test each chart before moving on.

---

## Phase 3 — Workspace App v1 (Months 6–8)

**Goal:** A canvas workspace where analysts build custom layouts.

- `workspace.html`, `workspace.css`, `workspace.js`
- Canvas with pan, zoom, snap-to-grid
- Card system: spawn, drag, resize, delete
- Terminal inside the workspace (~25 commands)
- Card types: shot map, xG flow, radar, stats, lineup, header, note, image
- Save/load to Supabase
- localStorage fallback for offline

**Deliverable:** An analyst opens a match in the workspace, spawns a shot
map via `chart shots`, drags a note next to it, saves, and returns later.

**Cut list:**
- No multi-match workspaces
- No real-time collaboration
- No connections between cards
- No templates
- URL-only images (no uploads)

---

## Phase 4 — Sharing (Month 9)

**Goal:** Analysts share their work.

- Public workspace share links (`olkvaj.com/w/abc123`)
- Read-only public view
- Fork a workspace into your own account
- Export to `.olkvaj` file (portable, backend-free)

**Deliverable:** An analyst posts a URL in Slack. A colleague opens it and
sees the exact workspace layout.

---

## Phase 5 — Polish & Launch (Months 10–11)

**Goal:** Ship-ready.

- Onboarding flow for new users
- Empty states, loading states, error states
- Mobile responsive fallbacks (workspace stays desktop-only)
- Privacy policy, terms of service, GDPR compliance
- Error monitoring (Sentry)
- Analytics (Plausible or PostHog)
- Beta tester round (5–10 analysts)
- Feedback triage

**Deliverable:** Public launch.

---

## Phase 6 — Post-launch (Month 12+)

Real-time collaboration, multi-match workspaces, image uploads, connections,
templates, player pages, additional sports.

These are deliberately NOT in year one.

---

## Cut priorities if time runs short

In order of what to drop first:

1. **Cut real-time collaboration** — ship async sharing only. Saves 2 months.
2. **Cut multi-match workspaces** — one workspace = one match. Saves 6 weeks.
3. **Cut image uploads** — URL-only images. Saves 2 weeks.
4. **Cut templates** — analysts build their own layouts. Saves 2 weeks.

If all four are cut, Phases 0–5 fit in 12 months with buffer.

---

## Success criteria

By end of year one:

- Public site live at a real domain with language subdomains
- Auth works, accounts work
- Match pages work better than before
- Workspace app functional, used by at least 10 analysts
- Documentation complete enough that another developer could take over
- Zero unhandled production errors for 30 consecutive days
