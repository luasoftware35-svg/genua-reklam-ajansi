function mergeFeaturedProject(catalogItem, remote) {
  if (!remote) return { ...catalogItem };

  return {
    ...catalogItem,
    slug: remote.slug || catalogItem.slug,
    title: remote.title?.trim() || catalogItem.title,
    category: remote.category?.trim() || catalogItem.category,
    image: remote.cover_image_url?.trim() || catalogItem.image,
    cover_image_url: remote.cover_image_url?.trim() || catalogItem.image,
    short_description: remote.short_description?.trim() || catalogItem.short_description,
    project_url: remote.project_url || catalogItem.project_url,
    challenge: remote.challenge || catalogItem.challenge,
    strategy: remote.strategy,
    execution: remote.execution,
    result: remote.result,
    tags: remote.tags || catalogItem.tags,
  };
}

async function fetchFeaturedProjects(config) {
  const select =
    'slug,title,category,tags,cover_image_url,short_description,challenge,strategy,execution,result,project_url,display_order,is_featured';
  const endpoint = `${config.url}/rest/v1/projects?select=${encodeURIComponent(select)}&is_active=eq.true&is_featured=eq.true&order=display_order.asc&limit=3`;

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
    return Array.isArray(items) && items.length ? items : null;
  } catch {
    return null;
  }
}

function resolveFeaturedProjects(remoteItems) {
  const catalog = window.GenuaFeaturedProjectsCatalog || [];
  if (!remoteItems?.length) return catalog.map((item) => ({ ...item }));

  const remoteBySlug = Object.fromEntries(remoteItems.map((item) => [item.slug, item]));
  const merged = catalog.map((item) => mergeFeaturedProject(item, remoteBySlug[item.slug]));

  remoteItems.forEach((remote) => {
    if (!merged.some((item) => item.slug === remote.slug)) {
      merged.push(mergeFeaturedProject({ slug: remote.slug, title: remote.title, category: remote.category }, remote));
    }
  });

  return merged.slice(0, 3);
}

async function loadFeaturedProjects() {
  const grid = document.querySelector('#featuredProjectsGrid');
  if (!grid || !window.GenuaProjectCards) return;

  const config = window.GenuaSupabase;
  let projects = (window.GenuaFeaturedProjectsCatalog || []).map((item) => ({ ...item }));

  if (config?.url && config?.key) {
    const remoteItems = await fetchFeaturedProjects(config);
    if (remoteItems) projects = resolveFeaturedProjects(remoteItems);
  }

  grid.innerHTML = projects.map((project, index) =>
    window.GenuaProjectCards.renderProjectCard(project, index, { useModal: false, preferCaseStudy: true }),
  ).join('');

  document.dispatchEvent(new CustomEvent('genua:featured-projects-rendered', { detail: { count: projects.length } }));
}

loadFeaturedProjects();
