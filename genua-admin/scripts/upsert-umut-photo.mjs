import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const photoUrl = 'https://genuadigital.com/varlıklar/resimler/umut-avci.jpg';

const { data: member, error: readError } = await supabase
  .from('team_members')
  .select('id, full_name, photo_url')
  .ilike('full_name', '%Umut Avc%')
  .limit(1)
  .maybeSingle();

if (readError) {
  console.error('Ekip kaydı okunamadı:', readError.message);
  process.exit(1);
}

if (!member?.id) {
  console.error('Umut Avcı ekip kaydı bulunamadı.');
  process.exit(1);
}

const { error } = await supabase
  .from('team_members')
  .update({ photo_url: photoUrl })
  .eq('id', member.id);

if (error) {
  console.error('Güncelleme başarısız:', error.message);
  process.exit(1);
}

console.log('Umut Avcı fotoğrafı güncellendi:', member.full_name);
console.log('Önceki:', member.photo_url || '(boş)');
console.log('Yeni:', photoUrl);
