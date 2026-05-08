#!/usr/bin/env node
import { access } from 'node:fs/promises';

const required = ['bin/limitbar.js', 'src/index.js', 'examples/limitbar.config.json'];
for (const file of required) {
  await access(file);
}
console.log(`limitbar build check passed (${required.length} required files)`);
