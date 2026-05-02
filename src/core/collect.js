import { readManualUsage } from '../adapters/manual.js';
import { readOpenClawSummary } from '../adapters/openclaw.js';
import { evaluateAlerts } from './alerts.js';

export async function collectSnapshot(config, options = {}) {
  const items = [];
  if (config.adapters.manual?.enabled) {
    items.push(...await readManualUsage(config.adapters.manual));
  }
  if (config.adapters.openclaw?.enabled) {
    items.push(...await readOpenClawSummary({ ...config.adapters.openclaw, now: options.now }));
  }
  const alerts = evaluateAlerts(items, config.thresholds);
  return {
    generatedAt: options.now ?? new Date().toISOString(),
    totals: summarize(items),
    items,
    alerts
  };
}

export function summarize(items) {
  return items.reduce((totals, item) => {
    if (item.kind === 'provider') {
      totals.spendUsd += item.spendUsd;
      totals.providers += 1;
    }
    if (item.kind === 'sessions') {
      totals.activeRuns += item.activeRuns;
      totals.queued += item.queued;
      totals.spendUsd += item.runs.reduce((sum, run) => sum + (run.spendUsd ?? 0), 0);
    }
    return totals;
  }, { providers: 0, spendUsd: 0, activeRuns: 0, queued: 0 });
}
