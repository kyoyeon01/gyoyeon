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

function initHeaderScroll() {
  const header = document.querySelector(".hero-header");
  if (!header) return;

  const topBoundary = 20;
  const directionChangeThreshold = 4;
  const hideDownDistance = 8;
  const showUpDistance = 14;
  const hideLongUpDistance = 450;
  let lastY = Math.max(0, window.scrollY);
  let direction = null;
  let directionDistance = 0;
  let pendingDirection = null;
  let pendingDistance = 0;
  let revealedWhileScrollingUp = false;
  let ticking = false;

  const updateHeader = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastY;
    lastY = currentY;

    if (currentY <= topBoundary) {
      header.classList.remove("is-header-hidden");
      direction = null;
      directionDistance = 0;
      pendingDirection = null;
      pendingDistance = 0;
      revealedWhileScrollingUp = false;
      ticking = false;
      return;
    }

    if (Math.abs(delta) < 1) {
      ticking = false;
      return;
    }

    const nextDirection = delta > 0 ? "down" : "up";

    if (nextDirection !== direction) {
      if (pendingDirection !== nextDirection) {
        pendingDirection = nextDirection;
        pendingDistance = 0;
      }
      pendingDistance += Math.abs(delta);

      if (pendingDistance < directionChangeThreshold) {
        ticking = false;
        return;
      }

      direction = nextDirection;
      directionDistance = pendingDistance;
      pendingDirection = null;
      pendingDistance = 0;
      revealedWhileScrollingUp = false;
    } else {
      directionDistance += Math.abs(delta);
      pendingDirection = null;
      pendingDistance = 0;
    }

    if (direction === "down" && directionDistance >= hideDownDistance) {
      header.classList.add("is-header-hidden");
    } else if (direction === "up") {
      if (
        !revealedWhileScrollingUp &&
        directionDistance >= showUpDistance
      ) {
        header.classList.remove("is-header-hidden");
        revealedWhileScrollingUp = true;
      } else if (
        revealedWhileScrollingUp &&
        directionDistance >= hideLongUpDistance
      ) {
        header.classList.add("is-header-hidden");
      }
    }

    ticking = false;
  };

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  updateHeader();

  window.addEventListener(
    "pagehide",
    () => window.removeEventListener("scroll", handleScroll),
    { once: true },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  updateStageScale();
  initHeroParallax(document.querySelector(".hero"));
  initMobileMenu();
  initHeaderScroll();
});

window.addEventListener("resize", updateStageScale);
