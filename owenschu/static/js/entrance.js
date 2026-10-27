// Page entrance sequence: h1 scramble-decodes in place, then subtitle,
// project boxes, and nav bar reveal in turn.
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const SCRAMBLE_CHARS = "*&^$#@?!";

  function scrambleReveal(el) {
    return new Promise((resolve) => {
      const finalText = el.getAttribute("data-text") || el.textContent;
      const chars = Array.from(finalText);
      const FRAME_MS = 75;
      const REVEAL_STAGGER = 2;
      let frame = 0;
      const lockFrame = chars.map((_, i) => i * REVEAL_STAGGER + 4);
      const maxFrame = Math.max(...lockFrame) + 1;

      const timer = setInterval(() => {
        let out = "";
        for (let i = 0; i < chars.length; i++) {
          const target = chars[i];
          if (target === " ") { out += " "; continue; }
          out += frame >= lockFrame[i]
            ? target
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        el.textContent = out;
        frame++;
        if (frame > maxFrame) {
          el.textContent = finalText;
          clearInterval(timer);
          resolve();
        }
      }, FRAME_MS);
    });
  }

  const heroTitle = document.querySelector(".hero__title");
  const heroSubtitle = document.querySelector(".hero__subtitle");
  const projectBoxes = document.querySelectorAll(".project-box");
  const navBar = document.querySelector(".nav-bar");

  if (prefersReducedMotion) {
    heroTitle.textContent = heroTitle.getAttribute("data-text") || heroTitle.textContent;
    heroSubtitle.classList.add("is-visible");
    projectBoxes.forEach((box) => box.classList.add("is-visible"));
    navBar.classList.add("is-visible");
  } else {
    scrambleReveal(heroTitle)
      .then(() => {
        heroSubtitle.classList.add("is-visible");
        return wait(600);
      })
      .then(() => {
        projectBoxes.forEach((box, i) => {
          setTimeout(() => box.classList.add("is-visible"), i * 120);
        });
        return wait((projectBoxes.length - 1) * 120 + 450);
      })
      .then(() => {
        navBar.classList.add("is-visible");
      });
  }
})();
