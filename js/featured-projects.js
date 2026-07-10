function mapFeaturedReference(row) {
  return {
    slug: row.slug || '',
    title: row.title,
    category: row.category || 'Referans Marka',
    image: row.cover_image_url,
    cover_image_url: row.cover_image_url,
    logo_url: row.logo_url,
    short_description: row.short_description,
    project_url: row.project_url,
  };
}

async function fetchFeaturedReferences(config) {
  const select = 'slug,title,category,cover_image_url,logo_url,short_description,project_url,display_order';
  const endpoint = `${config.url}/rest/v1/featured_references?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc&limit=6`;

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
    return Array.isArray(items) && items.length ? items.map(mapFeaturedReference) : null;
  } catch {
    return null;
  }
}

async function loadFeaturedProjects() {
  const grid = document.querySelector('#featuredProjectsGrid');
  if (!grid || !window.GenuaProjectCards) return;

  const config = window.GenuaSupabase;
  let projects = (window.GenuaFeaturedProjectsCatalog || []).map((item) => ({ ...item }));

  if (config?.url && config?.key) {
    const references = await fetchFeaturedReferences(config);
    if (references) projects = references;
  }

  grid.innerHTML = projects
    .map((project, index) =>
      window.GenuaProjectCards.renderProjectCard(project, index, { useModal: false, preferCaseStudy: false }),
    )
    .join('');

  document.dispatchEvent(new CustomEvent('genua:featured-projects-rendered', { detail: { count: projects.length } }));
}

loadFeaturedProjects();
