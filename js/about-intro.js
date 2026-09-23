function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initAboutIntro() {
  const section = document.querySelector(".about-intro");
  const mark = document.querySelector("[data-about-intro-mark]");
  const title = document.querySelector("[data-about-intro-title]");
  const lead = document.querySelector("[data-about-intro-lead]");
  if (!section || !mark || !title || !lead) return;
  if (typeof gsap === "undefined" || prefersReducedMotion()) return;

  gsap.set(mark, { opacity: 0, y: 25, rotate: -8 });
  gsap.set(title, { opacity: 0, y: 20 });
  gsap.set(lead, { opacity: 0, y: 15 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onComplete: () => {
      gsap.to(mark, {
        y: -5,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
  });

  tl.to(mark, { opacity: 1, y: 0, rotate: 0, duration: 1.04 }, 0)
    .to(title, { opacity: 1, y: 0, duration: 0.91 }, 0.325)
    .to(lead, { opacity: 1, y: 0, duration: 0.845 }, 0.585);

  const playOnce = () => {
    if (tl.progress() > 0 || tl.isActive()) return;
    tl.play();
  };

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: playOnce,
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    playOnce();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      playOnce();
      observer.disconnect();
    },
    { threshold: 0.28 },
  );

  observer.observe(section);
}

document.addEventListener("DOMContentLoaded", initAboutIntro);
