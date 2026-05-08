export { loadConfig, normalizeConfig } from './config.js';
export { readAllProviders, readProvider } from './adapters/index.js';
export { evaluateAll, evaluateSnapshot, percent } from './thresholds.js';
export { summarize } from './summary.js';
export { renderJson, renderText } from './render.js';

import { readAllProviders } from './adapters/index.js';
import { loadConfig } from './config.js';
import { evaluateAll } from './thresholds.js';
import { summarize } from './summary.js';

export async function collectStatus(options = {}) {
  const config = await loadConfig(options.config ?? 'limitbar.config.json', options.cwd ?? process.cwd());
  const { snapshots, errors } = await readAllProviders(config);
  const warnings = evaluateAll(snapshots, config.thresholds);
  return summarize(snapshots, warnings, errors);
}
