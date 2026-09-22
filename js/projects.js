const PROJECTS = [
  {
    title: "FRUEN",
    category: "WEB",
    thumbnail: "assets/images/projects/fruen.png",
    detailRoute: "/portfolio/fruen",
    detailContained: true,
    accent: "#FFD11F",
    webUrl: "https://fruen.vercel.app/",
    figmaUrl: "https://www.figma.com/design/XLkjKR5PZlkas0TyZGvej0/1%EC%B0%A8-%ED%8C%80%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=641-2598&t=g5OUbLwjcB972WxM-1",
    detailImages: [
      "assets/images/projects/fruen/main.png",
      "assets/images/projects/fruen/brand.png",
      "assets/images/projects/fruen/complete.png",
    ],
    description: "",
  },
  {
    title: "오늘옹진",
    category: "WEB",
    thumbnail: "assets/images/projects/ongjin.png",
    detailRoute: "/portfolio/ongjin",
    detailContained: true,
    accent: "#2E7BC6",
    webUrl: "https://kyoyeon01.github.io/ongjin/",
    figmaUrl: "https://www.figma.com/design/46rHm1Ik5i8FoGBrgOVU2B/%EC%98%A4%EB%8A%98--%EC%98%B9%EC%A7%84?node-id=0-1&t=A27DFgHP1XZh325W-1",
    detailImages: [
      "assets/images/projects/ongjin/main.png",
      "assets/images/projects/ongjin/brand.png",
      "assets/images/projects/ongjin/complete.png",
    ],
    description: "",
  },
  {
    title: "그루 독서토론논술",
    category: "WEB",
    thumbnail: "assets/images/projects/geuru.png",
    detailRoute: "/portfolio/geuru",
    detailContained: true,
    accent: "#1F8B58",
    webUrl: "https://kyoyeon01.github.io/landing-page_gru-reading/",
    figmaUrl: "https://www.figma.com/design/Zt7t0r7t8tAvsO88uPmVEP/%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80?node-id=375-586&t=E9hssmPfQuSQ44FD-1",
    detailImages: [
      "assets/images/projects/geuru/main.png",
      "assets/images/projects/geuru/brand.png",
      "assets/images/projects/geuru/complete.png",
    ],
    description: "",
  },
  {
    title: "PAWONG",
    category: "PRODUCT",
    thumbnail: "assets/images/projects/pawong.png?v=3",
    detailRoute: "/portfolio/pawong",
    detailContained: true,
    detailImages: [
      "assets/images/projects/pawong/p1.png",
      "assets/images/projects/pawong/p2.png",
      "assets/images/projects/pawong/p3.png",
      "assets/images/projects/pawong/p4.png",
      "assets/images/projects/pawong/p5.png",
      "assets/images/projects/pawong/p6.png",
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
      "assets/images/projects/deepseaker/de1.png",
      "assets/images/projects/deepseaker/de2.png",
      "assets/images/projects/deepseaker/de3.png",
      "assets/images/projects/deepseaker/de4.png",
      "assets/images/projects/deepseaker/de5.png",
      "assets/images/projects/deepseaker/de6.png",
      "assets/images/projects/deepseaker/de7.png",
    ],
    description:
      "해난 구조를 위한 수중 탐색 디바이스 프로젝트입니다. 상세 이미지와 본문은 추후 교체됩니다.",
  },
  {
    title: "MEDIMATES",
    category: "PRODUCT",
    thumbnail: "assets/images/projects/medimates.png",
    detailRoute: "/portfolio/medimates",
    detailContained: true,
    detailImages: [
      "assets/images/projects/medimates/m1.png",
      "assets/images/projects/medimates/m2.png",
      "assets/images/projects/medimates/m3.png",
      "assets/images/projects/medimates/m4.png",
      "assets/images/projects/medimates/m5.png",
      "assets/images/projects/medimates/m6.png",
      "assets/images/projects/medimates/m7.png",
      "assets/images/projects/medimates/m8.png",
      "assets/images/projects/medimates/m9.png",
    ],
    description: "",
  },
  {
    title: "RESCUE X",
    category: "PRODUCT",
    thumbnail: "assets/images/projects/rescue-x/dr_썸네일.png",
    detailRoute: "/portfolio/rescue-x",
    detailContained: true,
    detailImages: [
      "assets/images/projects/rescue-x/dr1.png",
      "assets/images/projects/rescue-x/dr2.png",
      "assets/images/projects/rescue-x/dr3.png",
      "assets/images/projects/rescue-x/dr4.png",
      "assets/images/projects/rescue-x/dr 5.png",
      "assets/images/projects/rescue-x/dr 6.png",
      "assets/images/projects/rescue-x/dr7.png",
      "assets/images/projects/rescue-x/dr8.png",
      "assets/images/projects/rescue-x/dr9.png",
      "assets/images/projects/rescue-x/dr10.png",
      "assets/images/projects/rescue-x/dr11.png",
    ],
    description: "산악 구조용 드론",
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
    title: "MEDIPOP",
    category: "GRAPHIC",
    thumbnail: "assets/images/projects/medipop/메디팝업_썸네일.png",
    detailRoute: "/portfolio/medipop",
    detailContained: true,
    detailImages: [
      "assets/images/projects/medipop/medi1.jpg",
      "assets/images/projects/medipop/medi 2.jpg",
      "assets/images/projects/medipop/medi 3.jpg",
      "assets/images/projects/medipop/medi 4.jpg",
      "assets/images/projects/medipop/medi 5.jpg",
      "assets/images/projects/medipop/medi 6.jpg",
      "assets/images/projects/medipop/medi 7.jpg",
    ],
    description: "이동식 의료 서비스 브랜드 디자인",
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

const PROJECT_IMAGE_SIZE = {
  "assets/images/projects/deepseaker/de1.png": [5760, 3240],
  "assets/images/projects/deepseaker/de2.png": [5760, 3240],
  "assets/images/projects/deepseaker/de3.png": [5760, 3240],
  "assets/images/projects/deepseaker/de4.png": [5760, 3240],
  "assets/images/projects/deepseaker/de5.png": [5760, 3240],
  "assets/images/projects/deepseaker/de6.png": [5760, 3240],
  "assets/images/projects/deepseaker/de7.png": [5760, 3240],
  "assets/images/projects/deepseaker.jpg": [875, 1024],
  "assets/images/projects/fruen/brand.png": [5760, 3240],
  "assets/images/projects/fruen/complete.png": [5760, 3240],
  "assets/images/projects/fruen/main.png": [5760, 3240],
  "assets/images/projects/fruen.png": [1755, 2052],
  "assets/images/projects/geuru/brand.png": [5760, 3240],
  "assets/images/projects/geuru/complete.png": [5760, 3240],
  "assets/images/projects/geuru/main.png": [5760, 3240],
  "assets/images/projects/geuru.png": [1755, 2052],
  "assets/images/projects/medimates/m1.png": [5760, 3240],
  "assets/images/projects/medimates/m2.png": [5760, 3240],
  "assets/images/projects/medimates/m3.png": [5760, 3240],
  "assets/images/projects/medimates/m4.png": [5760, 3240],
  "assets/images/projects/medimates/m5.png": [5760, 4959],
  "assets/images/projects/medimates/m6.png": [5760, 3240],
  "assets/images/projects/medimates/m7.png": [5760, 3240],
  "assets/images/projects/medimates/m8.png": [5760, 3240],
  "assets/images/projects/medimates/m9.png": [5760, 3240],
  "assets/images/projects/medimates.png": [1755, 2052],
  "assets/images/projects/medipop/medi 2.jpg": [1024, 576],
  "assets/images/projects/medipop/medi 3.jpg": [1024, 576],
  "assets/images/projects/medipop/medi 4.jpg": [1024, 576],
  "assets/images/projects/medipop/medi 5.jpg": [1024, 576],
  "assets/images/projects/medipop/medi 6.jpg": [1024, 576],
  "assets/images/projects/medipop/medi 7.jpg": [1024, 576],
  "assets/images/projects/medipop/medi1.jpg": [1024, 576],
  "assets/images/projects/medipop/메디팝업_썸네일.png": [875, 1024],
  "assets/images/projects/ongjin/brand.png": [5760, 3240],
  "assets/images/projects/ongjin/complete.png": [5760, 3240],
  "assets/images/projects/ongjin/main.png": [5760, 3240],
  "assets/images/projects/ongjin.png": [1755, 2052],
  "assets/images/projects/pawong/p1.png": [5760, 3240],
  "assets/images/projects/pawong/p2.png": [5760, 3240],
  "assets/images/projects/pawong/p3.png": [5760, 3240],
  "assets/images/projects/pawong/p4.png": [5760, 3240],
  "assets/images/projects/pawong/p5.png": [5760, 3240],
  "assets/images/projects/pawong/p6.png": [5760, 3240],
  "assets/images/projects/pawong.png": [874, 1024],
  "assets/images/projects/rescue-x/dr 5.png": [1024, 576],
  "assets/images/projects/rescue-x/dr 6.png": [1024, 576],
  "assets/images/projects/rescue-x/dr1.png": [1024, 576],
  "assets/images/projects/rescue-x/dr10.png": [1024, 576],
  "assets/images/projects/rescue-x/dr11.png": [1024, 576],
  "assets/images/projects/rescue-x/dr2.png": [1024, 576],
  "assets/images/projects/rescue-x/dr3.png": [1024, 576],
  "assets/images/projects/rescue-x/dr4.png": [1024, 576],
  "assets/images/projects/rescue-x/dr7.png": [1024, 576],
  "assets/images/projects/rescue-x/dr8.png": [1024, 576],
  "assets/images/projects/rescue-x/dr9.png": [1024, 576],
  "assets/images/projects/rescue-x/dr_썸네일.png": [875, 1024],
};

const PROJECT_THUMB_SIZES =
  "(max-width: 767px) min(48vw, 180px), (max-width: 1199px) min(41.3vw, 413px), min(28.66vw, 550px)";
const PROJECT_WORKS_THUMB_SIZES =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 108px) / 2), calc((min(1440px, 100vw) - 268px) / 4)";
const PROJECT_DETAIL_SIZES =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 80px), min(1256px, calc(100vw - 184px))";

function projectImageKey(path) {
  return String(path || "")
    .replace(/^\.\//, "")
    .replace(/\?.*$/, "");
}

function encodeAssetPath(path) {
  return String(path || "")
    .split("/")
    .map((segment) => {
      if (!segment || segment === "." || segment === "..") return segment;
      const q = segment.indexOf("?");
      if (q === -1) return encodeURIComponent(segment);
      return `${encodeURIComponent(segment.slice(0, q))}?${segment.slice(q + 1)}`;
    })
    .join("/");
}

function applyProjectImage(img, path, options = {}) {
  const url = siteAssetUrl(path);
  const size = PROJECT_IMAGE_SIZE[projectImageKey(path)];
  img.src = url;
  img.draggable = false;
  img.decoding = options.decoding || "async";
  if (options.alt != null) img.alt = options.alt;
  if (options.loading) img.loading = options.loading;
  if (options.fetchPriority) img.setAttribute("fetchpriority", options.fetchPriority);
  if (size) {
    img.width = size[0];
    img.height = size[1];
    img.srcset = `${url} ${size[0]}w`;
    if (options.sizes) img.sizes = options.sizes;
  }
}

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
  const clean = encodeAssetPath(path.replace(/^\.\//, ""));
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
