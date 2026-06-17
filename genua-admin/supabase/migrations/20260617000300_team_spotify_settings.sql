ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS team_spotify_eyebrow TEXT DEFAULT 'Ofis Ritmi',
  ADD COLUMN IF NOT EXISTS team_spotify_title TEXT DEFAULT 'Ekibimizin dinledikleri',
  ADD COLUMN IF NOT EXISTS team_spotify_description TEXT DEFAULT 'Strateji toplantılarından gece yarısı teslimatlarına — Genua ofisinde dönen playlist.',
  ADD COLUMN IF NOT EXISTS team_spotify_url TEXT,
  ADD COLUMN IF NOT EXISTS team_spotify_cover_url TEXT;
