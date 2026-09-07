const fs = require('fs');
const path = require('path');
const { isValidSlug, postUrl, absoluteAsset, fetchPublishedPost, ORIGIN } = require('../lib/blog');

const TEMPLATE_PATH = path.join(__dirname, '..', 'lib', 'blog-detay-template.html');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceAttr(html, pattern, content) {
  return html.replace(pattern, `$1${escapeHtml(content)}$2`);
}

function upsertMeta(html, attr, key, content) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"`);
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}"`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}>\n</head>`);
}

function rootRelativeAssets(html) {
  return html.replace(
    /\b(href|src)="(?!https?:|\/\/|\/|#|mailto:|tel:|data:)([^"]+)"/gi,
    (_, attr, url) => `${attr}="/${url}"`,
  );
}

function injectJsonLd(html, post, canonical, description, image) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (full, json) => {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      return full;
    }

    const list = Array.isArray(data) ? data : [data];
    const crumbs = list.find((item) => item['@type'] === 'BreadcrumbList');
    if (crumbs?.itemListElement) {
      crumbs.itemListElement = [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${ORIGIN}/anasayfa` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ];
    }

    let article = list.find((item) => {
      const type = item['@type'];
      return type === 'Article' || type === 'BlogPosting' || (Array.isArray(type) && (type.includes('Article') || type.includes('BlogPosting')));
    });
    if (!article) {
      article = { '@context': 'https://schema.org' };
      list.push(article);
    }

    article['@type'] = 'BlogPosting';
    article.headline = post.title;
    article.description = description;
    article.image = image;
    article.mainEntityOfPage = canonical;
    article.datePublished = post.published_at || undefined;
    article.dateModified = post.updated_at || post.published_at || undefined;
    article.author = {
      '@type': 'Person',
      name: post.author_name || 'Genua Ekibi',
    };
    article.publisher = {
      '@type': 'Organization',
      name: 'Genua Reklam Ajansı',
      logo: {
        '@type': 'ImageObject',
        url: `${ORIGIN}/varlıklar/resimler/genua-logo.png`,
      },
    };
    article.inLanguage = 'tr-TR';
    article.url = canonical;

    return `<script type="application/ld+json">${JSON.stringify(list)}</script>`;
  });
}

function injectMeta(html, post) {
  const canonical = postUrl(post.slug);
  const title = post.meta_title || `${post.title} | Genua Blog`;
  const description = post.meta_description || post.excerpt || title;
  const image = absoluteAsset(post.cover_image_url);
  const keywords = Array.isArray(post.tags) ? post.tags.join(', ') : '';

  html = rootRelativeAssets(html);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceAttr(html, /(<meta name="description" content=")[^"]*(")/, description);
  if (keywords) {
    html = replaceAttr(html, /(<meta name="keywords" content=")[^"]*(")/, keywords);
  }
  html = replaceAttr(html, /(<link rel="canonical" href=")[^"]*(")/, canonical);
  html = replaceAttr(html, /(<meta name="robots" content=")[^"]*(")/, 'index, follow, max-image-preview:large');
  html = replaceAttr(html, /(<meta property="og:type" content=")[^"]*(")/, 'article');
  html = replaceAttr(html, /(<meta property="og:title" content=")[^"]*(")/, title);
  html = replaceAttr(html, /(<meta property="og:description" content=")[^"]*(")/, description);
  html = replaceAttr(html, /(<meta property="og:url" content=")[^"]*(")/, canonical);
  html = replaceAttr(html, /(<meta property="og:image" content=")[^"]*(")/, image);
  html = replaceAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, title);
  html = replaceAttr(html, /(<meta name="twitter:description" content=")[^"]*(")/, description);
  html = replaceAttr(html, /(<meta name="twitter:image" content=")[^"]*(")/, image);
  html = upsertMeta(html, 'property', 'og:image:alt', post.title);
  if (post.published_at) {
    html = upsertMeta(html, 'property', 'article:published_time', post.published_at);
  }
  if (post.updated_at || post.published_at) {
    html = upsertMeta(html, 'property', 'article:modified_time', post.updated_at || post.published_at);
  }

  return injectJsonLd(html, post, canonical, description, image);
}

function readTemplate() {
  try {
    return fs.readFileSync(TEMPLATE_PATH, 'utf8');
  } catch {
    return fs.readFileSync(path.join(process.cwd(), 'blog-detay.html'), 'utf8');
  }
}

function readSlug(req) {
  const candidates = [
    req.query?.slug,
    req.query?.path,
  ];
  const url = String(req.url || '');
  try {
    candidates.push(new URL(url, ORIGIN).searchParams.get('slug'));
  } catch {
    /* ignore */
  }
  const pathMatch = url.match(/\/blog\/([^/?#]+)/);
  if (pathMatch?.[1]) candidates.push(decodeURIComponent(pathMatch[1]));
  const invokePath = String(req.headers?.['x-invoke-path'] || req.headers?.['x-matched-path'] || '');
  const invokeMatch = invokePath.match(/\/blog\/([^/?#]+)/);
  if (invokeMatch?.[1]) candidates.push(decodeURIComponent(invokeMatch[1]));

  return candidates
    .flat()
    .map((value) => String(value || '').trim())
    .find((value) => isValidSlug(value) && value !== ':slug') || '';
}

module.exports = async function handler(req, res) {
  const slug = readSlug(req);
  if (!isValidSlug(slug)) {
    res.writeHead(302, { Location: '/blog' });
    res.end();
    return;
  }

  let post = null;
  try {
    post = await fetchPublishedPost(slug);
  } catch (error) {
    console.error('blog-post fetch', error);
  }

  if (!post) {
    res.writeHead(302, { Location: '/blog' });
    res.end();
    return;
  }

  const html = injectMeta(readTemplate(), post);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(html);
};
