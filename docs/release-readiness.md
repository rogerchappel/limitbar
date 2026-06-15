# Release Readiness

Use this checklist before publishing, tagging, or asking reviewers to trust the package surface.

## Package Surface

- Package: `limitbar`
- Repository: `https://github.com/rogerchappel/limitbar`
- Pack contents are constrained by the `files` allowlist in `package.json`.

## CLI Surface

- `limitbar` -> `./src/cli.js`

## Verification Commands

- `npm run check`: `node --check src/cli.js && node --check src/index.js`
- `npm run test`: `node --test`
- `npm run build`: `node scripts/build-check.js`
- `npm run smoke`: `node src/cli.js status --config fixtures/limitbar.config.json --json`
- `npm run package:smoke`: `npm pack --dry-run`
- `npm run release:check`: `npm run check && npm test && npm run build && npm run smoke && npm run package:smoke`

Run `npm run release:check` before opening a release PR. Record any skipped command and the reason in the PR body.

## Reviewer Notes

- Compare README examples with the current CLI bins or module exports.
- Inspect `npm pack --dry-run` output for generated logs, caches, or private fixtures.
- Confirm CI exercises the same release check path used locally.
