# Project State

Last updated: 2026-10-07

## What this is

Olkvaj is a football analytics platform for analysts. It provides:

1. **Match reports** — detailed match data including shot maps, xG flow,
   radar comparisons, lineups, substitutions, formations, and annotations.
2. **Club profiles** — history, finance, staff, records, players, head-to-head.
3. **Analyst workspace** (planned) — canvas where analysts build their own
   layouts, take notes, embed images, and share findings.

Target audience: analysts, scouts, journalists — people who need EVERYTHING
about a match, not just a summary.

## Current state

| Area | Status |
|---|---|
| Static site (`en/main/`) | Working |
| Club pages (`en/sports/football/profiles/clubs/`) | Working |
| Match pages (`match.html`) | Working, feature-rich |
| Player pages | Not started |
| Authentication | Not started |
| Backend | Not started |
| Workspace app | Not started |
| Multilingual | Folder structure exists (`en/`), only English populated |

## File inventory

### `en/main/`

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, search, football clubs grid, footer |
| `settings.html` | User settings — theme, calendar, research mode, keybinds, timezone |

### `en/sports/football/profiles/clubs/`

| File | Purpose |
|---|---|
| `match.html` | Match report shell — loads data via query params |
| `real-madrid.html`, `ac-milan.html`, etc. | Club profile pages |
| `_shared/match.js` | Match page engine |
| `_shared/match.css` | Match page styles |
| `_shared/club.js` | Club profile engine |
| `_shared/club.css` | Club profile styles |
| `_shared/data/matches/ucl/2024-25.js` | Match data files |
| `_shared/data/clubs/*.js` | Club data files |

## Key features already built

**Match page:**
- Overview tab: possession, radar chart, top performers, detailed stats
- Shots tab: shot map (SVG), xG flow chart, filters (team/goals), fullscreen mode
- Lineup tab: pitch view, formation changes, substitution impact, lineup tables
- Additional tab: referee, venue, managers, attendance
- Hover tooltips on player names (Shift-gated)
- Pin tooltips by clicking
- Crosshair mode on charts (C toggle)
- X-ray mode — reveals inline ratings and values (X hold)
- Mini scorecard in corner (S toggle)
- Notes system — shot notes and element notes
- Shift+N to pick any element and annotate
- Alt+hover to highlight a name across the page
- Research Mode Panel (Q)
- Keyboard: 1/2/3/4 (tabs), H/A/B (team filter), G (goals), F (fullscreen), Esc (reset)
- Session memory — remembers active tab and card state
- Cookies popup

**Club page:**
- Overview, Finance, Stadium, Staff, Records, Players, Info tabs
- H2H with fixture navigation
- Multi-calendar support (Gregorian, Hijri, Persian, Chinese)
- Light/dark theme

## Global settings (localStorage)

| Key | Purpose |
|---|---|
| `olkvaj_theme` | `light` / `dark` |
| `olkvaj_calendar` | `gregorian` / `islamic` / `persian` / `chinese` |
| `olkvaj_research_mode` | `on` / `off` — unlocks most keybinds |
| `olkvaj_keybinds` | `on` / `off` — master kill switch |
| `olkvaj_animations` | `on` / `off` |
| `olkvaj_cookies` | `accept` / `essential` |
| `olkvaj_annotations:<matchId>` | Per-match notes (localStorage) |
| `olkvaj_match_session:<matchId>` | Per-match session state (sessionStorage) |

## Known issues / TODOs

- Match page currently hardcodes layout; the workspace app will need chart
  renderers extracted into a shared `charts.js` module
- Player pages not started
- No authentication
- No backend

## Dependencies

Zero. No npm, no build tools, no frameworks. Plain HTML/CSS/JS.

External CDN only: Google Fonts (Inter).
