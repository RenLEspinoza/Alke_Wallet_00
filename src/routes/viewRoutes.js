const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User, Account, Transaction } = require("../models");

//===========================================================================================
// RUTAS DE VISTAS (Renderizado de Páginas)
//===========================================================================================

//======================================================================================
// VISTA DE HOME
//======================================================================================
router.get("/", (req, res) => res.render("home"));

//======================================================================================
// VISTA DE REGISTRO
//======================================================================================
router.get("/register", (req, res) => res.render("register"));

//======================================================================================
// VISTA DE LOGIN
//======================================================================================
router.get("/login", (req, res) => res.render("login"));

//======================================================================================
// VISTA DE DASHBOARD
//======================================================================================
router.get("/dashboard", async (req, res) => {
  // console.log("Query Params recibidos:", req.query); // Para depuración // Descomentar si quieres ver los parámetros de consulta en la consola
  try {
    // PASO 1: Capturar el ID de usuario (o usar 1 de fallback) y convertir a entero
    const rawUserId = req.query.user_id || req.session?.userId;

    if (!rawUserId) {
      return res.status(400).send("ID de usuario no proporcionado.");
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

    // Determinar la URL del avatar (si existe en la BD o usar una imagen por defecto)
    const userAvatar =
      account.User && account.User.avatar_url
        ? `${account.User.avatar_url}`
        : "../avatar-default.png";

    // PASO 5: Renderizar la plantilla Handlebars
    res.render("dashboard", {
      user: {
        id: currentUserId,
        nombre: account.User
          ? `${account.User.first_name || ""} ${account.User.last_name || ""}`.trim()
          : "Usuario",
        saldo: account.balance,
        numero_cuenta: account.account_number || account.account_id,
        avatar: userAvatar,
      },
      transacciones: transacciones, // Si no hay registros, pasará un arreglo vacío [] sin romper la app
    });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

//======================================================================================
// VISTA DE DEPOSITAR
//======================================================================================
router.get("/deposit", async (req, res) => {
  try {
    // Capturar el ID del usuario
    const rawUserId = req.query.user_id || req.session?.userId;

    if (!rawUserId) {
      return res.status(400).send("ID de usuario no proporcionado.");
    }

    const currentUserId = parseInt(rawUserId, 10);

    if (isNaN(currentUserId)) {
      return res.status(400).send("ID de usuario inválido.");
    }

    // Buscar la cuenta asociada
    const account = await Account.findOne({
      where: { user_id: currentUserId },
      include: [{ model: User }],
    });

    if (!account) {
      return res
        .status(404)
        .send("Cuenta no encontrada para el usuario indicado.");
    }

    // Renderizar la vista "depositar" enviando los datos del usuario/cuenta
    res.render("deposit", {
      user: {
        id: currentUserId,
        nombre: account.User
          ? `${account.User.first_name || ""} ${account.User.last_name || ""}`.trim()
          : "Usuario",
        saldo: account.balance,
        numero_cuenta: account.account_number || account.account_id,
        account_id: account.account_id,
      },
    });
  } catch (error) {
    console.error("Error al cargar la vista de depositar:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

//======================================================================================
// VISTA DE TRANSFERIR
//======================================================================================
router.get("/transfer", async (req, res) => {
  try {
    // Capturar el ID del usuario
    const rawUserId = req.query.user_id || req.session?.userId;

    if (!rawUserId) {
      return res.status(400).send("ID de usuario no proporcionado.");
    }

    const currentUserId = parseInt(rawUserId, 10);

    if (isNaN(currentUserId)) {
      return res.status(400).send("ID de usuario inválido.");
    }

    // Buscar la cuenta del usuario emisor
    const account = await Account.findOne({
      where: { user_id: currentUserId },
      include: [{ model: User }],
    });

    if (!account) {
      return res
        .status(404)
        .send("Cuenta no encontrada para el usuario indicado.");
    }

    // Opcional: Buscar otros usuarios/cuentas disponibles para mostrar en un <select> de contactos
    const otrasCuentas = await Account.findAll({
      where: {
        user_id: { [Op.ne]: currentUserId }, // Excluir al usuario actual
      },
      include: [{ model: User }],
    });

    const contactos = otrasCuentas.map((acc) => ({
      account_id: acc.account_id,
      nombre: acc.User
        ? `${acc.User.first_name || ""} ${acc.User.last_name || ""}`.trim()
        : `Cuenta N° ${acc.account_id}`,
      numero_cuenta: acc.account_number || acc.account_id,
    }));

    // Renderizar la vista "transferir"
    res.render("transfer", {
      user: {
        id: currentUserId,
        nombre: account.User
          ? `${account.User.first_name || ""} ${account.User.last_name || ""}`.trim()
          : "Usuario",
        saldo: account.balance,
        numero_cuenta: account.account_number || account.account_id,
        account_id: account.account_id,
      },
      contactos: contactos, // Lista de contactos para elegir a quién transferir
    });
  } catch (error) {
    console.error("Error al cargar la vista de transferir:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

module.exports = router;
