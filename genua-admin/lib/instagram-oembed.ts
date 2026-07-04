import { randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

type ReelMeta = {
  title: string | null;
  thumbnail_url: string | null;
};

const INSTAGRAM_BOT_UA =
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

function normalizeReelUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!/instagram\.com$/i.test(parsed.hostname.replace(/^www\./, ''))) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function decodeMetaValue(value: string) {
  return value.replace(/&amp;/g, '&').replace(/\\u0026/g, '&').trim();
}

async function fetchReelMetaFromHtml(reelUrl: string): Promise<ReelMeta> {
  try {
    const response = await fetch(reelUrl, {
      headers: {
        'User-Agent': INSTAGRAM_BOT_UA,
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      next: { revalidate: 0 },
    });
    if (!response.ok) return { title: null, thumbnail_url: null };

    const html = await response.text();
    const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];

    return {
      title: ogTitle ? decodeMetaValue(ogTitle) : null,
      thumbnail_url: ogImage ? decodeMetaValue(ogImage) : null,
    };
  } catch {
    return { title: null, thumbnail_url: null };
  }
}

async function fetchReelMetaFromOembed(reelUrl: string): Promise<ReelMeta> {
  const token = process.env.META_OEMBED_ACCESS_TOKEN?.trim();
  const endpoints = token
    ? [`https://graph.facebook.com/v21.0/instagram_oembed?url=${encodeURIComponent(reelUrl)}&access_token=${encodeURIComponent(token)}`]
    : [];

  endpoints.push(`https://noembed.com/embed?url=${encodeURIComponent(reelUrl)}`);

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { next: { revalidate: 0 } });
      if (!response.ok) continue;
      const data = await response.json();
      if (data.error) continue;

      return {
        title: typeof data.title === 'string' ? data.title.trim() : null,
        thumbnail_url:
          typeof data.thumbnail_url === 'string'
            ? data.thumbnail_url
            : typeof data.thumbnail === 'string'
              ? data.thumbnail
              : null,
      };
    } catch {
      continue;
    }
  }

  return { title: null, thumbnail_url: null };
}

export async function mirrorInstagramThumbnail(sourceUrl: string): Promise<string | null> {
  try {
    const response = await fetch(sourceUrl, { next: { revalidate: 0 } });
    if (!response.ok) return sourceUrl;

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return sourceUrl;

    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const fileName = `instagram-reels/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await response.arrayBuffer());
    const admin = createAdminClient();
    const { error } = await admin.storage.from('genua-media').upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

    if (error) return sourceUrl;

    const { data } = admin.storage.from('genua-media').getPublicUrl(fileName);
    return data.publicUrl;
  } catch {
    return sourceUrl;
  }
}

export async function fetchInstagramReelMeta(reelUrl: string): Promise<ReelMeta> {
  const normalized = normalizeReelUrl(reelUrl);
  if (!normalized) return { title: null, thumbnail_url: null };

  const htmlMeta = await fetchReelMetaFromHtml(normalized);
  if (htmlMeta.thumbnail_url) return htmlMeta;

  const oembedMeta = await fetchReelMetaFromOembed(normalized);
  if (oembedMeta.thumbnail_url || oembedMeta.title) {
    return {
      title: oembedMeta.title || htmlMeta.title,
      thumbnail_url: oembedMeta.thumbnail_url || htmlMeta.thumbnail_url,
    };
  }

  return htmlMeta;
}
