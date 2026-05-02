document.addEventListener("DOMContentLoaded", () => {
  // Si la intro ya se mostró en esta sesión, no se vuelve a ejecutar
  if (sessionStorage.getItem("introShown")) return;

  // Marcamos la intro como mostrada
  sessionStorage.setItem("introShown", "true");

  // Crear overlay de la intro
  const overlay = document.createElement("div");
  overlay.className = "intro-overlay";

  overlay.innerHTML = `
    <div class="intro-content">
      <h1>TESTS INTERACTIVOS</h1>
      <p>1º ASIR</p>
    </div>
  `;

  // Insertar al inicio del body
  document.body.prepend(overlay);

  // Bloquear scroll mientras dura la intro
  document.body.classList.add("intro-active");

  // Tiempo antes de empezar el fade out
  setTimeout(() => {
    overlay.classList.add("intro-hide");
    document.body.classList.remove("intro-active");
  }, 2600);

  // Eliminar completamente el overlay después del fade
  setTimeout(() => {
    overlay.remove();
  }, 3600);
});
