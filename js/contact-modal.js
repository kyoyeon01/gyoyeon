const CONTACT_INFO = {
  email: "lee.gyoyeon@gmail.com",
  phone: "010-2427-0502",
  message: "작업 및 협업 문의는 아래 연락처로 부탁드립니다.",
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildContactModal() {
  const root = document.createElement("div");
  root.className = "contact-modal";
  root.hidden = true;
  root.setAttribute("aria-hidden", "true");

  root.innerHTML = `
    <div class="contact-modal-overlay" data-contact-overlay></div>
    <div class="contact-modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" tabindex="-1">
      <button class="contact-modal-close" type="button" data-contact-close aria-label="닫기">
        <span></span>
        <span></span>
      </button>
      <h2 id="contact-modal-title">CONTACT</h2>
      <p class="contact-modal-copy">${CONTACT_INFO.message}</p>
      <dl class="contact-modal-list">
        <div>
          <dt>Email</dt>
          <dd><a href="mailto:${CONTACT_INFO.email}">${CONTACT_INFO.email}</a></dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd><a href="tel:${CONTACT_INFO.phone.replace(/-/g, "")}">${CONTACT_INFO.phone}</a></dd>
        </div>
      </dl>
    </div>
  `;

  document.body.appendChild(root);
  return root;
}

function initContactModal() {
  const root = buildContactModal();
  const overlay = root.querySelector("[data-contact-overlay]");
  const card = root.querySelector(".contact-modal-card");
  const closeBtn = root.querySelector("[data-contact-close]");
  let open = false;
  let animating = false;

  const contactLinks = Array.from(
    document.querySelectorAll(".hero-nav a, .hero-menu-panel a"),
  ).filter((link) => link.textContent.trim() === "CONTACT");

  function setOpen(next) {
    if (animating || next === open) return;
    open = next;
    animating = true;

    const reduced = prefersReducedMotion() || typeof gsap === "undefined";

    if (next) {
      root.hidden = false;
      root.setAttribute("aria-hidden", "false");
      document.body.classList.add("contact-modal-open");

      if (reduced) {
        overlay.style.opacity = "1";
        card.style.opacity = "1";
        card.style.transform = "none";
        animating = false;
        card.focus();
        return;
      }

      gsap.set(overlay, { opacity: 0 });
      gsap.set(card, { opacity: 0, y: 20, scale: 0.95 });
      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            animating = false;
            card.focus();
          },
        })
        .to(overlay, { opacity: 1, duration: 0.28 }, 0)
        .to(card, { opacity: 1, y: 0, scale: 1, duration: 0.38 }, 0.04);
      return;
    }

    const finishClose = () => {
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("contact-modal-open");
      animating = false;
    };

    if (reduced) {
      finishClose();
      return;
    }

    gsap
      .timeline({
        defaults: { ease: "power2.in" },
        onComplete: finishClose,
      })
      .to(card, { opacity: 0, y: 20, scale: 0.95, duration: 0.22 }, 0)
      .to(overlay, { opacity: 0, duration: 0.22 }, 0);
  }

  contactLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setOpen(true);
    });
  });

  closeBtn.addEventListener("click", () => setOpen(false));
  overlay.addEventListener("click", () => setOpen(false));
}

document.addEventListener("DOMContentLoaded", initContactModal);
