CREATE TABLE IF NOT EXISTS featured_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT DEFAULT 'Referans Marka',
  cover_image_url TEXT,
  logo_url TEXT,
  short_description TEXT,
  project_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_featured_references_updated_at ON featured_references;
CREATE TRIGGER update_featured_references_updated_at
  BEFORE UPDATE ON featured_references
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS featured_references_active_order_idx
  ON featured_references (is_active, display_order);

ALTER TABLE featured_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active featured references" ON featured_references;
CREATE POLICY "Public read active featured references"
  ON featured_references FOR SELECT USING (is_active = TRUE);

INSERT INTO featured_references (slug, title, category, cover_image_url, logo_url, short_description, project_url, display_order, is_active)
SELECT * FROM (
  VALUES
    (
      'togg',
      'Togg',
      'Referans Marka',
      'varlıklar/resimler/projeler/togg.jpg',
      'varlıklar/resimler/logolar/togg.svg',
      'Referans markalarımız arasında yer alan Togg için dijital iletişim ve kreatif üretim çalışmaları yürüttük.',
      'https://www.togg.com.tr/',
      1,
      TRUE
    ),
    (
      'bosendorfer',
      'Bösendorfer',
      'Referans Marka',
      'varlıklar/resimler/projeler/bosendorfer.jpg',
      'varlıklar/resimler/logolar/bosendorfer.svg',
      'Premium piyano markası Bösendorfer için etkinlik tanıtımı ve dijital marka görünürlüğü desteği sağladık.',
      'https://www.boesendorfer.com/',
      2,
      TRUE
    ),
    (
      'buyuk-sehir-hastanesi',
      'Büyük Şehir Hastanesi',
      'Referans Marka',
      'varlıklar/resimler/projeler/buyuk-sehir-hastanesi.jpg',
      'varlıklar/resimler/logolar/saglik-bakanligi.png',
      'Sağlık kurumları için bilgilendirme içerikleri, dijital iletişim ve güven odaklı kreatif üretim.',
      'https://www.saglik.gov.tr/',
      3,
      TRUE
    )
) AS seed(slug, title, category, cover_image_url, logo_url, short_description, project_url, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM featured_references LIMIT 1);
