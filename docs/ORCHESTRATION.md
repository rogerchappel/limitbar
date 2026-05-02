# Orchestration

limitbar is intentionally local-first. The CLI reads local JSON files, aggregates status, and prints a stable contract that a future menu bar app can poll.

## Flow
1. Load config from `--config` or safe defaults.
2. Read enabled adapters from local paths only.
3. Normalize provider usage and OpenClaw run summaries.
4. Evaluate thresholds for usage, spend, queue depth, and runaway sessions.
5. Render a table, one-line status, or redacted JSON.

## Safety
- No credential scraping.
- No hidden network calls.
- No provider-limit bypass logic.
- No secret values in rendered JSON.
- Missing fixture files degrade to empty adapter results.
