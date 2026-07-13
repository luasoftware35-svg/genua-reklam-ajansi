function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function projectCard(project) {
  const title = project.title || project.client_name || 'Behance Projesi';
  const subtitle = project.client_name && project.title ? project.client_name : '';
  const thumb = project.cover_image_url?.trim() || '';

  return `
    <a class="behance-card" href="${escapeHtml(project.project_url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(title)} — Behance'te görüntüle" data-behance-title="${escapeHtml(title)}" data-behance-url="${escapeHtml(project.project_url)}">
      <div class="behance-card-media">
        ${
          thumb
            ? `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">`
            : '<span class="behance-card-fallback" aria-hidden="true">BEHANCE</span>'
        }
        <span class="behance-card-badge" aria-hidden="true">Bē</span>
      </div>
      <div class="behance-card-copy">
        <strong>${escapeHtml(title)}</strong>
        ${subtitle ? `<span>${escapeHtml(subtitle)}</span>` : ''}
      </div>
    </a>`;
}

function bindBehanceAnalytics(container) {
  container.querySelectorAll('.behance-card').forEach((link) => {
    link.addEventListener('click', () => {
      window.GenuaAnalytics?.track('behance_click', {
        project_title: link.dataset.behanceTitle || 'Behance',
        page_path: window.location.pathname,
      });
    });
  });
}

function setBehanceCardCover(card, coverUrl) {
  const media = card.querySelector('.behance-card-media');
  if (!media || !coverUrl) return;

  media.querySelector('.behance-card-fallback')?.remove();
  let img = media.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = card.getAttribute('aria-label')?.replace(/ — Behance'te görüntüle$/, '') || 'Behance Projesi';
    media.prepend(img);
  }

  img.src = coverUrl;
}

async function hydrateBehanceCovers(section) {
  const cards = [...section.querySelectorAll('.behance-card')];
  await Promise.all(
    cards.map(async (card) => {
      const img = card.querySelector('.behance-card-media img');
      if (img?.naturalWidth > 0) return;

      const projectUrl = card.dataset.behanceUrl || card.getAttribute('href');
      if (!projectUrl) return;

      try {
        const response = await fetch(`/api/behance-meta?url=${encodeURIComponent(projectUrl)}`, { cache: 'force-cache' });
        if (!response.ok) return;
        const meta = await response.json();
        if (meta.cover_image_url) setBehanceCardCover(card, meta.cover_image_url);
      } catch {
        /* fallback badge stays visible */
      }
    }),
  );
}

function renderMarquee(section, projects, behanceUrl) {
  section.hidden = false;
  section.setAttribute('aria-labelledby', 'behanceTitle');
  const cards = projects.map(projectCard).join('');
  const trackHtml = `${cards}${cards}`;

  section.innerHTML = `
    <div class="container behance-marquee-head reveal is-visible">
      <div class="section-heading">
        <p class="eyebrow">Portföyden</p>
        <h2 id="behanceTitle">Behance'ten seçkiler</h2>
        <p class="section-note">Etkinlik, marka ve kreatif üretim projelerimizden Behance üzerindeki seçkiler. Kartlara tıklayarak projeleri inceleyebilirsiniz.</p>
      </div>
      <a class="text-link behance-profile-link" href="${escapeHtml(behanceUrl)}" target="_blank" rel="noopener noreferrer">behance.net/umutavci4 <span aria-hidden="true">→</span></a>
    </div>
    <div class="behance-marquee-outer">
      <div class="behance-marquee-wrap">
        <div class="behance-marquee-track" id="behanceProjectsTrack">${trackHtml}</div>
      </div>
    </div>`;

  bindBehanceAnalytics(section);
}

function getFallbackProjects() {
  const catalog = window.GenuaBehanceProjectsCatalog;
  return Array.isArray(catalog) && catalog.length ? catalog : [];
}

function scheduleBehanceCoverHydration(section) {
  const run = () => hydrateBehanceCovers(section);
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 400);
  }
}

function renderBehanceProjects(section, projects, behanceUrl) {
  if (!section || !projects.length) return;
  renderMarquee(section, projects, behanceUrl);
  scheduleBehanceCoverHydration(section);
  document.dispatchEvent(new CustomEvent('genua:behance-rendered'));
}

async function loadBehanceProjectsFromSupabase(section, behanceUrl) {
  const config = window.GenuaSupabase;
  if (!config?.url || !config?.key) return null;

  const select = 'title,client_name,project_url,cover_image_url,display_order';
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4000);

  try {
    const [projectsResponse, settingsResponse] = await Promise.all([
      fetch(
        `${config.url}/rest/v1/behance_projects?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`,
        {
          cache: 'no-store',
          signal: controller.signal,
          headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
        },
      ),
      fetch(`${config.url}/rest/v1/site_settings?select=social_behance&limit=1`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      }),
    ]);

    let nextUrl = behanceUrl;
    if (settingsResponse.ok) {
      const settingsRows = await settingsResponse.json();
      nextUrl = settingsRows?.[0]?.social_behance?.trim() || nextUrl;
    }

    if (!projectsResponse.ok) return null;

    const rows = await projectsResponse.json();
    if (!Array.isArray(rows) || !rows.length) return null;

    return { projects: rows, behanceUrl: nextUrl };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function loadBehanceProjects() {
  const section = document.querySelector('#behanceProjectsSection');
  if (!section) return;

  const fallback = getFallbackProjects();
  const defaultBehanceUrl = 'https://www.behance.net/umutavci4';

  const remote = await loadBehanceProjectsFromSupabase(section, defaultBehanceUrl);
  if (remote?.projects?.length) {
    renderBehanceProjects(section, remote.projects, remote.behanceUrl);
    return;
  }

  if (fallback.length) {
    renderBehanceProjects(section, fallback, defaultBehanceUrl);
    return;
  }

  section.hidden = true;
}

function initBehanceProjects() {
  const section = document.querySelector('#behanceProjectsSection');
  if (!section) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    loadBehanceProjects();
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

initBehanceProjects();
