# limitbar

Status: in-progress

## Scorecard

Total: 86/100
Band: build now
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 18/20 | Directly addresses a repeated workflow pain. |
| Demand signal | 20/20 | Strong source signal or internal demand. |
| V1 buildability | 16/20 | Feasible, but platform/integration risk remains. |
| Differentiation | 13/15 | Clear wedge versus adjacent tools. |
| Agentic workflow leverage | 14/15 | Improves agent throughput or supervision. |
| Distribution potential | 5/10 | Distribution will require examples and content. |

## Pitch

A macOS menu bar app that shows agent usage limits, spend, active runs, queued work, and risky long-running sessions across Codex, Claude Code, OpenClaw, and local agents.

## Why It Matters

CodexBar going viral proves demand for glanceable agent-limit visibility. Roger needs this for high-throughput agent teams and spend control.

## Qualification

CodexBar’s star count is the strongest external signal in this set. Internal demand is high because Roger is scaling agent usage and wants throughput without losing control.

Source / adjacent research: Inspired by steipete/CodexBar, Swift menu bar app with 11,399 stars / 860 forks checked 2026-04-29.

Decision: build now

## V1 Scope

- Menu bar status for configured providers
- Manual token/limit counters where APIs are unavailable
- OpenClaw session summary adapter
- Alerts for near-limit and runaway sessions

## Out of Scope

- Credential scraping
- Bypassing provider limits
- Cloud account aggregation

## Verification

- Unit or fixture tests for core parsing/generation behavior.
- README with install, quickstart, and safety notes.
- Local-first behavior documented clearly.
- No hidden network, credential, or publish behavior.

## Agent Prompt

Build `limitbar` as a safe local macOS app. Store credentials in Keychain if needed, prefer manual/local adapters, and never log secrets.
