// Page entrance sequence + Godot engine boot, must run after #canvas and the
// page content exist in the DOM. godotexport.js is injected dynamically below
// (only when the smoke background actually runs), so it's never fetched at
// all on reduced-motion / narrow-viewport visits.
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileViewport = window.innerWidth < 720;

  // The Godot project is internally named "godot_testing" and the engine
  // calls document.title = <that name> during boot (via OS.set_window_title),
  // silently clobbering our real <title>. Watch for that and revert it
  // every time it happens, rather than fighting a one-off race with it.
  const SITE_TITLE = document.title;
  const titleEl = document.querySelector("title");
  if (titleEl) {
    new MutationObserver(() => {
      if (document.title !== SITE_TITLE) document.title = SITE_TITLE;
    }).observe(titleEl, { childList: true });
  }

  // Same trick, same reason: Godot's OS layer also sets the favicon at
  // boot (godot_js_display_window_icon_set looks up a link by the id
  // "-gd-engine-icon" and either rewrites its href or creates a new one
  // if it's missing), clobbering our real favicon with the Godot robot
  // icon. Re-assert ours on every change instead of relying on load order.
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    const SITE_FAVICON = faviconLink.href;
    new MutationObserver(() => {
      document.querySelectorAll('link[rel="icon"]').forEach((link) => {
        if (link.href !== SITE_FAVICON) link.href = SITE_FAVICON;
      });
    }).observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ---- Text scramble/decode effect, used only by the hero heading now ----
  const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function scrambleReveal(el) {
    return new Promise((resolve) => {
      const finalText = el.getAttribute("data-text") || el.textContent;
      const chars = Array.from(finalText);
      const FRAME_MS = 35;
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

  // ---- Page entrance sequence: h1 mismatch-decode -> subtitle fade ->
  // project boxes fade -> nav bar slides down. No loading screen --
  // this runs immediately and is entirely independent of the Godot
  // background's own load state. ----
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

  const canvas = document.getElementById("canvas");

  // Skip the Godot download entirely on reduced-motion or narrow/mobile
  // viewports -- the effect is barely visible there and isn't worth a
  // 37MB fetch. Falls back to a plain CSS gradient.
  if (prefersReducedMotion || isMobileViewport) {
    canvas.classList.add("is-static-fallback");
    return;
  }

  // ---- Godot engine boot (mirrors the default export shell, minus its own UI) ----
  const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"emscriptenPoolSize":8,"ensureCrossOriginIsolationHeaders":true,"executable":"/godot-export/godotexport","experimentalVK":false,"fileSizes":{"/godot-export/godotexport.pck":160092,"/godot-export/godotexport.wasm":37902138},"focusCanvas":false,"gdextensionLibs":[],"godotPoolSize":4};
  const GODOT_THREADS_ENABLED = false;

  // godotexport.js (the Emscripten loader glue) is only fetched once
  // we've decided the background is actually going to run.
  const engineScript = document.createElement("script");
  engineScript.src = "/godot-export/godotexport.js";
  engineScript.onerror = function () {
    console.error("Couldn't load the Godot background engine.");
    canvas.classList.add("is-static-fallback");
  };
  engineScript.onload = function () {
    const missing = Engine.getMissingFeatures({ threads: GODOT_THREADS_ENABLED });

    if (missing.length !== 0) {
      console.warn("Godot background skipped, missing features:", missing);
      canvas.classList.add("is-static-fallback");
      return;
    }

    const engine = new Engine(GODOT_CONFIG);
    engine.startGame().catch((err) => {
      console.error(err);
      canvas.classList.add("is-static-fallback");
    });
  };
  document.body.appendChild(engineScript);
})();
