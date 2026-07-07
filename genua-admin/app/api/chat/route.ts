import { NextResponse } from 'next/server';
import { saveChatLead } from '@/lib/genua-chat/leads';
import { buildScriptedReply, type ChatMessage } from '@/lib/genua-chat/rules';

export const runtime = 'nodejs';

type ChatRequest = {
  messages?: ChatMessage[];
  page?: string;
};

async function saveLeadIfNeeded(
  lead: NonNullable<ReturnType<typeof buildScriptedReply>['lead']>,
  messages: ChatMessage[],
  page?: string,
  userAgent?: string | null,
) {
  if (!lead?.contact && !lead?.email && !lead?.phone) return false;

  const summary = messages
    .slice(-8)
    .map((item) => `${item.role === 'user' ? 'Ziyaretçi' : 'G.'}: ${item.content}`)
    .join('\n');

  const leadId = await saveChatLead(lead, {
    referrer_page: page || null,
    user_agent: userAgent,
    conversation_summary: summary,
  });

  return Boolean(leadId);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const messages = (body.messages ?? []).filter(
      (item) => item?.content?.trim() && ['user', 'assistant'].includes(item.role),
    );

    if (!messages.length) {
      return NextResponse.json({ error: 'Mesaj gerekli.' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((item) => item.role === 'user');
    if (!lastUser) {
      return NextResponse.json({ error: 'Kullanıcı mesajı gerekli.' }, { status: 400 });
    }

    const { reply, lead } = buildScriptedReply(messages, lastUser.content);
    let leadSaved = false;

    if (lead) {
      leadSaved = await saveLeadIfNeeded(lead, messages, body.page, request.headers.get('user-agent'));
    }

    return NextResponse.json({
      reply,
      lead_saved: leadSaved,
      mode: 'scripted',
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
