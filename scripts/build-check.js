import { readdir } from 'node:fs/promises';
const required = ['src/cli.js', 'src/index.js', 'docs/PRD.md', 'docs/TASKS.md', 'docs/ORCHESTRATION.md', 'docs/orchestration.json'];
for (const path of required) await import('node:fs/promises').then(({ access }) => access(path));
console.log(`build-check ok (${(await readdir('src')).length} src entries)`);
