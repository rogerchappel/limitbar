#!/usr/bin/env node
import { createRequire } from 'node:module';
import { collectSnapshot, loadConfig, renderJson, renderStatusLine, renderTable } from './index.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const args = process.argv.slice(2);

const valueOptions = new Set(['--config', '--now']);
const flagOptions = new Set(['--json', '--line', '--fail-on-critical']);

function parseArgs(argv) {
  if (argv[0] === '--help' || argv[0] === '-h' || argv[0] === 'help') {
    if (argv.length > 1) throw new Error(`Unexpected argument: ${argv[1]}`);
    return { action: 'help' };
  }
  if (argv[0] === '--version' || argv[0] === '-v') {
    if (argv.length > 1) throw new Error(`Unexpected argument: ${argv[1]}`);
    return { action: 'version' };
  }

  let index = 0;
  let command = 'status';
  if (argv[0] && !argv[0].startsWith('-')) {
    command = argv[0];
    index = 1;
  }
  if (command !== 'status' && command !== 'summary') throw new Error(`Unknown command: ${command}`);

  const options = {};
  const seen = new Set();
  while (index < argv.length) {
    const argument = argv[index];
    if (!valueOptions.has(argument) && !flagOptions.has(argument)) {
      throw new Error(argument.startsWith('-') ? `Unknown option: ${argument}` : `Unexpected argument: ${argument}`);
    }
    if (seen.has(argument)) throw new Error(`Duplicate option: ${argument}`);
    seen.add(argument);
    if (valueOptions.has(argument)) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('-')) throw new Error(`Missing value for ${argument}`);
      options[argument.slice(2)] = value;
      index += 2;
    } else {
      options[argument.slice(2)] = true;
      index += 1;
    }
  }
  if (options.json && options.line) throw new Error('--json and --line cannot be used together');
  return { action: 'status', options };
}

async function main() {
  const parsed = parseArgs(args);
  if (parsed.action === 'version') {
    process.stdout.write(`${version}\n`);
    return;
  }
  if (parsed.action === 'help') return help();
  const config = await loadConfig(parsed.options.config);
  const snapshot = await collectSnapshot(config, { now: parsed.options.now });
  if (parsed.options.json) process.stdout.write(renderJson(snapshot));
  else if (parsed.options.line) process.stdout.write(`${renderStatusLine(snapshot)}\n`);
  else process.stdout.write(renderTable(snapshot));
  if (snapshot.alerts.some((a) => a.level === 'critical') && parsed.options['fail-on-critical']) process.exitCode = 2;
}

function help() {
  process.stdout.write(`limitbar\n\nUsage:\n  limitbar status [--config path] [--json|--line] [--fail-on-critical]\n  limitbar summary [--config path] [--json|--line] [--fail-on-critical]\n  limitbar --help|-h\n  limitbar --version|-v\n\nLocal-first monitor for manual agent limits and fixture-backed OpenClaw session summaries.\n`);
}

main().catch((error) => {
  console.error(`limitbar: ${error.message}`);
  process.exit(1);
});
