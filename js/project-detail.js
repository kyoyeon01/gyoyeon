function resetScrollTop() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
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

  const files = project.detailImages || [];
  files.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = siteAssetUrl(src);
    img.alt = index === 0 ? project.title : `${project.title} ${index + 1}`;
    img.draggable = false;
    images.append(img);
  });

  const listWrap = document.createElement("div");
  listWrap.className = "project-list";
  const list = document.createElement("a");
  list.className = "project-list-btn";
  list.href = getPortfolioHref(project.category || "PRODUCT");
  list.textContent = "LIST";
  listWrap.append(list);

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
