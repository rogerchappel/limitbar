import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { safeReadJson, assertLocalPath } from './safety.js';

export const defaultConfig = {
  thresholds: {
    spendWarnUsd: 10,
    spendCriticalUsd: 25,
    usageWarnRatio: 0.8,
    usageCriticalRatio: 0.95,
    runawayMinutes: 90,
    queueWarn: 5
  },
  adapters: {
    manual: { enabled: true, path: '~/.config/limitbar/manual-usage.json' },
    openclaw: { enabled: false, path: '~/.openclaw/session-summary.json' }
  }
};

function expandHome(path) {
  return path?.startsWith('~/') ? resolve(homedir(), path.slice(2)) : path;
}

function resolveConfigPath(path, baseDir) {
  const expanded = expandHome(path);
  if (!expanded) return expanded;
  if (isAbsolute(expanded)) return expanded;
  const fromConfig = resolve(baseDir, expanded);
  if (existsSync(fromConfig)) return fromConfig;
  return resolve(expanded);
}

export async function loadConfig(path) {
  const configPath = path ? assertLocalPath(path) : undefined;
  const raw = configPath ? await safeReadJson(configPath, { fallback: {} }) : {};
  const baseDir = configPath ? dirname(resolve(configPath)) : process.cwd();
  const config = {
    ...defaultConfig,
    ...raw,
    thresholds: { ...defaultConfig.thresholds, ...(raw.thresholds ?? {}) },
    adapters: {
      manual: { ...defaultConfig.adapters.manual, ...(raw.adapters?.manual ?? {}) },
      openclaw: { ...defaultConfig.adapters.openclaw, ...(raw.adapters?.openclaw ?? {}) }
    }
  };
  for (const adapter of Object.values(config.adapters)) {
    if (adapter.path) adapter.path = assertLocalPath(resolveConfigPath(adapter.path, baseDir));
  }
  return config;
}
