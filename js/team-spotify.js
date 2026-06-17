function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SPOTIFY_ICON = `<svg class="spotify-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;

const EQUALIZER = `
  <div class="spotify-equalizer" aria-hidden="true">
    <span></span><span></span><span></span><span></span><span></span>
  </div>`;

function coverMarkup(coverUrl, title) {
  if (coverUrl) {
    return `<div class="spotify-cover has-cover"><img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(title || 'Playlist kapak görseli')}" loading="lazy" decoding="async"></div>`;
  }
  return `<div class="spotify-cover"><span class="spotify-cover-glow"></span>${EQUALIZER}</div>`;
}

function renderSpotifyCard(data) {
  const url = data.team_spotify_url?.trim();
  if (!url) return '';

  const eyebrow = data.team_spotify_eyebrow || 'Ofis Ritmi';
  const title = data.team_spotify_title || 'Ekibimizin dinledikleri';
  const description =
    data.team_spotify_description ||
    'Strateji toplantılarından gece yarısı teslimatlarına — Genua ofisinde dönen playlist.';

  return `
    <a class="spotify-card reveal" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(title)} — Spotify'da dinle">
      <div class="spotify-card-copy">
        <div class="spotify-card-head">
          ${SPOTIFY_ICON}
          <p class="eyebrow spotify-eyebrow">${escapeHtml(eyebrow)}</p>
        </div>
        <h2>${escapeHtml(title)}</h2>
        <p class="spotify-description">${escapeHtml(description)}</p>
        <span class="spotify-cta">Spotify'da dinle <span aria-hidden="true">→</span></span>
      </div>
      <div class="spotify-card-visual">
        ${coverMarkup(data.team_spotify_cover_url, title)}
        <div class="spotify-vinyl" aria-hidden="true"></div>
      </div>
    </a>`;
}

function observeReveal(root) {
  const items = root.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  items.forEach((el) => observer.observe(el));
}

async function loadTeamSpotify() {
  const section = document.querySelector('#teamSpotifySection');
  const config = window.GenuaSupabase;
  if (!section) return;

  if (!config?.url || !config?.key) {
    observeReveal(section);
    return;
  }

  const select =
    'team_spotify_eyebrow,team_spotify_title,team_spotify_description,team_spotify_url,team_spotify_cover_url';
  const response = await fetch(
    `${config.url}/rest/v1/site_settings?select=${encodeURIComponent(select)}&limit=1`,
    {
      cache: 'no-store',
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    },
  );

  if (!response.ok) {
    observeReveal(section);
    return;
  }

  const rows = await response.json();
  const data = rows?.[0];
  if (!data?.team_spotify_url?.trim()) {
    observeReveal(section);
    return;
  }

  section.innerHTML = `<div class="container">${renderSpotifyCard(data)}</div>`;
  observeReveal(section);
}

loadTeamSpotify();
