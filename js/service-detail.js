function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveSlug() {
  const fromBody = document.body?.dataset?.serviceSlug?.trim();
  if (fromBody) return fromBody;

  const page = window.location.pathname.split('/').pop() || '';
  return page.replace(/\.html$/, '');
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

async function fetchRemoteService(slug) {
  const config = window.GenuaSupabase;
  if (!config?.url || !config?.key) return null;

  const select = 'slug,title,short_description,cover_image_url';
  const endpoint = `${config.url}/rest/v1/services?select=${encodeURIComponent(select)}&slug=eq.${encodeURIComponent(slug)}&limit=1`;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    if (!response.ok) return null;
    const items = await response.json();
    return Array.isArray(items) ? items[0] : null;
  } catch {
    return null;
  }
}

function applyHeroImage(hero, image, title) {
  if (!hero || !image) return;

  hero.classList.add('has-service-photo');

  let overlay = hero.querySelector('.page-hero-media');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-hero-media';
    overlay.setAttribute('aria-hidden', 'true');
    hero.prepend(overlay);
  }

  overlay.style.backgroundImage = `url("${image}")`;
  hero.setAttribute('aria-label', `${title} hizmet görseli`);
}

function applyVisualPanel(panel, image, title) {
  if (!panel || !image) return;

  panel.classList.add('has-photo');
  panel.innerHTML = `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">`;
}

function renderGalleryItem(item) {
  return `
    <figure class="service-gallery-item reveal">
      <div class="service-gallery-media">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
      </div>
      <figcaption>${escapeHtml(item.caption)}</figcaption>
    </figure>`;
}

function applyGallery(section, titleEl, grid, service) {
  if (!section || !grid || !service.gallery?.length) return;

  if (titleEl && service.galleryTitle) {
    titleEl.textContent = service.galleryTitle;
  }

  grid.innerHTML = service.gallery.map(renderGalleryItem).join('');
  section.hidden = false;
}

function applyServiceVisuals(service) {
  applyHeroImage(document.querySelector('#serviceHero'), service.image, service.title);
  applyVisualPanel(document.querySelector('#serviceVisualPanel'), service.image, service.title);
  applyGallery(
    document.querySelector('#serviceGallerySection'),
    document.querySelector('#serviceGalleryTitle'),
    document.querySelector('#serviceGallery'),
    service,
  );
}

async function initServiceDetailPage() {
  const slug = resolveSlug();
  const catalogItem = window.GenuaServiceCatalogBySlug?.[slug];
  if (!catalogItem) return;

  applyServiceVisuals(catalogItem);

  const remote = await fetchRemoteService(slug);
  if (remote) {
    applyServiceVisuals(mergeServiceRecord(catalogItem, remote));
  }

  document.dispatchEvent(new CustomEvent('genua:service-detail-ready', { detail: { slug, service: catalogItem } }));
}

initServiceDetailPage();
