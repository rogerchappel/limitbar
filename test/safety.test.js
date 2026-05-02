import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalPath, redactSecrets } from '../src/core/safety.js';

test('redacts obvious secrets recursively', () => {
  assert.deepEqual(redactSecrets({ token: 'abc', nested: { apiKey: 'xyz', ok: 'yes' } }), { token: '[redacted]', nested: { apiKey: '[redacted]', ok: 'yes' } });
});

test('rejects remote paths', () => {
  assert.throws(() => assertLocalPath('https://example.com/config.json'), /only reads local files/);
});
