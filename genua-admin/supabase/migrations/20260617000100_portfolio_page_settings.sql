ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS portfolio_hero_eyebrow TEXT DEFAULT 'Seçilmiş İşler',
  ADD COLUMN IF NOT EXISTS portfolio_hero_title TEXT DEFAULT 'Stratejiyle başlayan, sonuçla kanıtlanan projeler.',
  ADD COLUMN IF NOT EXISTS portfolio_hero_description TEXT DEFAULT 'Farklı sektörlerde markaların görünürlüğünü, iletişim kalitesini ve dönüşüm performansını büyüttüğümüz çalışmalardan seçkiler.';
