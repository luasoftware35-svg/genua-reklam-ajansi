function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatProjectDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

function parseMetrics(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((item) => item?._type !== 'hero');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item?._type !== 'hero') : [];
  } catch {
    return [];
  }
}

function parseHero(raw) {
  const items = Array.isArray(raw) ? raw : [];
  return items.find((item) => item?._type === 'hero') ?? null;
}

function parseGallery(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function renderMetric(metric, index) {
  const value = metric.value ?? metric.target ?? 0;
  const prefix = metric.prefix || '';
  const suffix = metric.suffix || '';
  const duration = metric.duration || 1500 + index * 200;
  return `
    <article class="stat-card reveal">
      <strong class="counter" data-target="${escapeHtml(value)}" data-prefix="${escapeHtml(prefix)}" data-suffix="${escapeHtml(suffix)}" data-duration="${duration}">0</strong>
      <span>${escapeHtml(metric.label || '')}</span>
    </article>`;
}

function renderGalleryItem(url) {
  return `<div class="gallery-item reveal has-cover"><img src="${escapeHtml(url)}" alt="" loading="lazy" decoding="async"></div>`;
}

async function loadCaseStudy() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const config = window.GenuaSupabase;
  if (!slug || !config?.url || !config?.key) {
    window.location.replace('portfolyo.html');
    return;
  }

  const select =
    'slug,title,client_name,category,tags,cover_image_url,gallery_images,short_description,case_hero_title,case_hero_lead,challenge,strategy,execution,result,metrics,tools_used,project_date,meta_title,meta_description';
  const response = await fetch(
    `${config.url}/rest/v1/projects?select=${encodeURIComponent(select)}&slug=eq.${encodeURIComponent(slug)}&is_active=eq.true&limit=1`,
    {
      cache: 'no-store',
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    },
  );
  if (!response.ok) return;
  const items = await response.json();
  const project = items?.[0];
  if (!project) {
    window.location.replace('portfolyo.html');
    return;
  }

  document.title = project.meta_title || `${project.title} Vaka Analizi | Genua`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && project.meta_description) metaDescription.setAttribute('content', project.meta_description);

  const heroEl = document.querySelector('#caseHero');
  const coverEl = document.querySelector('#caseCover');
  const metaEl = document.querySelector('#caseMeta');
  const introEl = document.querySelector('#caseIntro');
  const stepsEl = document.querySelector('#caseSteps');
  const metricsEl = document.querySelector('#caseMetrics');
  const galleryEl = document.querySelector('#caseGallery');

  const heroFromMetrics = parseHero(project.metrics);

  if (heroEl) {
    heroEl.innerHTML = `
      <div class="container reveal">
        <div class="breadcrumb">
          <a href="anasayfa.html">Ana Sayfa</a><span>/</span>
          <a href="portfolyo.html">Portföy</a><span>/</span>
          <span>${escapeHtml(project.title)}</span>
        </div>
        <p class="eyebrow">Vaka Analizi</p>
        <h1>${escapeHtml(project.case_hero_title || heroFromMetrics?.title || project.short_description || project.title)}</h1>
        <p>${escapeHtml(project.case_hero_lead || heroFromMetrics?.lead || project.short_description || '')}</p>
      </div>`;
  }

  if (coverEl && project.cover_image_url) {
    coverEl.innerHTML = `<div class="case-hero-image reveal has-cover"><img src="${escapeHtml(project.cover_image_url)}" alt="${escapeHtml(project.title)}" loading="eager" decoding="async"></div>`;
  } else if (coverEl) {
    coverEl.innerHTML = '';
  }

  if (metaEl) {
    const tools = (project.tools_used || []).join(', ');
    metaEl.innerHTML = `
      <article class="case-meta-card reveal"><h3>Müşteri</h3><p>${escapeHtml(project.client_name || project.title)}</p></article>
      <article class="case-meta-card reveal"><h3>Tarih</h3><p>${escapeHtml(formatProjectDate(project.project_date) || '—')}</p></article>
      <article class="case-meta-card reveal"><h3>Kategori</h3><p>${escapeHtml(project.category || '—')}</p></article>
      <article class="case-meta-card reveal"><h3>Araçlar</h3><p>${escapeHtml(tools || '—')}</p></article>`;
  }

  if (introEl) {
    introEl.innerHTML = `
      <p class="eyebrow">Süreç</p>
      <h2>Problemden sonuca net bir büyüme rotası.</h2>
      <p>${escapeHtml(project.result || project.short_description || '')}</p>`;
  }

  if (stepsEl) {
    const steps = [
      ['Problem', project.challenge],
      ['Strateji', project.strategy],
      ['Uygulama', project.execution],
      ['Sonuç', project.result],
    ].filter(([, text]) => text);
    stepsEl.innerHTML = steps
      .map(([title, text]) => `<article class="reveal"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`)
      .join('');
  }

  const metrics = parseMetrics(project.metrics);
  if (metricsEl) metricsEl.innerHTML = metrics.length ? metrics.map(renderMetric).join('') : '';

  const gallery = parseGallery(project.gallery_images);
  if (galleryEl) galleryEl.innerHTML = gallery.length ? gallery.map(renderGalleryItem).join('') : '';

  if (typeof window.initCounters === 'function') window.initCounters();

  document.querySelectorAll('.reveal').forEach((el) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      observer.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  });
}

loadCaseStudy();
