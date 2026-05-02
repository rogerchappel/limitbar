import { safeReadJson, assertLocalPath } from '../core/safety.js';

export async function readManualUsage(options = {}) {
  const path = assertLocalPath(options.path);
  const data = await safeReadJson(path, { fallback: { providers: [] } });
  return (data.providers ?? []).map((provider) => ({
    kind: 'provider',
    source: 'manual',
    id: provider.id,
    name: provider.name ?? provider.id,
    used: Number(provider.used ?? 0),
    limit: Number(provider.limit ?? 0),
    spendUsd: Number(provider.spendUsd ?? 0),
    resetAt: provider.resetAt ?? null,
    note: provider.note ?? ''
  }));
}
