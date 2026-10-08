# Olkvaj

Football analytics platform for analysts — match reports, club profiles,
and (in progress) a canvas-based analyst workspace.

**Live:** https://mustafazkr.github.io/olkvaj/

## What this is

Olkvaj provides:

1. **Match reports** — shot maps, xG flow, radar comparisons, lineups,
   substitutions, formations, annotations, and a research-mode keyboard
   layer built for analysts.
2. **Club profiles** — history, finance, staff, records, players, and
   head-to-head analysis.
3. **Analyst workspace** (planned) — a canvas where analysts build their
   own layouts, take notes, embed images, and share findings via URL.

Target audience: analysts, scouts, journalists — people who need
EVERYTHING about a match, not just a summary.

## Status

Pre-launch. Static site works. Backend not started.

| Area | Status |
|---|---|
| Static site (`en/main/`) | ✅ Working |
| Club pages | ✅ Working |
| Match pages | ✅ Working, feature-rich |
| Player pages | ⬜ Not started |
| Authentication | ⬜ Not started |
| Backend | ⬜ Not started |
| Workspace app | ⬜ Not started |
| Multilingual | ⬜ Only `en/` exists |

## Repo structure

olkvaj/
├── README.md this file
├── index.html redirect to en/main (for GitHub Pages)
├── docs/ project documentation
└── en/ English language root
├── main/ homepage, settings, legal pages
├── images/ logos, flags, branding
└── sports/
└── football/
└── profiles/
├── clubs/ club pages + match pages + shared engine
└── players/ player pages (future)


## Running locally

Open `en/main/index.html` in a browser. No build step, no server required.
Everything works from `file://`.

## Documentation

Read these in order if you're new to the project:

- **[PROJECT.md](docs/PROJECT.md)** — current state of every file, every feature
- **[DECISIONS.md](docs/DECISIONS.md)** — architectural decisions with reasoning
- **[ROADMAP.md](docs/ROADMAP.md)** — 12-month plan to public launch
- **[TERMINAL.md](docs/TERMINAL.md)** — command vocabulary for both terminals
- **[SCHEMA.md](docs/SCHEMA.md)** — database design (draft)

## Tech stack

- **Frontend:** Vanilla HTML/CSS/JS. No framework. No build tools.
- **Hosting (current):** GitHub Pages
- **Hosting (planned):** Cloudflare Pages (for subdomain routing)
- **Backend (planned):** Supabase (Postgres + Auth + Storage + Realtime)
- **Fonts:** Google Fonts (Inter)

## Key features already built

**Match page (`en/sports/football/profiles/clubs/match.html`):**

- Overview, Shots, Lineup, and Additional tabs
- Shot map, xG flow, radar chart, top performers, detailed stats
- Hover tooltips (Shift-gated) + pinned tooltips
- Crosshair mode on charts
- X-ray mode — reveals inline ratings and values
- Mini scorecard in the corner
- Notes system — shot notes and element notes
- Keyboard shortcuts (gated behind Research Mode)
- Session memory, dark/light theme, multi-calendar dates

**Club page:**

- Overview, Finance, Stadium, Staff, Records, Players, Info tabs
- Head-to-head with fixture navigation
- Multi-calendar support

## For AI assistants

If you're an AI helping on this project: read `docs/PROJECT.md` and
`docs/DECISIONS.md` before suggesting changes. The project has deliberate
constraints (no build tools, no frameworks, `file://` compatible) that
are documented there.

Command vocabulary for both terminals is in `docs/TERMINAL.md`.
