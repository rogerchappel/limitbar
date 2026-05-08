#!/usr/bin/env node
import { collectStatus } from '../src/index.js';
import { formatError } from '../src/errors.js';
import { renderJson, renderText } from '../src/render.js';

const HELP = `limitbar — local-first AI agent usage status\n\nUsage:\n  limitbar status --config <path> [--format text|json]\n  limitbar --help\n\nOptions:\n  --config <path>     Path to limitbar config JSON (default: limitbar.config.json)\n  --fixtures <dir>    Convenience base dir for fixture examples; config paths still win\n  --format <format>   text or json (default: text)\n`;

function parseArgs(argv) {
  const args = { command: 'status', config: 'limitbar.config.json', format: 'text' };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith('-')) args.command = rest.shift();
  while (rest.length > 0) {
    const flag = rest.shift();
    if (flag === '--help' || flag === '-h') args.help = true;
    else if (flag === '--config') args.config = rest.shift();
    else if (flag === '--format') args.format = rest.shift();
    else if (flag === '--fixtures') args.fixtures = rest.shift();
    else throw new Error(`Unknown option: ${flag}`);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.command === 'help') {
    console.log(HELP);
    return;
  }
  if (args.command !== 'status') throw new Error(`Unknown command: ${args.command}`);
  if (!['text', 'json'].includes(args.format)) throw new Error('--format must be text or json');
  const summary = await collectStatus({ config: args.config });
  console.log(args.format === 'json' ? renderJson(summary) : renderText(summary));
  if (summary.status === 'critical') process.exitCode = 2;
  else if (summary.status === 'warning') process.exitCode = 1;
}

main().catch((error) => {
  console.error(formatError(error));
  process.exitCode = 2;
});
