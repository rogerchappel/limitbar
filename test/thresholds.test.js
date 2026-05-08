import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateSnapshot, percent } from '../src/thresholds.js';

const thresholds = { nearLimitPercent: 80, criticalLimitPercent: 95, runawayMinutes: 120, spendWarningPercent: 75 };

test('computes stable percentages', () => {
  assert.equal(percent(82, 100), 82);
  assert.equal(percent(1, 3), 33.3);
  assert.equal(percent(1, 0), 0);
});

test('warns on near-limit and runaway active runs', () => {
  const warnings = evaluateSnapshot({ providerId: 'codex', limits: [{ name: 'daily', used: 90, limit: 100 }], spend: { used: 8, budget: 10 }, runs: [{ id: 'r1', status: 'active', ageMinutes: 121 }] }, thresholds);
  assert.deepEqual(warnings.map((warning) => warning.kind), ['limit', 'spend', 'runaway']);
});
