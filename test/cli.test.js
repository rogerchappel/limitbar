import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('cli prints package version', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--version'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${pkg.version}\n`);
  assert.equal(result.stderr, '');
});

test('cli help documents version flag', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /limitbar --version/);
});

test('old queued sessions do not trigger --fail-on-critical', () => {
  const configDir = mkdtempSync(join(tmpdir(), 'limitbar-queued-'));
  try {
    const summaryPath = join(configDir, 'session-summary.json');
    const configPath = join(configDir, 'limitbar.config.json');
    writeFileSync(summaryPath, JSON.stringify({
      runs: [{ id: 'waiting', label: 'waiting', status: 'queued', createdAt: '2026-07-22T13:00:00Z' }],
      queue: []
    }), 'utf8');
    writeFileSync(configPath, JSON.stringify({
      adapters: {
        manual: { enabled: false },
        openclaw: { enabled: true, path: summaryPath }
      }
    }), 'utf8');

    const result = spawnSync(process.execPath, [
      'src/cli.js', 'status', '--config', configPath, '--now', '2026-07-22T15:00:00Z', '--json', '--fail-on-critical'
    ], { encoding: 'utf8' });
    const snapshot = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.equal(snapshot.totals.activeRuns, 0);
    assert.equal(snapshot.totals.queued, 1);
    assert.equal(snapshot.items[0].runs[0].durationMinutes, 120);
    assert.equal(snapshot.alerts.some((alert) => alert.level === 'critical'), false);
  } finally {
    rmSync(configDir, { recursive: true, force: true });
  }
});
