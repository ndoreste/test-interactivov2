document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.className = "intro-overlay";
  overlay.innerHTML = `
    <div class="intro-content">
      <h1>TESTS INTERACTIVOS</h1>
      <p>1º ASIR</p>
    </div>
  `;

  document.body.prepend(overlay);
  document.body.classList.add("intro-active");

  setTimeout(() => {
    overlay.classList.add("intro-hide");
    document.body.classList.remove("intro-active");
  }, 2400);

  setTimeout(() => {
    overlay.remove();
  }, 3400);
});
