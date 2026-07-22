export function evaluateAlerts(items, thresholds) {
  const alerts = [];
  for (const item of items) {
    if (item.kind === 'provider') {
      const ratio = item.limit > 0 ? item.used / item.limit : 0;
      if (ratio >= thresholds.usageCriticalRatio) alerts.push(alert('critical', `${item.name} usage is ${pct(ratio)} of limit`, item));
      else if (ratio >= thresholds.usageWarnRatio) alerts.push(alert('warn', `${item.name} usage is ${pct(ratio)} of limit`, item));
      if (item.spendUsd >= thresholds.spendCriticalUsd) alerts.push(alert('critical', `${item.name} spend is $${money(item.spendUsd)}`, item));
      else if (item.spendUsd >= thresholds.spendWarnUsd) alerts.push(alert('warn', `${item.name} spend is $${money(item.spendUsd)}`, item));
    }
    if (item.kind === 'sessions') {
      if (item.queued >= thresholds.queueWarn) alerts.push(alert('warn', `${item.name} queue has ${item.queued} items`, item));
      for (const run of item.runs ?? []) {
        if (run.status !== 'queued' && run.durationMinutes >= thresholds.runawayMinutes) {
          alerts.push(alert('critical', `${run.label} has run for ${run.durationMinutes}m`, { ...item, run }));
        }
      }
    }
  }
  return alerts;
}

function alert(level, message, item) {
  return { level, message, source: item.source, id: item.run?.id ?? item.id };
}
function pct(value) { return `${Math.round(value * 100)}%`; }
function money(value) { return Number(value).toFixed(2); }
