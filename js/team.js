function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initialsFromName(name) {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 2) return (words[0] || '?').slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function socialLink(url, label) {
  if (!url) return '';
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`;
}

function photoMarkup(member) {
  if (member.photo_url) {
    return `<div class="team-photo has-photo"><img src="${escapeHtml(member.photo_url)}" alt="${escapeHtml(member.full_name)}" loading="lazy" decoding="async"></div>`;
  }
  return `<div class="team-photo"><span class="team-photo-initials" aria-hidden="true">${initialsFromName(member.full_name)}</span></div>`;
}

function renderTeamMember(member) {
  const socials = [
    socialLink(member.social_linkedin, 'IN'),
    socialLink(member.social_instagram, 'IG'),
    socialLink(member.social_twitter, 'X'),
  ]
    .filter(Boolean)
    .join('');

  return `
    <article class="team-card reveal">
      ${photoMarkup(member)}
      <h3>${escapeHtml(member.full_name)}</h3>
      <p>${escapeHtml(member.title)}</p>
      ${member.bio ? `<p class="team-bio">${escapeHtml(member.bio)}</p>` : ''}
      ${socials ? `<div class="team-socials">${socials}</div>` : ''}
    </article>`;
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
  }, { threshold: 0.16 });

  items.forEach((el) => observer.observe(el));
}

async function loadTeamMembers() {
  const grid = document.querySelector('#teamGrid');
  const countEl = document.querySelector('#teamCount');
  const config = window.GenuaSupabase;

  if (!grid || !config?.url || !config?.key) return;

  const select =
    'full_name,title,bio,photo_url,social_linkedin,social_instagram,social_twitter,display_order';
  const endpoint = `${config.url}/rest/v1/team_members?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`;

  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
  });

  if (!response.ok) return;
  const items = await response.json();
  if (!Array.isArray(items) || !items.length) return;

  grid.innerHTML = items.map(renderTeamMember).join('');

  if (countEl) {
    countEl.textContent = `${items.length} kişilik çekirdek ekibimizle aynı hedefe odaklanıyoruz.`;
  }

  observeReveal(grid);
}

loadTeamMembers();
