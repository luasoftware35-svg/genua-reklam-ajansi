type ReelMeta = {
  title: string | null;
  thumbnail_url: string | null;
};

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

export async function fetchInstagramReelMeta(reelUrl: string): Promise<ReelMeta> {
  const normalized = normalizeReelUrl(reelUrl);
  if (!normalized) return { title: null, thumbnail_url: null };

  const token = process.env.META_OEMBED_ACCESS_TOKEN?.trim();
  const endpoints = token
    ? [`https://graph.facebook.com/v21.0/instagram_oembed?url=${encodeURIComponent(normalized)}&access_token=${encodeURIComponent(token)}`]
    : [];

  endpoints.push(`https://noembed.com/embed?url=${encodeURIComponent(normalized)}`);

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
