function initialsFromName(name) {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 2) return (words[0] || '?').slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function stars(rating) {
  const total = Math.max(1, Math.min(5, Number(rating) || 5));
  return '★'.repeat(total);
}

function renderCard(item, index) {
  const subtitle = [item.client_title, item.client_company].filter(Boolean).join(' · ');
  return `
            <article class="testimonial-card${index === 0 ? ' is-active' : ''}">
              <div class="testimonial-person">
                <span class="avatar" aria-hidden="true">${initialsFromName(item.client_name)}</span>
                <div>
                  <h3>${item.client_name}</h3>
                  <p>${subtitle}</p>
                </div>
              </div>
              <p class="quote">${item.testimonial_text}</p>
              <span class="stars" aria-label="${item.rating || 5} yıldız">${stars(item.rating)}</span>
            </article>`;
}

function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prev = document.querySelector('.testimonial-shell .prev');
  const next = document.querySelector('.testimonial-shell .next');

  if (!cards.length || !prev || !next) return;

  let activeSlide = 0;
  let timerId = null;

  const showSlide = (index) => {
    activeSlide = (index + cards.length) % cards.length;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === activeSlide));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeSlide));
  };

  prev.addEventListener('click', () => showSlide(activeSlide - 1));
  next.addEventListener('click', () => showSlide(activeSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

  if (timerId) window.clearInterval(timerId);
  timerId = window.setInterval(() => showSlide(activeSlide + 1), 6500);
}

async function fetchTestimonials(config, select) {
  const endpoint = `${config.url}/rest/v1/testimonials?select=${encodeURIComponent(select)}&is_active=eq.true&order=display_order.asc`;

  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
  });

  if (!response.ok) return null;
  const items = await response.json();
  return Array.isArray(items) && items.length > 0 ? items : null;
}

async function loadTestimonials() {
  const track = document.querySelector('#testimonialTrack');
  const dotsWrap = document.querySelector('#testimonialDots');
  const config = window.GenuaSupabase;

  if (!track || !dotsWrap || !config?.url || !config?.key) return;

  const select = 'client_name,client_title,client_company,testimonial_text,rating,display_order';
  const items = await fetchTestimonials(config, select);
  if (!items) return;

  track.innerHTML = items.map(renderCard).join('');
  dotsWrap.innerHTML = items
    .map((_, index) => `<button class="dot${index === 0 ? ' is-active' : ''}" type="button" aria-label="${index + 1}. yorum"></button>`)
    .join('');

  initTestimonialSlider();
}

loadTestimonials();
