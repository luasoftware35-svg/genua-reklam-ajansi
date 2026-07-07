import type { LeadPayload } from '@/lib/genua-chat/prompt';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type ChatReply = {
  reply: string;
  lead?: LeadPayload | null;
};

type FlowStep = 'idle' | 'service' | 'company' | 'contact' | 'done';

const RESPONSES = {
  services: `Genua Dijital Medya Ajansı olarak aşağıdaki alanlarda kurumsal markalara hizmet sunuyoruz:

• Dijital Reklam (Google Ads & Meta)
• Sosyal Medya Yönetimi
• Marka Tasarımı
• İçerik Üretimi
• SEO
• Web Tasarım

Detaylı bilgi için genuadigital.com/hizmetler sayfasını inceleyebilirsiniz. Teklif talebi için "Teklif almak istiyorum" yazmanız yeterlidir.`,

  process: `Çalışma sürecimiz; keşif, strateji, üretim, yayın/optimizasyon ve raporlama aşamalarından oluşur.

Her proje, markanızın ihtiyaçlarına göre özelleştirilir. İhtiyaçlarınızı birlikte netleştirmekten memnuniyet duyarız.`,

  portfolio: `Referans çalışmalarımıza aşağıdaki bağlantılardan ulaşabilirsiniz:
• genuadigital.com/portfolyo
• genuadigital.com/projelerimiz
• Behance: behance.net/umutavci4`,

  location: `Ofis bilgilerimiz:

Merkez Ofis — Yeni, Menderes Blv. No: 7A D:3, 20030 Merkezefendi/Denizli
Stüdyo — Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M, Denizli`,

  contact: `İletişim kanallarımız:
• Telefon / WhatsApp: 0551 124 53 06
• E-posta: hello@genuadigital.com
• Instagram: @genuadigital

Teklif formu: genuadigital.com/teklif-al`,

  quoteStart: `Teklif sürecini başlatmak için memnuniyetle yardımcı olurum.

Öncelikle hangi hizmet alanlarıyla ilgilendiğinizi belirtir misiniz? (dijital reklam, sosyal medya, web tasarım, marka tasarımı, içerik üretimi, SEO — birden fazla seçenek yazabilirsiniz)`,

  quoteCompany: `Teşekkür ederiz. Sektörünüzü ve firma ölçeğinizi paylaşır mısınız? (Örn: e-ticaret, 10 kişilik ekip)`,

  quoteContact: `Son olarak adınızı, soyadınızı ve telefon veya e-posta bilginizi iletir misiniz? Ekibimiz bir iş günü içinde size dönüş yapacaktır.`,

  quoteDone: `Bilgileriniz tarafımıza ulaştı. Genua ekibi en kısa sürede sizinle iletişime geçecektir.

Acil bir konunuz varsa 0551 124 53 06 numarasından da bize ulaşabilirsiniz.`,

  handoff: `Bu talebi ilgili ekibimize iletmemiz daha uygun olacaktır. Adınızı ve iletişim bilgilerinizi paylaşırsanız, ekibimiz size özel olarak dönüş sağlayacaktır.`,

  default: `Konuyu netleştirmek adına sizi ekibimize yönlendirebilirim. Teklif talebi için "Teklif almak istiyorum" yazmanız yeterlidir.

Hizmetler, referanslar veya iletişim bilgileri hakkında da bilgi alabilirsiniz.`,
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function lastAssistantAsked(messages: ChatMessage[], hint: string) {
  const last = [...messages].reverse().find((m) => m.role === 'assistant');
  return last ? normalize(last.content).includes(hint) : false;
}

function detectIntent(text: string) {
  const n = normalize(text);
  if (/teklif|fiyat|ucret|maliyet|ne kadar|paket/.test(n)) return 'quote';
  if (/hizmet|neler yap|ne is/.test(n)) return 'services';
  if (/surec|nasil calis|nasıl çalış/.test(n)) return 'process';
  if (/ornek|portfolyo|referans|behance|isler/.test(n)) return 'portfolio';
  if (/nerede|adres|konum|denizli|ofis|studyo|stüdyo/.test(n)) return 'location';
  if (/iletisim|telefon|mail|e-posta|whatsapp|ulas|ulaş/.test(n)) return 'contact';
  if (/insan|umut|gorus|görüş|konus|özel|ozel|detayli/.test(n)) return 'handoff';
  return 'default';
}

function getFlowStep(messages: ChatMessage[]): FlowStep {
  if (lastAssistantAsked(messages, 'hizmet alanlariyla')) return 'service';
  if (lastAssistantAsked(messages, 'firma olceginizi') || lastAssistantAsked(messages, 'sektorunuzu')) return 'company';
  if (lastAssistantAsked(messages, 'iletir misiniz')) return 'contact';
  return 'idle';
}

function parseContact(text: string) {
  const trimmed = text.trim();
  const email = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phone = trimmed.match(/(?:\+90|0)?[\s.-]?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0]?.replace(/\D/g, '') ?? null;
  const name = trimmed
    .replace(email || '', '')
    .replace(phone ? trimmed.match(/(?:\+90|0)?[\s.-]?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0] || '' : '', '')
    .replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    full_name: name || null,
    email,
    phone: phone ? (phone.startsWith('90') ? phone : phone.startsWith('0') ? `90${phone.slice(1)}` : `90${phone}`) : null,
    contact: email || phone || trimmed,
  };
}

function extractQuoteContext(messages: ChatMessage[]) {
  let service = '';
  let company = '';

  for (let i = 0; i < messages.length; i += 1) {
    const msg = messages[i];
    const prev = messages[i - 1];
    if (msg.role !== 'user' || !prev || prev.role !== 'assistant') continue;
    const prevN = normalize(prev.content);
    if (prevN.includes('hizmet alanlariyla')) service = msg.content.trim();
    if (prevN.includes('firma olceginizi') || prevN.includes('sektorunuzu')) company = msg.content.trim();
  }

  return { service, company };
}

export function buildScriptedReply(messages: ChatMessage[], userText: string): ChatReply {
  const text = userText.trim();
  if (!text) return { reply: RESPONSES.default };

  const flow = getFlowStep(messages);
  const intent = detectIntent(text);

  if (flow === 'service') {
    return { reply: RESPONSES.quoteCompany };
  }

  if (flow === 'company') {
    return { reply: RESPONSES.quoteContact };
  }

  if (flow === 'contact') {
    const contact = parseContact(text);
    const { service, company } = extractQuoteContext([...messages, { role: 'user', content: text }]);

    if (!contact.contact && !contact.email && !contact.phone) {
      return { reply: 'Lütfen adınızı, soyadınızı ve geçerli bir telefon veya e-posta adresinizi paylaşır mısınız?' };
    }

    return {
      reply: RESPONSES.quoteDone,
      lead: {
        full_name: contact.full_name || 'Chatbot Ziyaretçi',
        contact: contact.contact,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        service_interest: service || undefined,
        company_size: company || undefined,
        message: 'Genua Chat (G.) üzerinden teklif talebi',
      },
    };
  }

  if (intent === 'quote') return { reply: RESPONSES.quoteStart };
  if (intent === 'services') return { reply: RESPONSES.services };
  if (intent === 'process') return { reply: RESPONSES.process };
  if (intent === 'portfolio') return { reply: RESPONSES.portfolio };
  if (intent === 'location') return { reply: RESPONSES.location };
  if (intent === 'contact') return { reply: RESPONSES.contact };
  if (intent === 'handoff') return { reply: RESPONSES.handoff };

  return { reply: RESPONSES.default };
}
