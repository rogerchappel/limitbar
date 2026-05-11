import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectSnapshot, loadConfig } from '../src/index.js';

test('collects fixture-backed manual and OpenClaw snapshot', async () => {
  const config = await loadConfig('fixtures/limitbar.config.json');
  const snapshot = await collectSnapshot(config, { now: '2026-05-02T00:00:00Z' });
  assert.equal(snapshot.totals.providers, 2);
  assert.equal(snapshot.totals.activeRuns, 2);
  assert.equal(snapshot.totals.queued, 5);
  assert.equal(snapshot.alerts.some((a) => a.level === 'critical'), true);
});

test('resolves adapter paths relative to the config file', async () => {
  const configDir = mkdtempSync(join(tmpdir(), 'limitbar-config-'));
  const originalCwd = process.cwd();
  const otherCwd = mkdtempSync(join(tmpdir(), 'limitbar-cwd-'));
  try {
    cpSync('fixtures/manual', join(configDir, 'manual'), { recursive: true });
    cpSync('fixtures/openclaw', join(configDir, 'openclaw'), { recursive: true });
    const configPath = join(configDir, 'limitbar.config.json');
    writeFileSync(configPath, JSON.stringify({
      adapters: {
        manual: { enabled: true, path: 'manual/manual-usage.json' },
        openclaw: { enabled: true, path: 'openclaw/session-summary.json' }
      }
    }), 'utf8');
    process.chdir(otherCwd);
    const config = await loadConfig(configPath);
    assert.match(config.adapters.manual.path, /manual\/manual-usage\.json$/);
    const snapshot = await collectSnapshot(config, { now: '2026-05-02T00:00:00Z' });
    assert.equal(snapshot.totals.providers, 2);
  } finally {
    process.chdir(originalCwd);
    rmSync(configDir, { recursive: true, force: true });
    rmSync(otherCwd, { recursive: true, force: true });
  }
});
