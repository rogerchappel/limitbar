# limitbar Orchestration

limitbar is designed to be polled by humans, shell scripts, menu-bar wrappers, and agent orchestrators without requiring secrets or network access.

## Local status flow

1. Read `limitbar.config.json`.
2. Resolve each provider path relative to the config file.
3. Read only local JSON files or local session-summary directories.
4. Normalize each snapshot.
5. Evaluate thresholds.
6. Render text for terminals or JSON for wrappers.

## Exit codes

- `0`: all configured providers are OK.
- `1`: warnings are present, such as near-limit or runaway sessions.
- `2`: critical status or CLI/config error.

## Recommended orchestrator usage

```sh
limitbar status --config examples/limitbar.config.json --format json
```

Parse `.status`, `.providers`, and `.warnings`; do not scrape terminal text when JSON is available.

## Safety contract

- The CLI does not make network calls.
- The CLI does not read credentials.
- The OpenClaw adapter reads a configured directory of JSON summaries only.
- Malformed local session files are skipped without content logging.

## Menu-bar path

A native macOS app can run `limitbar status --format json` on a timer, render the worst status in the menu bar, and show warning details in a popover. Keeping this as a wrapper preserves a testable core and avoids native complexity in V1.
