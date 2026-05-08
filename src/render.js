export function renderJson(summary) {
  return JSON.stringify(summary, null, 2);
}

export function renderText(summary) {
  const icon = summary.status === 'ok' ? '✓' : summary.status === 'critical' ? '!' : '⚠';
  const lines = [`limitbar ${icon} ${summary.status.toUpperCase()}`];
  for (const provider of summary.providers) {
    lines.push('', `${provider.label} (${provider.id})`);
    if (provider.limits.length === 0) lines.push('  limits: no local counters configured');
    for (const limit of provider.limits) {
      const window = limit.window ? ` / ${limit.window}` : '';
      lines.push(`  ${limit.name}: ${limit.used}/${limit.limit} ${limit.unit}${window} (${limit.percent}%)`);
    }
    if (provider.spend) {
      lines.push(`  spend: ${provider.spend.used}/${provider.spend.budget} ${provider.spend.currency} (${provider.spend.percent}%)`);
    }
    lines.push(`  runs: ${provider.activeRuns} active / ${provider.totalRuns} total${provider.riskyRuns ? `, ${provider.riskyRuns} risky` : ''}`);
  }
  if (summary.warnings.length > 0) {
    lines.push('', 'warnings:');
    for (const warning of summary.warnings) lines.push(`  [${warning.level}] ${warning.providerId}: ${warning.message}`);
  }
  if (summary.errors.length > 0) {
    lines.push('', 'adapter errors:');
    for (const error of summary.errors) lines.push(`  ${error.providerId}: ${error.message}`);
  }
  return lines.join('\n');
}
