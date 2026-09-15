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

function padProjectId(id) {
  return String(id).padStart(2, "0");
}

function createGalleryCard(project, options = {}) {
  const index = padProjectId(project.id);
  const card = document.createElement("a");
  card.className = "gallery-card";
  card.href = project.url;
  card.setAttribute("aria-label", `${index}. ${project.title}`);

  if (options.hidden) {
    card.tabIndex = -1;
  }

  if (!project.ready) {
    card.setAttribute("aria-disabled", "true");
  }

  card.addEventListener("click", (event) => {
    if (!project.ready) event.preventDefault();
  });

  const indexEl = document.createElement("p");
  indexEl.className = "gallery-card__index";
  indexEl.textContent = `${index}.`;

  const titleEl = document.createElement("h3");
  titleEl.className = "gallery-card__title";
  titleEl.textContent = project.title;

  const thumb = document.createElement("div");
  thumb.className = "gallery-card__thumb";

  const tag = document.createElement("span");
  tag.className = "gallery-card__tag";
  tag.textContent =
    project.tag.charAt(0) + project.tag.slice(1).toLowerCase();

  const img = document.createElement("img");
  img.alt = options.hidden ? "" : project.title;
  img.draggable = false;
  img.addEventListener("load", () => {
    thumb.appendChild(img);
  });
  img.src = project.image;

  thumb.append(tag);
  card.append(indexEl, titleEl, thumb);
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

function initGallery() {
  const track = document.querySelector("[data-gallery-track]");
  if (!track) return;

  track.append(createGalleryGroup(false), createGalleryGroup(true));
}

document.addEventListener("DOMContentLoaded", initGallery);
