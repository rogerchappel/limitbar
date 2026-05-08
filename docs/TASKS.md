# limitbar Tasks

## Completed for V1

- [x] Scaffold `oss-cli` repository with StackForge.
- [x] Define local-first config schema.
- [x] Add fixture JSON adapter.
- [x] Add generic local JSON file adapter.
- [x] Add local OpenClaw session-summary adapter.
- [x] Normalize snapshots into limits, spend, and runs.
- [x] Evaluate near-limit, critical-limit, spend, and runaway warnings.
- [x] Render text and JSON CLI output.
- [x] Add library exports for downstream menu-bar wrappers.
- [x] Add realistic synthetic fixtures.
- [x] Add unit tests for config, adapters, thresholds, and rendering.
- [x] Add CLI smoke test using fixtures.
- [x] Document install, usage, safety, and development workflow.
- [x] Include security, contributing, license, package metadata, scripts, and examples.

## Follow-up backlog

- [ ] Add a `limitbar init` helper that writes a starter config.
- [ ] Add optional JSON schema export for editor validation.
- [ ] Add a compact one-line renderer for menu-bar polling.
- [ ] Prototype a native macOS menu-bar wrapper around `limitbar status --format json`.
- [ ] Add more safe local adapters as providers publish supported exports.

## Acceptance checks

- [x] `npm run check`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run smoke`
- [x] `bash scripts/validate.sh`
- [x] Real CLI smoke with `examples/limitbar.config.json`
