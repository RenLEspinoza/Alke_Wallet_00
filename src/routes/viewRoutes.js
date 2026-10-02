const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User, Account, Transaction } = require("../models");

// 1. DASHBOARD
router.get("/dashboard", async (req, res) => {
  try {
    const currentUserId = req.query.userId || 1;

    // Buscar la cuenta del usuario
    const account = await Account.findOne({
      where: { user_id: currentUserId },
      include: [{ model: User }],
    });

    if (!account) {
      return res
        .status(404)
        .send("Cuenta no encontrada para el usuario indicado.");
    }

    // ⚠️ USAMOS account.account_id EN LUGAR DE account.id
    const accountId = account.account_id;

    // Buscar las últimas 5 transacciones
    const transactionsRaw = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_account_id: accountId },
          { receiver_account_id: accountId },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
      raw: true,
    });

    // Formatear movimientos para la plantilla
    const transacciones = transactionsRaw.map((t) => {
      const esIngreso = t.receiver_account_id === accountId;
      return {
        concepto: esIngreso
          ? `Depósito/Abono recibido (Origen: Cuenta #${t.sender_account_id || "Externa"})`
          : `Transferencia enviada (Destino: Cuenta #${t.receiver_account_id})`,
        monto: t.importe || t.monto,
        fecha: new Date(t.createdAt).toLocaleDateString("es-CL"),
        esIngreso,
      };
    });

    res.render("dashboard", {
      user: {
        nombre: account.User
          ? `${account.User.first_name || ""} ${account.User.last_name || ""}`.trim()
          : "Usuario",
        saldo: account.balance,
        numero_cuenta: account.account_number || account.account_id,
      },
      transacciones,
    });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

// 2. HISTORIAL COMPLETO DE TRANSACCIONES
router.get("/transacciones", async (req, res) => {
  try {
    const currentUserId = req.query.userId || 1;

    const account = await Account.findOne({
      where: { user_id: currentUserId },
    });
    if (!account) return res.status(404).send("Cuenta no encontrada.");

    const accountId = account.account_id;

    const transactionsRaw = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_account_id: accountId },
          { receiver_account_id: accountId },
        ],
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const transacciones = transactionsRaw.map((t) => {
      const esIngreso = t.receiver_account_id === accountId;
      return {
        id: t.transaction_id || t.id,
        concepto: esIngreso
          ? `Abono desde Cuenta #${t.sender_account_id || "Sistema"}`
          : `Transferencia a Cuenta #${t.receiver_account_id}`,
        monto: t.importe || t.monto,
        fecha: new Date(t.createdAt).toLocaleDateString("es-CL"),
        esIngreso,
      };
    });

    res.render("transacciones", { transacciones });
  } catch (error) {
    console.error("Error al cargar transacciones:", error);
    res.status(500).send("Error al obtener el historial: " + error.message);
  }
});

// 3. VISTAS DE FORMULARIOS
router.get("/depositar", (req, res) => res.render("depositar"));
router.get("/transferir", (req, res) => res.render("transferir"));

module.exports = router;
