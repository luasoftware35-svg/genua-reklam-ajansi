-- GENUA REKLAM AJANSI — ADMIN PANEL DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Genua Reklam Ajansı',
  site_description TEXT,
  site_keywords TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  contact_map_embed TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  social_tiktok TEXT,
  social_behance TEXT,
  hero_title TEXT DEFAULT 'Markanızı Büyütüyoruz.',
  hero_subtitle TEXT,
  hero_cta_primary_text TEXT DEFAULT 'Portföyümüzü İncele',
  hero_cta_primary_url TEXT DEFAULT '/portfolyo',
  hero_cta_secondary_text TEXT DEFAULT 'Teklif Al',
  hero_cta_secondary_url TEXT DEFAULT '/teklif-al',
  hero_bg_video_url TEXT,
  stats_counters JSONB DEFAULT '[{"label":"Proje","value":150,"suffix":"+"},{"label":"Yıl Deneyim","value":4,"suffix":""},{"label":"Kişilik Ekip","value":5,"suffix":""},{"label":"Memnuniyet","value":98,"suffix":"%"}]',
  footer_description TEXT,
  footer_copyright TEXT DEFAULT '© 2026 Genua Reklam Ajansı. Tüm hakları saklıdır.',
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  meta_og_image_url TEXT,
  portfolio_hero_eyebrow TEXT DEFAULT 'Seçilmiş İşler',
  portfolio_hero_title TEXT DEFAULT 'Stratejiyle başlayan, sonuçla kanıtlanan projeler.',
  portfolio_hero_description TEXT DEFAULT 'Farklı sektörlerde markaların görünürlüğünü, iletişim kalitesini ve dönüşüm performansını büyüttüğümüz çalışmalardan seçkiler.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  icon TEXT,
  cover_image_url TEXT,
  what_we_do JSONB DEFAULT '[]',
  tools_used JSONB DEFAULT '[]',
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  short_description TEXT,
  case_hero_title TEXT,
  case_hero_lead TEXT,
  challenge TEXT,
  strategy TEXT,
  execution TEXT,
  result TEXT,
  metrics JSONB DEFAULT '[]',
  tools_used TEXT[] DEFAULT '{}',
  project_date DATE,
  project_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  social_linkedin TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_photo_url TEXT,
  client_company_logo_url TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author_name TEXT,
  author_photo_url TEXT,
  author_title TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  read_time_minutes INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  form_type TEXT DEFAULT 'contact' CHECK (form_type IN ('contact','quote')),
  requested_services TEXT[] DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  company_name TEXT,
  company_website TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  admin_notes TEXT,
  replied_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  referrer_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  initials TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_public_client BOOLEAN DEFAULT FALSE,
  is_collapsed BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT,
  button_url TEXT,
  image_url TEXT,
  bg_color TEXT DEFAULT '#0a0a00',
  text_color TEXT DEFAULT '#ffffff',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('super_admin','admin','editor')),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS services_active_order_idx ON services (is_active, display_order);
CREATE INDEX IF NOT EXISTS projects_active_featured_order_idx ON projects (is_active, is_featured, display_order);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx ON contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS client_logos_active_order_idx ON client_logos (is_active, display_order);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active services" ON services;
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read active projects" ON projects;
CREATE POLICY "Public read active projects" ON projects FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read active team" ON team_members;
CREATE POLICY "Public read active team" ON team_members FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read active testimonials" ON testimonials;
CREATE POLICY "Public read active testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read published posts" ON blog_posts;
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Public read active logos" ON client_logos;
CREATE POLICY "Public read active logos" ON client_logos FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read active banners" ON banners;
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (TRUE);

INSERT INTO site_settings (site_title, contact_email, contact_phone, contact_address, social_instagram, social_linkedin, social_behance, footer_description)
SELECT 'Genua Reklam Ajansı', 'hello@genuadigital.com', '0551 124 53 06', 'Denizli, Türkiye', 'https://www.instagram.com/genuadigital/', 'https://tr.linkedin.com/company/genua-digital-media-agency', 'https://www.behance.net/umutavci4', 'Denizli merkezli dijital medya ve reklam ajansı.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

INSERT INTO services (slug, title, short_description, icon, display_order, is_active, is_featured) VALUES
('dijital-reklam', 'Dijital Reklam', 'Google ve Meta platformlarında hedef kitlenize ulaşın.', 'BarChart3', 1, TRUE, TRUE),
('sosyal-medya', 'Sosyal Medya Yönetimi', 'Markanızı sosyal medyada güçlü ve tutarlı şekilde konumlandırın.', 'Instagram', 2, TRUE, TRUE),
('marka-tasarim', 'Marka Tasarımı', 'Kimliğinizi yansıtan özgün logo ve marka tasarımları.', 'Palette', 3, TRUE, TRUE),
('icerik-uretimi', 'İçerik Üretimi', 'Dikkat çeken, paylaşılabilir içerikler üretiyoruz.', 'PenTool', 4, TRUE, FALSE),
('seo', 'SEO & İçerik Pazarlama', 'Arama motorlarında üst sıralara çıkın.', 'Search', 5, TRUE, FALSE),
('web-tasarim', 'Web Tasarım & Geliştirme', 'Hızlı, modern ve dönüşüm odaklı web siteleri.', 'Monitor', 6, TRUE, FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO client_logos (company_name, logo_url, initials, display_order, is_public_client, is_collapsed, is_active)
SELECT * FROM (
  VALUES
    ('Adalet Bakanlığı', 'varlıklar/resimler/logolar/adalet-bakanligi.svg', NULL::TEXT, 1, TRUE, FALSE, TRUE),
    ('Sağlık Bakanlığı', 'varlıklar/resimler/logolar/saglik-bakanligi.png', NULL, 2, TRUE, FALSE, TRUE),
    ('Aile ve Sosyal Hizmetler Bakanlığı', 'varlıklar/resimler/logolar/aile-sosyal-hizmetler.svg', NULL, 3, TRUE, FALSE, TRUE),
    ('Denizli Valiliği', 'varlıklar/resimler/logolar/denizli-valiligi.png', NULL, 4, TRUE, FALSE, TRUE),
    ('Denizli İl Kültür Turizm Müdürlüğü', NULL, 'DK', 5, TRUE, FALSE, TRUE),
    ('Orman Bakanlığı', NULL, 'OB', 6, TRUE, FALSE, TRUE),
    ('Togg', NULL, 'TG', 7, FALSE, FALSE, TRUE),
    ('Simya Sigorta', NULL, 'SS', 8, FALSE, FALSE, TRUE),
    ('Gajah', NULL, 'GJ', 9, FALSE, FALSE, TRUE),
    ('Bösendorfer', NULL, 'BÖ', 10, FALSE, FALSE, TRUE),
    ('Kaburgacı Usta', NULL, 'KU', 11, FALSE, FALSE, TRUE),
    ('Çağla Şeker Beauty', NULL, 'ÇB', 12, FALSE, FALSE, TRUE),
    ('Hiera Coffee', NULL, 'HC', 13, FALSE, FALSE, TRUE),
    ('Sağdıçlar Shop', NULL, 'SŞ', 14, FALSE, FALSE, TRUE),
    ('Alfin Yapı', NULL, 'AY', 15, FALSE, FALSE, TRUE),
    ('Altınordu SK', NULL, 'AS', 16, FALSE, FALSE, TRUE),
    ('Anason Pera', NULL, 'AP', 17, FALSE, FALSE, TRUE),
    ('Antalya Ink Fest', NULL, 'AIF', 18, FALSE, FALSE, TRUE),
    ('Avare Meyhane', NULL, 'AM', 19, FALSE, FALSE, TRUE),
    ('Aydın İnşaat', NULL, 'Aİ', 20, FALSE, FALSE, TRUE),
    ('Belfast Efes', NULL, 'BE', 21, FALSE, FALSE, TRUE),
    ('Bonin Bakery & Eatery', NULL, 'BB', 22, FALSE, FALSE, TRUE),
    ('Boom Pub', NULL, 'BP', 23, FALSE, FALSE, TRUE),
    ('Ciğerci Ahmet Şef', NULL, 'CA', 24, FALSE, FALSE, TRUE),
    ('Denizli AK Parti Kongresi', NULL, 'AK', 25, FALSE, FALSE, TRUE),
    ('Diyarbakır OSB', NULL, 'DO', 26, FALSE, FALSE, TRUE),
    ('Engiz İnşaat', NULL, 'Eİ', 27, FALSE, FALSE, TRUE),
    ('Flora Duvar Kağıtları', NULL, 'FD', 28, FALSE, FALSE, TRUE),
    ('Gajah Dekorasyon', NULL, 'GD', 29, FALSE, FALSE, TRUE),
    ('Halk Oyunları Festivali', NULL, 'HF', 30, FALSE, FALSE, TRUE),
    ('HD Optik', NULL, 'HO', 31, FALSE, TRUE, TRUE),
    ('Kavdemir Tarım', NULL, 'KT', 32, FALSE, TRUE, TRUE),
    ('Kocatepe Tarım', NULL, 'KT', 33, FALSE, TRUE, TRUE),
    ('Lufian', NULL, 'LF', 34, FALSE, TRUE, TRUE),
    ('Lumix', NULL, 'LX', 35, FALSE, TRUE, TRUE),
    ('Luuq Coffee (Hiera Coffee)', NULL, 'LC', 36, FALSE, TRUE, TRUE),
    ('Mazzini Mobilya', NULL, 'MM', 37, FALSE, TRUE, TRUE),
    ('Meftune Restoran', NULL, 'MR', 38, FALSE, TRUE, TRUE),
    ('Milss', NULL, 'ML', 39, FALSE, TRUE, TRUE),
    ('Müdavim Ocakbaşı & Sahne', NULL, 'MO', 40, FALSE, TRUE, TRUE),
    ('Ocasso Mobilya', NULL, 'OM', 41, FALSE, TRUE, TRUE),
    ('Saylanlar İnşaat', NULL, 'Sİ', 42, FALSE, TRUE, TRUE),
    ('Sessli Meyhane', NULL, 'SM', 43, FALSE, TRUE, TRUE),
    ('SMF Hafriyat', NULL, 'SH', 44, FALSE, TRUE, TRUE),
    ('Star Yapı İnşaat', NULL, 'SY', 45, FALSE, TRUE, TRUE),
    ('Timur İnşaat', NULL, 'Tİ', 46, FALSE, TRUE, TRUE),
    ('Tinyhouse İnşaat', NULL, 'TH', 47, FALSE, TRUE, TRUE),
    ('Tiyatro Festivali', NULL, 'TF', 48, FALSE, TRUE, TRUE),
    ('Turuncu Kuruyemiş', NULL, 'TK', 49, FALSE, TRUE, TRUE),
    ('Vuslat Gecesi', NULL, 'VG', 50, FALSE, TRUE, TRUE)
) AS seed(company_name, logo_url, initials, display_order, is_public_client, is_collapsed, is_active)
WHERE NOT EXISTS (SELECT 1 FROM client_logos LIMIT 1);

-- Storage setup: run after Supabase Storage is available.
INSERT INTO storage.buckets (id, name, public)
VALUES ('genua-media', 'genua-media', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read genua media" ON storage.objects;
CREATE POLICY "Public read genua media" ON storage.objects FOR SELECT USING (bucket_id = 'genua-media');
DROP POLICY IF EXISTS "Authenticated upload genua media" ON storage.objects;
CREATE POLICY "Authenticated upload genua media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'genua-media');
DROP POLICY IF EXISTS "Authenticated update genua media" ON storage.objects;
CREATE POLICY "Authenticated update genua media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'genua-media') WITH CHECK (bucket_id = 'genua-media');
DROP POLICY IF EXISTS "Authenticated delete genua media" ON storage.objects;
CREATE POLICY "Authenticated delete genua media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'genua-media');
