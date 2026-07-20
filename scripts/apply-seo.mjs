import { readFileSync, writeFileSync } from 'node:fs';
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
    title: 'Denizli Reklam Ajansı | Dijital Pazarlama & Sosyal Medya – Genua',
    description:
      'Denizli reklam ajansı Genua; Google Ads, Meta reklam, sosyal medya yönetimi, marka tasarımı ve web projelerinde Denizli ve Türkiye geneline hizmet verir. Ücretsiz teklif alın.',
    keywords:
      'denizli reklam ajansı, reklam ajansı denizli, dijital reklam ajansı denizli, sosyal medya ajansı denizli, dijital pazarlama denizli, genua reklam ajansı',
    path: '/anasayfa',
    schema: 'home',
    breadcrumbs: [{ name: 'Ana Sayfa', path: '/anasayfa' }],
  },
  'denizli-reklam-ajansi.html': {
    title: 'Denizli Reklam Ajansı | Dijital Reklam & Sosyal Medya – Genua',
    description:
      'Denizli reklam ajansı arayan markalar için strateji, kreatif ve performans odaklı dijital pazarlama. Google Ads, Meta, sosyal medya, marka ve web hizmetleri. Merkezefendi ofis.',
    keywords:
      'denizli reklam ajansı, denizli dijital ajans, denizli reklam firması, denizli sosyal medya ajansı, google ads denizli',
    path: '/denizli-reklam-ajansi',
    schema: 'local-landing',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Denizli Reklam Ajansı', path: '/denizli-reklam-ajansi' },
    ],
    faq: [
      {
        question: 'Denizli reklam ajansı seçerken nelere bakmalıyım?',
        answer:
          'Referans projeler, ölçülebilir performans raporlaması, hizmet kapsamının bütüncül olması ve iletişim sürecinin şeffaflığı kritik kriterlerdir. Genua bu alanlarda Denizli merkezli ekip ve kamu-kurumsal referanslarıyla hizmet verir.',
      },
      {
        question: 'Genua hangi dijital pazarlama hizmetlerini sunuyor?',
        answer:
          'Dijital reklam (Google Ads, Meta Ads), sosyal medya yönetimi, marka tasarımı, içerik üretimi, SEO ve kurumsal web tasarım hizmetleri sunuyoruz.',
      },
      {
        question: 'Denizli dışındaki markalarla da çalışıyor musunuz?',
        answer: 'Evet. Merkez ofisimiz Denizli Merkezefendi\'de olmakla birlikte Türkiye genelinde uzaktan proje yönetimi ve saha prodüksiyon desteği sağlıyoruz.',
      },
      {
        question: 'Teklif süreci nasıl işliyor?',
        answer:
          'Teklif Al formu veya telefon ile projenizi paylaştığınızda hedeflerinize göre medya planı, kreatif kapsamı ve zaman çizelgesi içeren özel bir teklif hazırlıyoruz.',
      },
    ],
  },
  'hakkimizda.html': {
    title: 'Hakkımızda | Denizli Reklam Ajansı – Genua',
    description:
      '2022\'den bu yana Denizli merkezli Genua Reklam Ajansı; strateji, kreatif ve performansı bir araya getiren 5 kişilik ekip. Kamu kurumları ve markalarla dijital büyüme projeleri.',
    keywords: 'genua hakkında, denizli reklam ajansı, dijital ajans ekibi, kurumsal reklam ajansı denizli',
    path: '/hakkimizda',
    schema: 'about',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hakkımızda', path: '/hakkimizda' },
    ],
  },
  'hizmetler.html': {
    title: 'Hizmetler | Denizli Reklam Ajansı – Dijital Pazarlama – Genua',
    description:
      'Denizli reklam ajansı Genua hizmetleri: dijital reklam, sosyal medya yönetimi, marka tasarımı, içerik üretimi, SEO ve web tasarım. Kurumsal dijital pazarlama çözümleri.',
    keywords: 'denizli reklam ajansı hizmetleri, dijital pazarlama hizmetleri, sosyal medya yönetimi denizli, marka danışmanlığı',
    path: '/hizmetler',
    schema: 'services',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
    ],
  },
  'dijital-reklam.html': {
    title: 'Dijital Reklam Yönetimi | Google Ads & Meta Ads – Genua Denizli',
    description:
      'Denizli reklam ajansı Genua ile Google Ads, Meta Ads ve LinkedIn reklam yönetimi. Performans odaklı medya planlama, kreatif üretim ve dönüşüm optimizasyonu.',
    keywords: 'google ads yönetimi denizli, meta reklam ajansı denizli, dijital reklam yönetimi, performans pazarlama denizli',
    path: '/dijital-reklam',
    schema: 'service',
    serviceName: 'Dijital Reklam Yönetimi',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'Dijital Reklam', path: '/dijital-reklam' },
    ],
  },
  'sosyal-medya.html': {
    title: 'Sosyal Medya Yönetimi | Denizli Kurumsal Ajans – Genua',
    description:
      'Denizli merkezli kurumsal sosyal medya yönetimi, içerik takvimi, Reels üretimi ve topluluk yönetimi. Markanızı sosyal medyada tutarlı konumlandırın.',
    keywords: 'sosyal medya yönetimi denizli, kurumsal sosyal medya, instagram yönetimi denizli, reels içerik üretimi',
    path: '/sosyal-medya',
    schema: 'service',
    serviceName: 'Sosyal Medya Yönetimi',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'Sosyal Medya', path: '/sosyal-medya' },
    ],
  },
  'marka-tasarim.html': {
    title: 'Marka Tasarımı & Kurumsal Kimlik | Denizli – Genua',
    description:
      'Denizli reklam ajansı Genua ile logo tasarımı, kurumsal kimlik, brand book ve görsel sistem. Markanızı profesyonel bir dile taşıyoruz.',
    keywords: 'marka tasarımı denizli, kurumsal kimlik tasarımı, logo tasarım ajansı denizli, brand book',
    path: '/marka-tasarim',
    schema: 'service',
    serviceName: 'Marka Tasarımı',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'Marka Tasarımı', path: '/marka-tasarim' },
    ],
  },
  'icerik-uretimi.html': {
    title: 'İçerik Üretimi | Video, Fotoğraf & Reklam Kreatifi – Genua Denizli',
    description:
      'Denizli stüdyo ve saha prodüksiyon ile fotoğraf, video, motion grafik ve sosyal medya kreatifleri. Kampanya ve kurumsal içerik üretimi.',
    keywords: 'içerik üretimi ajansı denizli, video prodüksiyon denizli, reklam kreatifi, fotoğraf çekimi',
    path: '/icerik-uretimi',
    schema: 'service',
    serviceName: 'İçerik Üretimi',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'İçerik Üretimi', path: '/icerik-uretimi' },
    ],
  },
  'seo.html': {
    title: 'SEO & İçerik Pazarlama | Denizli Organik Görünürlük – Genua',
    description:
      'Denizli reklam ajansı Genua ile teknik SEO, içerik kümeleri ve arama niyeti odaklı optimizasyon. Organik trafiğinizi sürdürülebilir biçimde artırın.',
    keywords: 'seo ajansı denizli, teknik seo denizli, içerik pazarlama, organik trafik, denizli reklam ajansı seo',
    path: '/seo',
    schema: 'service',
    serviceName: 'SEO & İçerik Pazarlama',
    ogImage: '/varlıklar/resimler/hizmetler/seo.jpg',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'SEO', path: '/seo' },
    ],
  },
  'web-tasarim.html': {
    title: 'Web Tasarım & Geliştirme | Kurumsal Site – Genua Denizli',
    description:
      'Denizli merkezli kurumsal web tasarım: hızlı, erişilebilir, SEO uyumlu ve dönüşüm odaklı arayüzler. UI/UX, geliştirme ve analitik entegrasyonu.',
    keywords: 'web tasarım denizli, kurumsal web sitesi, ui ux tasarım denizli, seo uyumlu web sitesi',
    path: '/web-tasarim',
    schema: 'service',
    serviceName: 'Web Tasarım & Geliştirme',
    ogImage: '/varlıklar/resimler/hizmetler/web-tasarim.jpg',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: 'Web Tasarım', path: '/web-tasarim' },
    ],
  },
  'projelerimiz.html': {
    title: 'Projelerimiz & Referanslar | Denizli Reklam Ajansı – Genua',
    description:
      'Denizli reklam ajansı Genua referansları: kamu kurumları ve özel sektör markalarıyla dijital reklam, sosyal medya, marka ve web projeleri.',
    keywords: 'reklam ajansı referansları denizli, dijital ajans projeleri, kamu dijital projeler, denizli ajans referansları',
    path: '/projelerimiz',
    schema: 'webpage',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Projelerimiz', path: '/projelerimiz' },
    ],
  },
  'portfolyo.html': {
    title: 'Portföy | Dijital Reklam & Sosyal Medya – Genua Denizli',
    description:
      'Genua Denizli reklam ajansı portföyü: dijital reklam kampanyaları, sosyal medya yönetimi, marka tasarımı ve web projelerinden seçkiler.',
    keywords: 'dijital ajans portföy denizli, reklam kampanyası örnekleri, sosyal medya case study',
    path: '/portfolyo',
    schema: 'webpage',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Portföy', path: '/portfolyo' },
    ],
  },
  'blog.html': {
    title: 'Blog | Denizli Dijital Pazarlama Rehberleri – Genua',
    description:
      'Denizli reklam ajansı Genua blog: dijital pazarlama, sosyal medya, reklam optimizasyonu, SEO ve marka stratejisi üzerine uygulanabilir rehberler.',
    keywords: 'dijital pazarlama blog, denizli reklam ajansı blog, sosyal medya ipuçları, seo içerikleri',
    path: '/blog',
    schema: 'webpage',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Blog', path: '/blog' },
    ],
  },
  'blog-denizli-reklam-ajansi.html': {
    title: 'Denizli Reklam Ajansı Seçerken 7 Kriter | Genua Blog',
    description:
      'Denizli reklam ajansı seçerken dikkat edilmesi gereken 7 kriter: referans, performans raporlama, hizmet kapsamı, ekip, süreç, bütçe ve iletişim.',
    keywords: 'denizli reklam ajansı seçimi, denizli dijital ajans, reklam ajansı nasıl seçilir, denizli reklam firması',
    path: '/blog-denizli-reklam-ajansi',
    schema: 'article',
    articleTitle: 'Denizli reklam ajansı seçerken dikkat edilmesi gereken 7 kriter',
    ogImage: '/varlıklar/resimler/blog/google-ads.jpg',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Blog', path: '/blog' },
      { name: 'Denizli Reklam Ajansı Seçimi', path: '/blog-denizli-reklam-ajansi' },
    ],
  },
  'blog-detay.html': {
    title: '2026 Performans Pazarlama Planı | Genua Reklam Ajansı Blog',
    description:
      'Kurumsal markalar için 2026 performans pazarlama planı: medya bütçesi, içerik üretimi, landing page optimizasyonu ve ölçümleme çerçevesi.',
    keywords: 'performans pazarlama, dijital reklam stratejisi 2026, medya planlama, dönüşüm optimizasyonu',
    path: '/blog-detay',
    schema: 'article',
    articleTitle: '2026\'da kurumsal markalar için performans pazarlama nasıl planlanmalı?',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Blog', path: '/blog' },
      { name: 'Performans Pazarlama', path: '/blog-detay' },
    ],
  },
  'vaka-analizi.html': {
    title: 'Nova Tower Vaka Analizi | Dijital Reklam Case Study – Genua',
    description: 'Nova Tower dijital reklam ve web dönüşüm projesi vaka analizi. Strateji, uygulama süreci ve elde edilen performans sonuçları.',
    keywords: 'vaka analizi, dijital reklam case study, web dönüşüm optimizasyonu',
    path: '/vaka-analizi',
    schema: 'webpage',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Vaka Analizi', path: '/vaka-analizi' },
    ],
  },
  'iletisim.html': {
    title: 'İletişim | Denizli Reklam Ajansı – Genua',
    description:
      'Denizli reklam ajansı Genua ile iletişime geçin. Merkezefendi ofis, telefon 0551 124 53 06, hello@genuadigital.com. Dijital pazarlama teklifi alın.',
    keywords: 'genua iletişim, denizli reklam ajansı telefon, denizli dijital ajans adres, reklam ajansı email',
    path: '/iletisim',
    schema: 'contact',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'İletişim', path: '/iletisim' },
    ],
  },
  'teklif-al.html': {
    title: 'Teklif Al | Denizli Reklam Ajansı – Ücretsiz Teklif – Genua',
    description:
      'Denizli reklam ajansı Genua\'dan dijital reklam, sosyal medya, marka tasarımı ve içerik üretimi için hızlı teklif alın. Projenize özel plan oluşturalım.',
    keywords: 'dijital pazarlama teklifi denizli, reklam ajansı teklif al, denizli ajans fiyat',
    path: '/teklif-al',
    schema: 'webpage',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Teklif Al', path: '/teklif-al' },
    ],
  },
  'gizlilik-politikasi.html': {
    title: 'Gizlilik Politikası | Genua Reklam Ajansı',
    description: 'Genua Reklam Ajansı gizlilik politikası ve kişisel verilerin korunması hakkında bilgilendirme.',
    keywords: 'genua gizlilik politikası',
    path: '/gizlilik-politikasi',
    schema: 'webpage',
    robots: 'index, follow',
    breadcrumbs: [
      { name: 'Ana Sayfa', path: '/anasayfa' },
      { name: 'Gizlilik Politikası', path: '/gizlilik-politikasi' },
    ],
  },
  'tesekkurler.html': {
    title: 'Teşekkürler | Genua Reklam Ajansı',
    description: 'Teklif talebiniz Genua Reklam Ajansı ekibine ulaştı. En kısa sürede sizinle iletişime geçeceğiz.',
    keywords: 'genua teşekkürler',
    path: '/tesekkurler',
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

function resolveOgImage(config) {
  if (!config.ogImage) return ogImage;
  if (config.ogImage.startsWith('http')) return config.ogImage;
  return `${origin}/${config.ogImage.replace(/^\//, '')}`;
}

function localBusinessSchema() {
  const org = site.organization;
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'AdvertisingAgency'],
    '@id': `${origin}/#localbusiness`,
    name: org.legalName,
    alternateName: org.alternateName,
    url: origin,
    logo: logoAbsolute,
    image: [ogImage, logoAbsolute],
    email: org.email,
    telephone: org.phone,
    priceRange: org.priceRange,
    foundingDate: org.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.streetAddress,
      postalCode: org.postalCode,
      addressLocality: org.addressLocality,
      addressRegion: org.addressRegion,
      addressCountry: org.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: org.latitude,
      longitude: org.longitude,
    },
    openingHoursSpecification: org.openingHours.map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.dayOfWeek,
      opens: entry.opens,
      closes: entry.closes,
    })),
    areaServed: [
      { '@type': 'City', name: 'Denizli' },
      { '@type': 'AdministrativeArea', name: 'Denizli' },
      { '@type': 'Country', name: 'Türkiye' },
    ],
    sameAs: [org.instagram, org.linkedin, org.behance].filter(Boolean),
    hasMap: org.googleMapsUrl,
    description:
      'Denizli merkezli reklam ajansı; dijital reklam, sosyal medya yönetimi, marka tasarımı, içerik üretimi, SEO ve web tasarım hizmetleri.',
  };
}

function breadcrumbSchema(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

function faqSchema(faq) {
  if (!faq?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };
}

function buildSchema(page, config) {
  const schemas = [localBusinessSchema()];

  const crumbs = breadcrumbSchema(config.breadcrumbs);
  if (crumbs) schemas.push(crumbs);

  const faq = faqSchema(config.faq);
  if (faq) schemas.push(faq);

  if (config.schema === 'home') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.siteName,
      url: origin,
      inLanguage: 'tr-TR',
      publisher: { '@type': 'Organization', name: site.siteName, url: origin },
    });
    return schemas;
  }

  if (config.schema === 'about') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: config.title,
      url: `${origin}${config.path}`,
      description: config.description,
    });
    return schemas;
  }

  if (config.schema === 'contact') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: config.title,
      url: `${origin}${config.path}`,
      description: config.description,
    });
    return schemas;
  }

  if (config.schema === 'local-landing') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${origin}${config.path}#webpage`,
      name: config.title,
      url: `${origin}${config.path}`,
      description: config.description,
      about: {
        '@type': 'Thing',
        name: 'Denizli reklam ajansı',
      },
      isPartOf: { '@type': 'WebSite', name: site.siteName, url: origin },
    });
    return schemas;
  }

  if (config.schema === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: config.serviceName,
      provider: { '@type': 'LocalBusiness', name: site.siteName, url: origin },
      areaServed: [
        { '@type': 'City', name: 'Denizli' },
        { '@type': 'Country', name: 'Türkiye' },
      ],
      url: `${origin}${config.path}`,
      description: config.description,
    });
    return schemas;
  }

  if (config.schema === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.articleTitle,
      description: config.description,
      author: { '@type': 'Organization', name: site.siteName },
      publisher: {
        '@type': 'Organization',
        name: site.siteName,
        logo: { '@type': 'ImageObject', url: logoAbsolute },
      },
      mainEntityOfPage: `${origin}${config.path}`,
      inLanguage: 'tr-TR',
      image: resolveOgImage(config),
    });
    return schemas;
  }

  if (config.schema === 'services') {
    schemas.push({
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
    });
    return schemas;
  }

  if (config.schema === 'none') return [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.title,
    url: `${origin}${config.path}`,
    description: config.description,
  });
  return schemas;
}

function buildHead(page, config) {
  const canonical = `${origin}${config.path}`;
  const robots = config.robots ?? 'index, follow, max-image-preview:large';
  const schemas = buildSchema(page, config);
  const pageOgImage = resolveOgImage(config);
  const schemaBlock = schemas.length
    ? `\n  <script type="application/ld+json">${JSON.stringify(schemas)}</script>`
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
  <meta name="geo.position" content="${site.organization.latitude};${site.organization.longitude}">
  <meta name="ICBM" content="${site.organization.latitude}, ${site.organization.longitude}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${favicon}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${favicon}">
  <meta property="og:locale" content="${site.locale}">
  <meta property="og:site_name" content="${escapeHtml(site.siteName)}">
  <meta property="og:type" content="${config.schema === 'article' ? 'article' : 'website'}">
  <meta property="og:title" content="${escapeHtml(config.title)}">
  <meta property="og:description" content="${escapeHtml(config.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${pageOgImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="${site.twitterHandle}">
  <meta name="twitter:title" content="${escapeHtml(config.title)}">
  <meta name="twitter:description" content="${escapeHtml(config.description)}">
  <meta name="twitter:image" content="${pageOgImage}">${schemaBlock}`;
}

for (const file of Object.keys(pages)) {
  const filePath = resolve(root, file);
  let html = readFileSync(filePath, 'utf8');
  if (!html.match(/<link rel="(?:preconnect|preload)"/)) {
    console.warn('Skipped (no head anchor):', file);
    continue;
  }
  html = html.replace(/<head>\s*[\s\S]*?(?=<link rel="(?:preconnect|preload)")/, `<head>\n${buildHead(file, pages[file])}\n  `);
  writeFileSync(filePath, html, 'utf8');
  console.log('SEO updated:', file);
}

console.log('Done. Site origin:', origin);
