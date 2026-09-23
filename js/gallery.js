function createGalleryCard(project, options = {}) {
  const card = document.createElement("a");
  card.className = "gallery-card";
  card.href = getProjectHref(project);
  card.setAttribute("aria-label", project.title);

  if (options.hidden) {
    card.tabIndex = -1;
  }

  if (!project.detailRoute) {
    card.setAttribute("aria-disabled", "true");
    card.addEventListener("click", (event) => event.preventDefault());
  }

  const titleEl = document.createElement("h3");
  titleEl.className = "gallery-card__title";
  titleEl.textContent = project.title;

  const thumb = document.createElement("div");
  thumb.className = "gallery-card__thumb";

  const tag = document.createElement("span");
  tag.className = "gallery-card__tag";
  tag.textContent = project.category;

    if (project.thumbnail) {
      const img = document.createElement("img");
      applyProjectImage(img, project.thumbnail, {
        alt: options.hidden ? "" : project.title,
        sizes: PROJECT_THUMB_SIZES,
      });
      const attachImage = () => {
        if (img.naturalWidth && !thumb.contains(img)) thumb.appendChild(img);
      };
    if (img.complete) attachImage();
    else img.addEventListener("load", attachImage);
  }

  thumb.append(tag);
  card.append(titleEl, thumb);
  return card;
}

function createGalleryGroup(hidden) {
  const group = document.createElement("div");
  group.className = "gallery-group";
  if (hidden) group.setAttribute("aria-hidden", "true");

  for (const project of PROJECTS) {
    group.appendChild(createGalleryCard(project, { hidden }));
  }

  return group;
}

function getLoopWidth(track) {
  const group = track.querySelector(".gallery-group");
  return group ? group.offsetWidth : 0;
}

const GALLERY_EXPAND = 1.204;
const GALLERY_HOVER_DURATION = 0.55;
const GALLERY_HOVER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const GALLERY_EDGE_PAD = 8;
const GALLERY_LIFT = 18;

function canUseGalleryHover() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches
  );
}

function initGalleryHover(section, shiftLayer) {
  if (typeof gsap === "undefined" || !canUseGalleryHover()) return;

  const cards = Array.from(section.querySelectorAll(".gallery-card"));
  let active = null;
  let hoverTween = null;

  const cardBaseWidth = (card) => {
    const stored = Number(card.dataset.baseWidth);
    if (stored) return stored;
    const width = card.getBoundingClientRect().width;
    card.dataset.baseWidth = String(width);
    return width;
  };

  const expandFactor = (card) => {
    const baseWidth = cardBaseWidth(card);
    const bounds = section.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const title = card.querySelector(".gallery-card__title");
    const titleH = title ? title.getBoundingClientRect().height : 0;
    const desiredThumbH = baseWidth * GALLERY_EXPAND * 1.25;
    const desiredCardH = titleH + 10 + desiredThumbH;
    const available = bounds.bottom - rect.top - GALLERY_EDGE_PAD + GALLERY_LIFT;
    if (desiredCardH <= available) return GALLERY_EXPAND;
    const maxThumbH = available - titleH - 10;
    if (maxThumbH <= 0) return 1;
    return Math.max(1, Math.min(GALLERY_EXPAND, maxThumbH / (baseWidth * 1.25)));
  };

  const hoverShift = (card) => {
    const bounds = section.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const baseWidth = cardBaseWidth(card);
    const expandedWidth = baseWidth * expandFactor(card);
    const leftLimit = bounds.left + GALLERY_EDGE_PAD;
    const rightLimit = bounds.right - GALLERY_EDGE_PAD;
    const currentX = Number(gsap.getProperty(shiftLayer, "x")) || 0;

    let delta = 0;
    if (rect.left < leftLimit) delta += leftLimit - rect.left;

    const nextRight = rect.left + delta + expandedWidth;
    if (nextRight > rightLimit) delta -= nextRight - rightLimit;

    const nextLeft = rect.left + delta;
    if (nextLeft < leftLimit) delta += leftLimit - nextLeft;

    return {
      shift: currentX + delta,
      leftClipped: rect.left < bounds.left - 1,
    };
  };

  const play = (card) => {
    if (hoverTween) hoverTween.kill();

    cards.forEach((item) => {
      if (item === card) return;
      item.classList.remove("is-expanded");
      const base = Number(item.dataset.baseWidth);
      if (base) gsap.set(item, { width: base });
    });

    const baseWidth = cardBaseWidth(card);
    const factor = expandFactor(card);
    const { shift, leftClipped } = hoverShift(card);
    card.classList.add("is-expanded");
    gsap.set(card, { width: baseWidth });

    hoverTween = gsap.timeline({ overwrite: true, defaults: { ease: GALLERY_HOVER_EASE } });

    if (leftClipped && shift > 1) {
      hoverTween
        .to(shiftLayer, { x: shift, duration: GALLERY_HOVER_DURATION }, 0)
        .fromTo(
          card,
          { width: baseWidth },
          { width: baseWidth * factor, duration: GALLERY_HOVER_DURATION },
          0.12,
        );
    } else {
      hoverTween
        .to(shiftLayer, { x: shift, duration: GALLERY_HOVER_DURATION }, 0)
        .fromTo(
          card,
          { width: baseWidth },
          { width: baseWidth * factor, duration: GALLERY_HOVER_DURATION },
          0,
        );
    }
  };

  const reset = () => {
    if (hoverTween) hoverTween.kill();
    hoverTween = gsap.timeline({ overwrite: true, defaults: { ease: GALLERY_HOVER_EASE } });

    cards.forEach((card) => {
      card.classList.remove("is-expanded");
      const base = Number(card.dataset.baseWidth);
      if (base) hoverTween.to(card, { width: base, duration: GALLERY_HOVER_DURATION }, 0);
    });

    hoverTween.to(shiftLayer, { x: 0, duration: GALLERY_HOVER_DURATION }, 0);
    hoverTween.add(() => {
      cards.forEach((card) => gsap.set(card, { width: "" }));
    });
  };

  const cardFromPoint = (x, y) => {
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      const card = node.closest?.(".gallery-card");
      if (card && section.contains(card)) return card;
    }
    return null;
  };

  const syncHover = (x, y) => {
    if (!canUseGalleryHover()) return;
    const card = cardFromPoint(x, y);
    if (card === active) return;

    if (!card) {
      if (!active) return;
      active = null;
      reset();
      return;
    }

    active = card;
    play(card);
  };

  let lastX = null;
  let lastY = null;

  section.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (lastX === event.clientX && lastY === event.clientY) return;
    lastX = event.clientX;
    lastY = event.clientY;
    syncHover(event.clientX, event.clientY);
  });

  section.addEventListener("pointerleave", () => {
    lastX = null;
    lastY = null;
    if (!active) return;
    active = null;
    reset();
  });
}

function initHorizontalGallery(section, track) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  gsap.to(track, {
    x: () => -getLoopWidth(track),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.round(getLoopWidth(track) * 1.55)}`,
      pin: true,
      scrub: 1.15,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
}

function initGallery() {
  const section = document.querySelector("#portfolio");
  const track = document.querySelector("[data-gallery-track]");
  if (!section || !track) return;

  const shiftLayer = document.createElement("div");
  shiftLayer.className = "gallery-hover-shift";
  shiftLayer.append(createGalleryGroup(false), createGalleryGroup(true));
  track.append(shiftLayer);
  initHorizontalGallery(section, track);
  initGalleryHover(section, shiftLayer);
}

document.addEventListener("DOMContentLoaded", initGallery);
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});
