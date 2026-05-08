import assert from 'node:assert/strict';
import test from 'node:test';
import { readProvider } from '../src/adapters/index.js';

test('fixture adapter reads local provider snapshot', async () => {
  const snapshot = await readProvider({ id: 'codex', label: 'Codex', type: 'fixture', path: 'examples/fixtures/codex.json', baseDir: process.cwd() });
  assert.equal(snapshot.providerId, 'codex');
  assert.equal(snapshot.limits[0].unit, 'tokens');
  assert.equal(snapshot.runs.length, 3);
});

test('openclaw adapter reads local session files without network', async () => {
  const snapshot = await readProvider({ id: 'openclaw', label: 'OpenClaw', type: 'openclaw', path: 'examples/fixtures/openclaw', baseDir: process.cwd() });
  assert.equal(snapshot.providerId, 'openclaw');
  assert.equal(snapshot.runs.length, 2);
  assert.equal(snapshot.runs.some((run) => run.id.includes('limitbar-a')), true);
});
