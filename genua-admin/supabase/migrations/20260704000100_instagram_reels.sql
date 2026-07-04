CREATE TABLE IF NOT EXISTS instagram_reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  client_name TEXT,
  reel_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_instagram_reels_updated_at ON instagram_reels;
CREATE TRIGGER update_instagram_reels_updated_at
  BEFORE UPDATE ON instagram_reels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS instagram_reels_active_order_idx
  ON instagram_reels (is_active, display_order);

ALTER TABLE instagram_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active instagram reels" ON instagram_reels;
CREATE POLICY "Public read active instagram reels"
  ON instagram_reels FOR SELECT USING (is_active = TRUE);
