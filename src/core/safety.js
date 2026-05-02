import { readFile } from 'node:fs/promises';

const SECRET_KEYS = /(?:token|secret|password|api[_-]?key|authorization|cookie)/i;

export function redactSecrets(value) {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [
      key,
      SECRET_KEYS.test(key) ? '[redacted]' : redactSecrets(val)
    ]));
  }
  if (typeof value === 'string') {
    return value.replace(/(sk-[A-Za-z0-9_-]{8,})/g, '[redacted]');
  }
  return value;
}

export async function safeReadJson(path, { fallback = undefined } = {}) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (fallback !== undefined && (error.code === 'ENOENT' || error.name === 'SyntaxError')) return fallback;
    error.message = `Could not read JSON at ${path}: ${error.message}`;
    throw error;
  }
}

export function assertLocalPath(path) {
  if (!path || /^https?:\/\//i.test(path)) {
    throw new Error(`limitbar only reads local files; rejected path: ${path ?? '<empty>'}`);
  }
  return path;
}
