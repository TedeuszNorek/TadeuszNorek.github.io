const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const { target } = entry;
        const delay = target.dataset.delay;

        if (delay) {
          target.style.transitionDelay = `${delay}ms`;
        }

        target.classList.add("is-visible");
        observer.unobserve(target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const masonryGrid = document.querySelector("[data-masonry]");

if (masonryGrid) {
  const cards = Array.from(masonryGrid.querySelectorAll(".gallery-card"));

  const layoutMasonry = () => {
    if (window.innerWidth <= 720) {
      cards.forEach((card) => {
        card.style.gridRowEnd = "";
      });
      return;
    }

    const gridStyles = window.getComputedStyle(masonryGrid);
    const rowGap = parseFloat(gridStyles.gap);
    const rowHeight = parseFloat(gridStyles.gridAutoRows);

    cards.forEach((card) => {
      const inner = card.querySelector(".gallery-card__button");

      if (!inner) {
        return;
      }

      const itemHeight = inner.getBoundingClientRect().height;
      const span = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      card.style.gridRowEnd = `span ${span}`;
    });
  };

  const queuedLayout = () => window.requestAnimationFrame(layoutMasonry);

  window.addEventListener("load", queuedLayout);
  window.addEventListener("resize", queuedLayout);

  cards.forEach((card) => {
    const image = card.querySelector("img");

    if (!image) {
      return;
    }

    if (image.complete) {
      queuedLayout();
    } else {
      image.addEventListener("load", queuedLayout, { once: true });
    }
  });
}

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = lightbox?.querySelector(".lightbox__image");
const lightboxTitle = lightbox?.querySelector("#lightbox-title");
const lightboxKicker = lightbox?.querySelector("#lightbox-kicker");
const lightboxDescription = lightbox?.querySelector("#lightbox-description");
const lightboxClosers = lightbox?.querySelectorAll("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");

let lastTrigger = null;

const openLightbox = (trigger) => {
  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxKicker) {
    return;
  }

  lastTrigger = trigger;
  lightboxImage.src = trigger.dataset.image || "";
  lightboxImage.alt = trigger.querySelector("img")?.alt || "";
  lightboxTitle.textContent = trigger.dataset.title || "";
  lightboxKicker.textContent = trigger.dataset.cuisine || "";
  lightboxDescription.textContent = trigger.dataset.description || "";
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
};

const closeLightbox = () => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");

  if (lightboxImage) {
    lightboxImage.src = "";
  }

  if (lastTrigger) {
    lastTrigger.focus();
  }
};

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger));
});

lightboxClosers?.forEach((closer) => {
  closer.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
