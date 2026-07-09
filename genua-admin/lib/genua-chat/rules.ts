import type { LeadPayload } from '@/lib/genua-chat/prompt';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type ChatReply = {
  reply: string;
  lead?: LeadPayload | null;
};

const RESPONSES = {
  opening:
    'Merhaba, Genua Dijital Medya Ajansı adına G. Hizmetlerimiz, çalışma sürecimiz ve teklif talepleriniz hakkında bilgi verebilirim.',

  services: `Genua Dijital Medya Ajansı olarak kurumsal markalara şu alanlarda hizmet sunuyoruz:

• Dijital Reklam (Google Ads & Meta)
• Sosyal Medya Yönetimi
• Marka Tasarımı
• İçerik Üretimi
• SEO
• Web Tasarım

Detaylı bilgi: genuadigital.com/hizmetler

İhtiyacınıza uygun yönlendirme için kısaca ne aradığınızı yazmanız yeterlidir; ardından sizi ekibimize bağlarız.`,

  process: `Çalışma sürecimiz; keşif, strateji, üretim, yayın/optimizasyon ve raporlama aşamalarından oluşur.

Her proje markanızın hedeflerine göre planlanır. Uygun kapsamı birlikte netleştirmek için ekibimiz sizinle görüşebilir.`,

  portfolio: `Referans çalışmalarımıza şu bağlantılardan ulaşabilirsiniz:
• genuadigital.com/portfolyo
• genuadigital.com/projelerimiz
• Behance: behance.net/umutavci4

Benzer bir ihtiyaç varsa kısaca yazın; sizi doğru ekibe yönlendirelim.`,

  location: `Ofis bilgilerimiz:

Merkez Ofis — Yeni, Menderes Blv. No: 7A D:3, 20030 Merkezefendi/Denizli
Stüdyo — Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M, Denizli`,

  contact: `İletişim kanallarımız:
• Telefon / WhatsApp: 0551 124 53 06
• E-posta: hello@genuadigital.com
• Instagram: @genuadigital

Hızlı dönüş için adınız ve telefon numaranızı buradan da iletebilirsiniz.`,

  quoteNeed: `Size en doğru yönlendirmeyi yapabilmem için hangi konuda destek aradığınızı kısaca belirtir misiniz?

Örneğin: dijital reklam, sosyal medya yönetimi, web sitesi, marka tasarımı, içerik üretimi veya SEO.`,

  quoteContact: (needSummary: string) => {
    const prefix = needSummary ? `Teşekkür ederiz. ${needSummary}\n\n` : '';
    return `${prefix}Sizi ilgili ekibimize yönlendirmek için adınız, soyadınız ve telefon numaranızı paylaşır mısınız? Ekibimiz bir iş günü içinde sizinle iletişime geçecektir.`;
  },

  quoteDone: `Bilgileriniz tarafımıza ulaştı. Genua ekibi en kısa sürede sizinle iletişime geçecektir.

Acil bir konunuz varsa 0551 124 53 06 numarasından da bize ulaşabilirsiniz.`,

  completed: `Talebiniz ekibimize iletildi. Ek sorularınız için hizmetler, referanslar veya iletişim bilgileri hakkında yardımcı olabilirim.

Yeni bir proje için tekrar yazmanız yeterlidir.`,

  phoneRequired:
    'Size ulaşabilmemiz için lütfen adınızı ve geçerli bir telefon numaranızı paylaşır mısınız?',

  handoff:
    'Bu konuda sizi uzman ekibimize yönlendirmemiz en doğru adım olacaktır. Adınız ve telefon numaranızı paylaşırsanız, ekibimiz size özel dönüş sağlayacaktır.',

  default:
    'Size yardımcı olabilmem için kısaca ihtiyacınızı yazabilirsiniz. Uygun hizmeti önerip sizi ekibimize yönlendirebilirim.\n\nHizmetler, referanslar veya iletişim bilgileri hakkında da bilgi verebilirim.',
};

const SERVICE_ADVICE = [
  {
    pattern: /dijital reklam|google ads|meta reklam|reklam ver|facebook reklam|instagram reklam/,
    label: 'Dijital Reklam',
    advice:
      'Dijital reklam tarafında Google Ads ve Meta kampanyalarıyla markanıza uygun hedef kitle, bütçe ve dönüşüm odaklı bir yapı kuruyoruz.',
  },
  {
    pattern: /sosyal medya|instagram yonet|icerik plan|reels|tiktok/,
    label: 'Sosyal Medya Yönetimi',
    advice:
      'Sosyal medyada marka dili, içerik planı ve düzenli yayın akışıyla görünürlüğünüzü güçlendiriyoruz. Reels ve kreatif üretim de sürecin parçasıdır.',
  },
  {
    pattern: /web tasar|web sitesi|kurumsal site|landing|e-ticaret/,
    label: 'Web Tasarım',
    advice:
      'Kurumsal web sitelerinde hız, kullanıcı deneyimi ve marka algısını birlikte ele alıyoruz. İhtiyaca göre landing page veya kapsamlı kurumsal site planlanır.',
  },
  {
    pattern: /marka tasar|logo|kimlik|kurumsal kimlik|ambalaj/,
    label: 'Marka Tasarımı',
    advice:
      'Marka kimliği çalışmalarında logo, görsel dil ve tutarlı bir marka algısı oluşturarak kurumsal duruşunuzu güçlendiriyoruz.',
  },
  {
    pattern: /icerik|video|cekim|fotograf|uretim/,
    label: 'İçerik Üretimi',
    advice:
      'Stüdyo ve saha çekimleriyle reklam, sosyal medya ve marka iletişimi için kullanılabilir içerikler üretiyoruz.',
  },
  {
    pattern: /seo|arama motoru|google siralama|organik/,
    label: 'SEO',
    advice:
      'SEO çalışmalarında teknik altyapı, içerik ve görünürlük adımlarını birlikte planlayarak organik trafiğinizi güçlendiriyoruz.',
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function lastAssistantMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((m) => m.role === 'assistant') || null;
}

function leadAlreadySubmitted(messages: ChatMessage[]) {
  return messages.some(
    (m) => m.role === 'assistant' && normalize(m.content).includes('bilgileriniz tarafimiza ulasti'),
  );
}

function detectIntent(text: string) {
  const n = normalize(text);
  if (/^(merhaba|selam|iyi gunler|gunaydin|iyi aksamlar|hosgeldin)\b/.test(n)) return 'greeting';
  if (/tekrar|yeniden teklif|baska proje|yeni teklif/.test(n)) return 'quote';
  if (/teklif|fiyat|ucret|maliyet|ne kadar|paket|butce/.test(n)) return 'quote';
  if (/hizmet|neler yap|ne is|neler sun/.test(n)) return 'services';
  if (/surec|nasil calis/.test(n)) return 'process';
  if (/ornek|portfolyo|referans|behance|isler/.test(n)) return 'portfolio';
  if (/nerede|adres|konum|denizli|ofis|studyo|stüdyo/.test(n)) return 'location';
  if (/iletisim|telefon|mail|whatsapp|ulas|ulaş|numara/.test(n)) return 'contact';
  if (/insan|uzman|gorus|görüş|konus|bağla|bagla|yonlendir|ekip|danisman/.test(n)) return 'handoff';
  if (/tesekkur|sagol|tamamdir|ok\b|anladim/.test(n)) return 'thanks';
  return 'default';
}

function detectServiceAdvice(text: string) {
  const n = normalize(text);
  return SERVICE_ADVICE.find((item) => item.pattern.test(n)) || null;
}

function getFlowPhase(messages: ChatMessage[]) {
  if (leadAlreadySubmitted(messages)) return 'completed';

  const last = normalize(lastAssistantMessage(messages)?.content || '');
  if (last.includes('hangi konuda destek')) return 'awaiting_need';
  if (last.includes('telefon numaranizi paylasir misiniz') || last.includes('telefon numaranızı paylaşır mısınız')) {
    return 'awaiting_contact';
  }
  if (last.includes('telefon numaranizi paylasirsaniz') || last.includes('telefon numaranızı paylaşırsanız')) {
    return 'awaiting_contact';
  }
  return 'idle';
}

function parseContact(text: string) {
  const trimmed = text.trim();
  const email = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phoneMatch = trimmed.match(/(?:\+90|0)?[\s.-]?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/);
  const phoneRaw = phoneMatch?.[0] ?? null;
  const phoneDigits = phoneRaw ? phoneRaw.replace(/\D/g, '') : null;
  const name = trimmed
    .replace(email || '', '')
    .replace(phoneRaw || '', '')
    .replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let phone: string | null = null;
  if (phoneDigits) {
    if (phoneDigits.startsWith('90')) phone = phoneDigits;
    else if (phoneDigits.startsWith('0')) phone = `90${phoneDigits.slice(1)}`;
    else phone = `90${phoneDigits}`;
  }

  return {
    full_name: name || null,
    email,
    phone,
    contact: phoneRaw || email || trimmed,
  };
}

function extractNeedFromMessages(messages: ChatMessage[]) {
  let need = '';

  for (let i = 0; i < messages.length; i += 1) {
    const msg = messages[i];
    const prev = messages[i - 1];
    if (msg.role !== 'user' || !prev || prev.role !== 'assistant') continue;

    const prevN = normalize(prev.content);
    if (prevN.includes('hangi konuda destek')) {
      need = msg.content.trim();
    }
  }

  return need;
}

function buildNeedSummary(text: string) {
  const advice = detectServiceAdvice(text);
  if (advice) return advice.advice;
  if (text.length > 8) return 'İhtiyacınızı not aldık.';
  return '';
}

function buildLead(messages: ChatMessage[], contact: ReturnType<typeof parseContact>, needText: string) {
  const need = needText || extractNeedFromMessages(messages);
  const advice = detectServiceAdvice(need);

  return {
    full_name: contact.full_name || 'Chatbot Ziyaretçi',
    contact: contact.contact,
    email: contact.email || undefined,
    phone: contact.phone || undefined,
    service_interest: advice?.label || need || undefined,
    company_size: undefined,
    message: [
      'Genua Chat (G.) üzerinden iletişim talebi',
      need ? `İhtiyaç: ${need}` : null,
      advice ? `Önerilen alan: ${advice.label}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}

function faqReply(intent: string) {
  if (intent === 'services') return RESPONSES.services;
  if (intent === 'process') return RESPONSES.process;
  if (intent === 'portfolio') return RESPONSES.portfolio;
  if (intent === 'location') return RESPONSES.location;
  if (intent === 'contact') return RESPONSES.contact;
  return null;
}

export function buildScriptedReply(messages: ChatMessage[], userText: string): ChatReply {
  const text = userText.trim();
  if (!text) return { reply: RESPONSES.default };

  const phase = getFlowPhase(messages);
  const intent = detectIntent(text);
  const contact = parseContact(text);
  const advice = detectServiceAdvice(text);

  if (phase === 'completed') {
    if (intent === 'quote' || intent === 'handoff') return { reply: RESPONSES.quoteNeed };
    if (intent === 'thanks') {
      return { reply: 'Rica ederiz. Başka bir konuda yardımcı olmamı isterseniz yazmanız yeterlidir.' };
    }
    const faq = faqReply(intent);
    if (faq) return { reply: faq };
    return { reply: RESPONSES.completed };
  }

  if (phase === 'awaiting_contact') {
    const faq = faqReply(intent);
    if (faq && !contact.phone) {
      return {
        reply: `${faq}\n\nSizi ekibimize yönlendirmek için adınız ve telefon numaranızı paylaşmanız yeterlidir.`,
      };
    }

    if (!contact.phone) return { reply: RESPONSES.phoneRequired };

    const need = extractNeedFromMessages(messages);
    return {
      reply: RESPONSES.quoteDone,
      lead: buildLead(messages, contact, need),
    };
  }

  if (phase === 'awaiting_need') {
    const faq = faqReply(intent);
    if (faq && !advice && text.length < 20) {
      return {
        reply: `${faq}\n\nTeklif veya yönlendirme için kısaca ihtiyacınızı da yazabilirsiniz.`,
      };
    }

    const needSummary = buildNeedSummary(text);
    return { reply: RESPONSES.quoteContact(needSummary) };
  }

  if (contact.phone && (intent === 'handoff' || intent === 'quote' || intent === 'contact' || advice || text.length > 12)) {
    return {
      reply: RESPONSES.quoteDone,
      lead: buildLead(messages, contact, text),
    };
  }

  if (intent === 'greeting') return { reply: RESPONSES.opening };
  if (intent === 'quote') return { reply: RESPONSES.quoteNeed };
  if (intent === 'handoff') return { reply: RESPONSES.quoteContact('Talebinizi uzman ekibimize iletebiliriz.') };

  if (advice) {
    return { reply: `${advice.advice}\n\n${RESPONSES.quoteContact('')}` };
  }

  const faq = faqReply(intent);
  if (faq) return { reply: faq };
  if (intent === 'thanks') {
    return { reply: 'Rica ederiz. Projeniz için destek isterseniz kısaca ihtiyacınızı yazmanız yeterlidir.' };
  }

  return { reply: RESPONSES.default };
}
