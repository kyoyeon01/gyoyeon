function resetScrollTop() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

function createExtButton(label, url, variant) {
  const href = typeof url === "string" ? url.trim() : "";
  const className = `project-ext-btn ${variant}`;
  if (href) {
    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.disabled = true;
  button.textContent = label;
  return button;
}

function createExtRow(project) {
  const row = document.createElement("section");
  row.className = "project-ext-row";
  row.setAttribute("aria-label", "Project links");

  const label = document.createElement("p");
  label.className = "project-ext-label";
  label.textContent = "PROJECT LINKS";

  const actions = document.createElement("div");
  actions.className = "project-ext-actions";
  actions.append(
    createExtButton("VIEW WEBSITE ↗", project.webUrl, "is-website"),
    createExtButton("VIEW FIGMA ↗", project.figmaUrl, "is-figma"),
  );

  row.append(label, actions);
  return row;
}

const WEB_CTA_THEME = {
  fruen: {
    "--cta-fill": "#ffd11f",
    "--cta-fill-hover": "#e8bc12",
    "--cta-on-fill": "#5c3a0e",
    "--cta-line": "#8b5a1e",
    "--cta-line-hover": "#6e4716",
    "--cta-soft": "#fff6d6",
  },
  ongjin: {
    "--cta-fill": "#2e7bc6",
    "--cta-fill-hover": "#2469ab",
    "--cta-on-fill": "#ffffff",
    "--cta-line": "#2e7bc6",
    "--cta-line-hover": "#2469ab",
    "--cta-soft": "#e8f3fb",
  },
  geuru: {
    "--cta-fill": "#1f8b58",
    "--cta-fill-hover": "#187349",
    "--cta-on-fill": "#ffffff",
    "--cta-line": "#1f8b58",
    "--cta-line-hover": "#187349",
    "--cta-soft": "#e5f6ee",
  },
};

function applyWebCtaTheme(root, project) {
  const theme = WEB_CTA_THEME[getProjectSlug(project)] || WEB_CTA_THEME.ongjin;
  Object.entries(theme).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
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
    applyWebCtaTheme(root, project);
  }

  const files = project.detailImages || [];
  files.forEach((src, index) => {
    const img = document.createElement("img");
    applyProjectImage(img, src, {
      alt: index === 0 ? project.title : `${project.title} ${index + 1}`,
      sizes: PROJECT_DETAIL_SIZES,
      decoding: index === 0 ? "sync" : "async",
      fetchPriority: index === 0 ? "high" : undefined,
      loading: index === 0 ? undefined : "lazy",
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
