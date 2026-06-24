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

const payload = {
  contact_address: 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli',
  contact_studio_address: 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M',
};

const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
if (!existing?.id) {
  console.error('site_settings kaydı bulunamadı.');
  process.exit(1);
}

let { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id);
if (error?.message?.includes('contact_studio_address')) {
  ({ error } = await supabase
    .from('site_settings')
    .update({ contact_address: payload.contact_address })
    .eq('id', existing.id));
  if (!error) {
    console.log('Merkez ofis adresi güncellendi. Stüdyo kolonu için migration uygulayın.');
    process.exit(0);
  }
}
if (error) {
  console.error('Adresler güncellenemedi:', error.message);
  process.exit(1);
}

console.log('Merkez ofis ve stüdyo adresleri güncellendi.');
