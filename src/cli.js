#!/usr/bin/env node
import { createRequire } from 'node:module';
import { collectSnapshot, loadConfig, renderJson, renderStatusLine, renderTable } from './index.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const args = process.argv.slice(2);
const command = args[0] ?? 'status';

function option(name, fallback = undefined) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

async function main() {
  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${version}\n`);
    return;
  }
  if (args.includes('--help') || command === 'help') return help();
  if (command !== 'status' && command !== 'summary') throw new Error(`Unknown command: ${command}`);
  const config = await loadConfig(option('--config'));
  const snapshot = await collectSnapshot(config, { now: option('--now') });
  if (args.includes('--json')) process.stdout.write(renderJson(snapshot));
  else if (args.includes('--line')) process.stdout.write(`${renderStatusLine(snapshot)}\n`);
  else process.stdout.write(renderTable(snapshot));
  if (snapshot.alerts.some((a) => a.level === 'critical') && args.includes('--fail-on-critical')) process.exitCode = 2;
}

function help() {
  process.stdout.write(`limitbar\n\nUsage:\n  limitbar status [--config path] [--json|--line] [--fail-on-critical]\n  limitbar --version\n\nLocal-first monitor for manual agent limits and fixture-backed OpenClaw session summaries.\n`);
}

main().catch((error) => {
  console.error(`limitbar: ${error.message}`);
  process.exit(1);
});
