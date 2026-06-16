-- Admin panel site ayarları: SEO ve hero metinleri
UPDATE site_settings SET
  site_title = 'Genua Reklam Ajansı',
  site_description = 'Denizli merkezli Genua Reklam Ajansı; dijital reklam, sosyal medya yönetimi, marka tasarımı ve içerik üretimi ile markanızı büyütür. Kamu ve kurumsal projelerde deneyimli ekip.',
  site_keywords = 'dijital reklam ajansı denizli, sosyal medya ajansı, reklam ajansı denizli, dijital pazarlama, google ads yönetimi, meta reklam, marka tasarımı, içerik üretimi, genua reklam ajansı',
  contact_email = 'hello@genuadigital.com',
  contact_phone = '0551 124 53 06',
  contact_address = 'Denizli, Türkiye',
  social_instagram = 'https://www.instagram.com/genuadigital/',
  social_linkedin = 'https://tr.linkedin.com/company/genua-digital-media-agency',
  social_behance = 'https://www.behance.net/umutavci4',
  hero_title = 'Markanızı Büyütüyoruz.',
  hero_subtitle = 'Strateji, kreatif ve performansı aynı masada birleştiren Denizli merkezli dijital reklam ajansı.',
  hero_cta_primary_text = 'Portföyümüzü İncele',
  hero_cta_primary_url = '/portfolyo.html',
  hero_cta_secondary_text = 'Teklif Al',
  hero_cta_secondary_url = '/teklif-al.html',
  footer_description = 'Denizli merkezli dijital medya ve reklam ajansı. Dijital reklam, sosyal medya, marka tasarımı ve içerik üretiminde kurumsal çözümler.',
  footer_copyright = '© 2026 Genua Reklam Ajansı. Tüm hakları saklıdır.',
  meta_og_image_url = 'https://genuareklam.com/varlıklar/resimler/genua-og.svg',
  updated_at = NOW()
WHERE id IN (SELECT id FROM site_settings LIMIT 1);

INSERT INTO site_settings (
  site_title, site_description, site_keywords, contact_email, contact_phone, contact_address,
  social_instagram, social_linkedin, social_behance, hero_title, hero_subtitle,
  hero_cta_primary_text, hero_cta_primary_url, hero_cta_secondary_text, hero_cta_secondary_url,
  footer_description, footer_copyright, meta_og_image_url
)
SELECT
  'Genua Reklam Ajansı',
  'Denizli merkezli Genua Reklam Ajansı; dijital reklam, sosyal medya yönetimi, marka tasarımı ve içerik üretimi ile markanızı büyütür. Kamu ve kurumsal projelerde deneyimli ekip.',
  'dijital reklam ajansı denizli, sosyal medya ajansı, reklam ajansı denizli, dijital pazarlama, google ads yönetimi, meta reklam, marka tasarımı, içerik üretimi, genua reklam ajansı',
  'hello@genuadigital.com',
  '0551 124 53 06',
  'Denizli, Türkiye',
  'https://www.instagram.com/genuadigital/',
  'https://tr.linkedin.com/company/genua-digital-media-agency',
  'https://www.behance.net/umutavci4',
  'Markanızı Büyütüyoruz.',
  'Strateji, kreatif ve performansı aynı masada birleştiren Denizli merkezli dijital reklam ajansı.',
  'Portföyümüzü İncele',
  '/portfolyo.html',
  'Teklif Al',
  '/teklif-al.html',
  'Denizli merkezli dijital medya ve reklam ajansı. Dijital reklam, sosyal medya, marka tasarımı ve içerik üretiminde kurumsal çözümler.',
  '© 2026 Genua Reklam Ajansı. Tüm hakları saklıdır.',
  'https://genuareklam.com/varlıklar/resimler/genua-og.svg'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);
