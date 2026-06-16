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

const cover = (file) => `varlıklar/resimler/blog/${file}`;

const posts = [
  {
    slug: '2026-da-kurumsal-markalar-icin-performans-pazarlama-nasil-planlanmali',
    title: "2026'da kurumsal markalar için performans pazarlama nasıl planlanmalı?",
    excerpt: 'Medya bütçesi, içerik üretimi ve ölçümleme süreçlerini aynı hedefe bağlamak için pratik bir çerçeve.',
    category: 'Reklam Stratejisi',
    tags: ['performans pazarlama', 'medya planlama', 'dönüşüm'],
    author_name: 'Genua Strateji Ekibi',
    read_time_minutes: 7,
    published_at: '2026-06-12T09:00:00+03:00',
    display_order: 1,
    is_featured: true,
    cover_image_url: cover('performans-pazarlama.jpg'),
    meta_title: '2026 Performans Pazarlama Planı | Genua Reklam Ajansı Blog',
    meta_description:
      'Kurumsal markalar için 2026 performans pazarlama planı: medya bütçesi, içerik üretimi, landing page optimizasyonu ve ölçümleme çerçevesi.',
    content: `<p>Performans pazarlama artık yalnızca reklam panelinde optimizasyon yapmakla sınırlı değil. Kurumsal markalar için büyüme; medya bütçesi, kreatif üretim, landing page deneyimi, satış ekibi geri bildirimi ve raporlama disiplininin birlikte çalışmasıyla mümkün.</p>
<h2 id="hedef">1. Hedefi reklam metriği değil, iş sonucu olarak tanımlayın</h2>
<p>Tıklama oranı veya gösterim tek başına başarı değildir. Satış, nitelikli form, teklif talebi, bayi başvurusu veya demo rezervasyonu gibi iş sonuçları kampanya mimarisinin merkezinde olmalıdır.</p>
<blockquote>İyi bir performans planı, medya yatırımının hangi iş sonucunu büyüteceğini herkes için görünür hale getirir.</blockquote>
<h2 id="kreatif">2. Kreatif üretimi test sistemine bağlayın</h2>
<p>Reklam kreatifleri tek seferlik tasarım çıktısı değildir. Başlık, teklif, görsel, video açılışı ve CTA gibi değişkenler düzenli test edilmelidir.</p>
<h2 id="olcum">3. Ölçümleme altyapısını kampanyadan önce kurun</h2>
<p>GA4, Tag Manager, dönüşüm olayları ve CRM entegrasyonu kampanya yayına çıkmadan önce kontrol edilmelidir.</p>
<h2 id="rapor">4. Raporu aksiyon önerisine dönüştürün</h2>
<p>Raporun amacı tablo paylaşmak değil, sonraki kararları netleştirmektir. Hangi kanal büyüyecek, hangi kreatif değişecek soruları cevaplanmalıdır.</p>`,
  },
  {
    slug: 'google-ads-butcesini-bosa-harcatan-7-sinyal',
    title: 'Google Ads bütçenizi boşa harcatan 7 sinyal',
    excerpt: 'Kampanya sağlığını hızlı kontrol etmek için bakmanız gereken metrikler.',
    category: 'Reklam',
    tags: ['google ads', 'performans', 'optimizasyon'],
    read_time_minutes: 5,
    published_at: '2026-06-10T09:00:00+03:00',
    display_order: 2,
    cover_image_url: cover('google-ads.jpg'),
    content: `<p>Google Ads hesabında bütçe eriyor ama sonuç gelmiyorsa genelde sorun tekil bir ayar değil, birkaç sinyalin birlikte kaçırılmasıdır.</p>
<h2>1. Dönüşüm takibi eksik veya gecikmeli</h2>
<p>Form gönderimi, telefon tıklaması veya CRM kaydı doğru etiketlenmiyorsa algoritma yanlış öğrenir.</p>
<h2>2. Arama terimleri kontrolsüz büyüyor</h2>
<p>Geniş eşleme açıkken negatif kelime listesi güncellenmiyorsa bütçe alakasız sorgulara gider.</p>
<h2>3. Landing page mesaj uyumsuzluğu</h2>
<p>Reklam metni ile sayfa vaadi farklıysa tıklama maliyeti artar, dönüşüm düşer.</p>
<p>Diğer sinyaller: düşük kalite skoru, tek kreatif bağımlılığı, coğrafi hedef kayması, cihaz kırılımında kör nokta ve raporlama ile optimizasyon arasındaki gecikme.</p>`,
  },
  {
    slug: 'kurumsal-sosyal-medya-takvimi-nasil-hazirlanir',
    title: 'Kurumsal sosyal medya takvimi nasıl hazırlanır?',
    excerpt: 'Satış, itibar ve topluluk hedeflerini dengeleyen içerik sistemi.',
    category: 'Sosyal Medya',
    tags: ['içerik takvimi', 'sosyal medya'],
    read_time_minutes: 6,
    published_at: '2026-06-04T09:00:00+03:00',
    display_order: 3,
    cover_image_url: cover('sosyal-medya-takvimi.jpg'),
    content: `<p>Kurumsal sosyal medya takvimi; paylaşım sıklığından önce hedef kitle, mesaj hiyerarşisi ve üretim kapasitesini dengeleyen bir planlama aracıdır.</p>
<h2>İçerik sütunlarını netleştirin</h2>
<p>Eğitici, kurumsal, ürün/hizmet, topluluk ve kampanya içeriklerini oranlayın. Her sütunun amacı farklı KPI taşır.</p>
<h2>Üretim ve onay akışını takvime bağlayın</h2>
<p>Metin, görsel, video ve yayın tarihi aynı tabloda görünmeli. Onay gecikmeleri planı boşa çıkarır.</p>
<h2>Performans geri bildirimini döngüye alın</h2>
<p>Aylık rapordan çıkan içgörüler bir sonraki takvimin ilk satırına yansıtılmalıdır.</p>`,
  },
  {
    slug: 'marka-dili-ile-reklam-metni-neden-ayri-dusunulmemeli',
    title: 'Marka dili ile reklam metni neden ayrı düşünülmemeli?',
    excerpt: 'Her temas noktasında tutarlı algı oluşturmanın yolları.',
    category: 'Marka',
    tags: ['marka dili', 'kreatif'],
    read_time_minutes: 4,
    published_at: '2026-05-29T09:00:00+03:00',
    display_order: 4,
    cover_image_url: cover('marka-dili.jpg'),
    content: `<p>Reklam metni kısa olduğu için marka dili dışında yazılabilir sanılır; oysa kullanıcı reklamı markanın sesi olarak okur.</p>
<h2>Tek cümlelik marka vaadi</h2>
<p>Her kampanyada tekrarlanan bir vaat cümlesi, kreatif çeşitliliği bozmadan tutarlılık sağlar.</p>
<h2>Do / Don't listesi</h2>
<p>Hangi kelimeler kullanılır, hangilerinden kaçınılır? Reklam ekibi için tek sayfalık rehber yeterlidir.</p>
<h2>Onay sürecine dil kontrolü ekleyin</h2>
<p>Görsel onayından önce metin tonu kontrol edilirse marka sapmaları erken yakalanır.</p>`,
  },
  {
    slug: 'seo-iceriginde-arama-niyeti-nasil-okunur',
    title: 'SEO içeriğinde arama niyeti nasıl okunur?',
    excerpt: 'Doğru içerik formatı seçmek için niyet analizini kullanma rehberi.',
    category: 'SEO',
    tags: ['seo', 'içerik', 'arama niyeti'],
    read_time_minutes: 7,
    published_at: '2026-05-20T09:00:00+03:00',
    display_order: 5,
    cover_image_url: cover('seo-arama-niyeti.jpg'),
    content: `<p>Arama niyeti; kullanıcının o sorguda gerçekten ne öğrenmek veya yapmak istediğini anlamaktır. Yanlış format, doğru kelimeyle bile trafik getirmez.</p>
<h2>Bilgi, karşılaştırma, işlem, navigasyon</h2>
<p>Her sorgu tipi farklı sayfa yapısı ister: rehber, karşılaştırma tablosu, landing page veya marka sayfası.</p>
<h2>SERP analizi yapın</h2>
<p>İlk 10 sonuç hangi formatı ödüllendiriyor? Video, liste, SSS veya uzun makale mi?</p>
<h2>İçerik derinliğini niyete göre ayarlayın</h2>
<p>İşlem niyetinde kısa ve net CTA; bilgi niyetinde kapsamlı açıklama ve örnekler gerekir.</p>`,
  },
  {
    slug: 'kurumsal-web-sitelerinde-donusum-odakli-tasarim',
    title: 'Kurumsal web sitelerinde dönüşüm odaklı tasarım',
    excerpt: 'CTA, form ve bilgi mimarisinin satış ekibine etkisi.',
    category: 'Web',
    tags: ['web tasarım', 'dönüşüm', 'ux'],
    read_time_minutes: 5,
    published_at: '2026-05-14T09:00:00+03:00',
    display_order: 6,
    cover_image_url: cover('web-donusum.jpg'),
    content: `<p>Kurumsal siteler çoğu zaman güzel görünür ama ziyaretçiyi yönlendirmez. Dönüşüm odaklı tasarım estetikten ödün vermeden net aksiyon ister.</p>
<h2>Hero alanında tek ana CTA</h2>
<p>Birden fazla eşit buton kararsızlık yaratır. Birincil hedef (teklif, demo, iletişim) öne çıkarılmalıdır.</p>
<h2>Form sürtünmesini azaltın</h2>
<p>Alan sayısını ihtiyaca göre kademelendirin. İlk temasta kısa form, ısınmış lead için detaylı form mantıklıdır.</p>
<h2>Güven sinyallerini CTA yakınına koyun</h2>
<p>Referans, sertifika veya vaka özeti, formun hemen yanında dönüşümü artırır.</p>`,
  },
  {
    slug: 'reklam-kreatiflerinde-test-edilecek-degiskenler',
    title: 'Reklam kreatiflerinde test edilecek değişkenler',
    excerpt: 'Başlık, görsel, teklif ve format testlerini planlama.',
    category: 'İçerik',
    tags: ['kreatif', 'a/b test', 'reklam'],
    read_time_minutes: 6,
    published_at: '2026-05-08T09:00:00+03:00',
    display_order: 7,
    cover_image_url: cover('reklam-kreatif.jpg'),
    content: `<p>Kreatif test plansız yapılırsa sonuç yorumlanamaz. Her testte tek değişken değişmeli, hipotez yazılı olmalıdır.</p>
<h2>Başlık ve teklif</h2>
<p>Fayda odaklı vs. aciliyet odaklı mesaj; fiyat vurgusu vs. güven vurgusu karşılaştırılabilir.</p>
<h2>Görsel ve format</h2>
<p>Statik görsel, carousel, kısa video ve UGC tarzı içerik farklı kitlelerde farklı performans verir.</p>
<h2>CTA dili</h2>
<p>“Teklif al”, “Hemen keşfet”, “Ücretsiz analiz” gibi ifadeler tıklama niyetini değiştirir.</p>`,
  },
  {
    slug: 'reklam-butcesi-nasil-planlanir',
    title: 'Reklam bütçesi nasıl planlanır?',
    excerpt: 'Medya yatırımını iş hedeflerine göre dağıtmanın pratik yöntemi.',
    category: 'Reklam',
    tags: ['bütçe', 'medya planlama'],
    read_time_minutes: 5,
    published_at: '2026-05-01T09:00:00+03:00',
    display_order: 8,
    cover_image_url: cover('reklam-butcesi.jpg'),
    content: `<p>Reklam bütçesi “kalan parayı harcamak” değil; büyüme hedeflerine göre kanallara pay ayırmaktır.</p>
<h2>Hedef ve dönüşüm maliyetini tanımlayın</h2>
<p>Lead veya satış başına kabul edilebilir maliyet olmadan bütçe dağılımı spekülasyona döner.</p>
<h2>Test – ölçek – koruma oranı</h2>
<p>Bütçenin bir kısmı deneysel kanallara, ana kısmı kanıtlanmış kanallara, küçük pay yedekte tutulmalıdır.</p>`,
  },
  {
    slug: 'sosyal-medya-raporu-nasil-okunur',
    title: 'Sosyal medya raporu nasıl okunur?',
    excerpt: 'Vanity metrikler yerine işe yarayan KPI’lara odaklanın.',
    category: 'Sosyal Medya',
    tags: ['raporlama', 'sosyal medya'],
    read_time_minutes: 4,
    published_at: '2026-04-25T09:00:00+03:00',
    display_order: 9,
    cover_image_url: cover('sosyal-medya-raporu.jpg'),
    content: `<p>Sosyal medya raporları takipçi ve beğeni ile sınırlı kalırsa strateji kararları yanlış alınır.</p>
<h2>Erişim ve kaydedilme</h2>
<p>İçeriğin gerçekten görülüp görülmediğini ve tekrar ziyaret edilip edilmediğini gösterir.</p>
<h2>Profil ziyareti ve link tıklaması</h2>
<p>Topluluğu web sitesine veya teklif sayfasına taşıyıp taşımadığını ölçer.</p>
<h2>İçerik türü kırılımı</h2>
<p>Reels, carousel ve statik gönderi performansını karşılaştırarak üretim planını güncelleyin.</p>`,
  },
  {
    slug: 'landing-page-donusum-checklisti',
    title: "Landing page dönüşüm checklist'i",
    excerpt: 'Daha fazla form almak için temel kontrol listesi.',
    category: 'Web',
    tags: ['landing page', 'dönüşüm', 'cro'],
    read_time_minutes: 5,
    published_at: '2026-04-18T09:00:00+03:00',
    display_order: 10,
    cover_image_url: cover('landing-page.jpg'),
    content: `<p>Landing page dönüşümü tek bir büyük değişiklikle değil, birçok küçük iyileştirmenin toplamıyla artar.</p>
<h2>İlk ekran netliği</h2>
<p>5 saniyede ne sunduğunuz, kime hitap ettiğiniz ve sonraki adım anlaşılmalı.</p>
<h2>Mobil form deneyimi</h2>
<p>Klavye türü, alan etiketleri ve hata mesajları mobilde test edilmeli.</p>
<h2>Hız ve güven</h2>
<p>Sayfa yüklenme süresi, SSL, gizlilik notu ve müşteri logosu dönüşümü doğrudan etkiler.</p>
<h2>Teşekkür ve takip</h2>
<p>Form sonrası net beklenti mesajı ve CRM/webhook entegrasyonu lead kaybını önler.</p>`,
  },
];

async function main() {
  const rows = posts.map((post) => ({
    ...post,
    status: 'published',
    author_name: post.author_name ?? 'Genua Ekibi',
  }));

  const { error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error(error.message);

  console.log(`${rows.length} blog yazısı kaydedildi (kapak görselleri dahil).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
