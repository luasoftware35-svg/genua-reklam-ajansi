import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const steps = ['apply-seo.mjs', 'sync-seo-footers.mjs', 'generate-sitemap.mjs'];

for (const script of steps) {
  const result = spawnSync(process.execPath, [resolve(__dirname, script)], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('SEO pipeline finished.');
