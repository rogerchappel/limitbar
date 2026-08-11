import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('cli prints package version', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--version'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${pkg.version}\n`);
  assert.equal(result.stderr, '');
});

test('cli help documents version flag', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /limitbar --version/);
});

test('cli accepts command and help/version aliases', () => {
  for (const args of [['summary', '--line'], ['--help'], ['-h'], ['help'], ['--version'], ['-v']]) {
    const result = spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
    assert.equal(result.stderr, '');
    assert.notEqual(result.stdout, '');
  }
});

test('cli rejects invalid argument combinations without normal output', () => {
  const cases = [
    [['status', '--bogus'], /Unknown option: --bogus/],
    [['status', '--config'], /Missing value for --config/],
    [['status', '--json', '--line'], /--json and --line cannot be used together/],
    [['--version', 'junk'], /Unexpected argument: junk/],
    [['status', '--config', 'one', '--config', 'two'], /Duplicate option: --config/],
    [['status', 'junk'], /Unexpected argument: junk/]
  ];
  for (const [args, message] of cases) {
    const result = spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8' });
    assert.notEqual(result.status, 0, args.join(' '));
    assert.equal(result.stdout, '');
    assert.match(result.stderr, message);
  }
});

test('cli accepts valid option combinations', () => {
  for (const format of ['--json', '--line']) {
    const result = spawnSync(process.execPath, [
      'src/cli.js', 'status', '--config', 'fixtures/limitbar.config.json', format, '--fail-on-critical'
    ], { encoding: 'utf8' });
    assert.equal(result.status, 2);
    assert.equal(result.stderr, '');
    assert.notEqual(result.stdout, '');
  }
});

test('old queued sessions do not trigger --fail-on-critical', () => {
  const configDir = mkdtempSync(join(tmpdir(), 'limitbar-queued-'));
  try {
    const summaryPath = join(configDir, 'session-summary.json');
    const configPath = join(configDir, 'limitbar.config.json');
    writeFileSync(summaryPath, JSON.stringify({
      runs: [{ id: 'waiting', label: 'waiting', status: 'queued', createdAt: '2026-07-22T13:00:00Z' }],
      queue: []
    }), 'utf8');
    writeFileSync(configPath, JSON.stringify({
      adapters: {
        manual: { enabled: false },
        openclaw: { enabled: true, path: summaryPath }
      }
    }), 'utf8');

    const result = spawnSync(process.execPath, [
      'src/cli.js', 'status', '--config', configPath, '--now', '2026-07-22T15:00:00Z', '--json', '--fail-on-critical'
    ], { encoding: 'utf8' });
    const snapshot = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.equal(snapshot.totals.activeRuns, 0);
    assert.equal(snapshot.totals.queued, 1);
    assert.equal(snapshot.items[0].runs[0].durationMinutes, 120);
    assert.equal(snapshot.alerts.some((alert) => alert.level === 'critical'), false);
  } finally {
    rmSync(configDir, { recursive: true, force: true });
  }
});
