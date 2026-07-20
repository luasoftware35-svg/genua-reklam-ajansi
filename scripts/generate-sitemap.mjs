import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const site = JSON.parse(readFileSync(resolve(root, 'seo/site.json'), 'utf8'));
const origin = site.siteOrigin.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

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
  { loc: '/blog-detay', changefreq: 'monthly', priority: '0.7' },
  { loc: '/iletisim', changefreq: 'monthly', priority: '0.85' },
  { loc: '/teklif-al', changefreq: 'monthly', priority: '0.9' },
  { loc: '/gizlilik-politikasi', changefreq: 'yearly', priority: '0.4' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) =>
      `  <url><loc>${origin}${entry.loc}</loc><lastmod>${today}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'sitemap.xml'), `${xml}\n`, 'utf8');
console.log(`Sitemap generated with ${urls.length} URLs (${today}).`);
