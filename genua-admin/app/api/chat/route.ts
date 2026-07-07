import { NextResponse } from 'next/server';
import { extractLeadFromReply, GENUA_CHAT_SYSTEM_PROMPT } from '@/lib/genua-chat/prompt';
import { saveChatLead } from '@/lib/genua-chat/leads';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
  page?: string;
};

const MODEL = process.env.ANTHROPIC_CHAT_MODEL || 'claude-sonnet-4-20250514';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Chat servisi yapılandırılmamış.' }, { status: 503 });
    }

    const body = (await request.json()) as ChatRequest;
    const messages = (body.messages ?? []).filter((item) => item?.content?.trim() && ['user', 'assistant'].includes(item.role));

    if (!messages.length) {
      return NextResponse.json({ error: 'Mesaj gerekli.' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((item) => item.role === 'user');
    if (!lastUser) {
      return NextResponse.json({ error: 'Kullanıcı mesajı gerekli.' }, { status: 400 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: GENUA_CHAT_SYSTEM_PROMPT,
        messages: messages.map((item) => ({
          role: item.role,
          content: item.content.trim(),
        })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Anthropic API error:', errorBody);
      return NextResponse.json({ error: 'Yanıt alınamadı. Biraz sonra tekrar dene.' }, { status: 502 });
    }

    const result = await response.json();
    const rawReply = result?.content?.find((block: { type?: string }) => block.type === 'text')?.text?.trim();

    if (!rawReply) {
      return NextResponse.json({ error: 'Boş yanıt döndü.' }, { status: 502 });
    }

    const { cleanReply, lead } = extractLeadFromReply(rawReply);
    let leadSaved = false;

    if (lead && (lead.contact || lead.email || lead.phone)) {
      const summary = messages
        .slice(-6)
        .map((item) => `${item.role === 'user' ? 'Ziyaretçi' : 'G.'}: ${item.content}`)
        .join('\n');

      const leadId = await saveChatLead(lead, {
        referrer_page: body.page || null,
        user_agent: request.headers.get('user-agent'),
        conversation_summary: summary,
      });

      leadSaved = Boolean(leadId);
    }

    return NextResponse.json({
      reply: cleanReply,
      lead_saved: leadSaved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
