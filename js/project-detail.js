function resetScrollTop() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

function createExtButton(label, url) {
  const href = typeof url === "string" ? url.trim() : "";
  if (href) {
    const link = document.createElement("a");
    link.className = "project-ext-btn";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  const button = document.createElement("button");
  button.className = "project-ext-btn";
  button.type = "button";
  button.disabled = true;
  button.textContent = label;
  return button;
}

function createExtRow(project) {
  const row = document.createElement("div");
  row.className = "project-ext-row";
  row.append(createExtButton("WEB", project.webUrl), createExtButton("FIGMA", project.figmaUrl));
  return row;
}

function renderProjectDetail(root, project) {
  root.replaceChildren();

  const images = document.createElement("section");
  images.className = "project-images";
  images.setAttribute("aria-label", `${project.title} 상세`);

  if (project.detailContained) {
    root.classList.add("is-contained");
  }

  if (getProjectSlug(project) === "deepseaker") {
    root.classList.add("is-deepseaker");
  }

  if (project.category === "WEB") {
    root.classList.add("is-web");
    if (project.accent) root.style.setProperty("--project-accent", project.accent);
  }

  const files = project.detailImages || [];
  files.forEach((src, index) => {
    const img = document.createElement("img");
    applyProjectImage(img, src, {
      alt: index === 0 ? project.title : `${project.title} ${index + 1}`,
      sizes: PROJECT_DETAIL_SIZES,
      decoding: index === 0 ? "sync" : "async",
      fetchPriority: index === 0 ? "high" : undefined,
    });
    images.append(img);
  });

  const listWrap = document.createElement("div");
  listWrap.className = "project-list";
  const list = document.createElement("a");
  list.className = "project-list-btn";
  list.href = getPortfolioHref(project.category || "PRODUCT");
  list.textContent = "LIST";
  listWrap.append(list);

  if (project.category === "WEB") {
    root.append(createExtRow(project), images, listWrap);
    return;
  }

  root.append(images, listWrap);
}

function initProjectDetail() {
  resetScrollTop();
  const root = document.querySelector("[data-project-detail]");
  if (!root) return;

  const slug = getProjectSlugFromLocation();
  const project = getProjectBySlug(slug);

  if (!project) {
    root.innerHTML = `<h1 class="project-title">Project</h1><p class="project-description">등록되지 않은 프로젝트입니다.</p>`;
    document.title = "교 · Project";
    return;
  }

  document.title = `교 · ${project.title}`;
  renderProjectDetail(root, project);
}

document.addEventListener("DOMContentLoaded", initProjectDetail);
