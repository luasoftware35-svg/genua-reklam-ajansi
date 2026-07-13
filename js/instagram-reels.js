function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isHostedThumbnail(url) {
  const value = String(url || '').trim();
  if (!value) return false;
  if (/instagram\.|fbcdn\.net|cdninstagram\.com/i.test(value)) return false;
  return value.startsWith('/') || /^https?:\/\//i.test(value);
}

function reelThumbnailSrc(reel) {
  const thumb = reel.thumbnail_url?.trim();
  if (isHostedThumbnail(thumb)) return thumb;
  if (reel.reel_url) {
    return `/api/reel-thumb?reel=${encodeURIComponent(reel.reel_url)}`;
  }
  return '';
}

function reelCard(reel) {
  const title = reel.title || reel.client_name || 'Genua Reels';
  const subtitle = reel.client_name && reel.title ? reel.client_name : '';
  const thumb = reelThumbnailSrc(reel);

  return `
    <a class="reel-card" href="${escapeHtml(reel.reel_url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(title)} — Instagram Reels'te izle" data-reel-title="${escapeHtml(title)}" data-reel-url="${escapeHtml(reel.reel_url)}">
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

function setReelCardThumbnail(card, thumbnailUrl) {
  const media = card.querySelector('.reel-card-media');
  if (!media) return;

  media.querySelector('.reel-card-fallback')?.remove();
  let img = media.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = card.getAttribute('aria-label')?.replace(/ — Instagram Reels'te izle$/, '') || 'Instagram Reels';
    media.prepend(img);
  }

  img.src = thumbnailUrl;
}

function bindReelThumbnailFallback(section) {
  section.querySelectorAll('.reel-card-media img').forEach((img) => {
    if (img.dataset.fallbackBound === '1') return;
    img.dataset.fallbackBound = '1';

    img.addEventListener('error', () => {
      const card = img.closest('.reel-card');
      const reelUrl = card?.dataset.reelUrl || card?.getAttribute('href');
      if (!reelUrl || img.dataset.retry === '1') return;
      img.dataset.retry = '1';
      img.src = `/api/reel-thumb?reel=${encodeURIComponent(reelUrl)}`;
    }, { once: true });
  });
}

async function hydrateReelThumbnails(section) {
  const cards = [...section.querySelectorAll('.reel-card')];
  await Promise.all(
    cards.map(async (card) => {
      const img = card.querySelector('.reel-card-media img');
      const reelUrl = card.dataset.reelUrl || card.getAttribute('href');
      if (!reelUrl) return;

      if (img && !img.complete) return;
      if (img?.naturalWidth > 0) return;

      const proxied = `/api/reel-thumb?reel=${encodeURIComponent(reelUrl)}`;
      setReelCardThumbnail(card, proxied);
    }),
  );
}

function instagramProfileLabel(url) {
  const match = String(url || '').match(/instagram\.com\/([^/?]+)/i);
  return match ? `@${match[1]}` : '@mrrumutt2';
}

function renderReelsMarquee(section, reels, instagramUrl) {
  section.hidden = false;
  section.setAttribute('aria-labelledby', 'reelsTitle');
  const cards = reels.map(reelCard).join('');
  const trackHtml = `${cards}${cards}`;
  const profileLabel = instagramProfileLabel(instagramUrl);

  section.innerHTML = `
    <div class="container reels-marquee-head reveal is-visible">
      <div class="section-heading">
        <p class="eyebrow">Stüdyodan</p>
        <h2 id="reelsTitle">Reels ile ürettiğimiz işler</h2>
        <p class="section-note">Sosyal medyada yayınladığımız içeriklerden seçkiler. Kartlara tıklayarak Instagram'da izleyebilirsiniz.</p>
      </div>
      <a class="text-link reels-profile-link" href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(profileLabel)} <span aria-hidden="true">→</span></a>
    </div>
    <div class="reels-marquee-outer">
      <div class="reels-marquee-wrap">
        <div class="reels-marquee-track" id="instagramReelsTrack">${trackHtml}</div>
      </div>
    </div>`;

  bindReelAnalytics(section);
  bindReelThumbnailFallback(section);
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
  renderReelsMarquee(section, reels, instagramUrl);
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
  const defaultInstagramUrl = 'https://www.instagram.com/mrrumutt2/reels/';

  if (fallback.length) {
    renderInstagramReels(section, fallback, defaultInstagramUrl);
  }

  const remote = await loadInstagramReelsFromSupabase(section, defaultInstagramUrl);
  if (remote?.reels?.length) {
    renderInstagramReels(section, remote.reels, remote.instagramUrl);
    return;
  }

  if (!fallback.length) section.hidden = true;
}

loadInstagramReels();
