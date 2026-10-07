document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("depositForm");
  const feedback = document.getElementById("feedbackMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amountInput = document.getElementById("amount").value;
    const amount = parseFloat(amountInput);
    const token = localStorage.getItem("token");

    // Obtener CURRENT_USER_ID desde localStorage o URL
    const storedUserId = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get("user_id") || storedUserId;

    console.log("Valores antes de enviar:", { currentUserId, amount, token });

    if (!token) {
      showAlert(
        "No hay una sesión activa. Inicia sesión nuevamente.",
        "danger",
      );
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      showAlert("Ingresa un monto válido a depositar.", "danger");
      return;
    }

    const payload = {
      CURRENT_USER_ID: Number(currentUserId),
      amount: amount,
    };

    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert(data.message || "¡Depósito realizado con éxito!", "success");
        form.reset();

        setTimeout(() => {
          window.location.href = `/dashboard?user_id=${currentUserId}`;
        }, 2000);
      } else {
        showAlert(data.message || "Error al realizar el depósito.", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error de conexión al realizar el depósito.", "danger");
    }
  });

  function showAlert(message, type) {
    if (!feedback) {
      alert(message);
      return;
    }
    feedback.className = `alert alert-${type} mt-3`;
    feedback.textContent = message;
    feedback.style.display = "block";
  }
});
