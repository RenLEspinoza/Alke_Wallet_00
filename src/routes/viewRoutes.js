const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User, Account, Transaction } = require("../models");

// 1. DASHBOARD
router.get("/dashboard", async (req, res) => {
  console.log("Query Params recibidos:", req.query); // Para depuración
  try {
    // PASO 1: Capturar el ID de usuario (o usar 1 de fallback) y convertir a entero
    const rawUserId = req.query.user_id || req.session?.userId || 1;

    if (!rawUserId) {
      return res.status(400).send("ID de usuario no proporcionado.");
      return res.redirect("/login"); // Redirigir a la página de inicio de sesión si no hay ID de usuario
    }

    const currentUserId = parseInt(rawUserId, 10);

    if (isNaN(currentUserId)) {
      return res.status(400).send("ID de usuario inválido.");
    }

    // PASO 2: Buscar la cuenta del usuario
    const account = await Account.findOne({
      where: { user_id: currentUserId },
      include: [{ model: User }],
    });

    if (!account) {
      return res
        .status(404)
        .send("Cuenta no encontrada para el usuario indicado.");
    }

    const currentAccountId = account.account_id;

    // PASO 3: Buscar transacciones usando las columnas REALES (sender_account_id o receiver_account_id)
    const transactionsRaw = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_account_id: currentAccountId },
          { receiver_account_id: currentAccountId },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    // PASO 4: Formatear movimientos de forma segura
    const transacciones = (transactionsRaw || []).map((t) => {
      const plain = t.get ? t.get({ plain: true }) : t;
      return {
        id: plain.transaction_id,
        tipo: plain.type,
        monto: plain.amount,
        descripcion: plain.description || "Sin descripción",
        fecha: plain.createdAt
          ? new Date(plain.createdAt).toLocaleDateString("es-CL")
          : "",
        esEgreso: plain.sender_account_id === currentAccountId, // Saber si la cuenta envió o recibió el monto
      };
    });

    // PASO 5: Renderizar la plantilla Handlebars
    res.render("dashboard", {
      user: {
        nombre: account.User
          ? `${account.User.first_name || ""} ${account.User.last_name || ""}`.trim()
          : "Usuario",
        saldo: account.balance,
        numero_cuenta: account.account_number || account.account_id,
      },
      transacciones: transacciones, // Si no hay registros, pasará un arreglo vacío [] sin romper la app
    });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

// 2. HISTORIAL COMPLETO DE TRANSACCIONES
// router.get("/transacciones", async (req, res) => {
//   try {
//     const currentUserId = req.query.userId || 1;

//     const account = await Account.findOne({
//       where: { user_id: currentUserId },
//     });
//     if (!account) return res.status(404).send("Cuenta no encontrada.");

//     const accountId = account.account_id;

//     const transactionsRaw = await Transaction.findAll({
//       where: {
//         [Op.or]: [
//           { sender_account_id: accountId },
//           { receiver_account_id: accountId },
//         ],
//       },
//       order: [["createdAt", "DESC"]],
//       raw: true,
//     });

//     const transacciones = transactionsRaw.map((t) => {
//       const esIngreso = t.receiver_account_id === accountId;
//       return {
//         id: t.transaction_id || t.id,
//         concepto: esIngreso
//           ? `Abono desde Cuenta #${t.sender_account_id || "Sistema"}`
//           : `Transferencia a Cuenta #${t.receiver_account_id}`,
//         monto: t.importe || t.monto,
//         fecha: new Date(t.createdAt).toLocaleDateString("es-CL"),
//         esIngreso,
//       };
//     });

//     res.render("transacciones", { transacciones });
//   } catch (error) {
//     console.error("Error al cargar transacciones:", error);
//     res.status(500).send("Error al obtener el historial: " + error.message);
//   }
// });

// 3. VISTAS DE FORMULARIOS
router.get("/depositar", (req, res) => res.render("depositar"));
router.get("/transferir", (req, res) => res.render("transferir"));

module.exports = router;
