// Se ejecuta al instante en cuanto el navegador descarga el archivo
(function validarSesion() {
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  const urlParams = new URLSearchParams(window.location.search);
  const currentUrlUserId = urlParams.get("user_id");

  if (!token || !storedUserId) {
    window.location.href = "/login";
  } else if (currentUrlUserId && currentUrlUserId !== storedUserId) {
    window.location.href = `/dashboard?user_id=${storedUserId}`;
  }
})();

// Lógica para manipular el DOM cuando termine de cargar
document.addEventListener("DOMContentLoaded", () => {
  // Peticiones fetch a la API con Bearer token...
});
