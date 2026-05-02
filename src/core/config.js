import { homedir } from 'node:os';
import { resolve } from 'node:path';
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

export async function loadConfig(path) {
  const raw = path ? await safeReadJson(assertLocalPath(path), { fallback: {} }) : {};
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
    if (adapter.path) adapter.path = expandHome(assertLocalPath(adapter.path));
  }
  return config;
}
