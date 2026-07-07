(function initGenuaChatRules(global) {
  const RESPONSES = {
    services: `Genua olarak şu alanlarda çalışıyoruz:

• Dijital Reklam (Google & Meta)
• Sosyal Medya Yönetimi
• Marka Tasarımı
• İçerik Üretimi
• SEO
• Web Tasarım

Detay için genuadigital.com/hizmetler — teklif için "teklif almak istiyorum" yazman yeterli.`,

    process: `Sürecimiz kısaca: keşif → strateji → üretim → yayın/optimizasyon → raporlama.

Her proje kapsama göre şekillenir. İstersen birlikte ihtiyacını netleştirelim.`,

    portfolio: `Örnek işlerimize buradan bakabilirsin:
• genuadigital.com/portfolyo
• genuadigital.com/projelerimiz
• Behance: behance.net/umutavci4`,

    location: `İki noktadayız:

Merkez Ofis — Yeni, Menderes Blv. No: 7A D:3, Merkezefendi/Denizli
Stüdyo — Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M`,

    contact: `Bize şu kanallardan ulaşabilirsin:
• 0551 124 53 06 / WhatsApp
• hello@genuadigital.com
• @genuadigital (Instagram)

Teklif formu: genuadigital.com/teklif-al`,

    quoteStart: `Tabii, sana uygun teklifi hazırlayalım.

Önce hangi hizmet ilgini çekiyor? (dijital reklam, sosyal medya, web tasarım, marka tasarımı, içerik, SEO — birden fazla yazabilirsin)`,

    quoteCompany: `Anladım. Peki sektörünüz ve firma büyüklüğünüz nedir? (ör. "e-ticaret, 8 kişilik ekip")`,

    quoteContact: `Son adım: adın soyadın ve telefon veya e-posta adresini yazar mısın? Ekibimiz 1 iş günü içinde dönüş yapar.`,

    quoteDone: `Teşekkürler, bilgilerini aldım. Genua ekibi en kısa sürede seninle iletişime geçecek.

Bu arada acil bir konu varsa 0551 124 53 06 numarasından da yazabilirsin.`,

    handoff: `Bunu ekibimize iletmem daha doğru olur. Adın ve telefon veya e-postanı yazarsan Umut ve ekip sana özel dönüş yapsın.`,

    default: `Bunu netleştirmek için ekibe bağlayabilirim. "Teklif almak istiyorum" yazarsan birkaç kısa soruyla ilerleriz.

Hizmetler, örnek işler veya iletişim için de sorabilirsin.`,
  };

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function lastAssistantAsked(messages, hint) {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    return last ? normalize(last.content).includes(hint) : false;
  }

  function detectIntent(text) {
    const n = normalize(text);
    if (/teklif|fiyat|ucret|maliyet|ne kadar|paket/.test(n)) return 'quote';
    if (/hizmet|neler yap|ne is/.test(n)) return 'services';
    if (/surec|nasil calis/.test(n)) return 'process';
    if (/ornek|portfolyo|referans|behance|isler/.test(n)) return 'portfolio';
    if (/nerede|adres|konum|denizli|ofis|studyo/.test(n)) return 'location';
    if (/iletisim|telefon|mail|whatsapp|ulas/.test(n)) return 'contact';
    if (/insan|umut|gorus|konus|ozel|detayli/.test(n)) return 'handoff';
    return 'default';
  }

  function getFlowStep(messages) {
    if (lastAssistantAsked(messages, 'hizmet ilgini')) return 'service';
    if (lastAssistantAsked(messages, 'sektorunuz')) return 'company';
    if (lastAssistantAsked(messages, 'telefon veya e-posta')) return 'contact';
    return 'idle';
  }

  function parseContact(text) {
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

    let phone = null;
    if (phoneDigits) {
      if (phoneDigits.startsWith('90')) phone = phoneDigits;
      else if (phoneDigits.startsWith('0')) phone = `90${phoneDigits.slice(1)}`;
      else phone = `90${phoneDigits}`;
    }

    return {
      full_name: name || null,
      email,
      phone,
      contact: email || phoneRaw || trimmed,
    };
  }

  function extractQuoteContext(messages) {
    let service = '';
    let company = '';

    for (let i = 0; i < messages.length; i += 1) {
      const msg = messages[i];
      const prev = messages[i - 1];
      if (msg.role !== 'user' || !prev || prev.role !== 'assistant') continue;
      const prevN = normalize(prev.content);
      if (prevN.includes('hizmet ilgini')) service = msg.content.trim();
      if (prevN.includes('sektorunuz')) company = msg.content.trim();
    }

    return { service, company };
  }

  function reply(messages, userText) {
    const text = String(userText || '').trim();
    if (!text) return { reply: RESPONSES.default, lead: null };

    const flow = getFlowStep(messages);
    const intent = detectIntent(text);

    if (flow === 'service') return { reply: RESPONSES.quoteCompany, lead: null };
    if (flow === 'company') return { reply: RESPONSES.quoteContact, lead: null };

    if (flow === 'contact') {
      const contact = parseContact(text);
      const { service, company } = extractQuoteContext([...messages, { role: 'user', content: text }]);

      if (!contact.contact && !contact.email && !contact.phone) {
        return { reply: 'İletişim için geçerli bir telefon veya e-posta yazar mısın? (Adınla birlikte)', lead: null };
      }

      return {
        reply: RESPONSES.quoteDone,
        lead: {
          full_name: contact.full_name || 'Chatbot Ziyaretçi',
          contact: contact.contact,
          email: contact.email,
          phone: contact.phone,
          service_interest: service || null,
          company_size: company || null,
          message: 'Genua Chat (G.) üzerinden teklif talebi',
        },
      };
    }

    if (intent === 'quote') return { reply: RESPONSES.quoteStart, lead: null };
    if (intent === 'services') return { reply: RESPONSES.services, lead: null };
    if (intent === 'process') return { reply: RESPONSES.process, lead: null };
    if (intent === 'portfolio') return { reply: RESPONSES.portfolio, lead: null };
    if (intent === 'location') return { reply: RESPONSES.location, lead: null };
    if (intent === 'contact') return { reply: RESPONSES.contact, lead: null };
    if (intent === 'handoff') return { reply: RESPONSES.handoff, lead: null };

    return { reply: RESPONSES.default, lead: null };
  }

  global.GenuaChatRules = { reply };
})(window);
