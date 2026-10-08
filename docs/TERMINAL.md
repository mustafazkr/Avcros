# Terminal — Command Vocabulary

The contract for both terminals. Same command names, same arguments,
same syntax. Different execution targets.

## Design principle

Two products share one vocabulary:

- **Web Terminal** — embedded in `match.html`. ~15 commands. Wraps existing
  UI behavior. Small, focused, low-risk.
- **Terminal Workspace** — standalone app (`workspace.html`). ~25+ commands.
  Canvas-based. Cards, notes, images, export.

An analyst who learns `filter goals` in the Web Terminal uses the same
command in the Workspace. The vocabulary is the contract.

---

## Syntax

- Commands are lowercase, hyphenated for multi-word (`chart shots`,
  `clear-workspace`)
- Arguments are space-separated
- `key=value` pairs are options
- Quoted strings preserve spaces: `note "Madrid pressed high after 60'"`
- Filters use operators: `min>60`, `xg<0.05`

---

## Common commands (both terminals)

### Navigation

| Command | Description |
|---|---|
| `overview` | Switch to Overview tab |
| `shots` | Switch to Shots tab |
| `lineup` | Switch to Lineup tab |
| `additional` | Switch to Additional tab |

### Filters (Shots tab)

| Command | Description |
|---|---|
| `filter home` | Show only home team shots |
| `filter away` | Show only away team shots |
| `filter goals` | Show only goals |
| `filter clear` | Reset filters |

### Modes

| Command | Description |
|---|---|
| `xray` | Toggle X-ray mode (reveals inline ratings and values) |
| `crosshair` | Toggle crosshair mode on charts |
| `mini` | Toggle mini scorecard |
| `notes` | Toggle notes panel |
| `research` | Open Research Mode Panel |

### Content

| Command | Description |
|---|---|
| `pin "name"` | Pin the tooltip for the named player or club |
| `goto <minute>` | Jump all charts to a specific minute |
| `note "text"` | Add a note (context-aware — shot or element) |
| `shot <n>` | Focus shot by index (from shot map order) |

### System

| Command | Description |
|---|---|
| `help` | List all commands |
| `help <command>` | Detailed help for one command |
| `clear` | Clear the terminal log |
| `history` | Show recent commands |
| `version` | Show version info |

---

## Workspace-only commands

Only available in the workspace app, not on `match.html`.

### Spawn cards

| Command | Description |
|---|---|
| `chart shots [opts]` | Spawn a shot map card |
| `chart xg` | Spawn an xG flow card |
| `chart radar` | Spawn a radar chart card |
| `chart stats` | Spawn a stats table card |
| `card lineup` | Spawn the lineup pitch card |
| `card pitch` | Alias for `card lineup` |
| `card header` | Spawn the scoreline header card |
| `note "text"` | Spawn a sticky note card |
| `text "markdown"` | Spawn a markdown block card |
| `image <url>` | Spawn an image card |

### Manage cards

| Command | Description |
|---|---|
| `link <id1> <id2>` | Draw a connector between two cards |
| `unlink <id1> <id2>` | Remove a connector |
| `list` | List all cards in the workspace |
| `delete <id>` | Remove a card |
| `clear-workspace` | Remove all cards |
| `arrange grid` | Auto-arrange cards in a grid |
| `arrange stack` | Auto-arrange cards in a vertical stack |

### Workspace persistence

| Command | Description |
|---|---|
| `save` | Save workspace to backend |
| `load` | Reload workspace from backend |
| `export` | Download workspace as .olkvaj file |
| `import` | Load workspace from .olkvaj file |
| `template <name>` | Spawn a preset layout |

---

## Card IDs

Cards are auto-assigned IDs when spawned:

- `chart-1`, `chart-2`, `chart-3`
- `note-1`, `note-2`
- `text-1`
- `image-1`
- `card-1`, `card-2`

The ID is printed in the terminal log after spawning, e.g.:


---

## Terminal behavior

| Key | Action |
|---|---|
| `` ` `` | Toggle terminal open/closed |
| `Enter` | Execute command |
| `Tab` | Autocomplete command name |
| `↑` / `↓` | Cycle command history |
| `Ctrl+L` | Clear log |
| `Esc` | Close terminal drawer (not workspace) |

**Focus behavior:** when the terminal is open, all keystrokes are captured
by the input field. Other keyboard shortcuts on the page are suspended
until the terminal closes.

**Prompt:**
- Match page: `match> `
- Workspace: `workspace> `

Both use the same parser and registry structure.

---

## Command examples

---

## Parser rules

- **Whitespace:** one or more spaces between tokens
- **Quoted strings:** double or single quotes preserve spaces and special
  characters
- **key=value:** parsed as an options object
- **Operators:** `>`, `<`, `>=`, `<=` are recognized inside filter arguments
- **Case:** commands are case-insensitive; arguments preserved as typed
- **Comments:** lines starting with `#` are ignored (future)

---

## Not yet implemented

These are aspirational — for future phases.

- Piping: `chart shots team=milan | filter xg>0.15`
- Multi-match: `load-match 202411000002`
- Highlighting: `highlight "Leão"`
- Undo/redo: `undo`, `redo`
- Ranged selection: `select chart-1 chart-2 chart-3`
