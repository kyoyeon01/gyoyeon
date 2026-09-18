const footerSocials = [
  {
    name: "Notion",
    image: "icon_notion.svg",
    url: "#",
  },
  {
    name: "GitHub",
    image: "icon_github.svg",
    url: "#",
  },
  {
    name: "Behance",
    image: "icon_behance.svg",
    url: "#",
  },
];

function initFooter() {
  const list = document.querySelector("[data-footer-socials]");
  if (!list) return;
  const logo = document.querySelector(".footer-logo img");
  const assetBase = logo
    ? new URL(".", logo.src)
    : new URL("./assets/images/", document.baseURI);

  for (const item of footerSocials) {
    const link = document.createElement("a");
    link.className = "footer-social";
    link.href = item.url;
    link.setAttribute("aria-label", item.name);

    if (item.url === "#") {
      link.addEventListener("click", (event) => event.preventDefault());
    }

    const img = document.createElement("img");
    img.src = new URL(item.image, assetBase).href;
    img.alt = "";
    img.draggable = false;

    link.appendChild(img);
    list.appendChild(link);
  }
}

document.addEventListener("DOMContentLoaded", initFooter);
