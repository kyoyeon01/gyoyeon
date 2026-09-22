function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function listenMotionChange(query, handler) {
  if (query.addEventListener) query.addEventListener("change", handler);
  else query.addListener(handler);
}

function initSmoothScroll() {
  if (typeof Lenis === "undefined") return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lenis = null;
  let tickerFn = null;
  let removeClick = null;

  const connectScrollTrigger = () => {
    if (typeof ScrollTrigger === "undefined") return;
    lenis.on("scroll", ScrollTrigger.update);
  };

  const bindAnchors = () => {
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !lenis) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    };

    document.addEventListener("click", onClick);
    removeClick = () => document.removeEventListener("click", onClick);
  };

  const start = () => {
    if (lenis || prefersReducedMotion()) return;

    try {
      lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
        wheelMultiplier: 1,
      });
    } catch (error) {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
      });
    }

    connectScrollTrigger();
    bindAnchors();

    if (typeof gsap !== "undefined") {
      tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (time) => {
        if (!lenis) return;
        lenis.raf(time);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    window.__lenis = lenis;
  };

  const stop = () => {
    if (removeClick) {
      removeClick();
      removeClick = null;
    }

    if (tickerFn && typeof gsap !== "undefined") {
      gsap.ticker.remove(tickerFn);
      tickerFn = null;
    }

    if (lenis) {
      lenis.destroy();
      lenis = null;
    }

    window.__lenis = null;
  };

  if (!prefersReducedMotion()) start();

  listenMotionChange(motion, () => {
    if (prefersReducedMotion()) stop();
    else start();
  });
}

document.addEventListener("DOMContentLoaded", initSmoothScroll);
