(function initServicesPageMotion() {
  const page = document.querySelector('.page-hero--services');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sidebar = document.querySelector('.service-sidebar');
  const indicator = sidebar?.querySelector('.service-sidebar-indicator');
  const tabs = [...document.querySelectorAll('.service-sidebar .tab-btn')];
  const sections = [...document.querySelectorAll('.service-detail-motion')];
  const heroScene = document.querySelector('.services-hero-scene');

  function revealHeroItems() {
    document.querySelectorAll('.services-motion-item').forEach((item) => {
      const delay = Number(item.dataset.motionDelay || 0);
      if (reduceMotion) {
        item.classList.add('is-visible');
        return;
      }
      window.setTimeout(() => item.classList.add('is-visible'), 140 + delay);
    });
  }

  function splitHeroTitle() {
    const title = document.querySelector('.services-hero-title[data-split-words]');
    if (!title || reduceMotion) {
      title?.classList.add('is-split');
      return;
    }

    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words
      .map((word, index) => `<span class="services-hero-word" style="--word-i:${index}">${word}</span>`)
      .join('<span class="services-hero-space" aria-hidden="true"> </span>');

    window.requestAnimationFrame(() => title.classList.add('is-split'));
  }

  function moveSidebarIndicator(activeTab) {
    if (!sidebar || !indicator || !activeTab) return;

    indicator.style.top = `${activeTab.offsetTop}px`;
    indicator.style.height = `${activeTab.offsetHeight}px`;
    indicator.style.opacity = '1';
  }

  function setActiveTab(id) {
    const target = `#${id}`;
    let activeTab = null;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.tabTarget === target;
      tab.classList.toggle('is-active', isActive);
      if (isActive) activeTab = tab;
    });

    sections.forEach((section) => {
      section.classList.toggle('is-scroll-active', section.id === id);
    });

    moveSidebarIndicator(activeTab);
  }

  function initScrollSpy() {
    if (!sections.length || !tabs.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveTab(visible.target.id);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.12, 0.35, 0.55] },
    );

    sections.forEach((section) => spy.observe(section));
    setActiveTab(sections[0].id);
  }

  function initSectionMotion() {
    if (!sections.length) return;

    if (reduceMotion) {
      sections.forEach((section) => section.classList.add('is-inview'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initHeroParallax() {
    if (!heroScene || reduceMotion) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.18, 120);
        heroScene.style.transform = `translate3d(0, ${offset}px, 0)`;
        frame = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tabTarget?.replace('#', '');
      if (id) setActiveTab(id);
      window.setTimeout(() => moveSidebarIndicator(tab), 320);
    });
  });

  window.addEventListener('resize', () => {
    const active = tabs.find((tab) => tab.classList.contains('is-active'));
    moveSidebarIndicator(active);
  });

  splitHeroTitle();
  revealHeroItems();
  initScrollSpy();
  initSectionMotion();
  initHeroParallax();

  document.dispatchEvent(new CustomEvent('genua:service-detail-ready'));
})();
