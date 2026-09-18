const TONES = ["a", "b", "c", "d"];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function pageSize() {
  if (window.matchMedia("(max-width: 767px)").matches) return 1;
  if (window.matchMedia("(max-width: 1023px)").matches) return 2;
  return 4;
}

function initPortfolioPage() {
  const track = document.querySelector("[data-works-track]");
  const tabs = Array.from(document.querySelectorAll("[data-works-tab]"));
  const prev = document.querySelector("[data-works-prev]");
  const next = document.querySelector("[data-works-next]");
  if (!track || !tabs.length || !prev || !next) return;

  let category = "WEB";
  let index = 0;
  let animating = false;

  const itemsFor = () => PROJECTS.filter((item) => projectMatchesCategory(item, category));
  const maxIndex = () => Math.max(0, itemsFor().length - pageSize());

  function createCard(item, order) {
    const card = document.createElement("a");
    card.className = "works-card";
    card.href = getProjectHref(item);

    if (!item.detailRoute) {
      card.setAttribute("aria-disabled", "true");
      card.addEventListener("click", (event) => event.preventDefault());
    }

    const thumb = document.createElement("div");
    thumb.className = "works-thumb";
    thumb.dataset.tone = TONES[order % TONES.length];
    thumb.setAttribute("aria-hidden", "true");

    if (item.thumbnail) {
      const img = document.createElement("img");
      img.src = siteAssetUrl(item.thumbnail);
      img.alt = "";
      img.draggable = false;
      thumb.append(img);
    }

    const title = document.createElement("h2");
    title.textContent = item.title;

    const caption = document.createElement("p");
    caption.textContent = item.category;

    card.append(thumb, title, caption);
    return card;
  }

  function renderCards() {
    track.innerHTML = "";
    itemsFor().forEach((item, order) => {
      track.appendChild(createCard(item, order));
    });
  }

  function updateArrows() {
    const max = maxIndex();
    prev.disabled = index <= 0;
    next.disabled = index >= max;
  }

  function applyOffset(immediate) {
    const first = track.querySelector(".works-card");
    const x = (() => {
      if (!first) return 0;
      const styles = getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      return -(first.getBoundingClientRect().width + gap) * index;
    })();

    if (typeof gsap === "undefined") {
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      return;
    }

    if (immediate || prefersReducedMotion()) {
      gsap.set(track, { x });
      return;
    }
    gsap.to(track, { x, duration: 0.45, ease: "power2.out", overwrite: "auto" });
  }

  function playEnter() {
    const cards = Array.from(track.children);
    if (prefersReducedMotion() || typeof gsap === "undefined") {
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "none";
      });
      return;
    }
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" },
    );
  }

  function showCategory(nextCategory, { animate } = { animate: true }) {
    if (animating) return;
    category = nextCategory;
    index = 0;

    tabs.forEach((tab) => {
      const active = tab.dataset.worksTab === category;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    const swap = () => {
      if (typeof gsap !== "undefined") gsap.set(track, { x: 0 });
      else track.style.transform = "translate3d(0, 0, 0)";
      renderCards();
      updateArrows();
      applyOffset(true);
      playEnter();
    };

    if (!animate || prefersReducedMotion() || typeof gsap === "undefined") {
      swap();
      return;
    }

    animating = true;
    gsap.to(track, {
      opacity: 0,
      duration: 0.22,
      ease: "power1.out",
      onComplete: () => {
        swap();
        gsap.fromTo(track, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power1.out" });
        animating = false;
      },
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.worksTab === category) return;
      showCategory(tab.dataset.worksTab, { animate: true });
    });
  });

  prev.addEventListener("click", () => {
    if (index <= 0) return;
    index -= 1;
    updateArrows();
    applyOffset(false);
  });

  next.addEventListener("click", () => {
    if (index >= maxIndex()) return;
    index += 1;
    updateArrows();
    applyOffset(false);
  });

  window.addEventListener("resize", () => {
    index = Math.min(index, maxIndex());
    updateArrows();
    applyOffset(true);
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const requested = new URLSearchParams(location.search).get("tab");
  const initial = requested && tabs.some((tab) => tab.dataset.worksTab === requested.toUpperCase())
    ? requested.toUpperCase()
    : "WEB";
  showCategory(initial, { animate: false });
}

document.addEventListener("DOMContentLoaded", initPortfolioPage);
