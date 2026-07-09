import { fetchInstagramReelMeta } from '@/lib/instagram-oembed';

const INSTAGRAM_BOT_UA =
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

export async function GET(request: Request) {
  const reelUrl = new URL(request.url).searchParams.get('reel')?.trim();
  if (!reelUrl) {
    return new Response('reel gerekli', { status: 400 });
  }

  const meta = await fetchInstagramReelMeta(reelUrl);
  if (!meta.thumbnail_url) {
    return new Response('Kapak bulunamadı', { status: 404 });
  }

  const imageResponse = await fetch(meta.thumbnail_url, {
    headers: {
      'User-Agent': INSTAGRAM_BOT_UA,
      Accept: 'image/*',
    },
    redirect: 'follow',
    next: { revalidate: 0 },
  });

  if (!imageResponse.ok || !imageResponse.body) {
    return new Response('Kapak yüklenemedi', { status: 502 });
  }

  const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
