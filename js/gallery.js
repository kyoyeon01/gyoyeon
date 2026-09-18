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
    img.alt = options.hidden ? "" : project.title;
    img.draggable = false;
    img.src = siteAssetUrl(project.thumbnail);
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

  track.append(createGalleryGroup(false), createGalleryGroup(true));
  initHorizontalGallery(section, track);
}

document.addEventListener("DOMContentLoaded", initGallery);
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});
