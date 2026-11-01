const products = [
  { id: "ER-02", category: "earrings", name: "18 Karat Gold Earring", karat: 18, detail: "Classic round hoop", weight: "2.5 grams", image: "assets/earrings-hoops-2-5g.jpeg", alt: "Pair of 18 Karat gold hoop earrings; scale reads 2.5 grams" },
  { id: "ER-05", category: "earrings", name: "18 Karat Gold Earring", karat: 18, detail: "Stud earring", weight: "2.1 grams", image: "assets/earrings-stud-2-1g.jpeg", alt: "Pair of 18 Karat gold stud earrings; scale reads 2.1 grams" },
  { id: "ER-08", category: "earrings", name: "18 Karat Gold Earring", karat: 18, detail: "Sculptural form", weight: "1.5 grams", image: "assets/earrings-sculptural-1-5g.jpeg", alt: "18 Karat sculptural gold earring; scale reads 1.5 grams" },
  { id: "ER-12", category: "earrings", name: "18 Karat Gold Earring", karat: 18, detail: "Patterned round hoop", weight: "2.6 grams", image: "assets/earrings-pattern-hoops-2-6g.jpeg", alt: "Pair of 18 Karat patterned gold hoop earrings; scale reads 2.6 grams" },
  { id: "NK-01", category: "necklaces", name: "18 Karat Twist Gold Necklace", karat: 18, detail: "Twist design", weight: "23.1 grams", image: "assets/twist-necklace-23-1g.png", alt: "18 Karat twist gold necklace; scale reads 23.1 grams" },
  { id: "NK-02", category: "necklaces", name: "18 Karat Twist Gold Necklace", karat: 18, detail: "Twist design", weight: "22.9 grams", image: "assets/twist-necklace-22-9g.png", alt: "Separate 18 Karat twist gold necklace; scale reads 22.9 grams" },
  { id: "NK-FR-01", category: "necklaces", name: "18 Karat Franco Gold Necklace", karat: 18, detail: "Franco design · no pendant", weight: "2.3 grams", image: "assets/franco-necklace-2-3g.png", alt: "18 Karat Franco gold necklace without a pendant; scale reads 2.3 grams" },
  { id: "NK-FR-02", category: "necklaces", name: "18 Karat Franco Gold Necklace", karat: 18, detail: "Franco design · no pendant", weight: "5.0 grams", image: "assets/franco-necklace-5g.png", alt: "Separate 18 Karat Franco gold necklace without a pendant; scale reads 5 grams" }
];

// Set this to the business WhatsApp number in international digits only, without + or spaces.
const BUSINESS_WHATSAPP = "2349026859689";
const whatsAppIcon = '<svg class="icon whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.241-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.711.226 1.358.194 1.87.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.832 9.832 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884 2.635 0 5.1 1.026 6.96 2.888a9.825 9.825 0 0 1 2.885 6.994c-.002 5.45-4.437 9.884-9.89 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.158 11.892c0 2.096.547 4.142 1.588 5.946L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.49-8.413Z"/></svg>';

const grid = document.querySelector("#product-grid");
const dialog = document.querySelector("#contact-dialog");
const messageField = document.querySelector("#message-text");
let activeFilter = "all";
let currentPage = 0;
const PAGE_SIZE = 4;
let revealObserver;

function renderProducts() {
  const visible = products.filter((product) => activeFilter === "all" || product.category === activeFilter);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, pageCount - 1);
  const start = currentPage * PAGE_SIZE;
  const pageItems = visible.slice(start, start + PAGE_SIZE);
  grid.innerHTML = pageItems.map((product, index) => `
    <article class="product-card" role="group" aria-roledescription="slide" aria-label="${product.name}, ${start + index + 1} of ${visible.length}" data-reveal style="--reveal-delay:${index * 70}ms">
      <div class="product-image"><img src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async" /></div>
      <div class="product-meta"><h3 class="product-title">${product.name}</h3><div class="product-facts"><span>${product.detail}</span><span>${product.weight}</span></div><div class="product-price"><strong>Price: ask for today’s rate</strong><span>Stock: confirm availability</span></div><button class="product-ask" type="button" data-product="${product.id}">${whatsAppIcon}<span>Check price &amp; stock</span></button></div>
    </article>`).join("");
  const carouselStatus = document.querySelector("#carousel-status");
  if (carouselStatus) {
    const categoryName = activeFilter === "all" ? "pieces" : activeFilter;
    carouselStatus.textContent = visible.length > 0
      ? `Showing ${start + 1}–${start + pageItems.length} of ${visible.length} ${categoryName}`
      : `No ${categoryName} found`;
  }
  const pages = document.querySelector("#carousel-pages");
  pages.innerHTML = Array.from({ length: pageCount }, (_, page) => `<button class="carousel-page${page === currentPage ? " is-active" : ""}" type="button" data-page="${page}" aria-label="Show collection page ${page + 1}" aria-current="${page === currentPage ? "page" : "false"}">${page + 1}</button>`).join("");
  pages.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => {
    currentPage = Number(button.dataset.page);
    renderProducts();
  }));
  const previous = document.querySelector('[data-carousel-step="-1"]');
  const next = document.querySelector('[data-carousel-step="1"]');
  previous.disabled = currentPage === 0;
  next.disabled = currentPage >= pageCount - 1;
  document.querySelector('[data-filter="all"] span').textContent = products.length;
  document.querySelector('[data-filter="earrings"] span').textContent = products.filter((item) => item.category === "earrings").length;
  document.querySelector('[data-filter="necklaces"] span').textContent = products.filter((item) => item.category === "necklaces").length;
  grid.querySelectorAll("[data-product]").forEach((button) => button.addEventListener("click", () => openInquiry(button.dataset.product)));
  observeRevealElements(grid);
}

document.querySelectorAll("[data-carousel-step]").forEach((button) => button.addEventListener("click", () => {
  const visible = products.filter((product) => activeFilter === "all" || product.category === activeFilter);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  currentPage = Math.max(0, Math.min(pageCount - 1, currentPage + Number(button.dataset.carouselStep)));
  renderProducts();
}));

function observeRevealElements(root = document) {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!revealObserver) {
    document.body.classList.add("motion-ready");
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  }
  root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => revealObserver.observe(element));
}

let scrollFrame = 0;
function updateScrollMotion() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    document.querySelector(".scroll-progress span").style.transform = `scaleX(${progress})`;
    document.querySelector(".floating-contact").classList.toggle("is-visible", window.scrollY > 520);
    scrollFrame = 0;
  });
}

function openInquiry(productId = "", intent = "general") {
  const product = products.find((item) => item.id === productId);
  const requests = {
    general: "I’d like to ask about your gold jewelry and gold bars. Please share current rates, availability, and delivery options.",
    rates: "Please share today’s selling rates per gram for 18 Karat, 21 Karat, 22 Karat, and 24 Karat gold.",
    visit: "I’d like to arrange an in-person visit to your Lagos location. Please share the location details and a suitable time.",
    trust: "I have a question about Karat, item weight, hallmark details, or the purchase receipt."
  };
  const text = product
    ? `Hello Goldplugdami, I’m interested in the ${product.name} (${product.weight}; ${product.detail}). Please confirm today’s calculated price, availability, and delivery options. Product reference: ${product.id}.`
    : `Hello Goldplugdami, ${requests[intent] || requests.general}`;
  const inquiryLabel = product
    ? `${product.name} · ${product.weight}`
    : intent === "visit"
      ? "Lagos shop visit"
      : intent === "rates"
        ? "Today’s Karat rates"
        : intent === "trust"
          ? "Karat, weight, and hallmark details"
          : "Gold jewelry and gold bars";
  document.querySelector("#dialog-product").textContent = inquiryLabel;
  messageField.value = text;
  document.querySelector("#copy-status").textContent = "";
  if (BUSINESS_WHATSAPP) {
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    return;
  }
  dialog.showModal();
}

document.querySelectorAll(".js-whatsapp").forEach((button) => {
  button.querySelectorAll(".icon").forEach((icon) => icon.remove());
  button.insertAdjacentHTML("afterbegin", whatsAppIcon);
  button.addEventListener("click", () => openInquiry("", button.dataset.intent || "general"));
});
document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  currentPage = 0;
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const selected = chip === button;
    chip.classList.toggle("is-active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  });
  renderProducts();
}));
document.querySelector("#copy-message").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(messageField.value);
    document.querySelector("#copy-status").textContent = "Inquiry copied. Paste it into your WhatsApp chat with Goldplugdami.";
  } catch {
    messageField.select();
    document.querySelector("#copy-status").textContent = "Select and copy the message, then paste it into your WhatsApp chat with Goldplugdami.";
  }
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const nav = document.querySelector("#site-nav");
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  button.querySelector(".menu-label").textContent = isOpen ? "Menu" : "Close";
  nav.classList.toggle("is-open", !isOpen);
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      const menuToggle = document.querySelector(".menu-toggle");
      const siteNav = document.querySelector("#site-nav");
      if (menuToggle && siteNav && siteNav.classList.contains("is-open")) {
        menuToggle.setAttribute("aria-expanded", "false");
        const menuLabel = menuToggle.querySelector(".menu-label");
        if (menuLabel) menuLabel.textContent = "Menu";
        siteNav.classList.remove("is-open");
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    }
  });
});

const navLinks = [...document.querySelectorAll("#site-nav a")];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${current.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .15, .4, .7] });
  navSections.forEach((section) => navObserver.observe(section));
}
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
observeRevealElements();
window.addEventListener("scroll", updateScrollMotion, { passive: true });
updateScrollMotion();

if ("IntersectionObserver" in window) {
  const footerContactObserver = new IntersectionObserver((entries) => {
    const footerVisible = entries.some((entry) => entry.isIntersecting);
    const floatingContact = document.querySelector(".floating-contact");
    floatingContact.classList.toggle("is-hidden-near-footer", footerVisible);
    floatingContact.setAttribute("aria-hidden", String(footerVisible));
    floatingContact.tabIndex = footerVisible ? -1 : 0;
  });
  footerContactObserver.observe(document.querySelector(".site-footer"));
}

// Let the primary-button highlight follow a mouse or trackpad pointer.
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".button-primary").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      button.style.setProperty("--glass-x", `${x}%`);
      button.style.setProperty("--glass-y", `${y}%`);
    }, { passive: true });
  });
}
