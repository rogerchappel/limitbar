# Security Policy

limitbar is local-first by design. Its V1 status path reads only files you explicitly configure.

## Supported versions

Security fixes target the latest `main` branch until the first tagged release. After `v1.0.0`, supported release lines will be documented here.

## Reporting a vulnerability

Please open a private GitHub security advisory for `rogerchappel/limitbar` or contact the maintainer through the repository profile. Include:

- affected version or commit;
- reproduction steps;
- expected and observed impact;
- whether secrets, file contents, or network activity are involved.

## Project security commitments

- No hidden network calls in `limitbar status`.
- No credential scraping or browser/session-token discovery.
- No provider-limit bypassing.
- No telemetry.
- Local adapter errors must not print sensitive file contents.

## Handling local files

Only point limitbar at usage snapshots or session-summary files you are comfortable processing locally. Do not put API keys, OAuth tokens, SSH keys, cookies, or private prompts in fixture files.
