import { NextResponse } from 'next/server';
import { fetchInstagramReelMeta } from '@/lib/instagram-oembed';

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')?.trim();
  if (!url) {
    return NextResponse.json({ error: 'url gerekli' }, { status: 400 });
  }

  const meta = await fetchInstagramReelMeta(url);
  return NextResponse.json(meta, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
