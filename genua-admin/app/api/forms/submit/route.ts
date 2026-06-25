import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type FormPayload = {
  form_type?: 'contact' | 'quote';
  full_name?: string;
  email?: string;
  phone?: string | null;
  subject?: string | null;
  message?: string;
  requested_services?: string[];
  budget_range?: string | null;
  timeline?: string | null;
  company_name?: string | null;
  referrer_page?: string | null;
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase yapılandırması eksik.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function buildEmailHtml(payload: FormPayload) {
  const rows = [
    ['Form', payload.form_type === 'quote' ? 'Teklif Al' : 'İletişim'],
    ['Ad Soyad', payload.full_name],
    ['E-posta', payload.email],
    ['Telefon', payload.phone || '—'],
    ['Konu', payload.subject || '—'],
    ['Firma', payload.company_name || '—'],
    ['Bütçe', payload.budget_range || '—'],
    ['Zaman', payload.timeline || '—'],
    [
      'Hizmetler',
      payload.requested_services?.length ? payload.requested_services.join(', ') : '—',
    ],
    ['Mesaj', payload.message?.replace(/\n/g, '<br>') || '—'],
    ['Sayfa', payload.referrer_page || '—'],
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin:0 0 16px;">Yeni ${payload.form_type === 'quote' ? 'Teklif' : 'İletişim'} Formu</h2>
      ${rows
        .map(
          ([label, value]) =>
            `<p style="margin:0 0 10px;"><strong>${label}:</strong><br>${String(value ?? '—')}</p>`,
        )
        .join('')}
    </div>
  `;
}

async function sendNotificationEmail(payload: FormPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const supabase = getServiceClient();
  const { data: settings } = await supabase.from('site_settings').select('contact_email').limit(1).maybeSingle();
  const to = process.env.FORM_NOTIFY_EMAIL || settings?.contact_email || 'hello@genuadigital.com';
  const from = process.env.FORM_FROM_EMAIL || 'Genua Formlar <onboarding@resend.dev>';
  const subjectPrefix = payload.form_type === 'quote' ? 'Yeni teklif talebi' : 'Yeni iletişim mesajı';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `${subjectPrefix}: ${payload.full_name}`,
      html: buildEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`E-posta gönderilemedi: ${errorBody}`);
  }

  return { skipped: false };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FormPayload;
    const full_name = payload.full_name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();

    if (!full_name || !email || !message) {
      return NextResponse.json({ error: 'Ad, e-posta ve mesaj zorunludur.' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        full_name,
        email,
        phone: payload.phone?.trim() || null,
        subject: payload.subject?.trim() || null,
        message,
        form_type: payload.form_type === 'quote' ? 'quote' : 'contact',
        requested_services: payload.requested_services ?? [],
        budget_range: payload.budget_range?.trim() || null,
        timeline: payload.timeline?.trim() || null,
        company_name: payload.company_name?.trim() || null,
        referrer_page: payload.referrer_page?.trim() || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await sendNotificationEmail({ ...payload, full_name, email, message });
    } catch (mailError) {
      console.error('Form mail notification failed:', mailError);
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
