function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_OFFICE = 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli';
const DEFAULT_STUDIO = 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M';

let officeQuery = DEFAULT_OFFICE;
let studioQuery = DEFAULT_STUDIO;
let activeMap = 'office';

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
      renderActiveMap();
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

async function loadSiteAddresses() {
  const officeFallback = document.querySelector('[data-office-address]')?.textContent?.trim() || DEFAULT_OFFICE;
  const studioFallback = document.querySelector('[data-studio-address]')?.textContent?.trim() || DEFAULT_STUDIO;
  const config = window.GenuaSupabase;

  bindMapSwitch();

  if (!config?.url || !config?.key) {
    applyAddresses(officeFallback, studioFallback);
    return;
  }

  const response = await fetch(
    `${config.url}/rest/v1/site_settings?select=contact_address,contact_studio_address,contact_map_embed&limit=1`,
    {
      cache: 'no-store',
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    },
  );

  if (!response.ok) {
    applyAddresses(officeFallback, studioFallback);
    return;
  }

  const rows = await response.json();
  const settings = rows?.[0] ?? {};
  applyAddresses(
    settings.contact_address || officeFallback,
    settings.contact_studio_address || studioFallback,
    settings.contact_map_embed || null,
  );
}

loadSiteAddresses();
