const ORIGIN = 'https://genuadigital.com';
const LIVE_SUPABASE_URL = 'https://xawqrlillkfjzjxpnjqe.supabase.co';
const LIVE_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd3FybGlsbGtmanpqeHBuanFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTU5MDQsImV4cCI6MjA5NzEzMTkwNH0.aX1_imlxr3crf0ur1y9S72M6St6-COavAZQAWm0qOqA';
const envSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_URL = envSupabaseUrl.includes('xawqrlillkfjzjxpnjqe') ? envSupabaseUrl : LIVE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  SUPABASE_URL === envSupabaseUrl
    ? process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || LIVE_SUPABASE_ANON_KEY
    : LIVE_SUPABASE_ANON_KEY;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const STATIC_PAGES = [
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

function isValidSlug(slug) {
  return SLUG_PATTERN.test(String(slug || ''));
}

function postPath(slug) {
  return `/blog/${slug}`;
}

function postUrl(slug) {
  return `${ORIGIN}${postPath(slug)}`;
}

function absoluteAsset(url) {
  if (!url) return `${ORIGIN}/varlıklar/resimler/genua-ekip.jpg`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${ORIGIN}/${String(url).replace(/^\//, '')}`;
}

async function supabaseGet(pathname) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase ${response.status}`);
  }
  return response.json();
}

async function fetchPublishedPost(slug) {
  if (!isValidSlug(slug)) return null;
  const rows = await supabaseGet(
    `blog_posts?select=slug,title,excerpt,content,category,cover_image_url,published_at,updated_at,read_time_minutes,author_name,meta_title,meta_description,tags&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function fetchPublishedPosts() {
  const rows = await supabaseGet(
    'blog_posts?select=slug,published_at,updated_at&status=eq.published&order=published_at.desc',
  );
  return Array.isArray(rows) ? rows : [];
}

module.exports = {
  ORIGIN,
  STATIC_PAGES,
  isValidSlug,
  postPath,
  postUrl,
  absoluteAsset,
  fetchPublishedPost,
  fetchPublishedPosts,
};
