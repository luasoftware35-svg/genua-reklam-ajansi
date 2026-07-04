import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const adminDir = resolve(__dirname, '..');
const vercelBin = resolve(adminDir, 'node_modules/.bin/vercel');

const extra = {
  FORM_NOTIFY_EMAIL: 'hello@genuadigital.com',
  FORM_FROM_EMAIL: 'Genua Formlar <onboarding@resend.dev>',
};

function parseEnvFile(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function listEnvNames() {
  const result = spawnSync(vercelBin, ['env', 'ls'], {
    cwd: adminDir,
    encoding: 'utf8',
  });

  if (result.status !== 0) return new Set();

  return new Set(
    result.stdout
      .split('\n')
      .map((line) => line.trim().split(/\s+/)[0])
      .filter((name) => name && /^[A-Z0-9_]+$/.test(name)),
  );
}

function addEnv(name, value) {
  const result = spawnSync(
    vercelBin,
    ['env', 'add', name, 'production', 'preview', 'development', '--force', '--yes'],
    {
      cwd: adminDir,
      input: value,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || result.stdout?.trim() || 'unknown error';
    throw new Error(`${name}: ${stderr}`);
  }

  console.log(`✓ ${name}`);
}

const localEnv = parseEnvFile(envPath);
const skip = new Set(['VERCEL_OIDC_TOKEN']);
const entries = {
  ...Object.fromEntries(Object.entries(localEnv).filter(([key]) => !skip.has(key))),
  ...extra,
};

if (process.env.RESEND_API_KEY) {
  entries.RESEND_API_KEY = process.env.RESEND_API_KEY;
}

const existing = listEnvNames();

for (const [name, value] of Object.entries(entries)) {
  if (!value) continue;
  if (existing.has(name)) {
    console.log(`• ${name} (zaten var)`);
    continue;
  }
  addEnv(name, value);
}

if (!entries.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY eklenmedi. Mail bildirimi için Resend API key gerekli.');
}
