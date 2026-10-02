const footerSocials = [
  {
    name: "Notion",
    image: "icon_notion.svg",
    url: "https://app.notion.com/p/2021-5d9d2bc885bb42379a82197e64d5eafb?source=copy_link",
  },
  {
    name: "GitHub",
    image: "icon_github.svg",
    url: "https://github.com/kyoyeon01",
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
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", item.name);

    const img = document.createElement("img");
    img.src = new URL(item.image, assetBase).href;
    img.alt = "";
    img.draggable = false;

    link.appendChild(img);
    list.appendChild(link);
  }
}

document.addEventListener("DOMContentLoaded", initFooter);
