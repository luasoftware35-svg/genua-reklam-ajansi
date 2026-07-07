function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_OFFICE = 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli';
const DEFAULT_STUDIO = 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M';
const DEFAULT_PHONE = '0551 124 53 06';
const DEFAULT_EMAIL = 'hello@genuadigital.com';

const SERVICE_LINKS = [
  ['dijital-reklam.html', 'Dijital Reklam'],
  ['sosyal-medya.html', 'Sosyal Medya'],
  ['marka-tasarim.html', 'Marka Tasarımı'],
  ['icerik-uretimi.html', 'İçerik Üretimi'],
  ['seo.html', 'SEO'],
  ['web-tasarim.html', 'Web Tasarım'],
];

const QUICK_LINKS = [
  ['hakkimizda.html', 'Hakkımızda'],
  ['projelerimiz.html', 'Referanslar'],
  ['portfolyo.html', 'İşlerimiz'],
  ['blog.html', 'Blog'],
  ['iletisim.html', 'İletişim'],
  ['teklif-al.html', 'Teklif Al'],
];

const SOCIAL_LINKS = [
  ['https://www.instagram.com/genuadigital/', 'Genua Instagram', 'IG'],
  ['https://tr.linkedin.com/company/genua-digital-media-agency', 'Genua LinkedIn', 'IN'],
  ['https://www.behance.net/umutavci4', 'Genua Behance', 'BH'],
];

let officeQuery = DEFAULT_OFFICE;
let studioQuery = DEFAULT_STUDIO;
let activeMap = 'office';
let settingsCache = null;

window.GenuaAnalytics = window.GenuaAnalytics || {
  track(eventName, params = {}) {
    return trackAnalyticsEvent(eventName, params);
  },
};

function trackAnalyticsEvent(eventName, params = {}) {
  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };

    const payload = { event: eventName, ...params };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        event_callback: finish,
        event_timeout: 2000,
      });
      window.setTimeout(finish, 2000);
      return;
    }

    window.setTimeout(finish, 300);
  });
}

function phoneToWhatsApp(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('90')) return digits;
  if (digits.startsWith('0')) return `90${digits.slice(1)}`;
  return digits;
}

function mapEmbedSrc(query) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=tr&z=16&output=embed`;
}

function mapOpenUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function currentQuery() {
  return activeMap === 'studio' ? studioQuery : officeQuery;
}

function renderActiveMap(customOfficeEmbed) {
  const mapWrap = document.querySelector('.contact-map[data-map-for="office"]');
  const link = document.querySelector('.map-open-link[data-map-link-for]');
  const query = currentQuery();

  if (mapWrap) {
    if (activeMap === 'office' && customOfficeEmbed?.includes('<iframe')) {
      mapWrap.innerHTML = customOfficeEmbed;
    } else {
      let iframe = mapWrap.querySelector('iframe');
      if (!iframe) {
        mapWrap.innerHTML =
          '<iframe id="contactMapFrame" title="Genua konum haritası" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
        iframe = mapWrap.querySelector('iframe');
      }
      if (iframe) iframe.src = mapEmbedSrc(query);
    }
  }

  if (link) link.href = mapOpenUrl(query);
}

function bindMapSwitch() {
  const buttons = document.querySelectorAll('.map-switch-btn[data-map-target]');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeMap = button.dataset.mapTarget || 'office';
      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      renderActiveMap(settingsCache?.contact_map_embed || null);
    });
  });
}

function applyAddresses(office, studio, customOfficeEmbed) {
  officeQuery = office;
  studioQuery = studio;

  document.querySelectorAll('[data-office-address]').forEach((el) => {
    el.innerHTML = escapeHtml(office).replace(/\n/g, '<br>');
  });

  document.querySelectorAll('[data-studio-address]').forEach((el) => {
    el.innerHTML = escapeHtml(studio).replace(/\n/g, '<br>');
  });

  renderActiveMap(customOfficeEmbed);
}

function updateNavLabels() {
  document.querySelectorAll('a[href="projelerimiz.html"]').forEach((link) => {
    if (link.closest('.nav-menu')) link.textContent = 'Referanslar';
  });

  document.querySelectorAll('a[href="portfolyo.html"]').forEach((link) => {
    if (link.closest('.nav-menu')) link.textContent = 'İşlerimiz';
  });
}

function renderLinkList(links) {
  return links.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('');
}

function ensureSocialLinks(container, settings) {
  if (!container || container.querySelector('.social-links')) return;

  const links = [
    [settings?.social_instagram || SOCIAL_LINKS[0][0], SOCIAL_LINKS[0][1], 'IG'],
    [settings?.social_linkedin || SOCIAL_LINKS[1][0], SOCIAL_LINKS[1][1], 'IN'],
    [settings?.social_behance || SOCIAL_LINKS[2][0], SOCIAL_LINKS[2][1], 'BH'],
  ].filter(([url]) => url);

  const markup = links
    .map(([url, label, text]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" title="${escapeHtml(label.replace(/^Genua\s+/i, ''))}">${text}</a>`)
    .join('');

  if (!markup) return;
  container.insertAdjacentHTML('beforeend', `<div class="social-links" aria-label="Sosyal medya bağlantıları">${markup}</div>`);
}

function normalizeFooter(settings) {
  document.querySelectorAll('.site-footer').forEach((footer) => {
    const columns = footer.querySelectorAll('.footer-grid > div');
    columns.forEach((column) => {
      const heading = column.querySelector('h2')?.textContent?.trim();
      const list = column.querySelector('ul');

      if (heading === 'Hizmetler' && list) {
        list.innerHTML = renderLinkList(SERVICE_LINKS);
      }

      if (heading === 'Hızlı Linkler' && list) {
        list.innerHTML = renderLinkList(QUICK_LINKS);
      }

      if (heading === 'İletişim' && list) {
        const email = settings?.contact_email || DEFAULT_EMAIL;
        const phone = settings?.contact_phone || DEFAULT_PHONE;
        const whatsapp = phoneToWhatsApp(phone);
        const office = settings?.contact_address || DEFAULT_OFFICE;
        const studio = settings?.contact_studio_address || DEFAULT_STUDIO;

        list.innerHTML = `
          <li><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></li>
          <li><a href="tel:+${phoneToWhatsApp(phone) || '905511245306'}">${escapeHtml(phone)}</a></li>
          ${whatsapp ? `<li><a href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">WhatsApp ile yazın</a></li>` : ''}
          <li class="footer-address"><strong>Merkez Ofis</strong> <span data-office-address>${escapeHtml(office)}</span></li>
          <li class="footer-address"><strong>Stüdyo</strong> <span data-studio-address>${escapeHtml(studio)}</span></li>`;
      }
    });

    ensureSocialLinks(footer.querySelector('.footer-brand'), settings);

    footer.querySelectorAll('.footer-bottom a').forEach((link) => {
      if (/gizlilik/i.test(link.textContent)) link.href = 'gizlilik-politikasi.html';
    });
  });
}

function injectWhatsAppButton(settings) {
  const phone = settings?.contact_phone || DEFAULT_PHONE;
  const whatsapp = phoneToWhatsApp(phone);
  if (!whatsapp || document.querySelector('.whatsapp-float')) return;

  const link = document.createElement('a');
  link.className = 'whatsapp-float';
  link.href = `https://wa.me/${whatsapp}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.innerHTML = '<span class="whatsapp-float-label">WhatsApp</span>';

  const syncWhatsAppLabel = () => {
    const mobile = window.matchMedia('(max-width: 640px)').matches;
    if (mobile) {
      link.setAttribute('aria-label', 'WhatsApp');
    } else {
      link.removeAttribute('aria-label');
    }
  };

  syncWhatsAppLabel();
  window.matchMedia('(max-width: 640px)').addEventListener('change', syncWhatsAppLabel);
  document.body.appendChild(link);
}

function initAnalytics(settings) {
  const gtmId = settings?.google_tag_manager_id?.trim();
  const gaId = settings?.google_analytics_id?.trim();

  if (gtmId && !document.querySelector(`script[data-gtm="${gtmId}"]`)) {
    const script = document.createElement('script');
    script.dataset.gtm = gtmId;
    script.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(script);

    if (!document.querySelector('.gtm-noscript')) {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<noscript class="gtm-noscript"><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      );
    }
  }

  if (gaId && !window.gtag && !gtmId) {
    const loader = document.createElement('script');
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(loader);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
  }

  window.GenuaAnalytics = {
    track(eventName, params = {}) {
      return trackAnalyticsEvent(eventName, params);
    },
  };

  fireDeferredAnalyticsEvents();
}

function fireDeferredAnalyticsEvents() {
  const pendingLead = window.sessionStorage?.getItem('genua_pending_lead');
  if (pendingLead && /tesekkurler\.html$/i.test(window.location.pathname)) {
    window.sessionStorage.removeItem('genua_pending_lead');
    trackAnalyticsEvent('generate_lead', {
      form_type: pendingLead,
      page_path: window.location.pathname,
      conversion_page: 'thank_you',
    });
    return;
  }

  const eventName = document.body?.dataset.analyticsEvent;
  if (!eventName) return;

  trackAnalyticsEvent(eventName, {
    page_path: window.location.pathname,
    ...(document.body.dataset.formType ? { form_type: document.body.dataset.formType } : {}),
  });
}

async function fetchSiteSettings() {
  const config = window.GenuaSupabase;
  const officeFallback = document.querySelector('[data-office-address]')?.textContent?.trim() || DEFAULT_OFFICE;
  const studioFallback = document.querySelector('[data-studio-address]')?.textContent?.trim() || DEFAULT_STUDIO;

  if (!config?.url || !config?.key) {
    return {
      contact_address: officeFallback,
      contact_studio_address: studioFallback,
      contact_phone: DEFAULT_PHONE,
      contact_email: DEFAULT_EMAIL,
    };
  }

  const select =
    'contact_address,contact_map_embed,contact_phone,contact_email,google_analytics_id,google_tag_manager_id,social_instagram,social_linkedin,social_behance';
  const response = await fetch(`${config.url}/rest/v1/site_settings?select=${encodeURIComponent(select)}&limit=1`, {
    cache: 'no-store',
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
  });

  if (!response.ok) {
    const analyticsOnly = await fetch(
      `${config.url}/rest/v1/site_settings?select=google_analytics_id,google_tag_manager_id&limit=1`,
      {
        cache: 'no-store',
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      },
    );
    const analyticsRows = analyticsOnly.ok ? await analyticsOnly.json() : [];
    return {
      contact_address: officeFallback,
      contact_studio_address: studioFallback,
      contact_phone: DEFAULT_PHONE,
      contact_email: DEFAULT_EMAIL,
      ...(analyticsRows?.[0] ?? {}),
    };
  }

  const rows = await response.json();
  return rows?.[0] ?? {};
}

  function injectChatWidget() {
  if (document.getElementById('genua-chat-root') || document.querySelector('link[data-genua-chat]')) return;

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'css/genua-chat.css';
  style.setAttribute('data-genua-chat', 'true');
  document.head.appendChild(style);

  const rules = document.createElement('script');
  rules.src = 'js/genua-chat-rules.js';
  rules.defer = true;
  document.body.appendChild(rules);

  const script = document.createElement('script');
  script.src = 'js/genua-chat.js';
  script.defer = true;
  document.body.appendChild(script);
}

async function bootSiteSettings() {
  bindMapSwitch();
  settingsCache = await fetchSiteSettings();

  applyAddresses(
    settingsCache.contact_address || DEFAULT_OFFICE,
    settingsCache.contact_studio_address || DEFAULT_STUDIO,
    settingsCache.contact_map_embed || null,
  );

  updateNavLabels();
  normalizeFooter(settingsCache);
  injectWhatsAppButton(settingsCache);
  injectChatWidget();
  initAnalytics(settingsCache);
}

bootSiteSettings();
