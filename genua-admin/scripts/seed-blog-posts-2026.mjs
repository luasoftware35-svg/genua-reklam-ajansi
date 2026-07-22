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

const posts = [
  {
    slug: 'sony-fx5-tanitildi-ozellikleri-fiyati',
    title: 'Sony FX5 Tanıtıldı: Cinema Line\'ın Yeni Gözdesi Geldi (2026)',
    excerpt:
      'Sony FX5 resmen tanıtıldı! Açık kapı 5K kayıt, dahili X-OCN RAW, üçlü baz ISO ve daha fazlası. Fiyat, çıkış tarihi ve tüm detaylar burada.',
    content: `<p>Sony, bugün (22 Temmuz 2026) uzun süredir konuşulan yeni Cinema Line kamerası <strong>FX5</strong>'i resmen tanıttı. FX3'ün "küçük kardeşi" değil, doğrudan VENICE ve BURANO serisinden inen teknolojileri kompakt bir gövdeye taşıyan yepyeni bir model olarak lanse edilen FX5, içerik üreticilerinden bağımsız yapımcılara kadar geniş bir kitlenin gündemine oturdu.</p>
<p>Peki bu kamerayı bu kadar konuşulur yapan ne? Kısaca özetleyelim.</p>
<h2>Sony FX5'in Öne Çıkan Özellikleri</h2>
<ul>
<li><strong>Yeni sensör:</strong> Tam kare, tamamen stacked (yığınlı) Exmor RS CMOS sensör ve yapay zekâ işleme birimine sahip yeni nesil BIONZ XR2 işlemci</li>
<li><strong>15+ stop dinamik aralık</strong> (S-Log3 modunda)</li>
<li><strong>Üçlü baz ISO</strong> desteği ve Dual Gain Shooting modu ile düşük ışıkta daha temiz görüntü</li>
<li><strong>Cinema Line tarihinde bir ilk:</strong> Açık kapı (Open Gate) 3:2 tam sensör kayıt desteği</li>
<li><strong>Dahili RAW kayıt:</strong> Sony'nin kendi X-OCN formatında, önceden çok daha pahalı kameralara özel olan bu özellik artık FX5'te</li>
<li><strong>Kayıt hızları:</strong> 5K'da 60 fps'e, 4K'da 120 fps'e, Full HD'de ise 240 fps'e kadar</li>
<li>Çıkarılabilir OLED vizör ve 32-bit float ses kaydı destekleyen yeni XLR tutamak gibi opsiyonel aksesuarlar</li>
<li>Çift UHS-II SD / CFexpress Type A kart yuvası, tri-band WiFi ve gelişmiş bağlantı seçenekleri</li>
</ul>
<p>Sony'nin açıklamasına göre FX5, FX3'ün yerini almıyor; iki model de Cinema Line'da yan yana satışta kalacak. Bu da FX5'i daha çok profesyonel prodüksiyon, belgesel ve reklam filmi çekimlerine yönelik konumlandırıyor.</p>
<h2>Fiyat ve Çıkış Tarihi</h2>
<p>FX5, 22 Temmuz itibarıyla ön siparişe açıldı, teslimatlar ise Ağustos 2026'da başlayacak. Fiyatlandırma bölgeye göre değişmekle birlikte öne çıkan rakamlar şöyle:</p>
<ul>
<li><strong>ILME-FX5B (sadece gövde):</strong> ABD'de yaklaşık 4.899 dolar</li>
<li><strong>ILME-FX5 (XLR tutamak kiti ile):</strong> ABD'de yaklaşık 5.499 dolar</li>
<li>Avrupa'da gövde fiyatı yaklaşık 5.400 Euro, tutamak kitiyle birlikte 6.000 Euro seviyesinde</li>
</ul>
<p>Bu fiyat, FX5'i FX3'ün oldukça üzerine, VENICE ve BURANO'nun ise altına konumlandırıyor; yani "orta segment profesyonel" diyebileceğimiz yeni bir kategori açıyor.</p>
<h2>Bu Kamera Kimin İşine Yarar?</h2>
<p>FX5, özellikle şu profillerdeki içerik üreticileri ve prodüksiyon ekipleri için dikkat çekici:</p>
<ul>
<li>Reklam ajansları ve marka içerikleri üreten prodüksiyon ekipleri</li>
<li>Belgesel yönetmenleri ve saha çekimi yapan gazeteciler</li>
<li>Gimbal, drone gibi hareketli ekipmanlarla çalışan operatörler</li>
<li>Post prodüksiyonda renk derinliği ve esneklik arayan kurgu/renk ekipleri</li>
</ul>
<p>Kompakt gövdesine rağmen VENICE'den gelen renk bilimi ve iş akışını sunması, FX5'i tek kişilik operatörlerden küçük prodüksiyon ekiplerine kadar geniş bir kitle için cazip kılıyor.</p>
<h2>Sonuç</h2>
<p>Sony FX5, kompakt cinema kameralarda "giriş seviyesi" ile "profesyonel flagship" arasındaki mesafeyi belirgin şekilde kısaltıyor. Açık kapı kayıt, dahili RAW ve üçlü baz ISO gibi özellikler daha önce çok daha yüksek bütçeli kameralara özeldi; şimdi bu teknolojiler daha erişilebilir bir noktaya iniyor.</p>
<p>Siz FX5'i işinize katmayı düşünüyor musunuz, yoksa FX3 veya FX6 hâlâ ekibiniz için daha mantıklı mı? Görüşlerinizi yorumlarda paylaşabilirsiniz.</p>
<p><em>Bu içerik Genua Digital tarafından, içerik üreticileri ve prodüksiyon ekipleri için hazırlanmıştır. Kamera ve ekipman haberlerini kaçırmamak için bizi takip edin.</em></p>
<p><a href="icerik-uretimi.html">İçerik üretimi hizmetlerimizi</a> inceleyebilir veya <a href="teklif-al.html">prodüksiyon teklifi</a> alabilirsiniz.</p>`,
    category: 'Kamera & Ekipman Haberleri',
    cover_image_url: 'varlıklar/resimler/blog/sony-fx5.jpg',
    author_name: 'Genua Ekibi',
    read_time_minutes: 6,
    meta_title: 'Sony FX5 Tanıtıldı: Özellikleri ve Fiyatı (2026) | Genua Blog',
    meta_description:
      'Sony FX5 resmen tanıtıldı! Açık kapı 5K kayıt, dahili X-OCN RAW, üçlü baz ISO ve daha fazlası. Fiyat, çıkış tarihi ve tüm detaylar burada.',
    tags: ['Sony FX5', 'Cinema Line', 'sinema kamerası', 'içerik üretimi', 'video ekipmanları'],
    status: 'published',
    published_at: '2026-07-22T09:00:00Z',
    display_order: 0,
    is_featured: true,
  },
  {
    slug: '2026-dijital-reklam-yasaklari-markalar-icin-rehber',
    title: "2026'da dijital reklam yasakları: markaların bilmesi gerekenler",
    excerpt:
      '2026 yılında güncellenen reklam düzenlemeleri, yasaklı içerikler ve markaların kampanya planlamasında dikkat etmesi gereken yasal çerçeve.',
    content: `<p>2026 yılında dijital reklam ekosistemi hem daha şeffaf hem de daha denetimli hale geldi. Reklam Kurulu kararları, Ticaret Bakanlığı uygulamaları ve platform politikaları birlikte değerlendirildiğinde markaların kampanya üretim sürecine yasal çerçeveyi baştan dahil etmesi artık zorunluluk.</p>
<h2>Hangi reklam türleri yasak veya kısıtlı?</h2>
<p>Tütün, tütün ürünleri, elektronik sigara ve alkol reklamları dijital mecralarda yasaklanmaya devam ediyor. Sağlık beyanı içeren ürünlerde kanıtlanmamış tedavi vaatleri, hızlı kilo verme iddiaları ve tıbbi sonuç garantileri Reklam Kurulu tarafından sıkça durduruluyor.</p>
<p>Çocukları hedefleyen yanıltıcı kampanyalar, karşılaştırmalı reklamlarda dayanaksız üstünlük iddiaları ve tüketiciyi manipüle eden fiyat/sunum biçimleri de 2026 düzenlemelerinde daha sıkı denetleniyor.</p>
<h2>Dijital reklamcılıkta yeni şeffaflık beklentisi</h2>
<p>Özellikle influencer iş birliklerinde reklam niteliği açıkça belirtilmeli. #reklam, #işbirliği veya #sponsor etiketleri görünür ve anlaşılır biçimde kullanılmalı. Gizli sponsorluk, ürün yerleştirme ve hediye karşılığı paylaşımlar artık yalnızca etik değil, hukuki risk de taşıyor.</p>
<h2>Veri ve hedefleme tarafında dikkat edilmesi gerekenler</h2>
<p>Kişisel verilerin reklam hedeflemesinde kullanımı KVKK çerçevesinde değerlendiriliyor. Açık rıza olmadan hassas veri segmentasyonu, yanıltıcı çerez bildirimleri ve kullanıcıyı yanıltan opt-in akışları markalar için cezai yaptırım riski oluşturuyor.</p>
<h2>Markalar için pratik kontrol listesi</h2>
<p>Kampanya yayına alınmadan önce kreatif metin, görsel, hedef kitle, influencer sözleşmesi ve landing page uyumu tek dosyada kontrol edilmeli. Ajans tarafında brief aşamasında yasal uygunluk maddesi standart hale getirilmeli.</p>
<p>Genua olarak kurumsal markaların kampanyalarını yayına almadan önce kreatif, hedefleme ve mecra uygunluğunu birlikte değerlendiriyoruz. Yasal çerçeveye uygun reklam üretimi için ekibimizle görüşebilirsiniz.</p>`,
    category: 'Reklam Hukuku',
    cover_image_url: 'varlıklar/resimler/blog/reklam-kreatif.jpg',
    author_name: 'Genua Ekibi',
    read_time_minutes: 7,
    meta_title: '2026 Dijital Reklam Yasakları | Genua Blog',
    meta_description:
      '2026 yılında dijital reklam yasakları, influencer şeffaflığı ve markaların kampanya planlamasında dikkat etmesi gereken yasal çerçeve.',
    tags: ['reklam yasakları', '2026', 'dijital reklam', 'reklam kurulu'],
    status: 'published',
    published_at: '2026-06-20T09:00:00Z',
    display_order: 1,
    is_featured: false,
  },
  {
    slug: '2026-influencer-reklam-kurallari-isbirligi-etiketleri',
    title: '2026 influencer reklam kuralları: #işbirliği ve şeffaflık rehberi',
    excerpt:
      "Influencer pazarlamasında 2026'da öne çıkan yasal zorunluluklar, etiket kullanımı ve markaların sözleşme aşamasında kontrol etmesi gereken maddeler.",
    content: `<p>Influencer pazarlama 2026'da hâlâ en hızlı büyüyen kanallardan biri; ancak denetim de aynı hızda artıyor. Tüketicinin reklam ile organik içerik arasındaki farkı net görememesi, hem marka itibarı hem de hukuki uygunluk açısından risk yaratıyor.</p>
<h2>Influencer içeriklerinde zorunlu şeffaflık</h2>
<p>Ücretli iş birliklerinde içeriğin başında veya ilk üç satırda reklam niteliği açıkça belirtilmeli. #reklam, #işbirliği, #sponsor gibi etiketler küçük puntoda, ekranın dışında veya kaybolan story katmanlarında yer almamalı.</p>
<p>Hediye ürün, affiliate link, indirim kodu veya uzun vadeli marka elçiliği dahil tüm ticari ilişkiler aynı şeffaflık standardına tabi.</p>
<h2>Markaların sözleşmede istemesi gereken maddeler</h2>
<p>İçerik onay süreci, yayın tarihi, kullanım hakkı, yasaklı ifadeler listesi ve reklam etiketi zorunluluğu sözleşmeye yazılmalı. Influencer'ın sağlık, finans veya sonuç garantisi içeren ifadeler kullanmaması özellikle regüle sektörlerde kritik.</p>
<h2>Hangi içerikler daha riskli?</h2>
<p>Bitcoin/yatırım vaatleri, estetik operasyon öncesi-sonrası görseller, çocuk ürünleri, bitkisel takviye iddiaları ve karşılaştırmalı rakip ürün yorumları 2026'da en sık inceleme alan içerik türleri arasında.</p>
<h2>Doğru uygulama örneği</h2>
<p>Video açılışında "Bu içerik X markası ile ticari iş birliğidir" ifadesi, açıklama alanında #işbirliği etiketi ve kampanya landing page'inde aynı ürün vaadi kullanılmalı. Marka, influencer ve ajans aynı mesaj dilinde konuşmalı.</p>
<p>Kurumsal influencer kampanyalarınızı yasal çerçeveye uygun planlamak için Genua ekibiyle iletişime geçebilirsiniz.</p>`,
    category: 'Influencer',
    cover_image_url: 'varlıklar/resimler/blog/sosyal-medya-raporu.jpg',
    author_name: 'Genua Ekibi',
    read_time_minutes: 6,
    meta_title: '2026 Influencer Reklam Kuralları | Genua Blog',
    meta_description:
      'Influencer reklamlarında 2026 şeffaflık kuralları, #işbirliği etiketleri ve markalar için sözleşme kontrol listesi.',
    tags: ['influencer', 'işbirliği', 'reklam kuralları', '2026'],
    status: 'published',
    published_at: '2026-06-25T09:00:00Z',
    display_order: 2,
    is_featured: false,
  },
  {
    slug: 'influencer-nasil-olunur-2026-rehberi',
    title: "Influencer nasıl olunur? 2026'da markalarla çalışma rehberi",
    excerpt:
      'Sıfırdan influencer olmak isteyenler için niş seçimi, içerik planı, portföy oluşturma ve markalarla profesyonel iş birliği adımları.',
    content: `<p>Influencer olmak 2026'da yalnızca takipçi sayısı toplamak değil; belirli bir konuda güvenilirlik, düzenli üretim ve markaların aradığı profesyonel duruşu birlikte kurmak anlamına geliyor.</p>
<h2>1. Nişinizi netleştirin</h2>
<p>Her şeyi anlatmak yerine bir alanda derinleşin: güzellik, yeme-içme, teknoloji, seyahat, ebeveynlik, fitness veya yerel yaşam gibi. Niş ne kadar netse markaların sizi bulması o kadar kolaylaşır.</p>
<h2>2. Portföy hesabı gibi düşünün</h2>
<p>Profil fotoğrafı, biyografi, sabit içerikler ve son 9 gönderi görsel bütünlük taşımalı. Markalar önce profilinize bakar; dağınık bir akış profesyonel iş birliği şansını düşürür.</p>
<h2>3. Düzenli ve ölçülebilir içerik üretin</h2>
<p>Haftada en az 3 kaliteli paylaşım hedefi koyun. Reels ve kısa video formatları keşif için hâlâ en güçlü araçlar. Kaydetme, paylaşım ve yorum oranlarını not edin; hangi formatın çalıştığını veriyle görün.</p>
<h2>4. Markalarla çalışmaya nasıl başlanır?</h2>
<p>İlk iş birlikleri çoğu zaman küçük yerel markalarla başlar. Medya kiti hazırlayın: takipçi sayısı, etkileşim oranı, kitle demografisi, örnek içerikler ve iletişim bilgisi. Soğuk e-posta yerine önce markanın diline uygun örnek içerik üretin.</p>
<h2>5. Profesyonel duruş ve yasal uyum</h2>
<p>Ücretli paylaşımlarda #işbirliği etiketini kullanın, teslim tarihlerine uyun, revize sürecine açık olun. Uzun vadede markalar güvenilir ve şeffaf influencer'larla tekrar çalışır.</p>
<h2>6. Gelir kanallarını çeşitlendirin</h2>
<p>Sponsorlu içerik dışında affiliate, dijital ürün, danışmanlık ve UGC üretimi gibi kanallar geliri tek kaynağa bağımlı olmaktan kurtarır.</p>
<p>Marka tarafındaysanız doğru influencer seçimi, kampanya kurgusu ve yasal uygunluk için Genua'nın sosyal medya ve içerik ekibi size özel strateji hazırlayabilir.</p>`,
    category: 'Influencer',
    cover_image_url: 'varlıklar/resimler/blog/sosyal-medya-takvimi.jpg',
    author_name: 'Genua Ekibi',
    read_time_minutes: 8,
    meta_title: 'Influencer Nasıl Olunur? 2026 Rehberi | Genua Blog',
    meta_description:
      "2026'da influencer olmak için niş seçimi, içerik planı, medya kiti hazırlama ve markalarla profesyonel iş birliği adımları.",
    tags: ['influencer', 'içerik üretimi', 'sosyal medya', '2026'],
    status: 'published',
    published_at: '2026-07-01T09:00:00Z',
    display_order: 3,
    is_featured: false,
  },
];

await supabase.from('blog_posts').update({ is_featured: false }).neq('slug', 'sony-fx5-tanitildi-ozellikleri-fiyati');

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
