export function percent(used, limit) {
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.round((used / limit) * 1000) / 10;
}

export function evaluateSnapshot(snapshot, thresholds) {
  const warnings = [];
  for (const limit of snapshot.limits) {
    const usagePercent = percent(limit.used, limit.limit);
    if (usagePercent >= thresholds.criticalLimitPercent) {
      warnings.push({ level: 'critical', kind: 'limit', providerId: snapshot.providerId, message: `${limit.name} is ${usagePercent}% used`, value: usagePercent });
    } else if (usagePercent >= thresholds.nearLimitPercent) {
      warnings.push({ level: 'warning', kind: 'limit', providerId: snapshot.providerId, message: `${limit.name} is ${usagePercent}% used`, value: usagePercent });
    }
  }
  if (snapshot.spend && snapshot.spend.budget > 0) {
    const spendPercent = percent(snapshot.spend.used, snapshot.spend.budget);
    if (spendPercent >= thresholds.spendWarningPercent) {
      warnings.push({ level: spendPercent >= thresholds.criticalLimitPercent ? 'critical' : 'warning', kind: 'spend', providerId: snapshot.providerId, message: `spend is ${spendPercent}% of budget`, value: spendPercent });
    }
  }
  for (const run of snapshot.runs) {
    if (run.status !== 'completed' && run.ageMinutes >= thresholds.runawayMinutes) {
      warnings.push({ level: 'warning', kind: 'runaway', providerId: snapshot.providerId, runId: run.id, message: `${run.label ?? run.id} has run for ${run.ageMinutes}m`, value: run.ageMinutes });
    }
  }
  return warnings;
}

export function evaluateAll(snapshots, thresholds) {
  return snapshots.flatMap((snapshot) => evaluateSnapshot(snapshot, thresholds));
}
