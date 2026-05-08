import { percent } from './thresholds.js';

export function summarize(snapshots, warnings, errors = []) {
  const providers = snapshots.map((snapshot) => ({
    id: snapshot.providerId,
    label: snapshot.providerLabel,
    capturedAt: snapshot.capturedAt,
    limits: snapshot.limits.map((limit) => ({ ...limit, percent: percent(limit.used, limit.limit) })),
    spend: snapshot.spend ? { ...snapshot.spend, percent: percent(snapshot.spend.used, snapshot.spend.budget) } : undefined,
    activeRuns: snapshot.runs.filter((run) => run.status !== 'completed').length,
    totalRuns: snapshot.runs.length,
    riskyRuns: snapshot.runs.filter((run) => warnings.some((warning) => warning.kind === 'runaway' && warning.runId === run.id)).length,
    notes: snapshot.notes
  }));
  return {
    generatedAt: new Date().toISOString(),
    status: warnings.some((warning) => warning.level === 'critical') ? 'critical' : warnings.length > 0 ? 'warning' : 'ok',
    providers,
    warnings,
    errors: errors.map((item) => ({ providerId: item.providerId, message: item.error?.message ?? String(item.error) }))
  };
}
