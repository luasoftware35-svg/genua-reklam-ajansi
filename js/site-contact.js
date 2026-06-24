function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_OFFICE = 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli';
const DEFAULT_STUDIO = 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M';

function mapEmbedSrc(query) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=tr&z=16&output=embed`;
}

function mapOpenUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function applyAddresses(office, studio, customOfficeEmbed) {
  document.querySelectorAll('[data-office-address]').forEach((el) => {
    el.innerHTML = escapeHtml(office).replace(/\n/g, '<br>');
  });

  document.querySelectorAll('[data-studio-address]').forEach((el) => {
    el.innerHTML = escapeHtml(studio).replace(/\n/g, '<br>');
  });

  applyMaps(office, studio, customOfficeEmbed);
}

function applyMaps(office, studio, customOfficeEmbed) {
  const officeMap = document.querySelector('[data-map-for="office"]');
  if (officeMap) {
    if (customOfficeEmbed?.includes('<iframe')) {
      officeMap.innerHTML = customOfficeEmbed;
    } else {
      const iframe = officeMap.querySelector('iframe');
      if (iframe) iframe.src = mapEmbedSrc(office);
    }
  }

  document.querySelectorAll('[data-map-link-for="office"]').forEach((link) => {
    link.href = mapOpenUrl(office);
  });

  const studioMap = document.querySelector('[data-map-for="studio"]');
  if (studioMap) {
    const iframe = studioMap.querySelector('iframe');
    if (iframe) iframe.src = mapEmbedSrc(studio);
  }

  document.querySelectorAll('[data-map-link-for="studio"]').forEach((link) => {
    link.href = mapOpenUrl(studio);
  });
}

async function loadSiteAddresses() {
  const officeFallback = document.querySelector('[data-office-address]')?.textContent?.trim() || DEFAULT_OFFICE;
  const studioFallback = document.querySelector('[data-studio-address]')?.textContent?.trim() || DEFAULT_STUDIO;
  const config = window.GenuaSupabase;

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
  const office = settings.contact_address || officeFallback;
  const studio = settings.contact_studio_address || studioFallback;
  applyAddresses(office, studio, settings.contact_map_embed || null);
}

loadSiteAddresses();
