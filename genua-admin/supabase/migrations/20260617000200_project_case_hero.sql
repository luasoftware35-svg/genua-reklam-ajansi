ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS case_hero_title TEXT,
  ADD COLUMN IF NOT EXISTS case_hero_lead TEXT;
