export function normalizeSnapshot(provider, snapshot) {
  return {
    providerId: provider.id,
    providerLabel: provider.label ?? provider.id,
    type: provider.type,
    capturedAt: snapshot.capturedAt ?? new Date(0).toISOString(),
    limits: Array.isArray(snapshot.limits) ? snapshot.limits.map(normalizeLimit) : [],
    spend: snapshot.spend ? normalizeSpend(snapshot.spend) : undefined,
    runs: Array.isArray(snapshot.runs) ? snapshot.runs.map(normalizeRun) : [],
    notes: Array.isArray(snapshot.notes) ? snapshot.notes : []
  };
}

function normalizeLimit(limit) {
  return {
    name: String(limit.name ?? 'usage'),
    used: Number(limit.used ?? 0),
    limit: Number(limit.limit ?? 0),
    unit: String(limit.unit ?? 'units'),
    window: limit.window ? String(limit.window) : undefined,
    resetsAt: limit.resetsAt
  };
}

function normalizeSpend(spend) {
  return {
    used: Number(spend.used ?? 0),
    budget: Number(spend.budget ?? 0),
    currency: String(spend.currency ?? 'USD'),
    window: spend.window ? String(spend.window) : undefined
  };
}

function normalizeRun(run) {
  return {
    id: String(run.id ?? 'unknown'),
    label: run.label ? String(run.label) : undefined,
    status: String(run.status ?? 'active'),
    startedAt: run.startedAt,
    ageMinutes: Number(run.ageMinutes ?? 0),
    cost: run.cost === undefined ? undefined : Number(run.cost),
    tokens: run.tokens === undefined ? undefined : Number(run.tokens)
  };
}
