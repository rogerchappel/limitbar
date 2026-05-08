import { readJsonFile, resolvePath } from '../fs.js';
import { normalizeSnapshot } from '../model.js';

export async function readFileProvider(provider) {
  const usagePath = resolvePath(provider.path, provider.baseDir ?? process.cwd());
  const snapshot = await readJsonFile(usagePath, `${provider.id} usage file`);
  return normalizeSnapshot(provider, snapshot);
}
