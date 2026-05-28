/* ═══════════════════════════════════════════════════════════════
   MATRIX BLUE INTRO — respeta identidad azul de la web
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  /* ── 1. CANVAS MATRIX ── */
  const canvas  = document.createElement("canvas");
  const ctx     = canvas.getContext("2d");
  const overlay = document.createElement("div");

  overlay.id        = "matrix-overlay";
  overlay.className = "intro-overlay";

  /* Title + bar (hidden initially, reveals mid-animation) */
  overlay.innerHTML = `
    <canvas id="matrix-canvas"></canvas>
    <div class="intro-content" id="intro-content">
      <h1 class="neon-title" id="neon-title">TESTS<br>INTERACTIVOS</h1>
      <div class="intro-bar"><div class="intro-bar-fill"></div></div>
      <p>1º ASIR · 2025–2026</p>
    </div>
  `;

  document.body.prepend(overlay);
  document.body.classList.add("intro-active");

  /* ── 2. SETUP CANVAS ── */
  const cv = overlay.querySelector("#matrix-canvas");
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  const cx  = cv.getContext("2d");

  const COLS     = Math.floor(cv.width  / 20);
  const ROWS     = Math.floor(cv.height / 20);
  const FONT_SZ  = 14;
  const CHARS    = "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/={}[];:+-*#@!?";

  /* y-position of falling head per column */
  const drops = Array.from({ length: COLS }, () =>
    -Math.floor(Math.random() * ROWS * 1.5)
  );

  /* which columns have "dissolved" already */
  const dissolved = new Set();

  /* Blue palette */
  const COLORS = {
    head:  "#00f7ff",
    trail: ["#00dcff","#0099cc","#005f80","#003348"],
    fade:  "rgba(3,6,15,0.22)",   /* bg with alpha for trail fade */
  };

  let frame = 0;
  let raf;

  function drawMatrix() {
    frame++;

    /* semi-transparent fill for ghost trail */
    cx.fillStyle = COLORS.fade;
    cx.fillRect(0, 0, cv.width, cv.height);

    cx.font = `${FONT_SZ}px "MM", monospace`;

    for (let col = 0; col < COLS; col++) {
      if (dissolved.has(col)) continue;

      const x    = col * 20;
      const y    = drops[col] * 20;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      /* glowing head */
      cx.shadowBlur  = 12;
      cx.shadowColor = COLORS.head;
      cx.fillStyle   = COLORS.head;
      cx.fillText(char, x, y);

      /* trail behind head (previous frames already painted darker) */
      /* reset shadow for normal text */
      cx.shadowBlur = 0;

      /* advance drop */
      drops[col]++;

      /* reset when it falls off screen */
      if (drops[col] * 20 > cv.height && Math.random() > 0.975) {
        drops[col] = -Math.floor(Math.random() * ROWS * 0.5);
      }
    }

    raf = requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  /* ── 3. TITLE REVEAL at 1.4s ── */
  const titleEl   = overlay.querySelector("#intro-content");
  const neonTitle = overlay.querySelector("#neon-title");

  setTimeout(() => {
    titleEl.classList.add("visible");
    startGlitch(neonTitle);
  }, 1400);

  /* ── 4. PROGRESSIVE COLUMN WIPE at 3.4s ── */
  /* Matrix runs freely for ~3.4s, then columns dissolve over ~1.1s */
  setTimeout(() => {
    const totalWipeMs = 1100; /* total time for all columns to dissolve */
    const colOrder    = shuffle([...Array(COLS).keys()]);
    const stepMs      = totalWipeMs / colOrder.length * 2; /* ~2 cols per tick */
    let ci = 0;

    const wipeInterval = setInterval(() => {
      const batch = 2;
      for (let b = 0; b < batch && ci < colOrder.length; b++, ci++) {
        const col = colOrder[ci];
        dissolved.add(col);
        /* fade column out softly instead of hard clear */
        for (let row = 0; row < ROWS + 2; row++) {
          cx.clearRect(col * 20, row * 20, 20, 20);
        }
      }

      if (ci >= colOrder.length) {
        clearInterval(wipeInterval);
        cx.clearRect(0, 0, cv.width, cv.height);
        setTimeout(finishIntro, 500);
      }
    }, stepMs);

  }, 3400);

  /* ── 5. FADE OUT overlay — slow and smooth ── */
  function finishIntro() {
    cancelAnimationFrame(raf);
    overlay.classList.add("intro-hide");
    document.body.classList.remove("intro-active");
    setTimeout(() => overlay.remove(), 1400);
  }

  /* ── HELPERS ── */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startGlitch(el) {
    const original = el.innerText;
    let ticks = 0;
    const id = setInterval(() => {
      ticks++;
      if (ticks > 18) { el.innerText = original; clearInterval(id); return; }
      el.innerText = original.split("").map(c =>
        c === "\n" || Math.random() > .35
          ? c
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join("");
    }, 55);
  }

  /* ── resize ── */
  window.addEventListener("resize", () => {
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;
  }, { once: true });

  /* ── 6. STAGGERED CARD ENTRANCE ── */
  const cards = document.querySelectorAll(".module-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${0.055 * i + 0.12}s`;
  });

  /* ── 7. GLITCH data-text for hero h1 ── */
  const heroH1 = document.querySelector(".hero h1");
  if (heroH1) heroH1.setAttribute("data-text", heroH1.textContent);
});
