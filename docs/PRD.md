# limitbar PRD

## Status

V1 implemented as a local-first CLI/library, with the macOS menu-bar app kept as a deliberate future path.

## Pitch

limitbar gives agent-heavy developers a glanceable status line for model-provider limits, spend, active runs, queued work, and risky long-running sessions.

## Inspiration and attribution

The idea was inspired by Peter Steinberger's CodexBar, a macOS menu-bar app whose popularity showed real demand for visible agent-usage limits. limitbar starts with a portable CLI/status adapter layer so the core data model, safety rules, and tests are useful before any native shell is built.

## Problem

Agent teams make it easy to lose track of:

- daily or windowed usage limits;
- local budget counters;
- active or stuck runs;
- noisy dashboards spread across provider-specific tools.

Developers need a safe local dashboard that does not scrape credentials, bypass provider limits, or phone home.

## V1 scope

- Read configured provider/session usage snapshots from fixture JSON and local files.
- Summarize limits, spend, active runs, total runs, and risky runaway sessions.
- Warn on near-limit, critical-limit, spend, and long-running sessions.
- Provide a small CLI and library API.
- Include realistic fixtures and smoke tests.
- Document safety, local-first operation, and future macOS menu-bar direction.

## Non-goals

- Credential scraping.
- Provider-limit bypassing.
- Hidden network calls.
- Cloud aggregation service.
- Native macOS app in V1.

## Users

- Solo developers running multiple coding agents.
- Agent orchestrator operators who need a terminal status adapter.
- Future menu-bar integrators that need a tested local data core.

## Functional requirements

1. Accept a JSON config with providers and thresholds.
2. Support fixture, local JSON file, and local OpenClaw session-summary adapters.
3. Normalize provider snapshots into one data model.
4. Evaluate near-limit, critical, spend, and runaway warnings.
5. Render text and JSON status.
6. Exit `0` when OK, `1` on warnings, and `2` on critical status or CLI errors.

## Safety requirements

- No network calls in the status path.
- No credential discovery or parsing.
- Ignore malformed OpenClaw local session files without printing their contents.
- Keep examples synthetic.

## Future work

- macOS menu-bar wrapper around the CLI/library.
- More provider-specific manual export adapters.
- Queue-depth adapters for orchestrators that expose safe local state.
- Optional notification hooks controlled explicitly by config.
