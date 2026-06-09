# Release Candidate Checklist

Use this checklist before publishing a LimitBar package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still emits valid JSON for `fixtures/limitbar.config.json`.
- Inspect `npm pack --dry-run` output and confirm it includes `src`, `fixtures`, `docs`, `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Save a sample `limitbar status --json` output when renderer or alert behavior changes.
- Note any config schema, threshold, or adapter changes in release notes.
- Confirm `bash scripts/validate.sh` still passes before opening a release PR.

## Support Notes

- Keep fixtures local and synthetic.
- Do not depend on a live OpenClaw process for the package smoke check.
