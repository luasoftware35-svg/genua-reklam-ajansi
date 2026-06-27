function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_UMUT_RESUME = `
<p class="resume-lead">Kurucu &amp; Stratejist — Genua Reklam Ajansı · Denizli</p>
<section>
  <h4>Profil</h4>
  <p>2022 yılında Denizli'de kurduğu Genua Reklam Ajansı ile markaların dijital iletişimini strateji, kreatif üretim ve performans pazarlamasını bir araya getirerek büyüten bir girişimci ve stratejist. Kamu kurumlarından yerel işletmelere geniş bir yelpazede marka kimliği, sosyal medya, dijital reklam ve web tasarım projeleri yürütür.</p>
</section>
<section>
  <h4>Deneyim</h4>
  <ul>
    <li><strong>Kurucu &amp; Stratejist</strong> — Genua Reklam Ajansı · 2022 – Günümüz<br>Marka danışmanlığı, Google &amp; Meta reklam yönetimi, sosyal medya operasyonu, web tasarım ve içerik üretimi projelerinin stratejik liderliği.</li>
    <li><strong>Grafik Tasarım &amp; Dijital Medya</strong> · 2019 – Günümüz<br>Marka kimliği, kampanya kreatifleri, dijital arayüzler ve prodüksiyon odaklı projeler.</li>
  </ul>
</section>
<section>
  <h4>Uzmanlık Alanları</h4>
  <ul>
    <li>Kurumsal marka stratejisi ve logo / kimlik tasarımı</li>
    <li>Google Ads &amp; Meta Ads kampanya yönetimi</li>
    <li>Sosyal medya içerik sistemi ve topluluk yönetimi</li>
    <li>Web arayüz tasarımı ve dijital dönüşüm projeleri</li>
    <li>İçerik üretimi, prodüksiyon ve kampanya kreatifleri</li>
    <li>Kamu kurumları iletişim danışmanlığı</li>
  </ul>
</section>
<section>
  <h4>Bağlantılar</h4>
  <ul>
    <li><a href="https://tr.linkedin.com/in/umutavc%C4%B1" target="_blank" rel="noopener">LinkedIn</a></li>
    <li><a href="https://www.behance.net/umutavci4" target="_blank" rel="noopener">Behance</a></li>
    <li><a href="https://www.instagram.com/genuadigital/" target="_blank" rel="noopener">Instagram — Genua</a></li>
  </ul>
</section>`.trim();

function initialsFromName(name) {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 2) return (words[0] || '?').slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function isUmutAvci(name) {
  return /umut\s+avc/i.test(String(name || '').trim());
}

const DEFAULT_UMUT_PHOTO = 'varlıklar/resimler/umut-avci.jpg';

function resolvePhotoUrl(member) {
  if (isUmutAvci(member.full_name)) return DEFAULT_UMUT_PHOTO;
  return member.photo_url?.trim() || null;
}

function formatBioAsResume(bio) {
  const paragraphs = String(bio || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!paragraphs.length) return '';

  const body = paragraphs
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<section><h4>Profil</h4>${body}</section>`;
}

function resolveResumeContent(member) {
  const resume = member.resume_content?.trim();
  if (resume) return resume;

  const bio = member.bio?.trim();
  if (bio) return formatBioAsResume(bio);

  if (isUmutAvci(member.full_name)) return DEFAULT_UMUT_RESUME;

  return `<section><p>${escapeHtml(member.title || 'Ekip üyesi')} — Genua Reklam Ajansı.</p></section>`;
}

function socialLink(url, label) {
  if (!url) return '';
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`;
}

function photoMarkup(member) {
  const photoUrl = resolvePhotoUrl(member);
  const portraitClass = isUmutAvci(member.full_name) ? ' is-portrait' : '';

  if (photoUrl) {
    return `<div class="team-photo has-photo${portraitClass}"><img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(member.full_name)}" loading="lazy" decoding="async"></div>`;
  }
  return `<div class="team-photo"><span class="team-photo-initials" aria-hidden="true">${initialsFromName(member.full_name)}</span></div>`;
}

function renderTeamMember(member, index) {
  const socials = [
    socialLink(member.social_linkedin, 'IN'),
    socialLink(member.social_instagram, 'IG'),
    socialLink(member.social_twitter, 'X'),
  ]
    .filter(Boolean)
    .join('');

  const resumeButton = `<button class="team-resume-btn" type="button" data-resume-index="${index}">Özgeçmiş</button>`;

  return `
    <article class="team-card reveal">
      ${photoMarkup(member)}
      <h3>${escapeHtml(member.full_name)}</h3>
      <p>${escapeHtml(member.title)}</p>
      ${resumeButton}
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

function bindResumeModal(members) {
  const modal = document.querySelector('#teamResumeModal');
  const titleEl = document.querySelector('#teamResumeTitle');
  const bodyEl = document.querySelector('#teamResumeBody');
  const closeBtn = document.querySelector('[data-resume-close]');
  const grid = document.querySelector('#teamGrid');

  if (!modal || !titleEl || !bodyEl || !grid) return;

  const openModal = (member) => {
    const content = resolveResumeContent(member);
    if (!content) return;

    titleEl.textContent = member.full_name;
    bodyEl.innerHTML = content;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    bodyEl.innerHTML = '';
  };

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-resume-index]');
    if (!button) return;
    const member = members[Number(button.dataset.resumeIndex)];
    if (member) openModal(member);
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

async function loadTeamMembers() {
  const grid = document.querySelector('#teamGrid');
  const countEl = document.querySelector('#teamCount');
  const config = window.GenuaSupabase;

  if (!grid || !config?.url || !config?.key) return;

  const select =
    'full_name,title,bio,resume_content,photo_url,social_linkedin,social_instagram,social_twitter,display_order';
  let endpoint = `${config.url}/rest/v1/team_members?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`;

  let response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
  });

  if (!response.ok && response.status === 400) {
    const fallbackSelect =
      'full_name,title,bio,photo_url,social_linkedin,social_instagram,social_twitter,display_order';
    endpoint = `${config.url}/rest/v1/team_members?select=${encodeURIComponent(fallbackSelect)}&is_active=eq.true&order=display_order.asc`;
    response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });
  }

  if (!response.ok) return;
  const items = await response.json();
  if (!Array.isArray(items) || !items.length) return;

  grid.innerHTML = items.map((member, index) => renderTeamMember(member, index)).join('');

  if (countEl) {
    countEl.textContent = `${items.length} kişilik çekirdek ekibimizle aynı hedefe odaklanıyoruz.`;
  }

  bindResumeModal(items);
  observeReveal(grid);
}

loadTeamMembers();
