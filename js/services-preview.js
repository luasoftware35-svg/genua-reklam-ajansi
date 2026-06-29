function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderServiceCard(service) {
  return `
    <article class="service-card reveal">
      <a class="service-card-link" href="${escapeHtml(service.href)}">
        <div class="service-card-media">
          <img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)}" loading="lazy" decoding="async">
        </div>
        <div class="service-card-body">
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.description)}</p>
          <span class="service-card-cta">Detay <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>`;
}

function mergeServiceRecord(catalogItem, remote) {
  if (!remote) return catalogItem;

  return {
    ...catalogItem,
    title: remote.title?.trim() || catalogItem.title,
    description: remote.short_description?.trim() || catalogItem.description,
    image: remote.cover_image_url?.trim() || catalogItem.image,
  };
}

async function loadServicesPreview() {
  const grid = document.querySelector('#servicesGrid');
  if (!grid) return;

  const catalog = window.GenuaServiceCatalog || [];
  let services = catalog.map((item) => ({ ...item }));
  const config = window.GenuaSupabase;

  if (config?.url && config?.key) {
    const select = 'slug,title,short_description,cover_image_url,display_order';
    const endpoint = `${config.url}/rest/v1/services?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`;

    try {
      const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
      });

      if (response.ok) {
        const remoteItems = await response.json();
        if (Array.isArray(remoteItems) && remoteItems.length) {
          const remoteBySlug = Object.fromEntries(remoteItems.map((item) => [item.slug, item]));
          services = catalog.map((item) => mergeServiceRecord(item, remoteBySlug[item.slug]));
        }
      }
    } catch {
      // Static catalog fallback is enough for the homepage preview.
    }
  }

  grid.innerHTML = services.map(renderServiceCard).join('');
  document.dispatchEvent(new CustomEvent('genua:services-rendered', { detail: { count: services.length } }));
}

loadServicesPreview();
