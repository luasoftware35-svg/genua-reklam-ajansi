function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function filterKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

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
    (project.tags || []).forEach((tag) => tags.add(filterKey(tag)));
    if (project.category) tags.add(filterKey(project.category));
  });
  return tags;
}

function projectCategories(project) {
  const values = [...(project.tags || [])];
  if (project.category) values.push(project.category);
  return [...new Set(values.map(filterKey).filter(Boolean))].join(' ');
}

function hasCaseStudy(project) {
  return Boolean(project.challenge || project.strategy || project.execution || project.result);
}

function cardLink(project) {
  if (project.project_url) return project.project_url;
  if (hasCaseStudy(project)) return `vaka-analizi.html?slug=${encodeURIComponent(project.slug)}`;
  return '#';
}

function overlayLabel(project) {
  if (project.project_url) return 'Siteyi Gör';
  if (hasCaseStudy(project)) return 'Vaka Analizi';
  return 'İncele';
}

function visualStyle(project, index) {
  if (project.cover_image_url) {
    return `background-image:linear-gradient(135deg,rgba(10,10,0,.12),rgba(10,10,0,.62)),url('${escapeHtml(project.cover_image_url)}');`;
  }
  const classes = ['project-one', 'project-two', 'project-three'];
  return `class="${classes[index % classes.length]}"`;
}

function renderCard(project, index) {
  const href = cardLink(project);
  const modalAttrs =
    href === '#'
      ? ` data-modal-title="${escapeHtml(project.title)}" data-modal-text="${escapeHtml(project.short_description || '')}"`
      : '';
  const externalAttrs = project.project_url ? ' target="_blank" rel="noopener"' : '';
  const visual = project.cover_image_url
    ? `<div class="project-visual" style="${visualStyle(project, index)}"></div>`
    : `<div class="project-visual ${['project-one', 'project-two', 'project-three'][index % 3]}"></div>`;

  return `
    <article class="project-card reveal" data-category="${projectCategories(project)}">
      <a href="${escapeHtml(href)}"${modalAttrs}${externalAttrs}>
        ${visual}
        <div class="project-overlay"><span>${overlayLabel(project)}</span></div>
        <div class="project-info">
          <span class="tag">${escapeHtml(project.category || 'Proje')}</span>
          <h3>${escapeHtml(project.title)}</h3>
        </div>
      </a>
    </article>`;
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
  if (!grid || !config?.url || !config?.key) return;

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
          <p class="eyebrow">${escapeHtml(page.portfolio_hero_eyebrow || 'Seçilmiş İşler')}</p>
          <h1>${escapeHtml(page.portfolio_hero_title || 'Stratejiyle başlayan, sonuçla kanıtlanan projeler.')}</h1>
          <p>${escapeHtml(page.portfolio_hero_description || '')}</p>
        </div>`;
    }
  }

  if (!projects?.length) return;

  if (filtersEl) {
    filtersEl.innerHTML = categoryFilters(projects)
      .map((item, index) => `<button class="filter-btn${index === 0 ? ' is-active' : ''}" type="button" data-filter="${item.key}">${item.label}</button>`)
      .join('');
  }

  grid.innerHTML = projects.map(renderCard).join('');
  bindFilters();
  bindModal();
  observeReveal(document);
}

loadPortfolio();
