import assert from 'node:assert/strict';
import test from 'node:test';
import { renderJson, renderText } from '../src/render.js';

test('renders memorable text status', () => {
  const output = renderText({ status: 'warning', providers: [{ id: 'codex', label: 'Codex', limits: [{ name: 'daily', used: 8, limit: 10, unit: 'runs', percent: 80 }], activeRuns: 2, totalRuns: 3, riskyRuns: 1 }], warnings: [{ level: 'warning', providerId: 'codex', message: 'daily is 80% used' }], errors: [] });
  assert.match(output, /limitbar/);
  assert.match(output, /Codex/);
  assert.match(output, /warnings/);
});

test('renders JSON status', () => {
  assert.equal(JSON.parse(renderJson({ status: 'ok' })).status, 'ok');
});
