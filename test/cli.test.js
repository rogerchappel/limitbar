import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('CLI smoke renders fixture status', () => {
  const result = spawnSync(process.execPath, ['bin/limitbar.js', 'status', '--config', 'examples/limitbar.config.json', '--format', 'text'], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Codex/);
  assert.match(result.stdout, /OpenClaw local sessions/);
  assert.match(result.stdout, /run for 185m/);
  assert.equal(result.stderr, '');
});
