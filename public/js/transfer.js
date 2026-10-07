document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transferForm");
  const feedback = document.getElementById("feedbackMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturar el CURRENT_USER_ID desde la URL (ejemplo: ?user_id=4)
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get("user_id"); // Ajusta el valor por defecto si aplica

    const receiver_id = document
      .getElementById("receiver_account_number")
      .value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value.trim();

    const token = localStorage.getItem("token");

    if (!token) {
      showAlert(
        "No hay una sesión activa. Inicia sesión nuevamente.",
        "danger",
      );
      return;
    }

    // Incluir CURRENT_USER_ID requerido por el backend
    const payload = {
      CURRENT_USER_ID: Number(currentUserId),
      receiver_id: receiver_id,
      amount: amount,
      description: description,
    };

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert(
          data.message || "¡Transferencia realizada con éxito!",
          "success",
        );
        form.reset();

        setTimeout(() => {
          window.location.href = `/dashboard?user_id=${currentUserId}`;
        }, 2000);
      } else {
        showAlert(data.message || "Error en la transferencia", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert(
        "Ocurrió un error de conexión al realizar la transferencia.",
        "danger",
      );
    }
  });

  function showAlert(message, type) {
    if (!feedback) {
      alert(message);
      return;
    }
    feedback.className = `alert alert-${type.toLowerCase()} mt-3`;
    feedback.textContent = message;
    feedback.style.display = "block";
  }
});
