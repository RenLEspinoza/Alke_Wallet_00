document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      // Guardar el token para futuras peticiones autenticadas
      localStorage.setItem("token", result.token);

      // Obtener el id de forma segura, ya que puede ser user_id o id dependiendo de la implementación
      const userId = result.user?.user_id || result.user?.id;

      // Redirigir al usuario a la página de dashboard o a otra página protegida
      window.location.href = "/dashboard"; // Cambia esto a la ruta de tu dashboard
    } else {
      alert(result.message || "Error en las credenciales");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor.");
  }
});
