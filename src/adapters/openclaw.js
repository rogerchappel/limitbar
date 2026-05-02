import { safeReadJson, assertLocalPath } from '../core/safety.js';

function durationMinutes(run, nowMs) {
  if (run.durationMinutes !== undefined) return Number(run.durationMinutes);
  const started = Date.parse(run.startedAt ?? run.createdAt ?? 0);
  const ended = run.endedAt ? Date.parse(run.endedAt) : nowMs;
  return Number.isFinite(started) && Number.isFinite(ended) ? Math.max(0, Math.round((ended - started) / 60000)) : 0;
}

export async function readOpenClawSummary(options = {}) {
  const path = assertLocalPath(options.path);
  const data = await safeReadJson(path, { fallback: { runs: [], queue: [] } });
  const nowMs = options.now ? Date.parse(options.now) : Date.now();
  const activeRuns = (data.runs ?? []).filter((run) => ['active', 'running', 'queued'].includes(run.status));
  return [{
    kind: 'sessions',
    source: 'openclaw',
    id: 'openclaw',
    name: 'OpenClaw',
    activeRuns: activeRuns.filter((run) => run.status !== 'queued').length,
    queued: (data.queue ?? []).length + activeRuns.filter((run) => run.status === 'queued').length,
    runs: activeRuns.map((run) => ({
      id: run.id ?? run.sessionKey ?? 'unknown',
      label: run.label ?? run.task ?? 'agent run',
      status: run.status,
      durationMinutes: durationMinutes(run, nowMs),
      spendUsd: Number(run.spendUsd ?? 0)
    }))
  }];
}
