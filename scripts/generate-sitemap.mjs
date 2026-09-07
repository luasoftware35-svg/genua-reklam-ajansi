import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const site = JSON.parse(readFileSync(resolve(root, 'seo/site.json'), 'utf8'));
const origin = site.siteOrigin.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const configRaw = readFileSync(resolve(root, 'js/supabase-config.js'), 'utf8');
const supabaseUrl = configRaw.match(/url:\s*"([^"]+)"/)?.[1];
const supabaseKey = configRaw.match(/key:\s*"([^"]+)"/)?.[1];

const urls = [
  { loc: '/anasayfa', changefreq: 'weekly', priority: '1.0' },
  { loc: '/denizli-reklam-ajansi', changefreq: 'weekly', priority: '0.95' },
  { loc: '/hakkimizda', changefreq: 'monthly', priority: '0.85' },
  { loc: '/hizmetler', changefreq: 'monthly', priority: '0.9' },
  { loc: '/dijital-reklam', changefreq: 'monthly', priority: '0.9' },
  { loc: '/sosyal-medya', changefreq: 'monthly', priority: '0.9' },
  { loc: '/marka-tasarim', changefreq: 'monthly', priority: '0.9' },
  { loc: '/icerik-uretimi', changefreq: 'monthly', priority: '0.9' },
  { loc: '/seo', changefreq: 'monthly', priority: '0.85' },
  { loc: '/web-tasarim', changefreq: 'monthly', priority: '0.85' },
  { loc: '/projelerimiz', changefreq: 'monthly', priority: '0.8' },
  { loc: '/portfolyo', changefreq: 'weekly', priority: '0.8' },
  { loc: '/vaka-analizi', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog-denizli-reklam-ajansi', changefreq: 'monthly', priority: '0.85' },
  { loc: '/iletisim', changefreq: 'monthly', priority: '0.85' },
  { loc: '/teklif-al', changefreq: 'monthly', priority: '0.9' },
  { loc: '/gizlilik-politikasi', changefreq: 'yearly', priority: '0.4' },
];

try {
  if (supabaseUrl && supabaseKey) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,published_at,updated_at&status=eq.published&order=published_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );
    if (response.ok) {
      const posts = await response.json();
      for (const post of posts) {
        if (!post?.slug) continue;
        const lastmod = (post.updated_at || post.published_at || today).slice(0, 10);
        urls.push({ loc: `/blog/${post.slug}`, changefreq: 'weekly', priority: '0.75', lastmod });
      }
    }
  }
} catch (error) {
  console.warn('Sitemap post fetch skipped:', error.message);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) =>
      `  <url><loc>${origin}${entry.loc}</loc><lastmod>${entry.lastmod || today}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'seo/sitemap.preview.xml'), `${xml}\n`, 'utf8');
console.log(`Sitemap preview generated with ${urls.length} URLs (${today}).`);
