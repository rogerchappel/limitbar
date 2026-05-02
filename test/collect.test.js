import test from 'node:test';
import assert from 'node:assert/strict';
import { collectSnapshot, loadConfig } from '../src/index.js';

test('collects fixture-backed manual and OpenClaw snapshot', async () => {
  const config = await loadConfig('fixtures/limitbar.config.json');
  const snapshot = await collectSnapshot(config, { now: '2026-05-02T00:00:00Z' });
  assert.equal(snapshot.totals.providers, 2);
  assert.equal(snapshot.totals.activeRuns, 2);
  assert.equal(snapshot.totals.queued, 5);
  assert.equal(snapshot.alerts.some((a) => a.level === 'critical'), true);
});
