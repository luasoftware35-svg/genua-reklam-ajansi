import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const adminBase = (env.NEXT_PUBLIC_SITE_URL || 'https://genuadigital.com').replace(/\/$/, '');

async function fetchMeta(reelUrl) {
  const response = await fetch(`${adminBase}/api/reel-meta?url=${encodeURIComponent(reelUrl)}`);
  if (!response.ok) throw new Error(`Meta alınamadı (${response.status})`);
  return response.json();
}

const { data: reels, error } = await supabase
  .from('instagram_reels')
  .select('id,title,reel_url,thumbnail_url')
  .order('display_order', { ascending: true });

if (error) {
  console.error(error.message);
  process.exit(1);
}

for (const reel of reels ?? []) {
  if (reel.thumbnail_url?.trim()) {
    console.log(`• ${reel.title || reel.reel_url} (zaten var)`);
    continue;
  }

  const meta = await fetchMeta(reel.reel_url);
  if (!meta?.thumbnail_url) {
    console.warn(`! Kapak bulunamadı: ${reel.reel_url}`);
    continue;
  }

  const { error: updateError } = await supabase
    .from('instagram_reels')
    .update({
      thumbnail_url: meta.thumbnail_url,
      title: reel.title?.trim() ? reel.title : meta.title,
    })
    .eq('id', reel.id);

  if (updateError) {
    console.error(`! Güncellenemedi (${reel.id}):`, updateError.message);
    continue;
  }

  console.log(`✓ ${reel.title || meta.title || reel.reel_url}`);
}
