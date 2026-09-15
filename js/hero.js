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

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initAboutCards() {
  const stack = document.querySelector(".about-card-stack");
  if (!stack || typeof gsap === "undefined") return;

  const cards = {
    yellow: stack.querySelector('[data-card="yellow"]'),
    pink: stack.querySelector('[data-card="pink"]'),
    blue: stack.querySelector('[data-card="blue"]'),
  };

  const slots = {
    active: "yellow",
    left: "pink",
    right: "blue",
  };

  let isAnimating = false;

  const getLayout = () => {
    const styles = getComputedStyle(stack);
    const shift = parseFloat(styles.getPropertyValue("--about-shift")) || 68;
    const lift = parseFloat(styles.getPropertyValue("--about-lift")) || -118;
    const tilt = parseFloat(styles.getPropertyValue("--about-tilt")) || 6;

    return {
      active: { x: 0, y: 0, rotation: 0, zIndex: 4 },
      left: { x: -shift, y: lift, rotation: -tilt, zIndex: 3 },
      right: { x: shift, y: lift, rotation: tilt, zIndex: 2 },
    };
  };

  const applySlotClasses = () => {
    Object.values(cards).forEach((card) => {
      card.classList.remove("is-active", "is-left", "is-right");
      card.setAttribute("aria-pressed", "false");
    });

    cards[slots.active].classList.add("is-active");
    cards[slots.active].setAttribute("aria-pressed", "true");
    cards[slots.left].classList.add("is-left");
    cards[slots.right].classList.add("is-right");
  };

  const placeCards = (animate = false) => {
    const layout = getLayout();
    const duration = animate && !prefersReducedMotion() ? 0.45 : 0;

    Object.entries(slots).forEach(([slot, name]) => {
      gsap.to(cards[name], {
        xPercent: -50,
        x: layout[slot].x,
        y: layout[slot].y,
        rotation: layout[slot].rotation,
        zIndex: layout[slot].zIndex,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const activateCard = (name) => {
    if (isAnimating || name === slots.active || !cards[name]) return;

    const incomingSlot = slots.left === name ? "left" : "right";
    const incoming = cards[name];
    const outgoing = cards[slots.active];
    const layout = getLayout();
    const reduced = prefersReducedMotion();

    slots[incomingSlot] = slots.active;
    slots.active = name;
    applySlotClasses();

    if (reduced) {
      placeCards(false);
      return;
    }

    isAnimating = true;
    stack.classList.add("is-animating");

    const incomingTarget = layout.active;
    const outgoingTarget = layout[incomingSlot];

    const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      onComplete: () => {
        isAnimating = false;
        stack.classList.remove("is-animating");
        placeCards(false);
      },
    });

    timeline
      .to(incoming, {
        y: "-=34",
        rotation: incomingTarget.rotation,
        duration: 0.22,
      })
      .set(incoming, { zIndex: 6 })
      .to(
        incoming,
        {
          x: incomingTarget.x,
          y: incomingTarget.y,
          rotation: incomingTarget.rotation,
          duration: 0.42,
        },
        "move",
      )
      .to(
        outgoing,
        {
          x: outgoingTarget.x,
          y: outgoingTarget.y,
          rotation: outgoingTarget.rotation,
          duration: 0.5,
        },
        "move+=0.06",
      )
      .set(outgoing, { zIndex: outgoingTarget.zIndex }, "move+=0.18");
  };

  applySlotClasses();
  gsap.set(Object.values(cards), { xPercent: -50 });
  placeCards(false);

  Object.values(cards).forEach((card) => {
    card.addEventListener("click", () => {
      activateCard(card.dataset.card);
    });
  });

  window.addEventListener("resize", () => {
    if (!isAnimating) placeCards(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStageScale();
  initHeroParallax(document.querySelector(".hero"));
  initMobileMenu();
  initAboutCards();
});

window.addEventListener("resize", updateStageScale);
