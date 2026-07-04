import { randomUUID } from 'crypto';
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

const adminBase = 'https://genuadigital.com';

function isExternalInstagram(url) {
  return /instagram\.|fbcdn\.net/i.test(String(url || ''));
}

async function resolveThumbnail(reelUrl, currentUrl) {
  if (currentUrl && !isExternalInstagram(currentUrl)) return currentUrl;

  const response = await fetch(`${adminBase}/api/reel-meta?url=${encodeURIComponent(reelUrl)}`);
  if (!response.ok) return currentUrl;
  const meta = await response.json();
  return meta.thumbnail_url || currentUrl;
}

async function mirrorToStorage(sourceUrl) {
  const response = await fetch(sourceUrl);
  if (!response.ok) return sourceUrl;

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) return sourceUrl;

  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const fileName = `instagram-reels/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  const { error } = await supabase.storage.from('genua-media').upload(fileName, buffer, {
    contentType,
    upsert: true,
  });

  if (error) return sourceUrl;

  const { data } = supabase.storage.from('genua-media').getPublicUrl(fileName);
  return data.publicUrl;
}

const { data: reels, error } = await supabase
  .from('instagram_reels')
  .select('id,title,reel_url,thumbnail_url')
  .eq('is_active', true)
  .order('display_order');

if (error) {
  console.error(error.message);
  process.exit(1);
}

for (const reel of reels ?? []) {
  if (!isExternalInstagram(reel.thumbnail_url)) {
    console.log(`• ${reel.title} (zaten mirror)`);
    continue;
  }

  const source = await resolveThumbnail(reel.reel_url, reel.thumbnail_url);
  if (!source) {
    console.warn(`! Kapak yok: ${reel.title}`);
    continue;
  }

  const mirrored = await mirrorToStorage(source);
  const { error: updateError } = await supabase
    .from('instagram_reels')
    .update({ thumbnail_url: mirrored })
    .eq('id', reel.id);

  if (updateError) {
    console.error(`! ${reel.title}:`, updateError.message);
    continue;
  }

  console.log(`✓ ${reel.title}`);
}
