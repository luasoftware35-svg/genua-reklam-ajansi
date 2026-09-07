const { ORIGIN, STATIC_PAGES, fetchPublishedPosts, postPath } = require('../lib/blog');

function isoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

function urlRow(loc, lastmod, changefreq, priority) {
  return `  <url><loc>${ORIGIN}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

module.exports = async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = STATIC_PAGES.map((page) => urlRow(page.loc, today, page.changefreq, page.priority));

  try {
    const posts = await fetchPublishedPosts();
    for (const post of posts) {
      if (!post?.slug) continue;
      rows.push(
        urlRow(postPath(post.slug), isoDate(post.updated_at || post.published_at), 'weekly', '0.75'),
      );
    }
  } catch (error) {
    console.error('sitemap posts', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  res.status(200).send(xml);
};
