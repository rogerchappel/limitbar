import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeConfig } from '../src/config.js';
import { validateConfig } from '../src/schema.js';

test('validates provider shape', () => {
  assert.throws(() => validateConfig({ providers: [{ id: 'bad', type: 'fixture' }] }), /path is required/);
});

test('normalizes thresholds with safe defaults', () => {
  const config = normalizeConfig({ providers: [{ id: 'codex', type: 'fixture', path: 'x.json' }], thresholds: { nearLimitPercent: 70 } }, '/tmp/limitbar.config.json');
  assert.equal(config.thresholds.nearLimitPercent, 70);
  assert.equal(config.thresholds.criticalLimitPercent, 95);
  assert.equal(config.providers[0].label, 'codex');
});
