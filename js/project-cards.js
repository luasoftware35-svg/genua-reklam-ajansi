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

function hasCaseStudy(project) {
  return Boolean(project.challenge || project.strategy || project.execution || project.result);
}

function projectCardLink(project, options = {}) {
  if (project.project_url) return project.project_url;
  if (project.href) return project.href;
  if (options.preferCaseStudy && hasCaseStudy(project) && project.slug) {
    return `vaka-analizi.html?slug=${encodeURIComponent(project.slug)}`;
  }
  if (hasCaseStudy(project) && project.slug) return `vaka-analizi.html?slug=${encodeURIComponent(project.slug)}`;
  if (project.slug) return `vaka-analizi.html?slug=${encodeURIComponent(project.slug)}`;
  return 'projelerimiz.html';
}

function projectOverlayLabel(project) {
  if (project.project_url) return 'Marka Sitesi';
  if (hasCaseStudy(project)) return 'Vaka Analizi';
  if (project.href === 'projelerimiz.html') return 'Referanslar';
  return 'İncele';
}

function projectCategories(project) {
  const values = [...(project.tags || [])];
  if (project.category) values.push(project.category);
  return [...new Set(values.map(filterKey).filter(Boolean))].join(' ');
}

function projectCoverImage(project) {
  return project.cover_image_url?.trim() || project.image?.trim() || '';
}

function renderProjectVisual(project, index) {
  const cover = projectCoverImage(project);
  if (cover) {
    const logo = project.logo_url
      ? `<span class="project-brand-logo has-image"><img src="${escapeHtml(project.logo_url)}" alt="" loading="lazy" decoding="async"></span>`
      : '';
    return `<div class="project-visual has-photo"><img src="${escapeHtml(cover)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">${logo}</div>`;
  }

  const classes = ['project-one', 'project-two', 'project-three'];
  return `<div class="project-visual ${classes[index % 3]}"></div>`;
}

function renderProjectCard(project, index, options = {}) {
  const href = projectCardLink(project, options);
  const useModal = options.useModal && href === '#';
  const modalAttrs = useModal
    ? ` data-modal-title="${escapeHtml(project.title)}" data-modal-text="${escapeHtml(project.short_description || '')}"`
    : '';
  const externalAttrs = project.project_url ? ' target="_blank" rel="noopener"' : '';
  const category = project.category || 'Proje';

  return `
    <article class="project-card reveal" data-category="${projectCategories(project)}">
      <a href="${escapeHtml(href)}" aria-label="${escapeHtml(project.title)} projesini incele"${modalAttrs}${externalAttrs}>
        ${renderProjectVisual(project, index)}
        <div class="project-overlay"><span>${projectOverlayLabel(project)}</span></div>
        <div class="project-info">
          <span class="tag">${escapeHtml(category)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          ${project.short_description ? `<p class="project-summary">${escapeHtml(project.short_description)}</p>` : ''}
        </div>
      </a>
    </article>`;
}

window.GenuaProjectCards = {
  escapeHtml,
  filterKey,
  hasCaseStudy,
  projectCardLink,
  projectOverlayLabel,
  projectCategories,
  projectCoverImage,
  renderProjectVisual,
  renderProjectCard,
};
