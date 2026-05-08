import { LimitbarError } from '../errors.js';
import { readFileProvider } from './file.js';
import { readFixtureProvider } from './fixture.js';
import { readOpenClawProvider } from './openclaw.js';

export async function readProvider(provider) {
  if (provider.type === 'fixture') return readFixtureProvider(provider);
  if (provider.type === 'file') return readFileProvider(provider);
  if (provider.type === 'openclaw') return readOpenClawProvider(provider);
  throw new LimitbarError(`Unsupported provider type: ${provider.type}`, 'UNSUPPORTED_PROVIDER');
}

export async function readAllProviders(config) {
  const snapshots = [];
  const errors = [];
  for (const provider of config.providers) {
    try {
      snapshots.push(await readProvider(provider));
    } catch (error) {
      errors.push({ providerId: provider.id, error });
    }
  }
  return { snapshots, errors };
}
