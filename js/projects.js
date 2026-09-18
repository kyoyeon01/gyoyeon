const PROJECTS = [
  {
    title: "PAWONG",
    category: "PRODUCT",
    thumbnail: "assets/images/projects/pawong.png?v=3",
    detailRoute: "/portfolio/pawong",
    detailContained: true,
    detailImages: [
      "assets/images/projects/pawong/pawongdetail-01.png",
      "assets/images/projects/pawong/pawongdetail-02.png",
      "assets/images/projects/pawong/pawongdetail-03.png",
    ],
    description:
      "반려견을 위한 자동 리드줄 제품 프로젝트입니다. 상세 이미지와 본문은 추후 교체됩니다.",
  },
  {
    title: "DEEPSEAKER",
    category: "PRODUCT",
    thumbnail: "assets/images/projects/deepseaker.jpg",
    detailRoute: "/portfolio/deepseaker",
    detailContained: true,
    detailImages: [
      "assets/images/projects/deepseaker/Frame_20.png",
      "assets/images/projects/deepseaker/Frame_634144.png",
      "assets/images/projects/deepseaker/Frame_634145.png",
      "assets/images/projects/deepseaker/Frame_634146.png",
      "assets/images/projects/deepseaker/Frame_634147.png",
    ],
    description:
      "해난 구조를 위한 수중 탐색 디바이스 프로젝트입니다. 상세 이미지와 본문은 추후 교체됩니다.",
  },
  {
    title: "NOT YET",
    category: "PRODUCT",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "PRODUCT",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "PRODUCT",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "WEB",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "WEB",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "WEB",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "WEB",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "GRAPHIC",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "GRAPHIC",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "GRAPHIC",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
  {
    title: "NOT YET",
    category: "GRAPHIC",
    thumbnail: "",
    detailRoute: "",
    detailImages: [],
    description: "",
  },
];

function getProjectSlug(project) {
  return String(project.detailRoute || "")
    .replace(/\/+$/, "")
    .split("/")
    .pop();
}

function normalizedPathname() {
  return location.pathname.replace(/\/index\.html$/, "/");
}

function isProjectDetailPath() {
  return /\/portfolio\/[^/]+\/?$/.test(normalizedPathname());
}

function isPortfolioIndexPath() {
  return /\/portfolio\/?$/.test(normalizedPathname());
}

function getProjectHref(project) {
  const slug = getProjectSlug(project);
  if (!slug) return "#";
  if (isProjectDetailPath()) return `../${slug}/`;
  if (isPortfolioIndexPath()) return `./${slug}/`;
  return `./portfolio/${slug}/`;
}

function getPortfolioHref(category) {
  const query = category ? `?tab=${encodeURIComponent(category)}` : "";
  if (isProjectDetailPath()) return `../${query}`;
  if (isPortfolioIndexPath()) return `./${query}`;
  return `./portfolio/${query}`;
}

function siteAssetUrl(path) {
  if (!path) return "";
  const clean = path.replace(/^\.\//, "");
  if (isProjectDetailPath()) return `../../${clean}`;
  if (isPortfolioIndexPath()) return `../${clean}`;
  return `./${clean}`;
}

function getProjectSlugFromLocation() {
  const path = location.pathname.replace(/\/index\.html$/, "/");
  const match = path.match(/\/portfolio\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

function getProjectBySlug(slug) {
  return PROJECTS.find((project) => getProjectSlug(project) === slug) || null;
}

function projectMatchesCategory(project, category) {
  return project.category === category;
}
