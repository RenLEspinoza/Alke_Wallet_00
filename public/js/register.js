document
  .getElementById("registroForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Capturamos los valores ingresados
    const formData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      // Enviamos la petición POST a la API REST
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Si el servidor respondió con estado 200 o 201
        alert("¡Usuario registrado con éxito!");
        window.location.href = "/login"; // O la ruta a la que quieras redirigir
      } else {
        // Si el servidor devolvió un error (400, 500, etc.)
        alert(result.message || "Ocurrió un error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error al conectar con el servidor.");
    }
  });
