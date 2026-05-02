import test from 'node:test';
import assert from 'node:assert/strict';
import { renderStatusLine, renderTable } from '../src/core/render.js';

test('renders status suitable for menu bar polling', () => {
  const snapshot = { totals: { spendUsd: 1.23, activeRuns: 2, queued: 1 }, alerts: [], items: [] };
  assert.equal(renderStatusLine(snapshot), 'limitbar OK · $1.23 · 2 active · 1 queued · 0 alerts');
  assert.match(renderTable(snapshot), /Sources:/);
});
