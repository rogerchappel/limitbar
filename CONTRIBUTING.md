# Contributing to limitbar

Thanks for helping make agent usage easier to supervise.

## Ground rules

- Keep the default status path local-first.
- Do not add hidden network calls.
- Do not scrape credentials, browser storage, Keychain entries, provider tokens, or private prompts.
- Prefer small, reviewable changes with fixtures and tests.

## Development setup

```sh
npm install
npm run check
npm test
npm run smoke
bash scripts/validate.sh
```

## Adding an adapter

Adapters should read explicit, user-configured local inputs. If an adapter needs network access, it must be opt-in, documented, tested separately, and disabled by default.

Every adapter should include:

1. synthetic fixtures;
2. unit tests for parsing;
3. failure behavior that avoids logging file contents or secrets;
4. README/docs updates.

## Commit style

Use clear atomic commits such as:

- `feat: add compact renderer`
- `test: cover spend thresholds`
- `docs: document menu-bar wrapper path`

## Pull requests

Before opening a PR, run:

```sh
npm run release:check
```

If a check cannot run, say why in the PR description.
