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

const covers = [
  ['dijital-reklam', 'https://genuadigital.com/varlıklar/resimler/hizmetler/dijital-reklam.jpg'],
  ['sosyal-medya', 'https://genuadigital.com/varlıklar/resimler/hizmetler/sosyal-medya.jpg'],
  ['marka-tasarim', 'https://genuadigital.com/varlıklar/resimler/hizmetler/marka-tasarim.jpg'],
  ['icerik-uretimi', 'https://genuadigital.com/varlıklar/resimler/hizmetler/icerik-uretimi.jpg'],
  ['seo', 'https://genuadigital.com/varlıklar/resimler/hizmetler/seo.jpg'],
  ['web-tasarim', 'https://genuadigital.com/varlıklar/resimler/hizmetler/web-tasarim.jpg'],
];

for (const [slug, coverUrl] of covers) {
  const { error } = await supabase.from('services').update({ cover_image_url: coverUrl }).eq('slug', slug);

  if (error) {
    console.error(`${slug} güncellenemedi:`, error.message);
    process.exit(1);
  }

  console.log(`${slug} → ${coverUrl}`);
}

console.log('Tüm hizmet kapak görselleri güncellendi.');
