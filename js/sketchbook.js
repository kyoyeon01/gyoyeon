function initSketchbook() {
  const about = document.querySelector("#about");
  const book = document.querySelector("[data-sketchbook]");
  const logo = document.querySelector(".sketchbook-logo");
  const blank = document.querySelector(".sketchbook-blank");
  const intro = document.querySelector("[data-sketch-intro]");
  const openBtn = document.querySelector("[data-about-open]");
  const moreBtn = document.querySelector("[data-about-more]");
  const deck = document.querySelector("[data-about-deck]");
  const overlay = document.querySelector("[data-about-overlay]");
  const notes = gsap.utils.toArray("[data-about-card]");
  const typeLines = gsap.utils.toArray("[data-type-line]");

  if (!about || !book || !deck || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = 0.7;
  const fullTexts = typeLines.map((line) => line.textContent.replace(/\s+/g, " ").trim());

  const shiftX = () => Math.min(320, Math.max(108, window.innerWidth * 0.3));

  const spreadOf = (key) => {
    if (key === "real") return { x: -shiftX(), rotation: -8, scale: 1, zIndex: 3 };
    if (key === "designer") return { x: 0, rotation: 0, scale: 1, zIndex: 4 };
    return { x: shiftX(), rotation: 8, scale: 1, zIndex: 2 };
  };

  const fromY = () => window.innerHeight / 2 - (about.offsetTop + about.offsetHeight / 2);

  gsap.set(book, {
    xPercent: -50,
    yPercent: -50,
    y: fromY,
    rotation: -12,
    scale: 0.85,
    opacity: 1,
    transformOrigin: "50% 50%",
  });
  gsap.set(notes, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 0.8,
    opacity: 0,
    filter: "blur(0px) drop-shadow(0 12px 18px rgba(0, 0, 0, 0.22))",
  });
  gsap.set(openBtn, { opacity: 0, scale: 0.8 });
  gsap.set(logo, { opacity: 1 });
  gsap.set(blank, { opacity: 0 });
  typeLines.forEach((line) => {
    line.textContent = "";
  });

  let cardState = "spread";
  let isBusy = false;
  let focused = null;
  let opened = false;
  let typingStarted = false;
  let typingTimer = 0;

  const setOverlay = (on) => {
    if (!overlay) return;
    overlay.hidden = !on;
  };

  const showMore = (on) => {
    moreBtn?.classList.toggle("is-visible", on);
  };

  const wait = (ms) =>
    new Promise((resolve) => {
      typingTimer = window.setTimeout(resolve, ms);
    });

  const clearTyping = () => {
    window.clearTimeout(typingTimer);
    typeLines.forEach((line) => {
      line.classList.remove("is-typing");
      line.textContent = "";
    });
  };

  const showOpenButton = () => {
    book.classList.add("is-ready");
    openBtn?.classList.add("is-on");
    gsap.to(openBtn, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const startTyping = async () => {
    if (typingStarted || opened) return;
    typingStarted = true;
    gsap.to(logo, { opacity: 0, duration: 0.35, overwrite: "auto" });
    gsap.to(blank, { opacity: 1, duration: 0.35, overwrite: "auto" });
    gsap.set(intro, { opacity: 1 });

    for (const [index, line] of typeLines.entries()) {
      if (!typingStarted) return;
      line.classList.add("is-typing");
      const text = fullTexts[index] || "";
      for (let i = 1; i <= text.length; i += 1) {
        if (!typingStarted) return;
        line.textContent = text.slice(0, i);
        await wait(reduced ? 0 : 36);
      }
      line.classList.remove("is-typing");
      await wait(reduced ? 0 : 120);
    }

    if (typingStarted && !opened) showOpenButton();
  };

  const resetIntro = () => {
    typingStarted = false;
    window.clearTimeout(typingTimer);
    book.classList.remove("is-ready");
    openBtn?.classList.remove("is-on");
    gsap.set(openBtn, { opacity: 0, scale: 0.8 });
    gsap.set(intro, { opacity: 1 });
    gsap.set(logo, { opacity: 1 });
    gsap.set(blank, { opacity: 0 });
    clearTyping();
  };

  const applySpread = () => {
    if (isBusy || cardState === "spread") return;
    isBusy = true;
    cardState = "spread";
    focused = null;
    setOverlay(false);
    notes.forEach((note) => note.classList.remove("is-focus"));

    notes.forEach((note) => {
      const dest = spreadOf(note.dataset.aboutCard);
      gsap.to(note, {
        x: dest.x,
        y: 0,
        rotation: dest.rotation,
        scale: 1,
        opacity: 1,
        zIndex: dest.zIndex,
        filter: "blur(0px) drop-shadow(0 12px 18px rgba(0, 0, 0, 0.22))",
        duration,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => {
          isBusy = false;
        },
      });
    });
  };

  const applyFocus = (note) => {
    if (!deck.classList.contains("is-open") || isBusy) return;
    if (cardState === "focus" && focused === note) return;

    isBusy = true;
    cardState = "focus";
    focused = note;
    setOverlay(true);
    notes.forEach((other) => other.classList.toggle("is-focus", other === note));

    notes.forEach((other) => {
      const dest = spreadOf(other.dataset.aboutCard);
      const isFocus = other === note;
      gsap.to(other, {
        x: isFocus ? 0 : dest.x,
        y: isFocus ? -20 : 0,
        rotation: isFocus ? 0 : dest.rotation,
        scale: isFocus ? 1.45 : 0.8,
        opacity: isFocus ? 1 : 0.4,
        zIndex: isFocus ? 10 : 1,
        filter: isFocus
          ? "blur(0px) drop-shadow(0 28px 20px rgba(0, 0, 0, 0.28)) drop-shadow(0 48px 56px rgba(0, 0, 0, 0.42))"
          : "blur(7px) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.16))",
        duration,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => {
          isBusy = false;
        },
      });
    });
  };

  const unfoldCards = () => {
    if (opened) return;
    opened = true;
    deck.classList.add("is-open");
    cardState = "spread";
    notes.forEach((note) => {
      const dest = spreadOf(note.dataset.aboutCard);
      gsap.to(note, {
        x: dest.x,
        y: 0,
        rotation: dest.rotation,
        scale: 1,
        opacity: 1,
        zIndex: dest.zIndex,
        filter: "blur(0px) drop-shadow(0 12px 18px rgba(0, 0, 0, 0.22))",
        duration,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => showMore(true),
      });
    });
  };

  const foldCards = () => {
    if (!opened) return;
    opened = false;
    isBusy = false;
    focused = null;
    cardState = "spread";
    setOverlay(false);
    showMore(false);
    deck.classList.remove("is-open");
    notes.forEach((note) => note.classList.remove("is-focus"));
    gsap.to(notes, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8,
      opacity: 0,
      filter: "blur(0px)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const openAboutCards = () => {
    if (opened || isBusy) return;
    isBusy = true;
    book.classList.remove("is-ready");
    openBtn?.classList.remove("is-on");
    gsap.to(intro, { opacity: 0, duration: 0.25, overwrite: "auto" });
    gsap.to(book, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
      onComplete: () => {
        isBusy = false;
        unfoldCards();
      },
    });
  };

  if (reduced) {
    gsap.set(book, { y: 0, rotation: 0, scale: 1.1, opacity: 1 });
    gsap.set(logo, { opacity: 0 });
    gsap.set(blank, { opacity: 1 });
    typeLines.forEach((line, index) => {
      line.textContent = fullTexts[index];
    });
    showOpenButton();
  } else {
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          end: "top top",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
      .to(book, {
        y: 0,
        rotation: 0,
        scale: 1.1,
        duration: 1,
      });

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: about,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.18) {
              if (opened) {
                foldCards();
                gsap.to(book, { opacity: 1, scale: 1.1, duration: 0.35, overwrite: "auto" });
              }
              if (typingStarted) resetIntro();
              return;
            }

            if (self.progress >= 0.42) startTyping();
          },
        },
      })
      .to({}, { duration: 1 });
  }

  openBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    openAboutCards();
  });

  notes.forEach((note) => {
    note.addEventListener("click", (event) => {
      event.stopPropagation();
      applyFocus(note);
    });
  });

  overlay?.addEventListener("click", applySpread);
  deck.addEventListener("click", (event) => {
    if (event.target === deck) applySpread();
  });

  moreBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    about.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("DOMContentLoaded", initSketchbook);
