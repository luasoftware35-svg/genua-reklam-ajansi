import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
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

const BEHANCE_BOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

async function fetchBehanceMeta(projectUrl) {
  try {
    const response = await fetch(projectUrl, {
      headers: { 'User-Agent': BEHANCE_BOT_UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
    });
    if (!response.ok) return { title: null, cover_image_url: null };

    const html = await response.text();
    const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
    const title = ogTitle
      ? ogTitle.replace(/&amp;/g, '&').replace(/\s*::\s*Behance$/i, '').trim()
      : null;

    return {
      title,
      cover_image_url: ogImage ? ogImage.replace(/&amp;/g, '&') : null,
    };
  } catch {
    return { title: null, cover_image_url: null };
  }
}

const seeds = [
  {
    client_name: 'SEFO',
    project_url: 'https://www.behance.net/gallery/248556979/SEFO-I-Denizli-I-30-Nisan-2026',
    display_order: 1,
  },
  {
    client_name: 'ATİ 242',
    project_url: 'https://www.behance.net/gallery/244596439/AT-242-I-Denizli-I-6-Subat-2026',
    display_order: 2,
  },
  {
    client_name: 'LVBEL C5',
    project_url: 'https://www.behance.net/gallery/244595991/LVBEL-C5-I-Denizli-I-17-Ocak-2026',
    display_order: 3,
  },
  {
    client_name: 'Motive',
    project_url: 'https://www.behance.net/gallery/244595579/Motive-I-Denizli-I-16-Subat-2026',
    display_order: 4,
  },
  {
    client_name: 'Dolu Kadehi Ters Tut',
    project_url: 'https://www.behance.net/gallery/244595227/Dolu-Kadehi-Ters-Tut-I-Denizli-I-15-Subat-2026',
    display_order: 5,
  },
  {
    client_name: 'Bonin',
    project_url: 'https://www.behance.net/gallery/240342987/Bonin-Bakery-Eatery-Yeni-Yl-UEruen-ve-Konsept-Cekimi',
    display_order: 6,
  },
  {
    client_name: 'Luuq Coffee',
    project_url: 'https://www.behance.net/gallery/240340611/Luuq-Coffee-Yeni-Yl-UEruen-ve-Konsept-Cekimi',
    display_order: 7,
  },
  {
    client_name: 'Togg',
    project_url: 'https://www.behance.net/gallery/182895889/TOGG-Katalog-Cekimi',
    display_order: 8,
  },
  {
    client_name: 'CEZA',
    project_url: 'https://www.behance.net/gallery/232742237/CEZA-19-MAYIS-2025-DENZL',
    display_order: 9,
  },
  {
    client_name: 'KIRAÇ',
    project_url: 'https://www.behance.net/gallery/233766331/KIRAC-I-30-AGUSTOS-2025-I-DENZL',
    display_order: 10,
  },
];

for (const seed of seeds) {
  const meta = await fetchBehanceMeta(seed.project_url);
  const payload = {
    title: meta.title,
    client_name: seed.client_name,
    project_url: seed.project_url,
    cover_image_url: meta.cover_image_url,
    display_order: seed.display_order,
    is_active: true,
  };

  const { data: existing } = await supabase
    .from('behance_projects')
    .select('id')
    .eq('project_url', seed.project_url)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from('behance_projects').update(payload).eq('id', existing.id);
    if (error) console.error('Güncelleme hatası:', seed.project_url, error.message);
    else console.log('Güncellendi:', payload.title || seed.client_name);
    continue;
  }

  const { error } = await supabase.from('behance_projects').insert(payload);
  if (error) console.error('Ekleme hatası:', seed.project_url, error.message);
  else console.log('Eklendi:', payload.title || seed.client_name);
}

const { count } = await supabase.from('behance_projects').select('*', { count: 'exact', head: true });
console.log('Toplam behance_projects kaydı:', count ?? 0);
