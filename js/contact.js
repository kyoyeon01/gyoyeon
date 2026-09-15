const CONTACT_EMAIL = "lee.gyoyeon@gmail.com";

const contacts = [
  {
    image: "./assets/images/contact1.png",
    rotate: -7,
  },
  {
    image: "./assets/images/contact2.png",
    rotate: 6,
  },
  {
    image: "./assets/images/contact3.png",
    rotate: -4,
  },
];

function initContact() {
  const stage = document.querySelector("[data-contact-flyers]");
  if (!stage) return;

  for (const item of contacts) {
    const link = document.createElement("a");
    link.className = "contact-flyer";
    link.href = `mailto:${CONTACT_EMAIL}`;
    link.setAttribute("aria-label", `${CONTACT_EMAIL}로 메일 보내기`);
    link.style.setProperty("--tilt", `${item.rotate}deg`);

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    img.draggable = false;

    link.appendChild(img);
    stage.appendChild(link);
  }
}

document.addEventListener("DOMContentLoaded", initContact);
