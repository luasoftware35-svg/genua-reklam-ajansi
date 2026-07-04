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
            ? `<img src="${escapeHtml(thumb)}" alt="" loading="lazy" decoding="async">`
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

function renderMarquee(section, reels, instagramUrl) {
  section.hidden = false;
  const cards = reels.map(reelCard).join('');
  const trackHtml = `${cards}${cards}`;

  section.innerHTML = `
    <div class="container reels-marquee-head reveal">
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

async function loadInstagramReels() {
  const section = document.querySelector('#instagramReelsSection');
  const config = window.GenuaSupabase;
  if (!section || !config?.url || !config?.key) return;

  const select = 'title,client_name,reel_url,thumbnail_url,display_order';
  const [reelsResponse, settingsResponse] = await Promise.all([
    fetch(
      `${config.url}/rest/v1/instagram_reels?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`,
      {
        cache: 'no-store',
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      },
    ),
    fetch(`${config.url}/rest/v1/site_settings?select=social_instagram&limit=1`, {
      cache: 'no-store',
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    }),
  ]);

  if (!reelsResponse.ok) return;

  const reels = await reelsResponse.json();
  if (!Array.isArray(reels) || !reels.length) {
    section.hidden = true;
    return;
  }

  let instagramUrl = 'https://www.instagram.com/genuadigital/';
  if (settingsResponse.ok) {
    const settingsRows = await settingsResponse.json();
    instagramUrl = settingsRows?.[0]?.social_instagram?.trim() || instagramUrl;
  }

  renderMarquee(section, reels, instagramUrl);
}

loadInstagramReels();
