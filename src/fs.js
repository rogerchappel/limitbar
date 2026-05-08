import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { LimitbarError } from './errors.js';

export function resolvePath(input, base = process.cwd()) {
  if (!input || typeof input !== 'string') return undefined;
  return path.isAbsolute(input) ? input : path.resolve(base, input);
}

export async function readJsonFile(filePath, label = 'JSON file') {
  const resolved = resolvePath(filePath);
  try {
    const raw = await readFile(resolved, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new LimitbarError(`${label} not found: ${resolved}`, 'FILE_NOT_FOUND');
    }
    if (error instanceof SyntaxError) {
      throw new LimitbarError(`${label} is not valid JSON: ${resolved}`, 'INVALID_JSON');
    }
    throw error;
  }
}

export async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
}
