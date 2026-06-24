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

const PROJECT_ID = 'b742223b-ed16-4d1d-8e12-d7eb90a6d6f0';

async function hasCaseHeroColumns() {
  const { error } = await supabase.from('projects').select('case_hero_title,case_hero_lead').limit(1);
  return !error;
}

async function resolveCoverImage() {
  const { data: logoRow } = await supabase
    .from('client_logos')
    .select('logo_url')
    .ilike('company_name', '%Müdavim%')
    .limit(1)
    .maybeSingle();

  if (logoRow?.logo_url) return logoRow.logo_url;

  const { data: files } = await supabase.storage.from('media').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
  const match = (files ?? []).find((file) => /mudavim/i.test(file.name));
  if (match) {
    const { data } = supabase.storage.from('media').getPublicUrl(match.name);
    return data.publicUrl;
  }

  return null;
}

const mudavimProject = {
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
  short_description:
    'Logo tasarımı, web sitesi, sosyal medya yönetimi ve dijital reklam operasyonunu Denizli’nin ocakbaşı markası için uçtan uca yürüttük.',
  case_hero_title: 'Müdavim Ocakbaşı için marka kimliğinden dijital reklama tam kapsamlı dönüşüm.',
  case_hero_lead:
    'Denizli’de ocakbaşı ve sahne konseptiyle öne çıkan Müdavim için logo tasarımı, web arayüzü, sosyal medya içerik sistemi ve Meta reklam yönetimini tek marka dili altında birleştirdik.',
  challenge:
    'Mekân güçlü bir lezzet ve atmosfer sunuyordu; ancak dijital kanallarda parçalı görünüm, tutarsız görsel dil ve rezervasyon odaklı net bir iletişim akışı eksikti. Sosyal medya ve reklam tarafında da marka sesi henüz oturmamıştı.',
  strategy:
    'Ocakbaşının sıcak ve samimi ruhunu premium ama ulaşılabilir bir marka diline taşıdık. Logo ve kurumsal kimlik seti ile web sitesi, sosyal içerik takvimi ve reklam mesajlarını aynı görsel rehber üzerinden kurguladık.',
  execution:
    'Marka logosu ve kurumsal kimlik seti tasarlandı. Mobil uyumlu web sitesi geliştirildi. Instagram ve Facebook için düzenli içerik üretimi, story/reels planlaması ve topluluk yönetimi yapıldı. Meta Ads ile yerel hedefleme, menü/etkinlik duyuruları ve rezervasyon odaklı kampanyalar yönetildi.',
  result:
    'Müdavim Ocakbaşı dijitalde tutarlı bir marka kimliği kazandı. Sosyal medyada düzenli içerik akışı ve artan etkileşimle mekânın ocakbaşı ve sahne konsepti daha net konumlandı. Reklam kanallarından gelen erişim ve profil ziyaretleriyle Denizli’de görünürlük güçlendi; marka artık hem fiziksel hem dijital deneyimde aynı dili konuşuyor.',
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
    'Müdavim Ocakbaşı için logo tasarımı, web sitesi, sosyal medya yönetimi ve dijital reklam projesi vaka analizi. Strateji, uygulama ve sonuçlar.',
};

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

async function upsertProject(payload) {
  let { data, error } = await supabase.from('projects').update(payload).eq('id', PROJECT_ID).select('id, slug, title, cover_image_url').maybeSingle();

  if (error?.message?.includes('case_hero')) {
    console.warn('case_hero kolonları yok; geçici olarak metrik JSON içine yazılıyor.');
    ({ data, error } = await supabase
      .from('projects')
      .update(stripCaseHeroFields(payload))
      .eq('id', PROJECT_ID)
      .select('id, slug, title')
      .maybeSingle());
  }

  if (error) throw error;

  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from('projects')
      .insert({ id: PROJECT_ID, ...payload })
      .select('id, slug, title')
      .maybeSingle();
    if (insertError?.message?.includes('case_hero')) {
      const { data: fallback, error: fallbackError } = await supabase
        .from('projects')
        .insert({ id: PROJECT_ID, ...stripCaseHeroFields(payload) })
        .select('id, slug, title')
        .maybeSingle();
      if (fallbackError) throw fallbackError;
      return fallback;
    }
    if (insertError) throw insertError;
    return inserted;
  }

  return data;
}

try {
  const coverImageUrl = await resolveCoverImage();
  const payload = coverImageUrl ? { ...mudavimProject, cover_image_url: coverImageUrl } : mudavimProject;
  const caseHeroReady = await hasCaseHeroColumns();
  const row = await upsertProject(caseHeroReady ? payload : stripCaseHeroFields(payload));
  console.log('Müdavim Ocakbaşı portföy kaydı güncellendi:', row);
  if (!caseHeroReady) {
    console.warn('case_hero kolonları yok; vaka başlığı metrik JSON içinde tutuluyor.');
  }
  if (!coverImageUrl) {
    console.warn('Kapak görseli bulunamadı; admin panelden yükleyebilirsin.');
  }
} catch (error) {
  console.error('Güncelleme başarısız:', error.message);
  process.exit(1);
}
