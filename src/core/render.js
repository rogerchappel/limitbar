import { redactSecrets } from './safety.js';

export function renderJson(snapshot) {
  return `${JSON.stringify(redactSecrets(snapshot), null, 2)}\n`;
}

export function renderStatusLine(snapshot) {
  const level = snapshot.alerts.some((a) => a.level === 'critical') ? 'CRIT' : snapshot.alerts.length ? 'WARN' : 'OK';
  return `limitbar ${level} · $${snapshot.totals.spendUsd.toFixed(2)} · ${snapshot.totals.activeRuns} active · ${snapshot.totals.queued} queued · ${snapshot.alerts.length} alerts`;
}

export function renderTable(snapshot) {
  const lines = [renderStatusLine(snapshot), '', 'Sources:'];
  for (const item of snapshot.items) {
    if (item.kind === 'provider') {
      const ratio = item.limit > 0 ? `${Math.round((item.used / item.limit) * 100)}%` : 'n/a';
      lines.push(`- ${item.name}: ${item.used}/${item.limit} (${ratio}), $${item.spendUsd.toFixed(2)}`);
    } else {
      lines.push(`- ${item.name}: ${item.activeRuns} active, ${item.queued} queued`);
      for (const run of item.runs) lines.push(`  • ${run.label} [${run.status}] ${run.durationMinutes}m $${run.spendUsd.toFixed(2)}`);
    }
  }
  if (snapshot.alerts.length) {
    lines.push('', 'Alerts:');
    for (const alert of snapshot.alerts) lines.push(`- ${alert.level.toUpperCase()}: ${alert.message}`);
  }
  return `${lines.join('\n')}\n`;
}
