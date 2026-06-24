import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const portfolioSettings = {
  portfolio_hero_eyebrow: 'Seçilmiş İşler',
  portfolio_hero_title: 'Stratejiyle başlayan, sonuçla kanıtlanan projeler.',
  portfolio_hero_description:
    'Farklı sektörlerde markaların görünürlüğünü, iletişim kalitesini ve dönüşüm performansını büyüttüğümüz çalışmalardan seçkiler.',
};

const projects = [
  {
    slug: 'mudavim-ocakbasi',
    title: 'Müdavim Ocakbaşı & Sahne',
    client_name: 'Müdavim Ocakbaşı & Sahne',
    category: 'Marka & Dijital',
    tags: ['marka', 'web', 'sosyal', 'dijital'],
    display_order: 1,
    is_active: true,
    is_featured: true,
    project_date: '2025-03-01',
    project_url: 'https://www.instagram.com/mudavimdenizli/',
    case_hero_title: 'Müdavim Ocakbaşı için marka kimliğinden dijital reklama tam kapsamlı dönüşüm.',
    case_hero_lead:
      'Denizli’de ocakbaşı ve sahne konseptiyle öne çıkan Müdavim için logo tasarımı, web arayüzü, sosyal medya içerik sistemi ve Meta reklam yönetimini tek marka dili altında birleştirdik.',
    short_description:
      'Logo tasarımı, web sitesi, sosyal medya yönetimi ve dijital reklam operasyonunu Denizli’nin ocakbaşı markası için uçtan uca yürüttük.',
    challenge:
      'Mekân güçlü bir lezzet ve atmosfer sunuyordu; ancak dijital kanallarda parçalı görünüm, tutarsız görsel dil ve rezervasyon odaklı net bir iletişim akışı eksikti.',
    strategy:
      'Ocakbaşının sıcak ve samimi ruhunu premium ama ulaşılabilir bir marka diline taşıdık. Logo, web, sosyal içerik ve reklam mesajlarını aynı görsel rehber üzerinden kurguladık.',
    execution:
      'Marka logosu ve kurumsal kimlik seti tasarlandı. Mobil uyumlu web sitesi geliştirildi. Instagram ve Facebook içerik üretimi ile Meta Ads kampanyaları yönetildi.',
    result:
      'Müdavim Ocakbaşı dijitalde tutarlı bir marka kimliği kazandı; sosyal medyada artan etkileşim ve reklam kanallarından gelen erişimle Denizli’de görünürlük güçlendi.',
    tools_used: ['Figma', 'Meta Ads', 'Meta Business Suite', 'Instagram', 'Facebook', 'Google Analytics'],
    metrics: [
      { value: 210, prefix: '%', label: 'Sosyal medya erişim artışı', duration: 1700 },
      { value: 185, prefix: '%', label: 'Profil etkileşimi artışı', duration: 1500 },
      { value: 4, suffix: '.2x', label: 'Reklam erişim çarpanı', duration: 1500 },
      { value: 360, suffix: '+', label: 'Aylık içerik çıktısı', duration: 1400 },
    ],
    gallery_images: [],
    meta_title: 'Müdavim Ocakbaşı Vaka Analizi | Marka, Web & Sosyal Medya – Genua',
    meta_description:
      'Müdavim Ocakbaşı için logo tasarımı, web sitesi, sosyal medya yönetimi ve dijital reklam projesi vaka analizi.',
  },
  {
    slug: 'arden-foods',
    title: 'Arden Foods',
    client_name: 'Arden Foods',
    category: 'Sosyal Medya',
    tags: ['sosyal'],
    display_order: 2,
    is_active: true,
    short_description:
      'Arden Foods için sosyal medya dili yenilendi, aylık içerik üretim sistemi kuruldu ve kampanya dönemlerinde etkileşim oranı yüzde 210 arttı.',
  },
  {
    slug: 'mira-clinic',
    title: 'Mira Clinic',
    client_name: 'Mira Clinic',
    category: 'Marka',
    tags: ['marka'],
    display_order: 3,
    is_active: true,
    short_description:
      'Mira Clinic için premium sağlık markası konumlandırması, kurumsal kimlik ve dijital lansman kreatifleri hazırlandı.',
  },
  {
    slug: 'forte-teknoloji',
    title: 'Forte Teknoloji',
    client_name: 'Forte Teknoloji',
    category: 'Web',
    tags: ['web', 'marka'],
    display_order: 4,
    is_active: true,
    short_description:
      'Forte Teknoloji için B2B odaklı yeni web arayüzü, LinkedIn içerik sistemi ve lead toplama akışı geliştirildi.',
  },
  {
    slug: 'liva-home',
    title: 'Liva Home',
    client_name: 'Liva Home',
    category: 'Dijital',
    tags: ['dijital'],
    display_order: 5,
    is_active: true,
    short_description:
      'Liva Home kampanyasında Meta ve Google reklamları birlikte optimize edilerek mağaza randevularında ciddi artış sağlandı.',
  },
  {
    slug: 'urban-fit',
    title: 'Urban Fit',
    client_name: 'Urban Fit',
    category: 'Sosyal Medya',
    tags: ['sosyal', 'marka'],
    display_order: 6,
    is_active: true,
    short_description:
      'Urban Fit için yeni kampanya dili, sporcu içerikleri ve sosyal medya lansman paketi hazırlandı.',
  },
];

function stripCaseHeroFields(project) {
  const { case_hero_title, case_hero_lead, metrics, ...rest } = project;
  const nextMetrics = Array.isArray(metrics) ? [...metrics] : [];
  if (case_hero_title || case_hero_lead) {
    nextMetrics.unshift({
      _type: 'hero',
      title: case_hero_title,
      lead: case_hero_lead,
    });
  }
  return { ...rest, metrics: nextMetrics };
}

async function updatePortfolioSettings() {
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
  if (!existing?.id) return;

  const { error } = await supabase.from('site_settings').update(portfolioSettings).eq('id', existing.id);
  if (error?.message?.includes('portfolio_hero')) {
    console.warn('Portföy hero kolonları henüz yok; site ayarları atlandı.');
    return;
  }
  if (error) throw error;
  console.log('Portföy sayfa metinleri güncellendi.');
}

async function insertProjects(rows) {
  let { error } = await supabase.from('projects').insert(rows);
  if (error?.message?.includes('case_hero')) {
    console.warn('case_hero kolonları yok; geçici olarak metrik JSON içine yazılıyor.');
    ({ error } = await supabase.from('projects').insert(rows.map(stripCaseHeroFields)));
  }
  if (error) throw error;
}

const { data: existing, error: readError } = await supabase.from('projects').select('slug');
if (readError) {
  console.error('Projeler okunamadı:', readError.message);
  process.exit(1);
}

await updatePortfolioSettings();

const existingSlugs = new Set((existing ?? []).map((row) => row.slug));
const toInsert = projects.filter((project) => !existingSlugs.has(project.slug));

if (!toInsert.length) {
  console.log('Tüm portföy projeleri zaten mevcut.');
  process.exit(0);
}

try {
  await insertProjects(toInsert);
  console.log(`${toInsert.length} portföy projesi eklendi.`);
} catch (error) {
  console.error('Seed başarısız:', error.message);
  process.exit(1);
}
