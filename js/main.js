const siteHeader = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primaryMenu");
const revealItems = document.querySelectorAll(".reveal");
window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});

if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader);
}

if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menüyü aç");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    navMenu.classList.add("is-open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Menüyü kapat");
    document.body.classList.add("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("is-open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target === navMenu) closeMenu();
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) closeMenu();
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = Number(counter.dataset.duration || 1400);
  const prefix = counter.dataset.prefix || "";
  const suffix = counter.dataset.suffix || "";
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    counter.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

window.initCounters = () => {
  const counters = document.querySelectorAll(".counter[data-target]:not([data-animated])");
  if (!counters.length) return;

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-animated", "true");
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });

    counters.forEach((counter) => counterObserver.observe(counter));
    return;
  }

  counters.forEach((counter) => {
    counter.setAttribute("data-animated", "true");
    animateCounter(counter);
  });
};

window.initCounters();

const filterButtons = document.querySelectorAll("[data-filter]");
const filterItems = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    filterItems.forEach((item) => {
      const categories = item.dataset.category.split(" ");
      item.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

const tabButtons = document.querySelectorAll("[data-tab-target]");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.tabTarget);
    tabButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalClose = document.querySelector("[data-modal-close]");

document.querySelectorAll("[data-modal-title]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    if (!modal || !modalTitle || !modalText) return;
    modalTitle.textContent = card.dataset.modalTitle;
    modalText.textContent = card.dataset.modalText;
    modal.classList.add("is-open");
    modalClose?.focus();
  });
});

modalClose?.addEventListener("click", () => modal?.classList.remove("is-open"));
modal?.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("is-open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modal?.classList.remove("is-open");
});

const quoteForm = document.querySelector("#quoteForm");
const quoteSteps = document.querySelectorAll(".quote-step");
const progress = document.querySelector(".progress span");
let quoteStepIndex = 0;

const updateQuoteStep = () => {
  quoteSteps.forEach((step, index) => step.classList.toggle("is-active", index === quoteStepIndex));
  if (progress) progress.style.width = `${((quoteStepIndex + 1) / quoteSteps.length) * 100}%`;
};

quoteForm?.querySelectorAll("[data-next-step]").forEach((button) => {
  button.addEventListener("click", () => {
    quoteStepIndex = Math.min(quoteStepIndex + 1, quoteSteps.length - 1);
    updateQuoteStep();
  });
});

quoteForm?.querySelectorAll("[data-prev-step]").forEach((button) => {
  button.addEventListener("click", () => {
    quoteStepIndex = Math.max(quoteStepIndex - 1, 0);
    updateQuoteStep();
  });
});

document.querySelectorAll("[data-show-more-clients]").forEach((button) => {
  button.addEventListener("click", () => {
    const grid = document.querySelector(`#${button.getAttribute("aria-controls")}`);
    const isExpanded = grid?.classList.toggle("is-expanded") ?? false;
    button.setAttribute("aria-expanded", String(isExpanded));
    button.textContent = isExpanded ? "Daha Az Göster" : "Daha Fazlasını Göster";
  });
});

document.querySelectorAll("[data-toggle-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.querySelector(button.dataset.togglePanel);
    if (!panel) return;

    const isOpen = panel.hasAttribute("hidden");
    panel.toggleAttribute("hidden", !isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const initCursorTrail = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (reduceMotion || !finePointer) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const points = [];
  const maxAge = 360;
  const maxPoints = 24;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let isRunning = false;

  if (!ctx) return;

  canvas.className = "cursor-trail-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (now) => {
    ctx.clearRect(0, 0, width, height);

    while (points.length && now - points[0].time > maxAge) {
      points.shift();
    }

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i += 1) {
        const current = points[i];
        const next = points[i + 1];
        ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
      }

      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.strokeStyle = "rgba(219, 255, 43, 0.36)";
      ctx.shadowColor = "rgba(219, 255, 43, 0.24)";
      ctx.shadowBlur = 6;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    if (points.length) {
      requestAnimationFrame(draw);
    } else {
      isRunning = false;
    }
  };

  const addPoint = (event) => {
    const lastPoint = points[points.length - 1];
    const distance = lastPoint ? Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y) : Infinity;
    if (distance < 5) return;

    points.push({ x: event.clientX, y: event.clientY, time: performance.now() });
    if (points.length > maxPoints) points.shift();
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(draw);
    }
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", addPoint, { passive: true });
  window.addEventListener("pointerleave", () => points.splice(0, points.length));
  resize();
};

initCursorTrail();
