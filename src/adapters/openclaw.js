import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolvePath } from '../fs.js';
import { normalizeSnapshot } from '../model.js';

export async function readOpenClawProvider(provider) {
  const root = resolvePath(provider.path, provider.baseDir ?? process.cwd());
  const runs = await readRuns(root, provider.maxFiles ?? 100);
  const snapshot = {
    capturedAt: new Date().toISOString(),
    limits: [],
    runs,
    notes: [`read ${runs.length} OpenClaw session summaries from local files`]
  };
  return normalizeSnapshot(provider, snapshot);
}

async function readRuns(root, maxFiles) {
  const names = await readdir(root);
  const jsonNames = names.filter((name) => name.endsWith('.json')).slice(0, maxFiles);
  const runs = [];
  for (const name of jsonNames) {
    const fullPath = path.join(root, name);
    try {
      const item = JSON.parse(await readFile(fullPath, 'utf8'));
      runs.push({
        id: item.id ?? path.basename(name, '.json'),
        label: item.label ?? item.task,
        status: item.status ?? (item.completedAt ? 'completed' : 'active'),
        startedAt: item.startedAt,
        ageMinutes: item.ageMinutes ?? ageMinutes(item.startedAt, item.completedAt),
        cost: item.cost,
        tokens: item.tokens
      });
    } catch {
      // Ignore malformed local session summaries rather than leaking contents.
    }
  }
  return runs;
}

function ageMinutes(startedAt, endedAt) {
  if (!startedAt) return 0;
  const end = endedAt ? Date.parse(endedAt) : Date.now();
  const start = Date.parse(startedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 60000));
}
