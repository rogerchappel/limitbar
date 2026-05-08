import path from 'node:path';
import { readJsonFile, resolvePath } from '../fs.js';
import { normalizeSnapshot } from '../model.js';

export async function readFixtureProvider(provider) {
  const fixturePath = resolvePath(provider.path, provider.baseDir ?? process.cwd());
  const snapshot = await readJsonFile(fixturePath, `${provider.id} fixture`);
  return normalizeSnapshot(provider, snapshot);
}

export function fixturePath(fixturesDir, providerId) {
  return path.join(fixturesDir, `${providerId}.json`);
}
