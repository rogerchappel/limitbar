import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAlerts } from '../src/core/alerts.js';

test('flags near-limit usage and runaway runs', () => {
  const alerts = evaluateAlerts([
    { kind: 'provider', id: 'codex', source: 'manual', name: 'Codex', used: 90, limit: 100, spendUsd: 3 },
    {
      kind: 'sessions',
      id: 'openclaw',
      source: 'openclaw',
      name: 'OpenClaw',
      queued: 6,
      activeRuns: 2,
      runs: [
        { id: 'r1', label: 'active long', status: 'active', durationMinutes: 91 },
        { id: 'r2', label: 'running long', status: 'running', durationMinutes: 92 }
      ]
    }
  ], { usageWarnRatio: 0.8, usageCriticalRatio: 0.95, spendWarnUsd: 10, spendCriticalUsd: 25, runawayMinutes: 90, queueWarn: 5 });
  assert.equal(alerts.length, 4);
  assert.match(alerts.map((a) => a.message).join('\n'), /Codex usage/);
  assert.match(alerts.map((a) => a.message).join('\n'), /queue/);
  assert.match(alerts.map((a) => a.message).join('\n'), /active long/);
  assert.match(alerts.map((a) => a.message).join('\n'), /running long/);
});
