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

const testimonials = [
  {
    client_name: 'Selin Acar',
    client_title: 'Kurucu',
    client_company: 'Çağla Şeker Beauty',
    testimonial_text:
      'Genua ile çalışmaya başladığımızda sosyal medyada tutarlı bir dilimiz yoktu. Üç aylık içerik planı, Reels çekimleri ve kampanya kurgusu sonrası hem etkileşim hem de randevu taleplerimiz belirgin şekilde arttı. En çok raporları her ay anlaşılır sunmalarını sevdik.',
    rating: 5,
    display_order: 1,
    is_featured: true,
  },
  {
    client_name: 'Kerem Yıldız',
    client_title: 'Operasyon Direktörü',
    client_company: 'Kaburgacı Usta',
    testimonial_text:
      'Restoran zinciri olarak dijitalde görünürlüğümüz sınırlıydı. Genua ekibi lokasyon bazlı Meta reklamları ve açılış dönemi kreatifleriyle yeni şubelerimizde ciddi talep yarattı. Hızlı iletişim ve sahaya yakın ekip anlayışı fark yarattı.',
    rating: 5,
    display_order: 2,
    is_featured: false,
  },
  {
    client_name: 'Aylin Tosun',
    client_title: 'Denizli Bölge Müdürü',
    client_company: 'Simya Sigorta',
    testimonial_text:
      'Sigorta sektöründe dijitalden gelen lead kalitesi her zaman kritik. Genua, landing page yapımızdan reklam metinlerine kadar süreci uçtan uca kurguladı. Beş ayda form başına maliyetimiz düştü, satış ekibimize giden başvurular daha nitelikli hale geldi.',
    rating: 5,
    display_order: 3,
    is_featured: true,
  },
  {
    client_name: 'Burak Demir',
    client_title: 'Pazarlama Müdürü',
    client_company: 'Alfin Yapı',
    testimonial_text:
      'Konut projelerimizin lansman dönemlerinde Google ve sosyal medyada aynı mesajı taşımak zordu. Genua ile marka dili, görsel sistem ve performans reklamlarını tek çatı altında topladık. Proje öncesi talep toplama kampanyalarında ölçülebilir sonuç aldık.',
    rating: 5,
    display_order: 4,
    is_featured: false,
  },
  {
    client_name: 'Defne Gürel',
    client_title: 'E-Ticaret Sorumlusu',
    client_company: 'Mazzini Mobilya',
    testimonial_text:
      'Ürün fotoğrafından katalog çekimlerine, Instagram vitrininden indirim dönemi reklamlarına kadar tüm içerik ihtiyacımızı karşıladılar. Ajans değil, içimizden biri gibi çalışıyorlar; bu da e-ticaret hedeflerimizi daha net yönetmemizi sağladı.',
    rating: 5,
    display_order: 5,
    is_featured: false,
  },
  {
    client_name: 'Onur Çelik',
    client_title: 'Kurucu Ortak',
    client_company: 'Hiera Coffee',
    testimonial_text:
      'Kafe markası olarak estetik ve mesaj tutarlılığı bizim için her şey. Genua, marka kimliğimizi dijital kanallara taşırken hiç ajans şablonu hissettirmedi. Story formatlarından mekân içi çekimlere kadar tüm üretim hızlı ve kaliteli ilerledi.',
    rating: 5,
    display_order: 6,
    is_featured: false,
  },
  {
    client_name: 'Zeynep Korkmaz',
    client_title: 'İşletme Müdürü',
    client_company: 'Meftune Restoran',
    testimonial_text:
      'Sezonluk menü duyuruları ve rezervasyon odaklı kampanyalar için kısa sürede çözüm üretmeleri işimize yaradı. Grafikten video kurgusuna kadar tek elden yönetim, operasyon yoğunken bize ciddi zaman kazandırdı.',
    rating: 5,
    display_order: 7,
    is_featured: false,
  },
  {
    client_name: 'Cem Aydın',
    client_title: 'İş Geliştirme Direktörü',
    client_company: 'Engiz İnşaat',
    testimonial_text:
      'Kurumsal inşaat firması olarak itibar yönetimi ve profesyonel görünüm önceliğimizdi. Web sitesi yenileme, kurumsal sunum setleri ve LinkedIn odaklı görünürlük çalışmasıyla müteahhit profilimizi güçlendirdik. Kamu ve kurumsal projelerdeki tecrübeleri bizi rahatlattı.',
    rating: 5,
    display_order: 8,
    is_featured: true,
  },
];

async function main() {
  const { count, error: countError } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true });

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) > 0) {
    console.log(`Zaten ${count} görüş var, seed atlandı.`);
    return;
  }

  const rows = testimonials.map((item) => ({ ...item, is_active: true }));
  const { error: insertError } = await supabase.from('testimonials').insert(rows);
  if (insertError) throw new Error(insertError.message);

  console.log(`${rows.length} müşteri görüşü eklendi.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
