function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function reelCard(reel) {
  const title = reel.title || reel.client_name || 'Genua Reels';
  const subtitle = reel.client_name && reel.title ? reel.client_name : '';
  const thumb = reel.thumbnail_url?.trim();

  return `
    <a class="reel-card" href="${escapeHtml(reel.reel_url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(title)} — Instagram Reels'te izle" data-reel-title="${escapeHtml(title)}">
      <div class="reel-card-media">
        ${
          thumb
            ? `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">`
            : '<span class="reel-card-fallback" aria-hidden="true">REEL</span>'
        }
        <span class="reel-card-play" aria-hidden="true"></span>
      </div>
      <div class="reel-card-copy">
        <strong>${escapeHtml(title)}</strong>
        ${subtitle ? `<span>${escapeHtml(subtitle)}</span>` : ''}
      </div>
    </a>`;
}

function bindReelAnalytics(container) {
  container.querySelectorAll('.reel-card').forEach((link) => {
    link.addEventListener('click', () => {
      window.GenuaAnalytics?.track('reel_click', {
        reel_title: link.dataset.reelTitle || 'Reel',
        page_path: window.location.pathname,
      });
    });
  });
}

const reelMetaCache = new Map();

async function fetchReelMeta(reelUrl) {
  if (reelMetaCache.has(reelUrl)) return reelMetaCache.get(reelUrl);

  try {
    const response = await fetch(`/api/reel-meta?url=${encodeURIComponent(reelUrl)}`, {
      cache: 'force-cache',
    });
    if (!response.ok) return null;
    const meta = await response.json();
    reelMetaCache.set(reelUrl, meta);
    return meta;
  } catch {
    return null;
  }
}

function setReelCardThumbnail(card, thumbnailUrl) {
  const media = card.querySelector('.reel-card-media');
  if (!media || media.querySelector('img')) return;

  media.querySelector('.reel-card-fallback')?.remove();
  const img = document.createElement('img');
  img.src = thumbnailUrl;
  img.alt = card.getAttribute('aria-label')?.replace(/ — Instagram Reels'te izle$/, '') || 'Instagram Reels';
  img.loading = 'lazy';
  img.decoding = 'async';
  media.prepend(img);
}

async function hydrateReelThumbnails(section) {
  const cards = [...section.querySelectorAll('.reel-card')];
  await Promise.all(
    cards.map(async (card) => {
      if (card.querySelector('.reel-card-media img')) return;
      const reelUrl = card.getAttribute('href');
      if (!reelUrl) return;
      const meta = await fetchReelMeta(reelUrl);
      if (meta?.thumbnail_url) setReelCardThumbnail(card, meta.thumbnail_url);
    }),
  );
}

function renderMarquee(section, reels, instagramUrl) {
  section.hidden = false;
  const cards = reels.map(reelCard).join('');
  const trackHtml = `${cards}${cards}`;

  section.innerHTML = `
    <div class="container reels-marquee-head reveal is-visible">
      <div class="section-heading">
        <p class="eyebrow">Stüdyodan</p>
        <h2 id="reelsTitle">Reels ile ürettiğimiz işler</h2>
        <p class="section-note">Sosyal medyada yayınladığımız içeriklerden seçkiler. Kartlara tıklayarak Instagram'da izleyebilirsiniz.</p>
      </div>
      <a class="text-link reels-profile-link" href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer">@genuadigital <span aria-hidden="true">→</span></a>
    </div>
    <div class="reels-marquee-outer">
      <div class="reels-marquee-wrap">
        <div class="reels-marquee-track" id="instagramReelsTrack">${trackHtml}</div>
      </div>
    </div>`;

  bindReelAnalytics(section);
}

function getFallbackReels() {
  const catalog = window.GenuaInstagramReelsCatalog;
  return Array.isArray(catalog) && catalog.length ? catalog : [];
}

function scheduleReelThumbnailHydration(section) {
  const run = () => hydrateReelThumbnails(section);
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 400);
  }
}

function renderInstagramReels(section, reels, instagramUrl) {
  if (!section || !reels.length) return;
  renderMarquee(section, reels, instagramUrl);
  scheduleReelThumbnailHydration(section);
  document.dispatchEvent(new CustomEvent('genua:reels-rendered'));
}

async function loadInstagramReelsFromSupabase(section, instagramUrl) {
  const config = window.GenuaSupabase;
  if (!config?.url || !config?.key) return null;

  const select = 'title,client_name,reel_url,thumbnail_url,display_order';
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4000);

  try {
    const [reelsResponse, settingsResponse] = await Promise.all([
      fetch(
        `${config.url}/rest/v1/instagram_reels?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`,
        {
          cache: 'no-store',
          signal: controller.signal,
          headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
        },
      ),
      fetch(`${config.url}/rest/v1/site_settings?select=social_instagram&limit=1`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      }),
    ]);

    let nextUrl = instagramUrl;
    if (settingsResponse.ok) {
      const settingsRows = await settingsResponse.json();
      nextUrl = settingsRows?.[0]?.social_instagram?.trim() || nextUrl;
    }

    if (!reelsResponse.ok) return null;

    const rows = await reelsResponse.json();
    if (!Array.isArray(rows) || !rows.length) return null;

    return { reels: rows, instagramUrl: nextUrl };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function loadInstagramReels() {
  const section = document.querySelector('#instagramReelsSection');
  if (!section) return;

  const fallback = getFallbackReels();
  const defaultInstagramUrl = 'https://www.instagram.com/genuadigital/';

  const remote = await loadInstagramReelsFromSupabase(section, defaultInstagramUrl);
  if (remote?.reels?.length) {
    renderInstagramReels(section, remote.reels, remote.instagramUrl);
    return;
  }

  if (fallback.length) {
    renderInstagramReels(section, fallback, defaultInstagramUrl);
    return;
  }

  section.hidden = true;
}

function initInstagramReels() {
  const section = document.querySelector('#instagramReelsSection');
  if (!section) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    loadInstagramReels();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: '320px 0px' },
    );
    observer.observe(section);
    window.setTimeout(start, 6000);
    return;
  }

  start();
}

initInstagramReels();
