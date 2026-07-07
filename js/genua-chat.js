(function initGenuaChat() {
  if (document.getElementById('genua-chat-root')) return;

  const STORAGE_KEY = 'genua.chat.messages.v1';
  const TEASER_KEY = 'genua.chat.teaser.dismissed';
  const OPENING_MESSAGE =
    'Merhaba, Genua Dijital Medya Ajansı adına G. Hizmetlerimiz, çalışma sürecimiz ve teklif talepleriniz hakkında bilgi verebilirim.';

  const quickReplies = ['Hizmetleriniz neler?', 'Teklif almak istiyorum', 'Ofis adresiniz', 'Referans çalışmalar'];

  let isOpen = false;
  let isLoading = false;
  let messages = [];
  let teaserTimer = null;

  const root = document.createElement('div');
  root.id = 'genua-chat-root';
  root.className = 'genua-chat-root';
  root.innerHTML = `
    <div class="genua-chat-teaser" id="genuaChatTeaser" hidden>
      <button type="button" aria-label="Kapat">×</button>
      Merhaba. Genua Dijital Medya Ajansı olarak size nasıl yardımcı olabiliriz?
    </div>
    <div class="genua-chat-panel" id="genuaChatPanel" role="dialog" aria-label="Genua Asistan sohbet" aria-modal="true">
      <div class="genua-chat-header">
        <div>
          <strong>G. — Genua Asistan</strong>
          <span>Kurumsal destek hattı</span>
        </div>
        <button class="genua-chat-close" type="button" aria-label="Sohbeti kapat">×</button>
      </div>
      <div class="genua-chat-messages" id="genuaChatMessages" aria-live="polite"></div>
      <div class="genua-chat-quick" id="genuaChatQuick"></div>
      <form class="genua-chat-form" id="genuaChatForm">
        <input type="text" id="genuaChatInput" placeholder="Mesajınızı yazın..." autocomplete="off" maxlength="1200" />
        <button type="submit" aria-label="Gönder">→</button>
      </form>
    </div>
    <button class="genua-chat-toggle" id="genuaChatToggle" type="button" aria-expanded="false" aria-controls="genuaChatPanel" aria-label="Genua Asistan sohbetini aç">
      G.
    </button>
  `;

  document.body.appendChild(root);

  const teaser = root.querySelector('#genuaChatTeaser');
  const panel = root.querySelector('#genuaChatPanel');
  const toggle = root.querySelector('#genuaChatToggle');
  const closeBtn = root.querySelector('.genua-chat-close');
  const messagesEl = root.querySelector('#genuaChatMessages');
  const quickEl = root.querySelector('#genuaChatQuick');
  const form = root.querySelector('#genuaChatForm');
  const input = root.querySelector('#genuaChatInput');

  function loadMessages() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((item) => item?.role && item?.content) : [];
    } catch {
      return [];
    }
  }

  function saveMessages() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function renderMessages() {
    messagesEl.innerHTML = messages
      .map(
        (item) =>
          `<div class="genua-chat-bubble ${item.role === 'user' ? 'is-user' : 'is-bot'}">${escapeHtml(item.content)}</div>`,
      )
      .join('');

    if (isLoading) {
      messagesEl.insertAdjacentHTML('beforeend', '<div class="genua-chat-bubble is-bot is-typing">Yazıyor...</div>');
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderQuickReplies() {
    quickEl.innerHTML = quickReplies
      .map((label) => `<button type="button" data-quick="${escapeHtml(label)}">${escapeHtml(label)}</button>`)
      .join('');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setOpen(next) {
    isOpen = next;
    panel.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Genua Asistan sohbetini kapat' : 'Genua Asistan sohbetini aç');

    if (isOpen) {
      hideTeaser(true);
      if (!messages.length) {
        messages.push({ role: 'assistant', content: OPENING_MESSAGE });
        saveMessages();
      }
      renderMessages();
      window.setTimeout(() => input.focus(), 120);
    }
  }

  function hideTeaser(persist) {
    teaser.classList.remove('is-visible');
    teaser.hidden = true;
    if (persist) sessionStorage.setItem(TEASER_KEY, '1');
  }

  function showTeaser() {
    if (sessionStorage.getItem(TEASER_KEY) || isOpen) return;
    teaser.hidden = false;
    window.requestAnimationFrame(() => teaser.classList.add('is-visible'));
  }

  async function submitLead(lead) {
    const phone = lead.phone || null;
    const email =
      lead.email ||
      (lead.contact?.includes('@') ? lead.contact : null) ||
      `chatbot+${Date.now()}@genuadigital.com`;

    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_type: 'quote',
        full_name: lead.full_name || 'Chatbot Ziyaretçi',
        email,
        phone,
        subject: 'Genua Chat (G.) — Teklif Talebi',
        message: [
          lead.message,
          lead.service_interest ? `Hizmet: ${lead.service_interest}` : null,
          lead.company_size ? `Firma/Sektör: ${lead.company_size}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        requested_services: lead.service_interest ? [lead.service_interest] : [],
        company_name: lead.company_size || null,
        referrer_page: window.location.pathname,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'Lead kaydedilemedi.');
    }
  }

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || isLoading) return;

    messages.push({ role: 'user', content });
    saveMessages();
    renderMessages();
    input.value = '';
    isLoading = true;
    form.querySelector('button').disabled = true;
    renderMessages();

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));

      const engine = window.GenuaChatRules;
      if (!engine?.reply) throw new Error('Chat motoru yüklenemedi.');

      const result = engine.reply(messages, content);
      messages.push({ role: 'assistant', content: result.reply });
      saveMessages();

      if (result.lead) {
        await submitLead(result.lead);
        window.GenuaAnalytics?.track('chat_lead_saved', { page_path: window.location.pathname });
      }
    } catch (error) {
      messages.push({
        role: 'assistant',
        content:
          error instanceof Error
            ? `${error.message} İstersen hello@genuadigital.com adresine yazabilirsin.`
            : 'Şu an yanıt veremiyorum. hello@genuadigital.com üzerinden bize ulaşabilirsin.',
      });
      saveMessages();
    } finally {
      isLoading = false;
      form.querySelector('button').disabled = false;
      renderMessages();
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen));
  closeBtn.addEventListener('click', () => setOpen(false));
  teaser.querySelector('button').addEventListener('click', () => hideTeaser(true));
  teaser.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    setOpen(true);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  quickEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quick]');
    if (!button) return;
    sendMessage(button.dataset.quick || '');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) setOpen(false);
  });

  messages = loadMessages();
  renderQuickReplies();
  if (messages.length) renderMessages();

  teaserTimer = window.setTimeout(showTeaser, 2600);

  window.GenuaChat = { open: () => setOpen(true), close: () => setOpen(false) };
})();
