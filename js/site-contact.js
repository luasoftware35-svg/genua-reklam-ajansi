function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_OFFICE = 'Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli';
const DEFAULT_STUDIO = 'Denizli Yenişehir, Ladik Evler Sitesi, 56. Sk. No: 1 M';

function applyAddresses(office, studio) {
  document.querySelectorAll('[data-office-address]').forEach((el) => {
    el.innerHTML = escapeHtml(office).replace(/\n/g, '<br>');
  });

  document.querySelectorAll('[data-studio-address]').forEach((el) => {
    el.innerHTML = escapeHtml(studio).replace(/\n/g, '<br>');
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
    `${config.url}/rest/v1/site_settings?select=contact_address,contact_studio_address&limit=1`,
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
  applyAddresses(settings.contact_address || officeFallback, settings.contact_studio_address || studioFallback);
}

loadSiteAddresses();
