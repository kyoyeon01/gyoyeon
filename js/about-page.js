function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initStickerGroups() {
  const stickers = Array.from(document.querySelectorAll(".about-sticker"));
  if (!stickers.length) return;

  const reveal = (sticker) => {
    sticker.classList.add("is-visible");
  };

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    stickers.forEach(reveal);
    return;
  }

  const scrollStickers = stickers.filter((sticker) => sticker.dataset.stickerScroll);
  const observedStickers = stickers.filter((sticker) => !sticker.dataset.stickerScroll);
  const revealQueue = [];
  let queueActive = false;

  const flushQueue = () => {
    const sticker = revealQueue.shift();
    if (!sticker) {
      queueActive = false;
      return;
    }

    reveal(sticker);
    window.setTimeout(flushQueue, 75);
  };

  const queueReveal = (sticker) => {
    if (
      sticker.classList.contains("is-visible") ||
      revealQueue.includes(sticker)
    ) {
      return;
    }

    revealQueue.push(sticker);
    if (!queueActive) {
      queueActive = true;
      flushQueue();
    }
  };

  const revealScrollStickers = () => {
    scrollStickers.forEach((sticker) => {
      const triggerY = Number(sticker.dataset.stickerScroll) || 0;
      if (window.scrollY >= triggerY) queueReveal(sticker);
    });

    if (scrollStickers.every((sticker) => sticker.classList.contains("is-visible"))) {
      window.removeEventListener("scroll", revealScrollStickers);
    }
  };

  window.addEventListener("scroll", revealScrollStickers, { passive: true });
  revealScrollStickers();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        queueReveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px",
    },
  );

  observedStickers.forEach((sticker) => observer.observe(sticker));
}

function initAboutPage() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const title = document.querySelector("[data-about-title]");
  const lead = document.querySelector("[data-about-lead]");
  const logo = document.querySelector("[data-about-logo]");
  const kyo = document.querySelector("[data-kyo]");
  const yeon = document.querySelector("[data-yeon]");
  const plus = document.querySelector("[data-plus]");
  const keys = gsap.utils.toArray("[data-about-key]");
  const profileTitle = document.querySelector("[data-profile-title]");
  const profilePhoto = document.querySelector("[data-profile-photo]");
  const profileMeta = gsap.utils.toArray("[data-profile-meta]");
  const profileBlocks = gsap.utils.toArray("[data-profile-block]");
  const skillTitle = document.querySelector("[data-skill-title]");
  const skillRows = gsap.utils.toArray("[data-skill-row]");
  const skillIcons = gsap.utils.toArray(".skill-icons li");

  if (prefersReducedMotion()) {
    gsap.set([title, lead, logo, kyo, yeon, plus, keys, profileTitle, profilePhoto, profileMeta, profileBlocks, skillTitle, skillRows, skillIcons], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    });
    return;
  }

  gsap.set(title, { opacity: 0, y: 28 });
  gsap.set(lead, { opacity: 0, y: 22 });
  gsap.set(kyo, { opacity: 0, x: -40 });
  gsap.set(yeon, { opacity: 0, x: 40 });
  gsap.set(plus, { opacity: 0 });
  gsap.set(keys, { opacity: 0, y: 20 });

  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: "power2.out",
    scrollTrigger: { trigger: title, start: "top 86%", once: true },
  });

  gsap.to(lead, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.12,
    ease: "power2.out",
    scrollTrigger: { trigger: lead, start: "top 88%", once: true },
  });

  if (logo) {
    gsap.fromTo(
      logo,
      { opacity: 0, filter: "blur(18px)", scale: 0.9 },
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-mark",
          start: "top 82%",
          end: "center 42%",
          scrub: 1.1,
        },
      },
    );
  }

  const names = document.querySelector(".about-names");
  if (names) {
    const namesTl = gsap.timeline({
      scrollTrigger: {
        trigger: names,
        start: "top 82%",
        end: "top 48%",
        scrub: 0.85,
      },
    });
    namesTl
      .to(kyo, { opacity: 1, x: 0, duration: 0.9 }, 0)
      .to(yeon, { opacity: 1, x: 0, duration: 0.9 }, 0)
      .to(plus, { opacity: 1, duration: 0.5 }, 0.25);
  }

  if (keys.length) {
    gsap.to(keys, {
      opacity: 1,
      y: 0,
      stagger: 0.14,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-keys",
        start: "top 86%",
        end: "top 58%",
        scrub: 0.8,
      },
    });
  }

  const profileSection = document.querySelector(".about-profile");
  if (profileSection) {
    gsap.set([profileTitle, profilePhoto, profileMeta, profileBlocks], {
      opacity: 0,
      y: 30,
    });

    const profileTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: profileSection,
        start: "top 82%",
        end: "top 36%",
        scrub: 0.9,
      },
    });

    profileTl
      .to(profileTitle, { opacity: 1, y: 0, duration: 0.7 })
      .to(profilePhoto, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
      .to(profileMeta, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.5)
      .to(profileBlocks, { opacity: 1, y: 0, duration: 0.7, stagger: 0.16 }, 0.85);
  }

  if (skillTitle) {
    gsap.set(skillTitle, { opacity: 0, y: 24 });
    gsap.to(skillTitle, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power2.out",
      scrollTrigger: { trigger: skillTitle, start: "top 88%", once: true },
    });
  }

  skillRows.forEach((row) => {
    const head = row.querySelector(".skill-row-head");
    const icons = row.querySelectorAll(".skill-icons li");

    gsap.set([head, icons], { opacity: 0, y: 18 });

    const rowTl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: row,
        start: "top 86%",
        once: true,
      },
    });

    rowTl
      .to(head, { opacity: 1, y: 0, duration: 0.55 })
      .to(icons, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, "-=0.22");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initStickerGroups();
  initAboutPage();
});
