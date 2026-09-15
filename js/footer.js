const footerSocials = [
  {
    name: "Notion",
    image: "./assets/images/icon_notion.svg",
    url: "#",
  },
  {
    name: "GitHub",
    image: "./assets/images/icon_github.svg",
    url: "#",
  },
  {
    name: "Behance",
    image: "./assets/images/icon_behance.svg",
    url: "#",
  },
];

function initFooter() {
  const list = document.querySelector("[data-footer-socials]");
  if (!list) return;

  for (const item of footerSocials) {
    const link = document.createElement("a");
    link.className = "footer-social";
    link.href = item.url;
    link.setAttribute("aria-label", item.name);

    if (item.url === "#") {
      link.addEventListener("click", (event) => event.preventDefault());
    }

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    img.draggable = false;

    link.appendChild(img);
    list.appendChild(link);
  }
}

document.addEventListener("DOMContentLoaded", initFooter);
