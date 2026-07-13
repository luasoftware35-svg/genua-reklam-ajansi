type BehanceMeta = {
  title: string | null;
  cover_image_url: string | null;
};

const BEHANCE_BOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

function decodeMetaValue(value: string) {
  return value.replace(/&amp;/g, '&').replace(/\\u0026/g, '&').trim();
}

export function normalizeBehanceProjectUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!/behance\.net$/i.test(parsed.hostname.replace(/^www\./, ''))) return null;
    const match = parsed.pathname.match(/\/gallery\/(\d+)\//);
    if (!match) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function fetchBehanceProjectMeta(projectUrl: string): Promise<BehanceMeta> {
  const normalized = normalizeBehanceProjectUrl(projectUrl);
  if (!normalized) return { title: null, cover_image_url: null };

  try {
    const response = await fetch(normalized, {
      headers: {
        'User-Agent': BEHANCE_BOT_UA,
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      next: { revalidate: 0 },
    });
    if (!response.ok) return { title: null, cover_image_url: null };

    const html = await response.text();
    const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];

    const title = ogTitle ? decodeMetaValue(ogTitle).replace(/\s*::\s*Behance$/i, '').trim() : null;

    return {
      title: title || null,
      cover_image_url: ogImage ? decodeMetaValue(ogImage) : null,
    };
  } catch {
    return { title: null, cover_image_url: null };
  }
}
