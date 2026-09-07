function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function detailUrl(slug) {
  return `/blog/${encodeURIComponent(slug)}`;
}

function currentSlug() {
  const pathName = window.location.pathname.replace(/\/+$/, '');
  const match = pathName.match(/^\/blog\/([^/]+)$/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  return new URLSearchParams(window.location.search).get('slug');
}

function assetSrc(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
  return `/${url}`;
}

function offerForPost(post) {
  const category = String(post.category || '').toLocaleLowerCase('tr-TR');
  const hay = `${post.slug || ''} ${post.title || ''}`.toLocaleLowerCase('tr-TR');
  const offers = [
    {
      test: () => /sosyal/.test(category) || /carousel|instagram|reels|influencer|creator|tiktok|takvim/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Carousel, Reels ve içerik takvimini ajans temposunda kuralım.',
      text: 'Yazıdaki formatı marka hesabınıza indiriyoruz: shot listesi, onay akışı ve haftalık yayın. Sosyal medya yönetimini uçtan uca teslim ederiz.',
      serviceHref: '/sosyal-medya',
      serviceLabel: 'Sosyal medya hizmeti',
    },
    {
      test: () => /seo/.test(category) || /arama niyeti|aeo|ai bakışı|ai-bakisi|google-ai/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Arama niyeti ve teknik SEO’yu sitenize uygulayalım.',
      text: 'Sayfa iskeleti, iç link ve Search Console takibini aynı planda yürütürüz. Blog yazmak yetmez; indekslenen, dönüşüm bağlayan yapı kurarız.',
      serviceHref: '/seo',
      serviceLabel: 'SEO hizmeti',
    },
    {
      test: () => /web/.test(category) || /landing|dönüşüm|donusum|checklist/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Landing ve form akışını dönüşüm için kuralım.',
      text: 'Sayfa hızı, teklif hiyerarşisi ve form ölçümü aynı teslimde olur. Kurumsal siteyi vitrin değil, randevu ve lead noktası yaparız.',
      serviceHref: '/web-tasarim',
      serviceLabel: 'Web tasarım hizmeti',
    },
    {
      test: () => /marka/.test(category) || /marka-dili|marka dili/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Marka dilini reklam ve sosyalde tek sisteme indirelim.',
      text: 'Logo yetmez. Renk, mesaj ve şablonlar aynı kılavuzdan çıkar; her paylaşımda marka dağılmaz.',
      serviceHref: '/marka-tasarim',
      serviceLabel: 'Marka tasarımı',
    },
    {
      test: () => /içerik|kamera/.test(category) || /fx5|fx3|çekim/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Stüdyo ve saha çekimini kampanya formatına çevirelim.',
      text: 'Katalog, Reels ve reklam kırpımı aynı çekim gününden çıkar. Yenişehir stüdyosu ve saha prodüksiyonu içerik paketine dahildir.',
      serviceHref: '/icerik-uretimi',
      serviceLabel: 'İçerik üretimi',
    },
    {
      test: () => /reklam/.test(category) || /ads|bütçe|butce|performans|yasal|google-ads/.test(hay),
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Google ve Meta bütçesini iş sonucuna bağlayalım.',
      text: 'Kampanyayı tıklama değil lead, randevu ve satış maliyetiyle yönetiriz. Haftalık optimizasyon, aylık yönetici özeti.',
      serviceHref: '/dijital-reklam',
      serviceLabel: 'Dijital reklam hizmeti',
    },
  ];

  return (
    offers.find((offer) => offer.test()) || {
      eyebrow: 'Bunu sizin için yapalım',
      title: 'Bu konuyu markanız için uygulayalım.',
      text: 'Strateji, üretim ve medyayı aynı masada toplarız. Brief’i alınca 1 iş günü içinde kapsam ve teklif döneriz.',
      serviceHref: '/hizmetler',
      serviceLabel: 'Hizmetlere bak',
    }
  );
}

function renderOfferBox(post) {
  const offer = offerForPost(post);
  return `
    <aside class="blog-offer" aria-label="Yazıdan teklife">
      <p class="eyebrow">${escapeHtml(offer.eyebrow)}</p>
      <h2>${escapeHtml(offer.title)}</h2>
      <p>${escapeHtml(offer.text)}</p>
      <div class="form-actions">
        <a class="btn btn-primary" href="/teklif-al">Teklif Al</a>
        <a class="btn" href="${escapeHtml(offer.serviceHref)}">${escapeHtml(offer.serviceLabel)}</a>
        <a class="btn" href="/blog">Blog'a Dön</a>
      </div>
    </aside>`;
}

function coverMarkup(url, alt, className = 'blog-image') {
  if (!url) return `<div class="${className}"></div>`;
  return `<div class="${className} has-cover"><img src="${escapeHtml(assetSrc(url))}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></div>`;
}


async function fetchPosts(config, select, extra = '') {
  const query = `${config.url}/rest/v1/blog_posts?select=${encodeURIComponent(select)}&status=eq.published&order=published_at.desc${extra}`;
  const response = await fetch(query, {
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
  });
  if (!response.ok) return null;
  const items = await response.json();
  return Array.isArray(items) ? items : null;
}

function renderFeatured(post) {
  return `
    <article class="featured-post reveal">
      ${coverMarkup(post.cover_image_url, post.title)}
      <div>
        <span class="tag">Öne Çıkan</span>
        <h2>${escapeHtml(post.title)}</h2>
        <p>${escapeHtml(post.excerpt || '')}</p>
        <div class="blog-meta">
          <span>${formatDate(post.published_at)}</span>
          <span>${escapeHtml(post.author_name || 'Genua Ekibi')}</span>
        </div>
        <a class="btn btn-primary" href="${detailUrl(post.slug)}">Yazıyı Oku</a>
      </div>
    </article>`;
}

function renderCard(post) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} dk` : '';
  return `
    <a class="blog-card reveal" href="${detailUrl(post.slug)}">
      ${coverMarkup(post.cover_image_url, post.title)}
      <span class="tag">${escapeHtml(post.category || 'Blog')}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt || '')}</p>
      <div class="blog-meta">
        <span>${formatDate(post.published_at)}</span>
        ${readTime ? `<span>${readTime}</span>` : ''}
      </div>
    </a>`;
}

function prepareArticleContent(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html || '';
  wrapper.querySelectorAll('h2').forEach((heading, index) => {
    if (!heading.id) heading.id = `bolum-${index + 1}`;
  });
  wrapper.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    const match = href.match(/blog-detay(?:\.html)?\?slug=([^&#]+)/);
    if (match?.[1]) {
      anchor.setAttribute('href', detailUrl(decodeURIComponent(match[1])));
    }
  });
  return wrapper.innerHTML;
}

function renderToc(content) {
  if (!content || typeof document === 'undefined') return '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = prepareArticleContent(content);
  const headings = wrapper.querySelectorAll('h2');
  if (!headings.length) return '';
  return [...headings]
    .map((heading) => `<a href="#${heading.id}">${escapeHtml(heading.textContent.trim())}</a>`)
    .join('');
}

function observeReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
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
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

async function loadBlogList() {
  const featuredEl = document.querySelector('#blogFeatured');
  const gridEl = document.querySelector('#blogGrid');
  const popularEl = document.querySelector('#blogPopular');
  const categoriesEl = document.querySelector('#blogCategories');
  const config = window.GenuaSupabase;

  if (!featuredEl || !gridEl || !config?.url || !config?.key) return;

  const select =
    'slug,title,excerpt,category,cover_image_url,published_at,read_time_minutes,author_name,is_featured,display_order';
  const posts = await fetchPosts(config, select);
  if (!posts?.length) return;

  const featured = posts.find((post) => post.is_featured) ?? posts[0];
  const rest = posts.filter((post) => post.slug !== featured.slug);

  featuredEl.innerHTML = renderFeatured(featured);
  gridEl.innerHTML = rest.map(renderCard).join('');

  if (popularEl) {
    popularEl.className = 'sidebar-links';
    popularEl.innerHTML = posts
      .slice(0, 3)
      .map((post) => `<li><a href="${detailUrl(post.slug)}">${escapeHtml(post.title)}</a></li>`)
      .join('');
  }

  if (categoriesEl) {
    const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
    categoriesEl.innerHTML = categories
      .map((category) => `<span class="pill">${escapeHtml(category)}</span>`)
      .join('');
  }

  observeReveal();
}

async function loadBlogDetail() {
  const slug = currentSlug();
  const config = window.GenuaSupabase;
  if (!config?.url || !config?.key) return;

  if (!slug) {
    window.location.replace('/blog');
    return;
  }

  const querySlug = new URLSearchParams(window.location.search).get('slug');
  const onPrettyBlogPath = window.location.pathname.replace(/\/+$/, '').startsWith('/blog/');
  const isLocalHost = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  if (querySlug && !onPrettyBlogPath && !isLocalHost) {
    window.location.replace(detailUrl(querySlug));
    return;
  }

  const select =
    'slug,title,excerpt,content,category,cover_image_url,published_at,read_time_minutes,author_name,meta_title,meta_description';
  const posts = await fetchPosts(config, select, `&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  const post = posts?.[0];
  if (!post) return;

  const pageTitle = post.meta_title || `${post.title} | Genua Blog`;
  const pageDescription = post.meta_description || post.excerpt || pageTitle;
  const canonical = `${window.location.origin}${detailUrl(post.slug)}`;
  const coverAbsolute = post.cover_image_url
    ? new URL(assetSrc(post.cover_image_url), `${window.location.origin}/`).href
    : '';

  document.title = pageTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', pageDescription);
  document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((el) => {
    el.setAttribute('content', pageTitle);
  });
  document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((el) => {
    el.setAttribute('content', pageDescription);
  });
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.setAttribute('href', canonical));
  document.querySelectorAll('meta[property="og:url"]').forEach((el) => el.setAttribute('content', canonical));
  if (coverAbsolute) {
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((el) => {
      el.setAttribute('content', coverAbsolute);
    });
  }

  const heroEl = document.querySelector('#blogHero');
  const contentEl = document.querySelector('#blogContent');
  const tocEl = document.querySelector('#blogToc');
  const relatedEl = document.querySelector('#blogRelated');

  if (heroEl) {
    const coverMarkup = post.cover_image_url
      ? `<div class="blog-article-cover"><img src="${escapeHtml(assetSrc(post.cover_image_url))}" alt="${escapeHtml(post.title)}" loading="eager" decoding="async"></div>`
      : '';

    heroEl.innerHTML = `
      <div class="container">
        <div class="breadcrumb">
          <a href="/anasayfa">Ana Sayfa</a><span>/</span>
          <a href="/blog">Blog</a><span>/</span>
          <span>${escapeHtml(post.category || 'Blog')}</span>
        </div>
        <p class="eyebrow">${escapeHtml(post.category || 'Blog')}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="blog-article-meta">Yazar: ${escapeHtml(post.author_name || 'Genua Ekibi')} · ${formatDate(post.published_at)}${post.read_time_minutes ? ` · ${post.read_time_minutes} dk okuma` : ''}</p>
        ${coverMarkup}
      </div>`;
  }

  if (contentEl) {
    const articleHtml = prepareArticleContent(post.content || `<p>${escapeHtml(post.excerpt || '')}</p>`);
    contentEl.innerHTML = `
      ${articleHtml}
      ${renderOfferBox(post)}`;
  }

  if (tocEl) {
    const links = renderToc(post.content);
    const tocBox = tocEl.closest('.sidebar-box');
    if (links) {
      tocEl.className = 'sidebar-links';
      tocEl.innerHTML = links;
      if (tocBox) tocBox.hidden = false;
    } else if (tocBox) {
      tocBox.hidden = true;
    }
  }

  if (relatedEl) {
    const all = await fetchPosts(config, 'slug,title,excerpt,category,cover_image_url,published_at,read_time_minutes');
    if (all?.length) {
      relatedEl.innerHTML = all
        .filter((item) => item.slug !== post.slug)
        .slice(0, 3)
        .map(renderCard)
        .join('');
    }
  }

  observeReveal();
}

if (document.querySelector('#blogGrid')) loadBlogList();
if (document.querySelector('#blogHero')) loadBlogDetail();
