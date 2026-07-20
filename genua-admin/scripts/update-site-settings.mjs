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
  site_title: 'Genua Reklam Ajansı',
  site_description:
    'Denizli merkezli Genua Reklam Ajansı; dijital reklam, sosyal medya yönetimi, marka tasarımı ve içerik üretimi ile markanızı büyütür. Kamu ve kurumsal projelerde deneyimli ekip.',
  site_keywords:
    'dijital reklam ajansı denizli, sosyal medya ajansı, reklam ajansı denizli, dijital pazarlama, google ads yönetimi, meta reklam, marka tasarımı, içerik üretimi, genua reklam ajansı',
  contact_email: 'hello@genuadigital.com',
  contact_phone: '0551 124 53 06',
  contact_address: 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli',
  contact_studio_address: 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M',
  social_instagram: 'https://www.instagram.com/genuadigital/',
  social_linkedin: 'https://tr.linkedin.com/company/genua-digital-media-agency',
  social_behance: 'https://www.behance.net/umutavci4',
  hero_title: 'Markanızı Büyütüyoruz.',
  hero_subtitle:
    'Strateji, kreatif ve performansı aynı masada birleştiren Denizli merkezli dijital reklam ajansı.',
  hero_cta_primary_text: 'Portföyümüzü İncele',
  hero_cta_primary_url: '/portfolyo.html',
  hero_cta_secondary_text: 'Teklif Al',
  hero_cta_secondary_url: '/teklif-al.html',
  footer_description:
    'Denizli merkezli dijital medya ve reklam ajansı. Dijital reklam, sosyal medya, marka tasarımı ve içerik üretiminde kurumsal çözümler.',
  footer_copyright: '© 2026 Genua Reklam Ajansı. Tüm hakları saklıdır.',
  meta_og_image_url: 'https://genuadigital.com/varlıklar/resimler/genua-ekip.jpg',
};

const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();

const query = existing?.id
  ? supabase.from('site_settings').update(payload).eq('id', existing.id)
  : supabase.from('site_settings').insert(payload);

const { error } = await query;
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log('Site ayarları SEO metinleriyle güncellendi.');
