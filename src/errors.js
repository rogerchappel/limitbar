export class LimitbarError extends Error {
  constructor(message, code = 'LIMITBAR_ERROR', details = undefined) {
    super(message);
    this.name = 'LimitbarError';
    this.code = code;
    this.details = details;
  }
}

export function formatError(error) {
  if (error instanceof LimitbarError) {
    return `${error.code}: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}
