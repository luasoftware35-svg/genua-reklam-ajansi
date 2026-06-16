import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const site = JSON.parse(readFileSync(resolve(root, 'seo/site.json'), 'utf8'));
const origin = site.siteOrigin.replace(/\/$/, '');
const ogPath = site.defaultOgImage.replace(/^\//, '');
const ogImage = site.defaultOgImage.startsWith('http') ? site.defaultOgImage : `${origin}/${ogPath}`;
const favicon = site.favicon;
const faviconAbsolute = favicon.startsWith('http') ? favicon : `${origin}/${favicon.replace(/^\//, '')}`;
const logoPath = site.logo ?? site.favicon;
const logoAbsolute = logoPath.startsWith('http') ? logoPath : `${origin}/${logoPath.replace(/^\//, '')}`;

const pages = {
  'anasayfa.html': {
    title: 'Genua Reklam Ajansı | Dijital Pazarlama & Sosyal Medya Ajansı – Denizli',
    description: 'Denizli merkezli Genua Reklam Ajansı; dijital reklam, sosyal medya yönetimi, marka tasarımı ve içerik üretimi ile markanızı büyütür. Kamu ve kurumsal projelerde deneyimli ekip.',
    keywords: 'dijital reklam ajansı denizli, sosyal medya ajansı, reklam ajansı denizli, dijital pazarlama, google ads yönetimi, meta reklam, marka tasarımı, içerik üretimi, genua reklam ajansı',
    path: '/anasayfa',
    schema: 'home',
  },
  'hakkimizda.html': {
    title: 'Hakkımızda | Genua Reklam Ajansı – Denizli Dijital Ajans',
    description: '2022’den bu yana Denizli merkezli Genua Reklam Ajansı; strateji, kreatif ve performansı bir araya getiren 5 kişilik ekip. Kamu kurumları ve markalarla dijital büyüme projeleri.',
    keywords: 'genua hakkında, denizli reklam ajansı, dijital ajans ekibi, kurumsal reklam ajansı',
    path: '/hakkimizda.html',
    schema: 'about',
  },
  'hizmetler.html': {
    title: 'Hizmetler | Dijital Reklam, Sosyal Medya & Marka Tasarımı – Genua',
    description: 'Dijital reklam, sosyal medya yönetimi, marka tasarımı, içerik üretimi, SEO ve web tasarım hizmetleri. Denizli ve Türkiye geneline kurumsal dijital pazarlama çözümleri.',
    keywords: 'dijital pazarlama hizmetleri, reklam ajansı hizmetleri, sosyal medya yönetimi denizli, marka danışmanlığı',
    path: '/hizmetler.html',
    schema: 'services',
  },
  'dijital-reklam.html': {
    title: 'Dijital Reklam Yönetimi | Google Ads & Meta Ads – Genua Denizli',
    description: 'Google Ads, Meta Ads ve LinkedIn reklam yönetimi ile hedef kitlenize ulaşın. Genua; performans odaklı medya planlama, kreatif üretim ve dönüşüm optimizasyonu sunar.',
    keywords: 'google ads yönetimi denizli, meta reklam ajansı, dijital reklam yönetimi, performans pazarlama, facebook instagram reklam',
    path: '/dijital-reklam.html',
    schema: 'service',
    serviceName: 'Dijital Reklam Yönetimi',
  },
  'sosyal-medya.html': {
    title: 'Sosyal Medya Yönetimi | Kurumsal Sosyal Medya Ajansı – Genua',
    description: 'Kurumsal sosyal medya yönetimi, içerik takvimi, Reels üretimi, topluluk yönetimi ve aylık performans raporu. Markanızı sosyal medyada tutarlı ve güçlü konumlandırın.',
    keywords: 'sosyal medya yönetimi denizli, kurumsal sosyal medya, instagram yönetimi, reels içerik üretimi, sosyal medya ajansı',
    path: '/sosyal-medya.html',
    schema: 'service',
    serviceName: 'Sosyal Medya Yönetimi',
  },
  'marka-tasarim.html': {
    title: 'Marka Tasarımı & Kurumsal Kimlik | Genua Reklam Ajansı',
    description: 'Logo tasarımı, kurumsal kimlik, brand book, renk ve tipografi sistemi ile markanızı profesyonel bir görsel dile taşıyoruz. Denizli ve Türkiye geneli marka danışmanlığı.',
    keywords: 'marka tasarımı denizli, kurumsal kimlik tasarımı, logo tasarım ajansı, brand book, marka danışmanlığı',
    path: '/marka-tasarim.html',
    schema: 'service',
    serviceName: 'Marka Tasarımı',
  },
  'icerik-uretimi.html': {
    title: 'İçerik Üretimi | Video, Fotoğraf & Reklam Kreatifi – Genua',
    description: 'Fotoğraf, video, motion grafik ve sosyal medya kreatifleri ile markanız için dikkat çeken içerikler üretiyoruz. Kampanya, lansman ve kurumsal içerik çözümleri.',
    keywords: 'içerik üretimi ajansı, video prodüksiyon denizli, reklam kreatifi, sosyal medya içerik üretimi, fotoğraf çekimi',
    path: '/icerik-uretimi.html',
    schema: 'service',
    serviceName: 'İçerik Üretimi',
  },
  'projelerimiz.html': {
    title: 'Projelerimiz & Referanslar | Genua Reklam Ajansı – Denizli',
    description: 'Kamu kurumları ve özel sektör markalarıyla yürüttüğümüz dijital reklam, sosyal medya, marka ve web projeleri. Genua müşteri portföyünü keşfedin.',
    keywords: 'reklam ajansı referansları, dijital ajans projeleri, kamu dijital projeler, denizli ajans referansları',
    path: '/projelerimiz.html',
    schema: 'webpage',
  },
  'portfolyo.html': {
    title: 'Portföy | Dijital Reklam & Sosyal Medya Projeleri – Genua',
    description: 'Dijital reklam kampanyaları, sosyal medya yönetimi, marka tasarımı ve web projelerinden seçilmiş Genua portföy çalışmaları.',
    keywords: 'dijital ajans portföy, reklam kampanyası örnekleri, sosyal medya case study, marka tasarım portföy',
    path: '/portfolyo.html',
    schema: 'webpage',
  },
  'blog.html': {
    title: 'Blog | Dijital Pazarlama, SEO & Sosyal Medya Rehberleri – Genua',
    description: 'Dijital pazarlama, sosyal medya yönetimi, reklam optimizasyonu, SEO ve marka stratejisi üzerine uygulanabilir ajans notları ve rehberler.',
    keywords: 'dijital pazarlama blog, sosyal medya ipuçları, reklam yönetimi rehberi, seo içerikleri',
    path: '/blog.html',
    schema: 'webpage',
  },
  'blog-detay.html': {
    title: '2026 Performans Pazarlama Planı | Genua Reklam Ajansı Blog',
    description: 'Kurumsal markalar için 2026 performans pazarlama planı: medya bütçesi, içerik üretimi, landing page optimizasyonu ve ölçümleme çerçevesi.',
    keywords: 'performans pazarlama, dijital reklam stratejisi 2026, medya planlama, dönüşüm optimizasyonu',
    path: '/blog-detay.html',
    schema: 'article',
    articleTitle: '2026’da kurumsal markalar için performans pazarlama nasıl planlanmalı?',
  },
  'vaka-analizi.html': {
    title: 'Nova Tower Vaka Analizi | Dijital Reklam Case Study – Genua',
    description: 'Nova Tower dijital reklam ve web dönüşüm projesi vaka analizi. Strateji, uygulama süreci ve elde edilen performans sonuçları.',
    keywords: 'vaka analizi, dijital reklam case study, web dönüşüm optimizasyonu, reklam ajansı başarı hikayesi',
    path: '/vaka-analizi.html',
    schema: 'webpage',
  },
  'iletisim.html': {
    title: 'İletişim | Genua Reklam Ajansı – Denizli Dijital Ajans',
    description: 'Genua Reklam Ajansı ile iletişime geçin. Dijital pazarlama, sosyal medya, marka tasarımı ve reklam yönetimi için bize ulaşın. Denizli, Türkiye.',
    keywords: 'genua iletişim, denizli reklam ajansı telefon, dijital ajans iletişim, reklam ajansı email',
    path: '/iletisim.html',
    schema: 'contact',
  },
  'teklif-al.html': {
    title: 'Teklif Al | Ücretsiz Dijital Pazarlama Teklifi – Genua',
    description: 'Dijital reklam, sosyal medya yönetimi, marka tasarımı ve içerik üretimi için Genua’dan hızlı teklif alın. Projenizi anlatın, size özel plan oluşturalım.',
    keywords: 'dijital pazarlama teklifi, reklam ajansı teklif al, sosyal medya teklif, denizli ajans fiyat',
    path: '/teklif-al.html',
    schema: 'webpage',
  },
  'tesekkurler.html': {
    title: 'Teşekkürler | Genua Reklam Ajansı',
    description: 'Teklif talebiniz Genua Reklam Ajansı ekibine ulaştı. En kısa sürede sizinle iletişime geçeceğiz.',
    keywords: 'genua teşekkürler',
    path: '/tesekkurler.html',
    robots: 'noindex, nofollow',
    schema: 'none',
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function organizationSchema() {
  const org = site.organization;
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    name: org.legalName,
    url: origin,
    logo: logoAbsolute,
    image: ogImage,
    email: org.email,
    telephone: org.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: org.addressLocality,
      addressRegion: org.addressRegion,
      addressCountry: org.addressCountry,
    },
    areaServed: ['Denizli', 'Türkiye'],
    sameAs: [org.instagram, org.linkedin, org.behance].filter(Boolean),
    description: 'Denizli merkezli dijital reklam, sosyal medya ve marka tasarım ajansı.',
  };
}

function buildSchema(page, config) {
  const org = organizationSchema();

  if (config.schema === 'home') {
    return [
      org,
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: site.siteName,
        url: origin,
        inLanguage: 'tr-TR',
        publisher: { '@type': 'Organization', name: site.siteName, url: origin },
      },
    ];
  }

  if (config.schema === 'about') {
    return [org, { '@context': 'https://schema.org', '@type': 'AboutPage', name: config.title, url: `${origin}${config.path}`, description: config.description }];
  }

  if (config.schema === 'contact') {
    return [org, { '@context': 'https://schema.org', '@type': 'ContactPage', name: config.title, url: `${origin}${config.path}`, description: config.description }];
  }

  if (config.schema === 'service') {
    return [
      org,
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: config.serviceName,
        provider: { '@type': 'Organization', name: site.siteName, url: origin },
        areaServed: 'Türkiye',
        url: `${origin}${config.path}`,
        description: config.description,
      },
    ];
  }

  if (config.schema === 'article') {
    return [
      org,
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: config.articleTitle,
        description: config.description,
        author: { '@type': 'Organization', name: site.siteName },
        publisher: { '@type': 'Organization', name: site.siteName, logo: { '@type': 'ImageObject', url: faviconAbsolute } },
        mainEntityOfPage: `${origin}${config.path}`,
        inLanguage: 'tr-TR',
      },
    ];
  }

  if (config.schema === 'services') {
    return [
      org,
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Genua Dijital Pazarlama Hizmetleri',
        itemListElement: [
          'Dijital Reklam Yönetimi',
          'Sosyal Medya Yönetimi',
          'Marka Tasarımı',
          'İçerik Üretimi',
          'SEO & İçerik Pazarlama',
          'Web Tasarım & Geliştirme',
        ].map((name, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@type': 'Service', name, provider: { '@type': 'Organization', name: site.siteName } },
        })),
      },
    ];
  }

  if (config.schema === 'none') return [];
  return [org, { '@context': 'https://schema.org', '@type': 'WebPage', name: config.title, url: `${origin}${config.path}`, description: config.description }];
}

function buildHead(page, config) {
  const canonical = `${origin}${config.path === '/' ? '/' : config.path}`;
  const robots = config.robots ?? 'index, follow, max-image-preview:large';
  const schemas = buildSchema(page, config);
  const schemaBlock = schemas.length
    ? `\n  <script type="application/ld+json">${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)}</script>`
    : '';

  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title)}</title>
  <meta name="description" content="${escapeHtml(config.description)}">
  <meta name="keywords" content="${escapeHtml(config.keywords)}">
  <meta name="author" content="${escapeHtml(site.siteName)}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#dbff2b">
  <meta name="geo.region" content="TR-20">
  <meta name="geo.placename" content="Denizli">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${favicon}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${favicon}">
  <meta property="og:locale" content="${site.locale}">
  <meta property="og:site_name" content="${escapeHtml(site.siteName)}">
  <meta property="og:type" content="${config.schema === 'article' ? 'article' : 'website'}">
  <meta property="og:title" content="${escapeHtml(config.title)}">
  <meta property="og:description" content="${escapeHtml(config.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(config.title)}">
  <meta name="twitter:description" content="${escapeHtml(config.description)}">
  <meta name="twitter:image" content="${ogImage}">${schemaBlock}`;
}

for (const file of Object.keys(pages)) {
  const filePath = resolve(root, file);
  let html = readFileSync(filePath, 'utf8');
  html = html.replace(/<head>\s*[\s\S]*?(?=<link rel="preconnect")/, `<head>\n${buildHead(file, pages[file])}\n  `);
  writeFileSync(filePath, html, 'utf8');
  console.log('SEO updated:', file);
}

console.log('Done. Site origin:', origin);
