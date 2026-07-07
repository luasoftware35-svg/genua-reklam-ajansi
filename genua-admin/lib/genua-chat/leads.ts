import { createClient } from '@supabase/supabase-js';
import type { LeadPayload } from '@/lib/genua-chat/prompt';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase yapılandırması eksik.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function splitContact(lead: LeadPayload) {
  const contact = lead.contact?.trim() || '';
  const email = lead.email?.trim() || (contact.includes('@') ? contact : null);
  const phone = lead.phone?.trim() || (!contact.includes('@') && contact ? contact : null);
  return { email, phone, contact: contact || email || phone || null };
}

function buildLeadEmailHtml(lead: LeadPayload & { referrer_page?: string | null }) {
  const rows = [
    ['Kaynak', 'Genua Chat (G.)'],
    ['Ad Soyad', lead.full_name || '—'],
    ['İletişim', lead.contact || lead.email || lead.phone || '—'],
    ['Hizmet', lead.service_interest || '—'],
    ['Firma / Sektör', lead.company_size || '—'],
    ['Özet', lead.message || '—'],
    ['Sayfa', lead.referrer_page || '—'],
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin:0 0 16px;">Yeni Chatbot Lead — G.</h2>
      ${rows
        .map(([label, value]) => `<p style="margin:0 0 10px;"><strong>${label}:</strong><br>${String(value ?? '—')}</p>`)
        .join('')}
    </div>
  `;
}

async function sendLeadNotificationEmail(lead: LeadPayload & { referrer_page?: string | null }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const supabase = getServiceClient();
  const { data: settings } = await supabase.from('site_settings').select('contact_email').limit(1).maybeSingle();
  const to = process.env.FORM_NOTIFY_EMAIL || settings?.contact_email || 'hello@genuadigital.com';
  const from = process.env.FORM_FROM_EMAIL || 'Genua Chat <onboarding@resend.dev>';
  const name = lead.full_name?.trim() || 'Ziyaretçi';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email?.includes('@') ? lead.email : undefined,
      subject: `Yeni chatbot lead: ${name}`,
      html: buildLeadEmailHtml(lead),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Lead e-postası gönderilemedi: ${errorBody}`);
  }

  return { skipped: false };
}

async function saveToChatLeads(
  supabase: ReturnType<typeof getServiceClient>,
  lead: LeadPayload,
  meta: { referrer_page?: string | null; user_agent?: string | null; conversation_summary?: string | null },
  contact: { email: string | null; phone: string | null; contact: string | null },
) {
  const { data, error } = await supabase
    .from('chat_leads')
    .insert({
      full_name: lead.full_name?.trim() || null,
      contact: contact.contact || contact.email || contact.phone,
      email: contact.email,
      phone: contact.phone,
      service_interest: lead.service_interest?.trim() || null,
      company_size: lead.company_size?.trim() || null,
      message: lead.message?.trim() || null,
      conversation_summary: meta.conversation_summary?.trim() || null,
      source: 'chatbot',
      status: 'new',
      referrer_page: meta.referrer_page?.trim() || null,
      user_agent: meta.user_agent?.trim() || null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

async function saveToContactMessages(
  supabase: ReturnType<typeof getServiceClient>,
  lead: LeadPayload,
  meta: { referrer_page?: string | null; user_agent?: string | null; conversation_summary?: string | null },
  contact: { email: string | null; phone: string | null; contact: string | null },
) {
  const phoneDigits = (contact.phone || contact.contact || '').replace(/\D/g, '');
  const email =
    contact.email ||
    (contact.contact?.includes('@') ? contact.contact : null) ||
    `chatbot+${phoneDigits || Date.now()}@genuadigital.com`;

  const messageParts = [
    lead.message?.trim(),
    lead.service_interest ? `Hizmet: ${lead.service_interest}` : null,
    lead.company_size ? `Firma/Sektör: ${lead.company_size}` : null,
    meta.conversation_summary ? `\n---\nSohbet özeti:\n${meta.conversation_summary}` : null,
  ].filter(Boolean);

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      full_name: lead.full_name?.trim() || 'Chatbot Ziyaretçi',
      email,
      phone: contact.phone || (phoneDigits ? contact.contact : null),
      subject: 'Genua Chat (G.) — Teklif Talebi',
      message: messageParts.join('\n') || 'Chatbot üzerinden iletişim talebi',
      form_type: 'quote',
      requested_services: lead.service_interest ? [lead.service_interest.trim()] : [],
      company_name: lead.company_size?.trim() || null,
      referrer_page: meta.referrer_page?.trim() || null,
      user_agent: meta.user_agent?.trim() || null,
      status: 'new',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function saveChatLead(
  lead: LeadPayload,
  meta: { referrer_page?: string | null; user_agent?: string | null; conversation_summary?: string | null },
) {
  const contact = splitContact(lead);
  if (!contact.contact && !contact.email && !contact.phone) return null;

  const supabase = getServiceClient();
  let leadId: string | null = null;

  const chatLeads = await supabase.from('chat_leads').select('id').limit(1);
  if (!chatLeads.error) {
    try {
      leadId = await saveToChatLeads(supabase, lead, meta, contact);
    } catch (error) {
      console.error('chat_leads insert failed, falling back to contact_messages:', error);
    }
  }

  if (!leadId) {
    leadId = await saveToContactMessages(supabase, lead, meta, contact);
  }

  try {
    await sendLeadNotificationEmail({ ...lead, referrer_page: meta.referrer_page });
  } catch (mailError) {
    console.error('Chat lead mail notification failed:', mailError);
  }

  return leadId;
}
