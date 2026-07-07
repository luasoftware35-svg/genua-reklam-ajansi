CREATE TABLE IF NOT EXISTS chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  contact TEXT,
  email TEXT,
  phone TEXT,
  service_interest TEXT,
  company_size TEXT,
  message TEXT,
  conversation_summary TEXT,
  source TEXT DEFAULT 'chatbot' CHECK (source IN ('chatbot', 'handoff')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'contacted', 'qualified', 'archived')),
  referrer_page TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_chat_leads_updated_at ON chat_leads;
CREATE TRIGGER update_chat_leads_updated_at
  BEFORE UPDATE ON chat_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS chat_leads_status_created_idx ON chat_leads (status, created_at DESC);

ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access chat_leads" ON chat_leads;
CREATE POLICY "Service role full access chat_leads" ON chat_leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
