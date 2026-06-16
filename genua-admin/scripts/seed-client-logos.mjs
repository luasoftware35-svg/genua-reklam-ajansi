import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const envText = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error('Supabase URL veya service role key bulunamadı.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const logos = [
  ['Adalet Bakanlığı', 'varlıklar/resimler/logolar/adalet-bakanligi.svg', null, 1, true, false],
  ['Sağlık Bakanlığı', 'varlıklar/resimler/logolar/saglik-bakanligi.png', null, 2, true, false],
  ['Aile ve Sosyal Hizmetler Bakanlığı', 'varlıklar/resimler/logolar/aile-sosyal-hizmetler.svg', null, 3, true, false],
  ['Denizli Valiliği', 'varlıklar/resimler/logolar/denizli-valiligi.png', null, 4, true, false],
  ['Denizli İl Kültür Turizm Müdürlüğü', null, 'DK', 5, true, false],
  ['Orman Bakanlığı', null, 'OB', 6, true, false],
  ['Togg', null, 'TG', 7, false, false],
  ['Simya Sigorta', null, 'SS', 8, false, false],
  ['Gajah', null, 'GJ', 9, false, false],
  ['Bösendorfer', null, 'BÖ', 10, false, false],
  ['Kaburgacı Usta', null, 'KU', 11, false, false],
  ['Çağla Şeker Beauty', null, 'ÇB', 12, false, false],
  ['Hiera Coffee', null, 'HC', 13, false, false],
  ['Sağdıçlar Shop', null, 'SŞ', 14, false, false],
  ['Alfin Yapı', null, 'AY', 15, false, false],
  ['Altınordu SK', null, 'AS', 16, false, false],
  ['Anason Pera', null, 'AP', 17, false, false],
  ['Antalya Ink Fest', null, 'AIF', 18, false, false],
  ['Avare Meyhane', null, 'AM', 19, false, false],
  ['Aydın İnşaat', null, 'Aİ', 20, false, false],
  ['Belfast Efes', null, 'BE', 21, false, false],
  ['Bonin Bakery & Eatery', null, 'BB', 22, false, false],
  ['Boom Pub', null, 'BP', 23, false, false],
  ['Ciğerci Ahmet Şef', null, 'CA', 24, false, false],
  ['Denizli AK Parti Kongresi', null, 'AK', 25, false, false],
  ['Diyarbakır OSB', null, 'DO', 26, false, false],
  ['Engiz İnşaat', null, 'Eİ', 27, false, false],
  ['Flora Duvar Kağıtları', null, 'FD', 28, false, false],
  ['Gajah Dekorasyon', null, 'GD', 29, false, false],
  ['Halk Oyunları Festivali', null, 'HF', 30, false, false],
  ['HD Optik', null, 'HO', 31, false, true],
  ['Kavdemir Tarım', null, 'KT', 32, false, true],
  ['Kocatepe Tarım', null, 'KT', 33, false, true],
  ['Lufian', null, 'LF', 34, false, true],
  ['Lumix', null, 'LX', 35, false, true],
  ['Luuq Coffee (Hiera Coffee)', null, 'LC', 36, false, true],
  ['Mazzini Mobilya', null, 'MM', 37, false, true],
  ['Meftune Restoran', null, 'MR', 38, false, true],
  ['Milss', null, 'ML', 39, false, true],
  ['Müdavim Ocakbaşı & Sahne', null, 'MO', 40, false, true],
  ['Ocasso Mobilya', null, 'OM', 41, false, true],
  ['Saylanlar İnşaat', null, 'Sİ', 42, false, true],
  ['Sessli Meyhane', null, 'SM', 43, false, true],
  ['SMF Hafriyat', null, 'SH', 44, false, true],
  ['Star Yapı İnşaat', null, 'SY', 45, false, true],
  ['Timur İnşaat', null, 'Tİ', 46, false, true],
  ['Tinyhouse İnşaat', null, 'TH', 47, false, true],
  ['Tiyatro Festivali', null, 'TF', 48, false, true],
  ['Turuncu Kuruyemiş', null, 'TK', 49, false, true],
  ['Vuslat Gecesi', null, 'VG', 50, false, true],
];

async function hasExtendedColumns() {
  const { error } = await supabase.from('client_logos').select('initials,is_public_client,is_collapsed').limit(1);
  return !error;
}

async function main() {
  const { count, error: countError } = await supabase
    .from('client_logos')
    .select('*', { count: 'exact', head: true });

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) > 0) {
    console.log(`Zaten ${count} logo var, seed atlandı.`);
    return;
  }

  const extended = await hasExtendedColumns();
  const rows = logos.map(([company_name, logo_url, initials, display_order, is_public_client, is_collapsed]) => {
    if (extended) {
      return {
        company_name,
        logo_url,
        initials,
        display_order,
        is_public_client,
        is_collapsed,
        is_active: true,
      };
    }

    return {
      company_name,
      logo_url: logo_url || (initials ? `initials:${initials}` : null),
      display_order,
      is_active: true,
    };
  });

  const { error: insertError } = await supabase.from('client_logos').insert(rows);
  if (insertError) throw new Error(insertError.message);

  console.log(`${rows.length} müşteri logosu eklendi${extended ? '' : ' (temel şema)'}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
