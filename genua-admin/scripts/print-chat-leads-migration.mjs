import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(
  resolve(__dirname, '../supabase/migrations/20260707000100_chat_leads.sql'),
  'utf8',
);

console.log(sql);
