import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { renderStatusLine, renderTable } from '../src/core/render.js';

const execFileAsync = promisify(execFile);

test('renders status suitable for menu bar polling', () => {
  const snapshot = { totals: { spendUsd: 1.23, activeRuns: 2, queued: 1 }, alerts: [], items: [] };
  assert.equal(renderStatusLine(snapshot), 'limitbar OK · $1.23 · 2 active · 1 queued · 0 alerts');
  assert.match(renderTable(snapshot), /Sources:/);
});

test('CLI help exits cleanly with usage text', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['src/cli.js', '--help'], { cwd: process.cwd() });

  assert.match(stdout, /Usage:/);
  assert.match(stdout, /limitbar status/);
});
