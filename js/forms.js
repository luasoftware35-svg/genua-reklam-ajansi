function hasPrivacyConsent(form) {
  const consent = form.querySelector('input[name="privacy_consent"]');
  return consent ? consent.checked : true;
}

async function submitFormPayload(payload) {
  const response = await fetch('/api/forms/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Form gönderilemedi. Lütfen tekrar deneyin.');
  }

  return result;
}

function setFormMessage(form, text, type = 'success') {
  const message = form.querySelector('.form-message');
  if (!message) return;
  message.textContent = text;
  message.classList.remove('is-error');
  if (type === 'error') message.classList.add('is-error');
  message.classList.add('is-visible');
}

function setSubmitting(form, isSubmitting) {
  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.disabled = isSubmitting;
    if (isSubmitting) button.dataset.defaultLabel = button.dataset.defaultLabel || button.textContent;
    button.textContent = isSubmitting ? 'Gönderiliyor...' : button.dataset.defaultLabel || button.textContent;
  });
}

function trackFormConversion(formType) {
  window.GenuaAnalytics?.track('generate_lead', {
    form_type: formType,
    page_path: window.location.pathname,
  });
}

function trackFormEvent(eventName, formType, extra = {}) {
  window.GenuaAnalytics?.track(eventName, {
    form_type: formType,
    page_path: window.location.pathname,
    ...extra,
  });
}

function bindFormEngagement(form, formType) {
  let started = false;
  let submitted = false;

  const markStarted = () => {
    if (started) return;
    started = true;
    trackFormEvent('form_start', formType);
  };

  form.addEventListener('focusin', markStarted, { once: true });
  form.addEventListener('change', markStarted, { once: true });

  form.addEventListener('submit', () => {
    submitted = true;
  });

  window.addEventListener('beforeunload', () => {
    if (started && !submitted) {
      trackFormEvent('form_abandon', formType);
    }
  });
}

function bindContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  bindFormEngagement(form, 'contact');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    if (!hasPrivacyConsent(form)) {
      setFormMessage(form, 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.', 'error');
      return;
    }

    setSubmitting(form, true);
    form.querySelector('.form-message')?.classList.remove('is-visible');

    try {
      await submitFormPayload({
        form_type: 'contact',
        full_name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim() || null,
        subject: String(formData.get('subject') || '').trim() || null,
        message: String(formData.get('message') || '').trim(),
        referrer_page: window.location.pathname,
      });

      trackFormConversion('contact');
      setFormMessage(
        form,
        'Teşekkürler, mesajınız alındı. Genua ekibi en kısa sürede sizinle iletişime geçecek.',
      );
      form.reset();
    } catch (error) {
      setFormMessage(form, error.message, 'error');
    } finally {
      setSubmitting(form, false);
    }
  });
}

function bindQuoteForm() {
  const form = document.querySelector('#quoteForm');
  if (!form) return;

  bindFormEngagement(form, 'quote');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const services = formData.getAll('service').map((value) => String(value).trim()).filter(Boolean);
    const note = String(formData.get('note') || '').trim();
    const messageParts = [];

    if (!services.length) {
      alert('Lütfen en az bir hizmet seçin.');
      return;
    }

    if (!hasPrivacyConsent(form)) {
      alert('Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.');
      return;
    }

    if (services.length) messageParts.push(`İstenen hizmetler: ${services.join(', ')}`);
    if (note) messageParts.push(`Ek notlar:\n${note}`);
    if (!messageParts.length) messageParts.push('Teklif talebi gönderildi.');

    setSubmitting(form, true);

    try {
      await submitFormPayload({
        form_type: 'quote',
        full_name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim() || null,
        subject: 'Teklif Talebi',
        message: messageParts.join('\n\n'),
        requested_services: services,
        budget_range: String(formData.get('budget') || '').trim() || null,
        timeline: String(formData.get('timeline') || '').trim() || null,
        company_name: String(formData.get('company') || '').trim() || null,
        referrer_page: window.location.pathname,
      });

      trackFormConversion('quote');
      window.location.href = 'tesekkurler.html';
    } catch (error) {
      setSubmitting(form, false);
      alert(error.message);
    }
  });
}

bindContactForm();
bindQuoteForm();
