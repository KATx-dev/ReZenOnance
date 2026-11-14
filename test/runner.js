import fs from 'node:fs';
import path from 'node:path';
import { run } from 'node:test';
import { spec as Spec } from 'node:test/reporters';

function findTests(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTests(full));
    } else if (entry.name.endsWith('.test.ts') && !entry.name.endsWith('runner.js')) {
      files.push(full);
    }
  }
  return files;
}

const files = findTests('test');
const stream = run({ files });
stream.compose(new Spec()).pipe(process.stdout);
let failed = false;
stream.on('test:fail', () => { failed = true; });
stream.on('end', () => {
  process.exit(failed ? 1 : 0);
});
