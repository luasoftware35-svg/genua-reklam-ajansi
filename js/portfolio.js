function categoryFilters(projects) {
  const defaults = [
    { key: 'all', label: 'Tümü' },
    { key: 'dijital', label: 'Dijital' },
    { key: 'sosyal', label: 'Sosyal Medya' },
    { key: 'marka', label: 'Marka' },
    { key: 'web', label: 'Web' },
  ];
  const keys = new Set();
  projectTags(projects).forEach((tag) => keys.add(tag));
  return defaults.filter((item) => item.key === 'all' || keys.has(item.key));
}

function projectTags(projects) {
  const tags = new Set();
  projects.forEach((project) => {
    (project.tags || []).forEach((tag) => tags.add(window.GenuaProjectCards.filterKey(tag)));
    if (project.category) tags.add(window.GenuaProjectCards.filterKey(project.category));
  });
  return tags;
}

function bindFilters() {
  const buttons = document.querySelectorAll('#portfolioFilters [data-filter]');
  const items = document.querySelectorAll('#portfolioGrid [data-category]');
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      items.forEach((item) => {
        const categories = item.dataset.category || '';
        item.classList.toggle('is-hidden', filter !== 'all' && !categories.split(' ').includes(filter));
      });
    });
  });
}

function bindModal() {
  const modal = document.querySelector('#projectModal');
  const modalTitle = document.querySelector('#modalTitle');
  const modalText = document.querySelector('#modalText');
  const modalClose = document.querySelector('[data-modal-close]');
  const grid = document.querySelector('#portfolioGrid');
  if (!modal || !grid) return;

  grid.addEventListener('click', (event) => {
    const link = event.target.closest('[data-modal-title]');
    if (!link) return;
    event.preventDefault();
    modalTitle.textContent = link.dataset.modalTitle || 'Proje';
    modalText.textContent = link.dataset.modalText || '';
    modal.classList.add('is-open');
    modalClose?.focus();
  });
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
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

async function fetchJson(url, config) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data) ? data : null;
}

async function loadPortfolio() {
  const grid = document.querySelector('#portfolioGrid');
  const filtersEl = document.querySelector('#portfolioFilters');
  const heroEl = document.querySelector('#portfolioHero');
  const config = window.GenuaSupabase;
  const cards = window.GenuaProjectCards;
  if (!grid || !config?.url || !config?.key || !cards) return;

  const projectSelect =
    'slug,title,category,tags,cover_image_url,short_description,challenge,strategy,execution,result,project_url,display_order';
  const projects = await fetchJson(
    `${config.url}/rest/v1/projects?select=${encodeURIComponent(projectSelect)}&is_active=eq.true&order=display_order.asc`,
    config,
  );

  if (heroEl) {
    const settings = await fetchJson(
      `${config.url}/rest/v1/site_settings?select=portfolio_hero_eyebrow,portfolio_hero_title,portfolio_hero_description&limit=1`,
      config,
    );
    const page = settings?.[0];
    if (page) {
      heroEl.innerHTML = `
        <div class="container reveal">
          <div class="breadcrumb"><a href="anasayfa.html">Ana Sayfa</a><span>/</span><span>Portföy</span></div>
          <p class="eyebrow">${cards.escapeHtml(page.portfolio_hero_eyebrow || 'Seçilmiş İşler')}</p>
          <h1>${cards.escapeHtml(page.portfolio_hero_title || 'Stratejiyle başlayan, sonuçla kanıtlanan projeler.')}</h1>
          <p>${cards.escapeHtml(page.portfolio_hero_description || '')}</p>
        </div>`;
    }
  }

  if (!projects?.length) return;

  if (filtersEl) {
    filtersEl.innerHTML = categoryFilters(projects)
      .map((item, index) => `<button class="filter-btn${index === 0 ? ' is-active' : ''}" type="button" data-filter="${item.key}">${item.label}</button>`)
      .join('');
  }

  grid.innerHTML = projects.map((project, index) => cards.renderProjectCard(project, index, { useModal: true })).join('');
  bindFilters();
  bindModal();
  observeReveal(document);
}

loadPortfolio();
