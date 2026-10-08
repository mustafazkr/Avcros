# Database Schema (Draft)

For Supabase (Postgres). Not yet implemented. Subject to change.

This schema supports Phase 0 (auth) and Phase 3 (workspace). It is
deliberately minimal for now. Extra tables (annotations sync,
collaborators) come later.

---

## Design principles

1. **Static stays static.** Match data, club data, and images live in the
   repo, not the database. The database only holds user-generated content
   and metadata needed to look it up.
2. **Match data is referenced, not stored.** The DB stores a match ID and
   the path to its static file. When the workspace loads a match, it fetches
   the file directly.
3. **Row Level Security from day one.** Every table has RLS policies that
   restrict access to the owner (or the public, for public workspaces).
4. **JSONB for card config.** Card types differ wildly; a JSON blob is
   flexible and Postgres indexes it fine.

---

## Tables

### `users`

Mirrors `auth.users` from Supabase Auth. Extended with app fields.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | Same as `auth.users.id` |
| `email` | text, unique | |
| `display_name` | text | |
| `avatar_url` | text | Optional |
| `created_at` | timestamptz | Default now() |
| `updated_at` | timestamptz | |

**RLS:**
- Select: anyone can read a user's public profile fields
- Insert / Update: only the user themselves

---

### `matches`

Cached metadata for workspace lookups. Match data itself stays in static
`.js` files under `en/sports/football/profiles/clubs/_shared/data/`.

| Column | Type | Notes |
|---|---|---|
| `id` | text, PK | Same as match data ID, e.g. `202411000001` |
| `home_slug` | text | e.g. `real-madrid` |
| `away_slug` | text | e.g. `ac-milan` |
| `comp` | text | e.g. `ucl` |
| `season` | text | e.g. `2024-25` |
| `date` | date | |
| `file_path` | text | Path to the static data file |
| `created_at` | timestamptz | |

**RLS:**
- Select: public
- Insert / Update: service role only (admin)

---

### `workspaces`

The core object. An analyst opens a match, builds a layout, saves it.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | Default gen_random_uuid() |
| `owner_id` | uuid, FK users | |
| `match_id` | text, FK matches | |
| `name` | text | User-given name |
| `is_public` | boolean | Default false |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS:**
- Select: owner OR `is_public = true`
- Insert: authenticated users, `owner_id` must equal `auth.uid()`
- Update / Delete: owner only

---

### `cards`

A card lives on a workspace. Its position and size are in canvas units.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `workspace_id` | uuid, FK workspaces ON DELETE CASCADE | |
| `type` | text | `chart-shots`, `chart-xg`, `chart-radar`, `note`, `text`, `image`, `card-header`, etc. |
| `config` | jsonb | Card-specific settings, e.g. `{ "team": "away", "goals": true }` |
| `x` | numeric | Canvas position |
| `y` | numeric | |
| `w` | numeric | Width |
| `h` | numeric | Height |
| `z` | integer | Z-index |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Indexes:**
- `(workspace_id)` — for loading all cards of a workspace
- `(workspace_id, z)` — for correct z-order rendering

**RLS:**
- Select: card is visible if its parent workspace is visible
- Insert / Update / Delete: only the workspace owner

---

### `card_connections`

Bezier connectors between cards. Phase 2+ feature but the table can exist now.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `workspace_id` | uuid, FK workspaces ON DELETE CASCADE | |
| `from_card_id` | uuid, FK cards ON DELETE CASCADE | |
| `to_card_id` | uuid, FK cards ON DELETE CASCADE | |
| `label` | text | Optional edge label |
| `created_at` | timestamptz | |

**RLS:**
- Same as cards — parent workspace visibility

---

### `annotations`

Currently `localStorage`-only (`olkvaj_annotations:<matchId>`). Future
migration to support cross-device sync.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `user_id` | uuid, FK users | |
| `match_id` | text, FK matches | |
| `type` | text | `shot` or `anchor` |
| `target` | text | Shot index (as text) or CSS selector |
| `text` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS:**
- Select / Insert / Update / Delete: owner only

---

### `collaborators` (Phase 6+)

Skipped for now. Will look like:

| Column | Type | Notes |
|---|---|---|
| `workspace_id` | uuid, FK workspaces | |
| `user_id` | uuid, FK users | |
| `role` | text | `view` / `edit` / `admin` |
| `invited_by` | uuid, FK users | |
| `created_at` | timestamptz | |

---

## Storage buckets

| Bucket | Purpose | Public? | Size cap |
|---|---|---|---|
| `avatars` | User profile images | Yes | 2 MB per file |
| `workspace-images` | Images uploaded to workspaces | Configurable per file | 10 MB per file |

**Note:** For Phase 3, workspace images are URL-only (no uploads). The
bucket is provisioned but unused. Upload support arrives in Phase 6+.

---

## Row Level Security — general rules

| Table | Read | Write |
|---|---|---|
| `users` | Public profile fields | Self only |
| `matches` | Public | Service role only |
| `workspaces` | Owner OR public | Owner |
| `cards` | Parent workspace readable | Owner of parent workspace |
| `card_connections` | Parent workspace readable | Owner of parent workspace |
| `annotations` | Owner | Owner |

---

## Migration path

| Phase | Creates |
|---|---|
| **Phase 0** | `users` table, auth integration, RLS policies |
| **Phase 3** | `matches`, `workspaces`, `cards`, `card_connections` |
| **Phase 4** | Sharing policies on `workspaces` (`is_public`) |
| **Phase 6+** | `annotations`, `collaborators`, image uploads |

Static site is unaffected by all migrations. Only the workspace app
queries these tables.

---

## Cost estimate

**Assumptions:**
- 1,000 users
- 10 workspaces per active user (say 20% active = 200 users × 10 = 2,000 workspaces)
- 20 cards per workspace = 40,000 cards
- Average card row: ~500 bytes with JSONB config

**Totals:**
- ~20 MB database
- ~0 MB storage (Phase 3 uses URL-only images)
- Small bandwidth

**Supabase free tier:**
- 500 MB database
- 1 GB storage
- 2 GB bandwidth / month
- 50,000 monthly active users

**Expected: free tier is enough until several thousand active users.**
First paid tier: $25/month at ~10k MAU.

---

## Future considerations

- **Full-text search** across notes and text cards
- **Soft delete** for workspaces (recoverable trash)
- **Version history** for cards (Google Docs-style undo)
- **Multi-match workspaces** (Phase 6) — new table `workspace_matches`
  mapping workspaces to multiple match IDs
- **Real-time presence** — Supabase Realtime channel per workspace
- **Webhooks** — notify collaborators when a workspace changes
