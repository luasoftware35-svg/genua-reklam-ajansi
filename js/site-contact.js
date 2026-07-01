// Backward compatibility: load unified site settings module.
(function loadSiteSettings() {
  if (document.querySelector('script[src*="site-settings.js"]')) return;
  const script = document.createElement('script');
  script.src = 'js/site-settings.js';
  document.body.appendChild(script);
})();
