const SERVICE_CATALOG = [
  {
    slug: 'dijital-reklam',
    title: 'Dijital Reklam',
    description:
      'Denizli merkezli ekibimizle Google ve Meta kampanyalarınızı doğru hedefleme, teklif stratejisi ve düzenli optimizasyonla büyütürüz.',
    href: 'dijital-reklam.html',
    image: 'varlıklar/resimler/hizmetler/dijital-reklam.jpg',
  },
  {
    slug: 'sosyal-medya',
    title: 'Sosyal Medya',
    description:
      'İçerik takvimi, topluluk yönetimi ve yaratıcı kampanyalarla sosyal medya varlığınızı güçlendiririz.',
    href: 'sosyal-medya.html',
    image: 'varlıklar/resimler/hizmetler/sosyal-medya.jpg',
  },
  {
    slug: 'marka-tasarim',
    title: 'Marka Tasarımı',
    description:
      'Kurumsal kimlik, görsel dil ve iletişim tonu ile markanızın pazarda net ayrışmasını sağlarız.',
    href: 'marka-tasarim.html',
    image: 'varlıklar/resimler/hizmetler/marka-tasarim.jpg',
  },
  {
    slug: 'icerik-uretimi',
    title: 'İçerik Üretimi',
    description:
      'Fotoğraf, video, motion ve metin üretimiyle satışa, güvene ve etkileşime hizmet eden içerikler hazırlarız.',
    href: 'icerik-uretimi.html',
    image: 'varlıklar/resimler/hizmetler/icerik-uretimi.jpg',
  },
  {
    slug: 'seo',
    title: 'SEO',
    description:
      'Teknik analiz, içerik planlama ve arama niyeti odaklı optimizasyonlarla organik görünürlüğünüzü artırırız.',
    href: 'seo.html',
    image: 'varlıklar/resimler/hizmetler/seo.jpg',
  },
  {
    slug: 'web-tasarim',
    title: 'Web Tasarım',
    description:
      'Hızlı, erişilebilir, SEO uyumlu ve dönüşüm odaklı kurumsal web siteleri tasarlar ve geliştiririz.',
    href: 'web-tasarim.html',
    image: 'varlıklar/resimler/hizmetler/web-tasarim.jpg',
  },
];

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

  let services = SERVICE_CATALOG.map((item) => ({ ...item }));
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
          services = SERVICE_CATALOG.map((item) => mergeServiceRecord(item, remoteBySlug[item.slug]));
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
