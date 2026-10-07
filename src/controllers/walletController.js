const { User, Account, Transaction } = require("../models");
const sequelize = require("../config/database");

// POST /api/transfer (Procesar)
const processTransfer = async (req, res) => {
  const {
    CURRENT_USER_ID,
    receiver_id: inputAccount,
    amount,
    description,
  } = req.body;
  const transferAmount = parseFloat(amount);

  let targetUserId = inputAccount;

  const targetAccount = await Account.findOne({
    where: {
      account_number: inputAccount,
    },
  });

  if (targetAccount) {
    targetUserId = targetAccount.account_id;
  }

  // Validación de id emisor
  if (!CURRENT_USER_ID) {
    return res.status(400).json({
      success: false,
      message: "ID de usuario emisor no proporcionado",
    });
  }

  // Validación de monto a transferir
  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ success: false, message: "Monto inválido" });
  }

  // Evitar autotransferencias
  if (CURRENT_USER_ID == targetUserId) {
    return res.status(400).json({
      success: false,
      message: "No puedes realizar una transferencia a tu propia cuenta",
    });
  }

  // Inicia transacción
  const t = await sequelize.transaction();

  try {
    const sender = await Account.findOne({
      where: { user_id: CURRENT_USER_ID },
      transaction: t,
    });
    const receiver = await Account.findOne({
      where: { user_id: targetUserId },
      transaction: t,
    });

    // Valida existencia de las cuentas
    if (!sender) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Usuario emisor no encontrado" });
    }

    if (!receiver) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Cuenta de destino no existe" });
    }

    // Valida saldo suficiente en la cuenta del emisor
    const senderBalance = parseFloat(sender.balance);
    if (senderBalance < transferAmount) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Saldo insuficiente" });
    }

    // Actualizar saldos en emisor y receptor
    const receiverBalance = parseFloat(receiver.balance);

    await sender.update(
      { balance: senderBalance - transferAmount },
      { transaction: t },
    );

    await receiver.update(
      { balance: receiverBalance + transferAmount },
      { transaction: t },
    );

    // Registra la transacción
    await Transaction.create(
      {
        type: "transfer",
        amount: transferAmount,
        description:
          description ||
          `Transferencia a cta ${receiver.account_id || receiver.id}`,
        sender_account_id: CURRENT_USER_ID,
        receiver_account_id: targetUserId,
        currency_id: 1,
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "¡Transferencia realizada con éxito!",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error en transfer:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar la transferencia",
    });
  }
};

// POST /api/deposit
const processDeposit = async (req, res) => {
  const { CURRENT_USER_ID, amount } = req.body;
  const depositAmount = parseFloat(amount);

  if (!CURRENT_USER_ID) {
    return res
      .status(400)
      .json({ success: false, message: "ID de usuario no proporcionado" });
  }

  if (isNaN(depositAmount) || depositAmount <= 0) {
    return res.status(400).json({ success: false, message: "Monto inválido" });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Buscar la cuenta activa del usuario
    const account = await Account.findOne({
      where: { user_id: CURRENT_USER_ID },
      transaction: t,
    });

    if (!account) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Cuenta no encontrada" });
    }

    // 2. Sumar el monto al saldo actual
    const currentBalance = parseFloat(account.balance);
    const newBalance = currentBalance + depositAmount;

    await account.update({ balance: newBalance }, { transaction: t });

    // 3. Registrar la transacción de tipo 'deposit'
    await Transaction.create(
      {
        type: "deposit",
        amount: depositAmount,
        description: "Depósito en cuenta propia",
        sender_account_id: account.account_id || account.id,
        receiver_account_id: account.account_id || account.id,
        currency_id: 1,
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "¡Depósito abonado con éxito a tu cuenta!",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error en el depósito:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar el depósito",
    });
  }
};

// // 6. GET /transactions
// const showTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.findAll({
//       where: { userId: CURRENT_USER_ID },
//       order: [["createdAt", "DESC"]],
//       raw: true,
//     });
//     res.render("transactions", {
//       title: "Historial",
//       showNav: true,
//       transactions,
//     });
//   } catch (error) {
//     res.status(500).send("Error obteniendo el historial");
//   }
// };

module.exports = {
  processTransfer,
  processDeposit,
};
