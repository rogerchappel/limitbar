# limitbar

A tiny local-first status bar for AI agent limits.

limitbar reads usage snapshots you already control, turns them into one status model, and warns when a provider is near a limit or an agent run looks runaway. V1 is a CLI/library; the macOS menu-bar app is the obvious next shell, not a rushed first cut.

## Why

When several coding agents are running, the expensive question is simple: **am I close to a limit, burning budget, or letting a session wander?** limitbar keeps that answer local, boring, and scriptable.

## Install

```sh
npm install -g limitbar
```

From source:

```sh
git clone https://github.com/rogerchappel/limitbar.git
cd limitbar
npm install
npm run smoke
```

## Quickstart

```sh
limitbar status --config examples/limitbar.config.json
limitbar status --config examples/limitbar.config.json --format json
```

Example text output:

```text
limitbar ⚠ WARNING

Codex (codex)
  daily tokens: 820000/1000000 tokens / day (82%)
  concurrent runs: 7/10 runs / now (70%)
  spend: 42.5/60 USD (70.8%)
  runs: 2 active / 3 total, 1 risky
```

Warning exit codes are intentional:

- `0` means OK;
- `1` means warnings exist;
- `2` means critical status or a CLI/config error.

## Config

```json
{
  "version": 1,
  "thresholds": {
    "nearLimitPercent": 80,
    "criticalLimitPercent": 95,
    "runawayMinutes": 120,
    "spendWarningPercent": 75
  },
  "providers": [
    { "id": "codex", "label": "Codex", "type": "fixture", "path": "fixtures/codex.json" },
    { "id": "openclaw", "label": "OpenClaw local sessions", "type": "openclaw", "path": "fixtures/openclaw" }
  ]
}
```

Provider paths are resolved relative to the config file.

## Adapters

- `fixture`: reads a synthetic or exported local snapshot JSON file.
- `file`: reads the same snapshot shape from any configured local JSON file.
- `openclaw`: reads a directory of local OpenClaw-style session summary JSON files.

No adapter in V1 calls a provider API.

## Library use

```js
import { collectStatus } from 'limitbar';

const summary = await collectStatus({ config: 'examples/limitbar.config.json' });
console.log(summary.status);
```

## Safety notes

limitbar is intentionally conservative:

- no hidden network calls;
- no credential scraping;
- no provider-limit bypassing;
- no cloud account aggregation;
- malformed local session files are skipped without dumping contents.

## Inspiration

limitbar is inspired by Peter Steinberger's CodexBar and the clear demand it showed for glanceable agent-limit visibility. This project starts with a portable local core so the eventual menu-bar wrapper has something trustworthy underneath.

## Development

```sh
npm run check
npm test
npm run build
npm run smoke
bash scripts/validate.sh
```

Useful docs:

- [PRD](docs/PRD.md)
- [Tasks](docs/TASKS.md)
- [Orchestration](docs/ORCHESTRATION.md)
- [Security](SECURITY.md)

## License

MIT
