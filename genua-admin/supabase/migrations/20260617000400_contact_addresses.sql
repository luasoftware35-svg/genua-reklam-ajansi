ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS contact_studio_address TEXT;

UPDATE site_settings
SET
  contact_address = 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli',
  contact_studio_address = 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M'
WHERE contact_address IS NULL OR contact_address = 'Denizli, Türkiye';
