import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
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
const featuredSlug = 'instagram-carousel-format-2026';

const posts = [
  {
    slug: featuredSlug,
    title: 'Instagram Carousel 2026: 4:5 mi, 3:4 mü? Ajanslar için güncel format rehberi',
    excerpt:
      'Instagram kaydırmalı gönderi (carousel) 2026’da hâlâ en yüksek etkileşim formatı. Yeni 3:4 ölçü, 20 slayt limiti ve Reels–carousel dengesini ajans masasına indiriyoruz.',
    category: 'Sosyal Medya',
    cover_image_url: cover('instagram-carousel-2026.jpg'),
    author_name: 'Genua Ekibi',
    read_time_minutes: 8,
    meta_title: 'Instagram Carousel Formatı 2026: Ölçü, Slayt ve Ajans Rehberi | Genua',
    meta_description:
      '2026 Instagram carousel ölçüleri: 1080x1350 (4:5), yeni 3:4 (1080x1440), 20 slayt, güvenli alan ve Reels karşılaştırması. Ajans içerik ekipleri için pratik rehber.',
    tags: ['Instagram', 'carousel', 'sosyal medya', 'içerik üretimi', '2026'],
    status: 'published',
    published_at: '2026-09-07T07:00:00Z',
    display_order: -4,
    is_featured: true,
    content: `<p>Instagram’da “hangi format tutar?” sorusu 2026’da tek cümleyle kapanmıyor. <strong>Reels keşif motoru</strong>, <strong>carousel ise etkileşim ve kaydetme motoru</strong>. Ajanslar için asıl kırılma noktası ise ölçü: profil ızgarası 3:4’e kaydı, feed’de 4:5 hâlâ varsayılan, yeni 3:4 (1080×1440) seçeneği de masaya geldi.</p>
<p>Bu yazı, MediaCat çizgisindeki sektör haberlerini ve 2026 ölçü güncellemelerini aynı masaya koyuyor: ne değişti, ne değişmedi, marka hesabında hangi slayt boyutunu kilitlemelisiniz.</p>
<h2>2026’da carousel neden hâlâ kritik?</h2>
<p>Tek kare gönderi feed’de küçülmeye devam ediyor. Kaydırmalı gönderi ise kullanıcıyı aktif hale getiriyor: her swipe, dwell time (içerikte kalma süresi) üretiyor. Eğitici rehber, karşılaştırma, “hata–düzeltme” ve mini case study formatları kaydetme oranında öne çıkıyor.</p>
<p>Pratik ayrım şöyle:</p>
<ul>
<li><strong>Reels:</strong> yeni kitle, keşfet, ilk 3 saniye kancası</li>
<li><strong>Carousel:</strong> otorite, kayıt, paylaşım, “sonra tekrar bakacağım” içeriği</li>
<li><strong>Story:</strong> ilişki, anket, DM ve yakınlık sinyali</li>
</ul>
<p>Haftalık dengeli bir kurumsal plan genelde <strong>3–4 Reels + 1–2 carousel + günlük Story</strong> ile kuruluyor. Hacim için kaliteyi düşürmek, 2026 algoritmasında en pahalı hata.</p>
<h2>Ölçü tablosu: hangisini kilitlemelisiniz?</h2>
<div style="overflow-x:auto;margin:0 0 28px;">
<table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
<thead>
<tr>
<th style="text-align:left;padding:12px 14px;border-bottom:2px solid rgba(219,255,43,0.5);">Format</th>
<th style="text-align:left;padding:12px 14px;border-bottom:2px solid rgba(219,255,43,0.5);">Piksel</th>
<th style="text-align:left;padding:12px 14px;border-bottom:2px solid rgba(219,255,43,0.5);">Ne zaman?</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">4:5 dikey (varsayılan)</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">1080 × 1350</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">Çoğu marka carousel’i, grafik, eğitim slaytı</td></tr>
<tr><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">3:4 yeni</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">1080 × 1440</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">Uzun metin, moda/full-body, ızgara kırpılmasın istiyorsanız</td></tr>
<tr><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">1:1 kare</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">1080 × 1080</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">Çoklu platforma aynı asset, fotoğraf dump</td></tr>
<tr><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">Yatay</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">1080 × 566</td><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">Neredeyse hiç. Feed’de kaybolur</td></tr>
</tbody>
</table>
</div>
<p><strong>Genua önerisi:</strong> Marka şablonunu 4:5’te kilitleyin. 3:4’ü “ızgara kapağı kritik” veya “çok metinli eğitim” işlerinde deneyin. Tüm slaytlar aynı oranda olmalı; ilk slayt oranı kilidi belirler, karışık oran kırpılır.</p>
<h2>Slayt sayısı: 20 tavan, 7–10 tatlı nokta</h2>
<p>Instagram carousel’de üst sınır 20 slayt. Bu, her gönderinin 20 kare olması gerektiği anlamına gelmiyor. Metin-grafik carousel’lerde <strong>7–10 slayt</strong> hâlâ en temiz okuma deneyimi. 11–15 slayt derin case study ve kontrol listelerinde işe yarıyor; 16–20 daha çok “kaydetmeli referans” içerikler için.</p>
<p>Kurgu iskeleti:</p>
<ul>
<li><strong>1. slayt:</strong> tek başına çalışmalı. Hook + vaat. Çoğu kişi sadece bunu görür.</li>
<li><strong>Orta slaytlar:</strong> slayt başına bir fikir. Padding cezalandırılır; boş çerçeve kaydırma düşürür.</li>
<li><strong>Son slayt:</strong> özet + net CTA (bio, DM, teklif, kaydet).</li>
</ul>
<h2>Güvenli alan: feed, ızgara, Explore</h2>
<p>Profil ızgarası 3:4 kırpıyor. 4:5 kapağın üst ve altından yaklaşık yüzde 6 gider. Kare kapağın üst-alt kaybı daha fazla. Bu yüzden logo, yüz ve başlık merkeze yakın, her kenardan yüzde 10 içeride kalmalı. Alt yüzde 10–12 zaten kullanıcı adı, noktalar ve aksiyon ikonlarıyla örtüşür.</p>
<p>Dışa aktarma notu: 1080 px genişlikte sRGB. Fotoğraf JPG (kalite 85–95), metin ağır slayt PNG. 4K yüklemek kaliteyi artırmaz; Instagram küçültüp tekrar sıkıştırır.</p>
<h2>Ajans üretim checklist’i</h2>
<ul>
<li>Şablon kütüphanesini 1080×1350’de tutun; sapma olduğunda tüm seti yeniden kırpmayın.</li>
<li>Kapak slaytını en son tasarlayın: hem feed’de durmalı hem 3:4 ızgarada okunmalı.</li>
<li>Reels’te keşfettiğiniz konuyu carousel’de derinleştirin. Aynı fikri iki formata çevirmek, tek formata sıkışmaktan daha güçlü sinyal üretir.</li>
<li>Planlama araçları hâlâ 3:4’ü reddedebiliyor. Otomasyon varsa 4:5’te kalın.</li>
</ul>
<h2>Sonuç</h2>
<p>2026’da carousel “eski feed postu” değil; Instagram içindeki mini landing page. Ölçüyü bir kez kilitleyen, hook’u ilk slayta yazan ve Reels ile birlikte planlayan ekipler hem erişim hem kayıt alır.</p>
<p><em>Bu içerik Genua Digital tarafından, sosyal medya ve kreatif ekipleri için hazırlanmıştır.</em></p>
<p><a href="sosyal-medya.html">Sosyal medya yönetimi</a> ve <a href="icerik-uretimi.html">içerik üretimi</a> hizmetlerimizi inceleyebilir veya <a href="teklif-al.html">teklif alabilirsiniz</a>.</p>`,
  },
  {
    slug: 'google-ai-bakisi-turkiye-aeo',
    title: 'Google AI Bakışı Türkiye’de: Daha az tıklama, daha yüksek niyet',
    excerpt:
      'AI Modu ve AI Bakışı Türkiye’de açıldı. Trafik düşüyor ama dönüşüm artabiliyor. Ajanslar için AEO ve Search Console AI görünürlüğü ne anlama geliyor?',
    category: 'SEO',
    cover_image_url: cover('google-ai-overviews.jpg'),
    author_name: 'Genua Ekibi',
    read_time_minutes: 7,
    meta_title: 'Google AI Bakışı Türkiye: AEO ve Ajanslar İçin Yeni SEO | Genua',
    meta_description:
      'Google AI Modu ve AI Bakışı Türkiye’de. Dentsu ve Monks verilerine göre trafik düşerken dönüşüm artabiliyor. AEO, yapılandırılmış içerik ve Search Console AI raporları.',
    tags: ['Google', 'AI Overviews', 'SEO', 'AEO', 'dijital pazarlama'],
    status: 'published',
    published_at: '2026-09-06T08:00:00Z',
    display_order: -3,
    is_featured: false,
    content: `<p>Google, Türkiye’de <strong>AI Modu</strong> ve <strong>AI Bakışı (AI Overviews)</strong> özelliklerini kademeli olarak açtı. Kullanıcı karmaşık soruyu doğrudan sonuç sayfasında özet olarak alıyor; kaynak linkleri duruyor, reklamlar da yerini koruyor. Ajans masasında ise tek soru kaldı: organik tıklama düşünce iş de mi küçülür?</p>
<p>MediaCat’in aktardığı ajans verileri bu paniği yumuşatıyor — ama stratejiyi de değiştiriyor.</p>
<h2>Yeni denklem: daha az ziyaretçi, daha hazır müşteri</h2>
<p>Dentsu, Monks ve Wpromote raporlarına göre bazı markalarda organik tıklama <strong>yüzde 15–30</strong> gerilerken satış veya dönüşüm oranı aynı oranda yükselebiliyor. Kaybolan trafik çoğunlukla üst hunideki “bilgi arayan” tıklamalar. AI özeti o soruyu sayfada yanıtlayınca blog tıklaması düşüyor; tıklayan kişi ise satın almaya daha yakın geliyor.</p>
<p>Sektör farkı önemli: perakendede trafik kaybı daha sert görülebilir, B2B’de aynı dönüşüm artışı henüz net değil. Google AI Bakışı ayda milyarlarca kullanıcıya hizmet veriyor; Dentsu müşterilerinde trafik düşüşünün ana nedeni olarak işaret ediliyor. Gelir düşüşü ise otomatik gelmiyor.</p>
<h2>Klasik SEO bitmiyor, AEO ekleniyor</h2>
<p>Answer Engine Optimization (AEO), içeriği yalnızca Google sıralaması için değil, yapay zekâ özetine kaynak olacak şekilde yazmak demek. MediaCat’te Clickzone’dan Alper Boyer’in vurguladığı çerçeve ajans işine doğrudan oturuyor:</p>
<ul>
<li>Soyut pazarlama dili yerine ölçülebilir, teknik, kanıtlanabilir cümleler</li>
<li>Yapılandırılmış başlıklar, listeler, SSS ve net tanımlar</li>
<li>Sektör otoritesi: alıntı, referans, kullanıcı yorumu, güvenilir dış bağlantı</li>
<li>Botun tarayabileceği teknik altyapı: hız, index, schema, güncel içerik</li>
</ul>
<p>AI, “harika tasarım” demez; “GOTS sertifikalı, 14 günde teslim, Denizli Merkezefendi ofis” der. Marka metnini bu yüzden yeniden yazmak gerekiyor.</p>
<h2>Search Console’da AI görünürlüğü</h2>
<p>Ağustos sonu itibarıyla Google, Search Console’da üretken AI performans raporlarını genişletti. AI Overviews, AI Mode ve Discover AI gösterimleri sayfa, ülke, cihaz ve tarihe göre izlenebiliyor. Sınır net: <strong>görünürlük var, tıklama ve sorgu kırılımı yok</strong>. Yani “oradayız”ı görürsünüz, “kaç lead geldi?”yi hâlâ GA4 ve CRM’den okursunuz.</p>
<p>Ajans rutini buna göre güncellenmeli:</p>
<ul>
<li>Haftalık: Search Console AI raporu + en kritik 10 sorgunun AI Modu testi</li>
<li>Aylık: trafik düşen içeriklerde dönüşüm oranı ve gelir karşılaştırması</li>
<li>İçerik: rehber yazıları silmek yerine, özetlenebilir “kaynak sayfa” haline getirmek</li>
</ul>
<h2>Ajanslar ne yapmalı?</h2>
<p>Üst huniyi kapatmak yanlış. AI, bilgi arayanı filtreler; marka o bilgiyi üretmezse kaynak da olmaz. Doğru hamle: blog ve hizmet sayfalarını soru–cevap iskeletine çekmek, LocalBusiness ve FAQ şemasını korumak, dönüşüm olaylarını tıklama düşmeden önce sıkılaştırmak.</p>
<p>Denizli ve Türkiye genelindeki kurumsal markalar için pratik sonuç şu: <strong>trafik KPI’sını tek başına başarının ölçüsü olmaktan çıkarın</strong>. Nitelikli form, teklif ve satış aynı dönemde yükselirse AI arama sizin lehinize çalışıyordur.</p>
<p><em>Bu içerik Genua Digital tarafından, SEO ve performans ekipleri için hazırlanmıştır. Sektör notları MediaCat ve ajans raporlarından derlenmiştir.</em></p>
<p><a href="seo.html">SEO hizmetimizi</a> inceleyebilir veya <a href="teklif-al.html">görünürlük planı</a> isteyebilirsiniz.</p>`,
  },
  {
    slug: 'tiktok-agentic-hub-ajanli-yapay-zeka',
    title: 'TikTok Agentic Hub: Reklamcılıkta ajanlı yapay zekâ dönemi başladı',
    excerpt:
      'TikTok, içerik üreten yapay zekâdan hedefi anlayıp aksiyon alan ajanlara geçiyor. Agentic Hub ve MCP, ajans operasyonunu nasıl değiştirir?',
    category: 'Reklam',
    cover_image_url: cover('tiktok-agentic-hub.jpg'),
    author_name: 'Genua Ekibi',
    read_time_minutes: 6,
    meta_title: 'TikTok Agentic Hub Nedir? Ajanlı Yapay Zekâ ve Ajanslar | Genua',
    meta_description:
      'TikTok Agentic Hub ve MCP ile reklamcılık ajanlı yapay zekâya geçiyor. HubSpot, Wix ve ölçüm ortakları ajans iş akışını nasıl değiştiriyor?',
    tags: ['TikTok', 'yapay zekâ', 'reklam teknolojisi', 'ajans', 'otomatik kampanya'],
    status: 'published',
    published_at: '2026-09-05T08:00:00Z',
    display_order: -2,
    is_featured: false,
    content: `<p>Yapay zekâ tartışması uzun süre “metin, görsel, video üretsin” cümlesinde kaldı. MediaCat’in aktardığı TikTok hamlesi başka bir kapı açıyor: <strong>ajanlı yapay zekâ</strong>. Yani sistemi birbirine bağlayan, hedefi okuyan ve rutin işi kendi yürüten katman.</p>
<p>TikTok Reklam Platformları ve Ajans İlişkileri Küresel Başkanı Qing Lan’ın çerçevesi net: pazarlamacının yeni bir üretici araca değil, dağınık sistemleri konuşturan akıllı bir omurgaya ihtiyacı var. Bu omurga <strong>TikTok Agentic Hub</strong> ve <strong>TikTok for Business MCP</strong> (Model Context Protocol) olarak duyuruldu.</p>
<h2>Üretmek yetmiyor, eyleme geçmek gerekiyor</h2>
<p>Ajans gününün büyük kısmı hâlâ kopyala–yapıştır. Form lead’ini CRM’e taşımak, katalogu güncellemek, bütçe sapmasını fark etmek, kreatif varyasyonu yayınlamak. Üretken modeller bu işi hızlandırır; ajanlar ise tetikleyip tamamlar.</p>
<p>Hub’ın ilk ortakları arasında HubSpot, Wix, Constant Contact, WorkMagic, Innovid ve Kochava var. Örnekler pratik:</p>
<ul>
<li><strong>HubSpot:</strong> TikTok form lead’i CRM’e otomatik akar, manuel aktarım biter.</li>
<li><strong>Wix:</strong> satış verisinden ürün, kitle, kreatif yön ve bütçe önerisi üretir.</li>
<li><strong>WorkMagic:</strong> Shop ve üçüncü parti e-ticaretteki dolaylı geliri ölçmeye çalışır.</li>
<li><strong>Kochava:</strong> harcama riskini önceden işaretler.</li>
</ul>
<h2>Bu, ajansı küçültmez — rolünü kaydırır</h2>
<p>Aynı dönemde WPP Open Pro ve Ogilvy’nin değer tartışması da aynı yere çıkıyor: saat satmak zorlaşıyor, strateji ve denetim değerleniyor. Makine kampanyayı kurabilir. Yanlış dönüşümü optimize ederse de kusursuzca yanlış çalışır.</p>
<p>Bağımsız ajanslar için fırsat burada. Holdingler platform ve otomasyon ölçeğine yatırım yapıyor. Küçük ve orta ölçekli ekipler ise kültürel hikâye, marka fit ve insan denetiminde daha çevik. MediaCat’in bağımsız ajans notu da bu: üretim ucuzladıkça sıradanlaşan görselin karşısında duran şey, doğru hikâyedir.</p>
<h2>Operasyonda dört kırmızı çizgi</h2>
<ol>
<li><strong>Önce ölçüm.</strong> Ajanı, yanlış dönüşüm olayına bağlarsanız bütçeyi hızla yakar.</li>
<li><strong>Marka koruması.</strong> Otonom kreatif marka dilini aşmamalı; onay katmanı kalmalı.</li>
<li><strong>Veri sınırı.</strong> CRM, katalog ve müşteri verisi hangi ajanın elinde, net yazılmalı.</li>
<li><strong>Haftalık denetim.</strong> “Kurup unutmak” 2026’da en pahalı medya hatası.</li>
</ol>
<h2>Türkiye’deki markalar için ne değişir?</h2>
<p>Her hesap yarın Agentic Hub’da yaşamaz. Ama yön belli: TikTok, Meta ve Google tarafında otomasyon katmanı kalınlaşıyor. Ajans teklifi “kaç kreatif, kaç reklam seti” olmaktan çıkıp “hangi hedef, hangi veri, hangi durdurma kuralı”na dönüyor.</p>
<p>Genua olarak bu dönüşümü tehdit değil, üretim hızı + insan stratejisi denklemi olarak okuyoruz. Ajan işi taşır; markanın neden o dünyada durduğunu hâlâ ekip yazar.</p>
<p><em>Bu içerik Genua Digital tarafından, medya ve performans ekipleri için hazırlanmıştır. Duyuru özeti MediaCat haberine dayanır.</em></p>
<p><a href="dijital-reklam.html">Dijital reklam</a> hizmetimizi inceleyebilir veya <a href="teklif-al.html">kampanya planı</a> isteyebilirsiniz.</p>`,
  },
  {
    slug: 'creator-marketing-marka-hatirlanmasi',
    title: 'Creator marketing’de beğenilmek yetmiyor: Markayı hatırlatan iş nasıl kurulur?',
    excerpt:
      'System1, WPP Media ve TikTok araştırması: etkileşim ile marka hafızası aynı şey değil. Creator seçiminde fame değil, brand fit öne çıkıyor.',
    category: 'Reklam Stratejisi',
    cover_image_url: cover('creator-marketing-brand-memory.jpg'),
    author_name: 'Genua Ekibi',
    read_time_minutes: 7,
    meta_title: 'Creator Marketing 2026: Etkileşim Değil Marka Hatırlanması | Genua',
    meta_description:
      'System1 araştırması: creator reklamlarının yalnızca %29’u ortalama marka reklamından daha fazla hatırlanma üretir. Brand fit, DBA ve ilk 2 saniye ajans rehberi.',
    tags: ['creator marketing', 'influencer', 'marka', 'TikTok', 'reklam stratejisi'],
    status: 'published',
    published_at: '2026-09-04T08:00:00Z',
    display_order: -1,
    is_featured: false,
    content: `<p>Markalar creator ile iş birliği yapıyor, izlenme alıyor, yorum sayıyor. MediaCat’in Cannes notlarında System1’dan Andrew Tindall’ın sorduğu soru ise daha sert: <strong>İnsanlar içeriği beğeniyor olabilir. Markanızı hatırlıyorlar mı?</strong></p>
<p>WPP Media, System1 ve TikTok’un sekiz pazarlık çalışması (1.217 ücretli TikTok reklamı, 183 binden fazla yanıt) creator’ın hem performans hem marka inşası üretebildiğini gösteriyor. Ama her iş birliği marka inşa etmiyor.</p>
<h2>Rakamlar: potansiyel yüksek, dağılım adaletsiz</h2>
<p>Creator merkezli reklamlar, kısa format marka reklamına göre ortalama <strong>yüzde 23 daha fazla brand memory lift</strong> üretiyor. Yani izleyici hem reklamı hem markayı daha sonra hatırlayabiliyor. İkinci katman daha çarpıcı:</p>
<ul>
<li>Creator reklamlarının yalnızca <strong>yüzde 29’u</strong> ortalama marka reklamının üzerine çıkıyor.</li>
<li>En iyi <strong>yüzde 20</strong> iş, toplam hatırlanma artışının <strong>yüzde 45’ini</strong> taşıyor.</li>
</ul>
<p>Kanalı “creator’a para basınca büyür” diye okumak bu yüzden yanıltıcı. Birkaç doğru eşleşme tüm raporu yukarı çeker; geri kalanı gürültüdür.</p>
<h2>Etkileşim, hatırlanmayı garanti etmez</h2>
<p>Raporun en sert bulgusu: <strong>engagement rate ile brand memory lift arasında anlamlı ilişki yok</strong>. Şaka tutmuş, trend yakalanmış, yorumlar şişmiş olabilir. Marka o sahnenin içinden görünmeden çıkmış da olabilir.</p>
<p>Ajans ölçüm dilini değiştirmek gerekiyor. “Bu film kaç beğeni aldı?” yerine “Bu iş markayı hafızaya yazdı mı?” Asıl KPI brand memory, satışa yakınlık ve distinctive brand assets’in (DBA) görünürlüğü.</p>
<h2>Doğru creator, en kalabalık creator değil</h2>
<p>Takipçi hâlâ en kolay satın alma kriteri. Araştırma iki başka değişkeni öne çıkarıyor: <strong>creator fame</strong> (izleyici o dünyayı tanıyor mu?) ve <strong>brand fit</strong> (marka o dünyada doğal mı?). Fit, fame’den daha güçlü. Tanınan creator + güçlü fit bir araya gelince hatırlanma neredeyse ikiye katlanıyor.</p>
<p>Yüksek takipçili ama “kiralanmış erişim aracı” gibi duran işler izlenir, marka kalmaz. Daha küçük, markanın ihtiyacıyla aynı hayatı yaşayan creator çoğu zaman daha ucuz ve daha kalıcıdır.</p>
<h2>İlk iki saniye: logo şart değil, DBA şart</h2>
<p>Marka çok erken girince reklam kokar, çok geç kalınca içerik hatırlanır marka unutulur. Araştırmanın somut aralığı: ilk iki saniyede <strong>iki ila dört ayırt edici marka varlığı</strong>. Logo olmak zorunda değil. Renk, ses, ambalaj formu, slogan, maskot, mekân — izleyici hissi kime yazacağını anlamalı.</p>
<p>Tindall’ın creative quality tanımı tam burada: pozitif duygu + erken ama doğal markalama. Brief bu ikisini kurtarmaz; strateji aşamasında ihtiyaç, creator dünyası ve marka rolü çözülmeden “ürünü biraz daha göster” demek işe yaramaz.</p>
<h2>Ajans brief’ini ikiye bölün</h2>
<ol>
<li><strong>Strateji:</strong> Hangi insan ihtiyacı? Hangi creator dünyası bunu doğal yaşatır? Markanın o sahnede inandırıcı bir rolü var mı?</li>
<li><strong>Brief:</strong> Duygu, platform dili, ilk iki saniye DBA, ürünün hikâyedeki işlevi.</li>
</ol>
<p>Creative quality, fame ve fit birlikte güçlüyse hatırlanma zayıf örneklere göre neredeyse dört katına çıkabiliyor. Bu yüzden creator listesi değil, creator dünyası seçilir.</p>
<h2>Sonuç</h2>
<p>2026’da influencer bütçesi “kaç takipçi, kaç Reels” tablosu olamaz. Beğenilen ama hatırlanmayan iş, medya israfıdır. Markayı erken, doğal ve ölçülebilir varlıklarla sahneye yazan işler kalır.</p>
<p><em>Bu içerik Genua Digital tarafından, marka ve sosyal ekipler için hazırlanmıştır. Araştırma özeti MediaCat / System1 oturum notlarına dayanır.</em></p>
<p><a href="sosyal-medya.html">Sosyal medya</a> ve <a href="icerik-uretimi.html">içerik üretimi</a> hizmetlerimizi inceleyebilir veya <a href="teklif-al.html">creator planı</a> isteyebilirsiniz.</p>`,
  },
];

await supabase.from('blog_posts').update({ is_featured: false }).neq('slug', featuredSlug);

for (const post of posts) {
  const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', post.slug).maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from('blog_posts').update(post).eq('id', existing.id);
    if (error) {
      console.error(`! Güncellenemedi ${post.slug}:`, error.message);
      continue;
    }
    console.log(`↻ ${post.title}`);
    continue;
  }

  const { error } = await supabase.from('blog_posts').insert(post);
  if (error) {
    console.error(`! Eklenemedi ${post.slug}:`, error.message);
    continue;
  }
  console.log(`✓ ${post.title}`);
}

console.log('Bitti.');
