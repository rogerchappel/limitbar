import { LimitbarError } from './errors.js';

const PROVIDERS = new Set(['fixture', 'file', 'openclaw']);

export function validateConfig(config) {
  const problems = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new LimitbarError('Config must be a JSON object.', 'INVALID_CONFIG');
  }
  if (!Array.isArray(config.providers) || config.providers.length === 0) {
    problems.push('providers must be a non-empty array');
  } else {
    config.providers.forEach((provider, index) => {
      if (!provider || typeof provider !== 'object') {
        problems.push(`providers[${index}] must be an object`);
        return;
      }
      if (!provider.id || typeof provider.id !== 'string') problems.push(`providers[${index}].id is required`);
      if (!PROVIDERS.has(provider.type)) problems.push(`providers[${index}].type must be one of: ${[...PROVIDERS].join(', ')}`);
      if ((provider.type === 'fixture' || provider.type === 'file') && (!provider.path || typeof provider.path !== 'string')) {
        problems.push(`providers[${index}].path is required for ${provider.type} adapters`);
      }
    });
  }
  if (config.thresholds !== undefined && (typeof config.thresholds !== 'object' || Array.isArray(config.thresholds))) {
    problems.push('thresholds must be an object when present');
  }
  if (problems.length > 0) {
    throw new LimitbarError(`Invalid config: ${problems.join('; ')}`, 'INVALID_CONFIG', problems);
  }
  return config;
}

export function normalizeThresholds(thresholds = {}) {
  return {
    nearLimitPercent: numberOrDefault(thresholds.nearLimitPercent, 80),
    criticalLimitPercent: numberOrDefault(thresholds.criticalLimitPercent, 95),
    runawayMinutes: numberOrDefault(thresholds.runawayMinutes, 120),
    spendWarningPercent: numberOrDefault(thresholds.spendWarningPercent, 80)
  };
}

function numberOrDefault(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
