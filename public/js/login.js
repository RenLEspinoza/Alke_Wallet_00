// Lógica para manejar el formulario de inicio de sesión

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  // Obtenemos el formulario por su ID y agregamos un listener para el evento submit
  e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario (recargar la página)

  const formData = {
    email: document.getElementById("email").value, // Obtenemos el valor del campo de email
    password: document.getElementById("password").value, // Obtenemos el valor del campo de password
  };

  try {
    const response = await fetch("/login", {
      // Hacemos una petición POST al endpoint /login
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Guardar el token en localStorage
      localStorage.setItem("token", result.token);

      // Obtener el ID del usuario (probando las estructuras más comunes de respuesta)
      const userId = result.user?.user_id || result.user_id || result.user?.id;

      if (userId) {
        localStorage.setItem("userId", userId);
        // Redirigir enviando el user_id en los query params
        window.location.href = `/dashboard?user_id=${userId}`;
      } else {
        console.error("Respuesta del servidor sin user_id:", result);
        // Fallback en caso de que la API solo envíe el token
        window.location.href = "/dashboard";
      }
    } else {
      alert(result.message || "Error en las credenciales");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor.");
  }
});
