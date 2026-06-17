import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL;
if (!dbUrl) {
  console.error('SUPABASE_DB_URL veya DATABASE_URL .env.local içinde tanımlı değil.');
  console.error('Supabase Dashboard > Project Settings > Database > Connection string (URI) değerini ekleyin.');
  process.exit(1);
}

const { default: postgres } = await import('postgres');
const sql = postgres(dbUrl, { max: 1, ssl: 'require' });

const migrationDir = resolve(__dirname, '../supabase/migrations');
const files = readdirSync(migrationDir)
  .filter((name) => name.startsWith('20260617'))
  .sort();

for (const file of files) {
  const query = readFileSync(resolve(migrationDir, file), 'utf8');
  console.log(`Uygulanıyor: ${file}`);
  await sql.unsafe(query);
}

await sql.end();
console.log('Portföy migration dosyaları uygulandı.');
