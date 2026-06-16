function initialsFromName(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function renderLogoMark(logo) {
  if (logo.logo_url) {
    return `<span class="brand-logo has-image"><img src="${logo.logo_url}" alt="${logo.company_name} logosu" loading="lazy"></span>`;
  }

  const label = logo.initials || initialsFromName(logo.company_name);
  return `<span class="brand-logo">${label}</span>`;
}

function renderLogoCard(logo) {
  const classes = ["brand-logo-card", "reveal", "is-visible"];
  if (logo.is_public_client) classes.push("public-client");
  if (logo.is_collapsed) classes.push("client-extra");

  const inner = `<div>${renderLogoMark(logo)}<span>${logo.company_name}</span></div>`;

  if (logo.website_url) {
    return `<a class="${classes.join(" ")}" href="${logo.website_url}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  }

  return `<article class="${classes.join(" ")}">${inner}</article>`;
}

async function loadClientLogos() {
  const grid = document.querySelector("#clientGrid");
  const config = window.GenuaSupabase;

  if (!grid || !config?.url || !config?.key) return;

  const endpoint = `${config.url}/rest/v1/client_logos?select=company_name,logo_url,initials,website_url,is_public_client,is_collapsed&is_active=eq.true&order=display_order.asc`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    if (!response.ok) return;

    const logos = await response.json();
    if (!Array.isArray(logos) || logos.length === 0) return;

    grid.innerHTML = logos.map(renderLogoCard).join("");
  } catch {
    // Statik HTML yedek içerik kalır.
  }
}

loadClientLogos();
