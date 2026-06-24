function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FALLBACK_IMAGE = 'varlıklar/resimler/blog/marka-dili.jpg';
const FALLBACK_ALT = 'Genua marka ve strateji çalışması';

function applyAboutVisual(panel, src, alt) {
  panel.classList.add('has-photo');
  panel.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
  panel.setAttribute('aria-label', alt);
}

function pickMemberPhoto(members) {
  if (!Array.isArray(members) || !members.length) return null;

  const founder = members.find((member) => /umut\s+avc/i.test(String(member.full_name || '').trim()));
  if (founder?.photo_url) return founder;

  return members.find((member) => member.photo_url) ?? null;
}

async function loadAboutVisual() {
  const panel = document.querySelector('#aboutVisualPanel');
  const config = window.GenuaSupabase;

  if (!panel) return;

  if (!config?.url || !config?.key) {
    applyAboutVisual(panel, FALLBACK_IMAGE, FALLBACK_ALT);
    return;
  }

  const select = 'full_name,photo_url,display_order';
  const endpoint = `${config.url}/rest/v1/team_members?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    if (!response.ok) {
      applyAboutVisual(panel, FALLBACK_IMAGE, FALLBACK_ALT);
      return;
    }

    const members = await response.json();
    const member = pickMemberPhoto(members);

    if (member?.photo_url) {
      applyAboutVisual(
        panel,
        member.photo_url,
        `${member.full_name} — Genua Reklam Ajansı kurucusu`,
      );
      return;
    }
  } catch {
    // fall through to local image
  }

  applyAboutVisual(panel, FALLBACK_IMAGE, FALLBACK_ALT);
}

loadAboutVisual();
