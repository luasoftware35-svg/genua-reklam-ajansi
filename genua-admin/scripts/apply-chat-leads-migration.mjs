import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const dbUrl = process.env.SUPABASE_DB_URL || env.SUPABASE_DB_URL || env.DATABASE_URL;
if (!dbUrl) {
  console.error('SUPABASE_DB_URL veya DATABASE_URL gerekli.');
  console.error('Supabase Dashboard > Project Settings > Database > Connection string (URI)');
  process.exit(1);
}

const migrationPath = resolve(__dirname, '../supabase/migrations/20260707000100_chat_leads.sql');
const query = readFileSync(migrationPath, 'utf8');

const { default: postgres } = await import('postgres');
const sql = postgres(dbUrl, { max: 1, ssl: 'require' });

try {
  console.log('chat_leads migration uygulanıyor...');
  await sql.unsafe(query);
  const rows = await sql`SELECT COUNT(*)::int AS count FROM chat_leads`;
  console.log('Tamam. chat_leads tablosu hazır. Kayıt sayısı:', rows[0]?.count ?? 0);
} finally {
  await sql.end();
}
