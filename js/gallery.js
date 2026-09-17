const projects = [
  {
    id: 1,
    title: "PROJECT",
    tag: "WEB",
    image: "./assets/images/project01.png",
    url: "./projects/project01.html",
    ready: false,
  },
  {
    id: 2,
    title: "PROJECT",
    tag: "GRAPHIC",
    image: "./assets/images/project02.png",
    url: "./projects/project02.html",
    ready: false,
  },
  {
    id: 3,
    title: "PROJECT",
    tag: "PRODUCT",
    image: "./assets/images/project03.png",
    url: "./projects/project03.html",
    ready: false,
  },
  {
    id: 4,
    title: "PROJECT",
    tag: "WEB",
    image: "./assets/images/project04.png",
    url: "./projects/project04.html",
    ready: false,
  },
  {
    id: 5,
    title: "PROJECT",
    tag: "GRAPHIC",
    image: "./assets/images/project05.png",
    url: "./projects/project05.html",
    ready: false,
  },
  {
    id: 6,
    title: "PROJECT",
    tag: "PRODUCT",
    image: "./assets/images/project06.png",
    url: "./projects/project06.html",
    ready: false,
  },
  {
    id: 7,
    title: "PROJECT",
    tag: "WEB",
    image: "./assets/images/project07.png",
    url: "./projects/project07.html",
    ready: false,
  },
  {
    id: 8,
    title: "PROJECT",
    tag: "GRAPHIC",
    image: "./assets/images/project08.png",
    url: "./projects/project08.html",
    ready: false,
  },
  {
    id: 9,
    title: "PROJECT",
    tag: "PRODUCT",
    image: "./assets/images/project09.png",
    url: "./projects/project09.html",
    ready: false,
  },
  {
    id: 10,
    title: "PROJECT",
    tag: "WEB",
    image: "./assets/images/project10.png",
    url: "./projects/project10.html",
    ready: false,
  },
  {
    id: 11,
    title: "PROJECT",
    tag: "GRAPHIC",
    image: "./assets/images/project11.png",
    url: "./projects/project11.html",
    ready: false,
  },
  {
    id: 12,
    title: "PROJECT",
    tag: "PRODUCT",
    image: "./assets/images/project12.png",
    url: "./projects/project12.html",
    ready: false,
  },
  {
    id: 13,
    title: "PROJECT",
    tag: "WEB",
    image: "./assets/images/project13.png",
    url: "./projects/project13.html",
    ready: false,
  },
  {
    id: 14,
    title: "PROJECT",
    tag: "GRAPHIC",
    image: "./assets/images/project14.png",
    url: "./projects/project14.html",
    ready: false,
  },
  {
    id: 15,
    title: "PROJECT",
    tag: "PRODUCT",
    image: "./assets/images/project15.png",
    url: "./projects/project15.html",
    ready: false,
  },
];

function createGalleryCard(project, options = {}) {
  const card = document.createElement("a");
  card.className = "gallery-card";
  card.href = project.url;
  card.setAttribute("aria-label", project.title);

  if (options.hidden) {
    card.tabIndex = -1;
  }

  if (!project.ready) {
    card.setAttribute("aria-disabled", "true");
  }

  card.addEventListener("click", (event) => {
    if (!project.ready) event.preventDefault();
  });

  const titleEl = document.createElement("h3");
  titleEl.className = "gallery-card__title";
  titleEl.textContent = project.title;

  const thumb = document.createElement("div");
  thumb.className = "gallery-card__thumb";

  const tag = document.createElement("span");
  tag.className = "gallery-card__tag";
  tag.textContent = project.tag.charAt(0) + project.tag.slice(1).toLowerCase();

  const img = document.createElement("img");
  img.alt = options.hidden ? "" : project.title;
  img.draggable = false;
  img.src = project.image;
  const attachImage = () => {
    if (img.naturalWidth && !thumb.contains(img)) thumb.appendChild(img);
  };
  if (img.complete) attachImage();
  else img.addEventListener("load", attachImage);

  thumb.append(tag);
  card.append(titleEl, thumb);
  return card;
}

function createGalleryGroup(hidden) {
  const group = document.createElement("div");
  group.className = "gallery-group";
  if (hidden) group.setAttribute("aria-hidden", "true");

  for (const project of projects) {
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
  const section = document.querySelector(".section-project");
  const track = document.querySelector("[data-gallery-track]");
  if (!section || !track) return;

  track.append(createGalleryGroup(false), createGalleryGroup(true));
  initHorizontalGallery(section, track);
}

document.addEventListener("DOMContentLoaded", initGallery);
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});
