CREATE TABLE IF NOT EXISTS behance_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  client_name TEXT,
  project_url TEXT NOT NULL UNIQUE,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_behance_projects_updated_at ON behance_projects;
CREATE TRIGGER update_behance_projects_updated_at
  BEFORE UPDATE ON behance_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS behance_projects_active_order_idx
  ON behance_projects (is_active, display_order);

ALTER TABLE behance_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active behance projects" ON behance_projects;
CREATE POLICY "Public read active behance projects"
  ON behance_projects FOR SELECT USING (is_active = TRUE);
