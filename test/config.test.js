import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig } from '../src/index.js';

test('loadConfig rejects a missing explicit config with its path', async () => {
  const configPath = join(tmpdir(), 'limitbar-missing-config.json');

  await assert.rejects(loadConfig(configPath), (error) => {
    assert.equal(error.code, 'ENOENT');
    assert.match(error.message, new RegExp(`Could not read JSON at ${configPath}`));
    return true;
  });
});

test('loadConfig rejects malformed explicit JSON with its path', async () => {
  const configDir = mkdtempSync(join(tmpdir(), 'limitbar-config-'));
  try {
    const configPath = join(configDir, 'invalid.json');
    writeFileSync(configPath, '{invalid json\n', 'utf8');

    await assert.rejects(loadConfig(configPath), (error) => {
      assert.equal(error.name, 'SyntaxError');
      assert.match(error.message, new RegExp(`Could not read JSON at ${configPath}`));
      return true;
    });
  } finally {
    rmSync(configDir, { recursive: true, force: true });
  }
});

test('loadConfig merges a valid explicit config with defaults', async () => {
  const configDir = mkdtempSync(join(tmpdir(), 'limitbar-config-'));
  try {
    const configPath = join(configDir, 'valid.json');
    writeFileSync(configPath, JSON.stringify({
      thresholds: { queueWarn: 9 },
      adapters: { manual: { enabled: false } }
    }), 'utf8');

    const config = await loadConfig(configPath);

    assert.equal(config.thresholds.queueWarn, 9);
    assert.equal(config.thresholds.spendWarnUsd, 10);
    assert.equal(config.adapters.manual.enabled, false);
  } finally {
    rmSync(configDir, { recursive: true, force: true });
  }
});
