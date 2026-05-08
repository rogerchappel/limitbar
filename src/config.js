import { readJsonFile, resolvePath } from './fs.js';
import { normalizeThresholds, validateConfig } from './schema.js';

export const DEFAULT_CONFIG_PATH = 'limitbar.config.json';

export async function loadConfig(configPath = DEFAULT_CONFIG_PATH, cwd = process.cwd()) {
  const resolved = resolvePath(configPath, cwd);
  const config = validateConfig(await readJsonFile(resolved, 'config'));
  return normalizeConfig(config, resolved);
}

export function normalizeConfig(config, configPath) {
  const baseDir = configPath ? new URL('.', `file://${configPath}`).pathname : process.cwd();
  return {
    version: config.version ?? 1,
    name: config.name ?? 'limitbar',
    thresholds: normalizeThresholds(config.thresholds),
    providers: config.providers.map((provider) => ({
      ...provider,
      label: provider.label ?? provider.id,
      baseDir
    }))
  };
}
