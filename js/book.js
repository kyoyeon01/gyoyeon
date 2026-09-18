function initBook() {
  const about = document.querySelector("#about");
  const stage = document.querySelector("[data-book-stage]");
  const book = document.querySelector("[data-book]");

  if (
    !about ||
    !stage ||
    !book ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const pages = gsap.utils.toArray(".book__page", book);
  const flippablePages = pages.slice(0, -1);
  const pageCount =
    Number.parseFloat(getComputedStyle(about).getPropertyValue("--page-count")) ||
    8;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const heroOffset = () =>
    window.innerHeight / 2 - (about.offsetTop + about.offsetHeight / 2);

  gsap.set(stage, {
    xPercent: -50,
    yPercent: -50,
    y: reducedMotion ? 0 : heroOffset,
    scale: reducedMotion ? 1 : 1.14,
    transformOrigin: "50% 50%",
  });

  gsap.set(book, {
    y: reducedMotion ? 0 : -5,
    rotateY: reducedMotion ? 0 : -4,
    rotateZ: reducedMotion ? 0 : -10,
  });

  pages.forEach((page, index) => {
    gsap.set(page, {
      z: index === 0 ? 13 : -index,
      rotateY: 0,
    });
  });

  if (reducedMotion) {
    const aboutHeading = about.querySelector("[data-about-heading]");
    if (aboutHeading) gsap.set(aboutHeading, { opacity: 1, y: 0 });
    return;
  }

  const floating = gsap.to(book, {
    y: 7,
    rotateY: -2,
    rotateZ: -8,
    duration: 3.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: about,
        start: "top 99%",
        end: "top top",
        scrub: 1.2,
        invalidateOnRefresh: true,
        onEnter: () => floating.pause(),
        onEnterBack: () => floating.pause(),
        onLeaveBack: () => floating.restart(),
      },
    })
    .to(stage, {
      y: 0,
      scale: 1,
    })
    .to(
      book,
      {
        y: 0,
        rotateY: 0,
        rotateZ: 0,
      },
      0,
    );

  const aboutHeading = about.querySelector("[data-about-heading]");
  if (aboutHeading) {
    gsap.set(aboutHeading, { opacity: 0, y: 30 });
    gsap.to(aboutHeading, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power2.out",
      scrollTrigger: {
        trigger: about,
        start: "top top",
        toggleActions: "play none none reverse",
      },
    });
  }

  const flipTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: about,
      start: "top top",
      end: () => `+=${window.innerHeight * (0.45 + pageCount * 0.55)}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // The empty section keeps the closed book still before the first cover opens.
  flipTimeline.to({}, { duration: 0.8 });

  flippablePages.forEach((page, index) => {
    const fullRotation = -(180 - index / 2);
    const flipStart = flipTimeline.duration();

    flipTimeline
      .to(page, {
        rotateY: fullRotation / 2,
        duration: 0.5,
      })
      .set(page, {
        z: index === 0 ? -13 : index,
      })
      .to(page, {
        rotateY: fullRotation,
        duration: 0.5,
      });

    if (index === 0) {
      flipTimeline.to(
        stage,
        {
          xPercent: 0,
          duration: 1,
        },
        flipStart,
      );
    }
  });

  flipTimeline.to({}, { duration: 0.35 });
}

document.addEventListener("DOMContentLoaded", initBook);
