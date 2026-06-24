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

const resumeContent = `
<p class="resume-lead">Kurucu &amp; Stratejist — Genua Reklam Ajansı · Denizli</p>
<section>
  <h4>Profil</h4>
  <p>2022 yılında Denizli'de kurduğu Genua Reklam Ajansı ile markaların dijital iletişimini strateji, kreatif üretim ve performans pazarlamasını bir araya getirerek büyüten bir girişimci ve stratejist. Kamu kurumlarından yerel işletmelere geniş bir yelpazede marka kimliği, sosyal medya, dijital reklam ve web tasarım projeleri yürütür.</p>
</section>
<section>
  <h4>Deneyim</h4>
  <ul>
    <li><strong>Kurucu &amp; Stratejist</strong> — Genua Reklam Ajansı · 2022 – Günümüz<br>Marka danışmanlığı, Google &amp; Meta reklam yönetimi, sosyal medya operasyonu, web tasarım ve içerik üretimi projelerinin stratejik liderliği.</li>
    <li><strong>Grafik Tasarım &amp; Dijital Medya</strong> · 2019 – Günümüz<br>Marka kimliği, kampanya kreatifleri, dijital arayüzler ve prodüksiyon odaklı projeler.</li>
  </ul>
</section>
<section>
  <h4>Uzmanlık Alanları</h4>
  <ul>
    <li>Kurumsal marka stratejisi ve logo / kimlik tasarımı</li>
    <li>Google Ads &amp; Meta Ads kampanya yönetimi</li>
    <li>Sosyal medya içerik sistemi ve topluluk yönetimi</li>
    <li>Web arayüz tasarımı ve dijital dönüşüm projeleri</li>
    <li>İçerik üretimi, prodüksiyon ve kampanya kreatifleri</li>
    <li>Kamu kurumları iletişim danışmanlığı</li>
  </ul>
</section>
<section>
  <h4>Bağlantılar</h4>
  <ul>
    <li><a href="https://tr.linkedin.com/in/umutavc%C4%B1" target="_blank" rel="noopener">LinkedIn</a></li>
    <li><a href="https://www.behance.net/umutavci4" target="_blank" rel="noopener">Behance</a></li>
    <li><a href="https://www.instagram.com/genuadigital/" target="_blank" rel="noopener">Instagram — Genua</a></li>
  </ul>
</section>`.trim();

const { data: member, error: readError } = await supabase
  .from('team_members')
  .select('id, full_name')
  .ilike('full_name', '%Umut Avc%')
  .limit(1)
  .maybeSingle();

if (readError) {
  console.error('Ekip kaydı okunamadı:', readError.message);
  process.exit(1);
}

if (!member?.id) {
  console.error('Umut Avcı ekip kaydı bulunamadı.');
  process.exit(1);
}

let { error } = await supabase.from('team_members').update({ resume_content: resumeContent }).eq('id', member.id);

if (error?.message?.includes('resume_content')) {
  console.warn('resume_content kolonu yok; migration çalıştırılmalı.');
  process.exit(1);
}

if (error) {
  console.error('Güncelleme başarısız:', error.message);
  process.exit(1);
}

console.log('Umut Avcı özgeçmişi güncellendi:', member.full_name);
