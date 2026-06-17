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
    slug: 'nova-tower',
    title: 'Nova Tower',
    client_name: 'Nova Tower',
    category: 'Dijital',
    tags: ['dijital', 'web'],
    display_order: 1,
    is_active: true,
    is_featured: true,
    project_date: '2026-01-15',
    case_hero_title: 'Nova Tower için nitelikli talep üretimini büyüttük.',
    case_hero_lead:
      'Gayrimenkul sektöründe lansman dönemindeki projeye dijital reklam, landing page ve raporlama sistemiyle ölçülebilir talep akışı kurduk.',
    short_description: 'Nova Tower lansman döneminde dijital reklam ve web dönüşüm optimizasyonu.',
    challenge: 'Reklam trafiği vardı ancak form kalitesi ve satış ekibine aktarılan lead niteliği düşüktü.',
    strategy: 'Kitle segmentleri ayrıldı, teklif mesajları sadeleştirildi ve landing page dönüşüm akışı kısaltıldı.',
    execution: 'Google Search, Meta remarketing ve yeni landing page A/B testleri birlikte çalıştırıldı.',
    result:
      'Projenin hedef kitlesi yüksek bütçeli yatırımcı ve kurumsal karar vericilerdi. Bu yüzden kampanya dili, landing page akışı ve reklam hedeflemeleri nitelikli talep üretimine göre yeniden tasarlandı. Nitelikli form hacmi artarken lead başı maliyet düşürüldü ve satış ekibinin geri dönüş hızı iyileşti.',
    tools_used: ['Google Ads', 'Meta Ads', 'GA4', 'Tag Manager'],
    metrics: [
      { value: 320, prefix: '%', label: 'Daha fazla erişim', duration: 1700 },
      { value: 46, prefix: '%', label: 'CPL düşüşü', duration: 1500 },
      { value: 3, suffix: '.4x', label: 'Form dönüşüm artışı', duration: 1500 },
      { value: 28, label: 'Günde nitelikli lead', duration: 1400 },
    ],
    gallery_images: [],
    meta_title: 'Nova Tower Vaka Analizi | Dijital Reklam Case Study – Genua',
    meta_description:
      'Nova Tower dijital reklam ve web dönüşüm projesi vaka analizi. Strateji, uygulama süreci ve elde edilen performans sonuçları.',
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
