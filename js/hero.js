const RANGE_PX = 22;
const DAMPING = 0.08;

function shouldDisableParallax() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function initHeroParallax(section) {
  if (!section || shouldDisableParallax()) return;

  const layers = Array.from(section.querySelectorAll("[data-depth]"));
  let raf = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const onMove = (event) => {
    const rect = section.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    targetX = Math.max(-1, Math.min(1, nx));
    targetY = Math.max(-1, Math.min(1, ny));
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  const tick = () => {
    currentX += (targetX - currentX) * DAMPING;
    currentY += (targetY - currentY) * DAMPING;

    for (const layer of layers) {
      const depth = Number(layer.dataset.depth) || 0;
      const x = currentX * depth * RANGE_PX;
      const y = currentY * depth * RANGE_PX;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    raf = requestAnimationFrame(tick);
  };

  section.addEventListener("mousemove", onMove);
  section.addEventListener("mouseleave", onLeave);
  raf = requestAnimationFrame(tick);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    },
    { once: true },
  );
}

function initMobileMenu() {
  const toggle = document.querySelector(".hero-menu-toggle");
  const panel = document.querySelector(".hero-menu-panel");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };

  toggle.addEventListener("click", () => {
    setOpen(panel.hidden);
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

function updateStageScale() {
  const stage = document.querySelector(".hero-stage");
  if (!stage) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const isTablet = window.matchMedia("(max-width: 1199px)").matches;
  const width = isMobile ? 760 : isTablet ? 1600 : 1920;
  const height = isMobile ? 980 : isTablet ? 980 : 1080;
  const scale = Math.min(window.innerWidth / width, window.innerHeight / height);

  stage.style.setProperty("--hero-scale", String(scale));
}

document.addEventListener("DOMContentLoaded", () => {
  updateStageScale();
  initHeroParallax(document.querySelector(".hero"));
  initMobileMenu();
});

window.addEventListener("resize", updateStageScale);
