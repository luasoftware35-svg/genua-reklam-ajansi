#!/usr/bin/env node
/**
 * Tek komutla chatbot'u bitir:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/finish-chatbot-setup.mjs
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const adminDir = resolve(__dirname, '..');
const vercelBin = resolve(adminDir, 'node_modules/.bin/vercel');

const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!anthropicKey) {
  console.error('ANTHROPIC_API_KEY gerekli.');
  console.error('Kullanım: ANTHROPIC_API_KEY=sk-ant-... node scripts/finish-chatbot-setup.mjs');
  process.exit(1);
}

function addEnv(name, value) {
  const result = spawnSync(
    vercelBin,
    ['env', 'add', name, 'production', 'preview', 'development', '--force', '--yes'],
    { cwd: adminDir, input: value, encoding: 'utf8' },
  );
  if (result.status !== 0) {
    console.error(`✗ ${name}:`, result.stderr?.trim() || result.stdout?.trim());
    process.exit(1);
  }
  console.log(`✓ ${name} eklendi`);
}

console.log('Vercel env güncelleniyor...');
addEnv('ANTHROPIC_API_KEY', anthropicKey);

const model = process.env.ANTHROPIC_CHAT_MODEL?.trim() || 'claude-sonnet-4-20250514';
addEnv('ANTHROPIC_CHAT_MODEL', model);

console.log('Production deploy başlıyor...');
const deploy = spawnSync(vercelBin, ['--prod', '--yes'], {
  cwd: adminDir,
  encoding: 'utf8',
  stdio: 'inherit',
});

if (deploy.status !== 0) {
  console.error('Deploy başarısız.');
  process.exit(1);
}

console.log('\nTamam. genuadigital.com üzerinde G. butonunu test et.');
