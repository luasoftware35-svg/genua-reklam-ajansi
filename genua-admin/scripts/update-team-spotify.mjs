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

const playlistUrl = 'https://open.spotify.com/playlist/1OQNeKz4vnW9j0G9Cu4BgH';
const oembedUrl = `${playlistUrl}?utm_source=oembed`;

const oembedResponse = await fetch(
  `https://open.spotify.com/oembed?url=${encodeURIComponent(playlistUrl)}`,
);
const oembed = oembedResponse.ok ? await oembedResponse.json() : null;

const payload = {
  team_spotify_eyebrow: 'Ofis Ritmi',
  team_spotify_title: 'Ekibimizin dinledikleri',
  team_spotify_description:
    'Strateji toplantılarından gece yarısı teslimatlarına — Genua ofisinde dönen playlist.',
  team_spotify_url: playlistUrl,
  team_spotify_cover_url: oembed?.thumbnail_url ?? null,
};

const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
if (!existing?.id) {
  console.error('site_settings kaydı bulunamadı.');
  process.exit(1);
}

const { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id);
if (error?.message?.includes('team_spotify')) {
  console.error('Spotify kolonları henüz yok. Önce migration uygulayın:', error.message);
  process.exit(1);
}
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log('Spotify playlist ayarlandı:', oembed?.title?.trim() || 'Genua');
