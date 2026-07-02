# limitbar

Local-first status bar core for agent usage limits, spend, active runs, queued work, runaway sessions, and alerts.

`limitbar` is a safe CLI/TUI-ready MVP for a future macOS menu bar app. It reads local files only, prefers manual counters and fixture-backed summaries, and avoids cloud APIs unless a future user explicitly configures them.

## Quickstart

```bash
npm test
node src/cli.js status --config fixtures/limitbar.config.json
node src/cli.js status --config fixtures/limitbar.config.json --line
node src/cli.js status --config fixtures/limitbar.config.json --json
```

Example one-line output for menu bar polling:

```text
limitbar CRIT · $20.65 · 2 active · 5 queued · 3 alerts
```

## Configuration

```json
{
  "adapters": {
    "manual": { "enabled": true, "path": "fixtures/manual/manual-usage.json" },
    "openclaw": { "enabled": true, "path": "fixtures/openclaw/session-summary.json" }
  }
}
```

## Safety boundaries

- Reads local paths only; `http://` and `https://` inputs are rejected.
- Does not scrape credentials or bypass provider limits.
- Does not make hidden network calls.
- Redacts obvious secret fields from JSON output.
- Missing adapter files return empty local data rather than calling external APIs.

## Commands

```bash
limitbar status [--config path] [--json|--line] [--fail-on-critical]
```

## Development

```bash
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

Release verification scripts not already covered above:

- `npm run test` - node --test
- `npm run build` - node scripts/build-check.js

## Release Verification

Before publishing or tagging a release, run the same verification path used by CI:

- `npm run release:check`
- `npm run package:smoke`

See `docs/release-readiness.md` for the package surface, CLI bins, and reviewer checklist.

## Release readiness

Before opening a release PR, run the same checks that CI runs:

```sh
npm run release:check
npm pack --dry-run
```

The package smoke keeps the published tarball contents visible before tagging or publishing.

## Install

```bash
npm install limitbar
npx limitbar --help
```
