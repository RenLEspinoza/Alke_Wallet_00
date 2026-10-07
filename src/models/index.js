const sequelize = require("../config/database");

// Importar los modelos directamente (sin pasar sequelize ni DataTypes como función)
const User = require("./User");
const Currency = require("./Currency");
const Account = require("./Account");
const Transaction = require("./Transaction");

// Relación 1:1 (Usuario -> Cuenta)
User.hasOne(Account, { foreignKey: "user_id", onDelete: "CASCADE" });
Account.belongsTo(User, { foreignKey: "user_id" });

// Relación 1:N (Moneda -> Cuentas)
Currency.hasMany(Account, { foreignKey: "currency_id" });
Account.belongsTo(Currency, { foreignKey: "currency_id" });

// Relación 1:N (Cuenta Emisora -> Transacciones)
Account.hasMany(Transaction, {
  as: "SentTransactions",
  foreignKey: "sender_account_id",
});
Transaction.belongsTo(Account, {
  as: "SenderAccount",
  foreignKey: "sender_account_id",
});

// Relación 1:N (Cuenta Receptora -> Transacciones)
Account.hasMany(Transaction, {
  as: "ReceivedTransactions",
  foreignKey: "receiver_account_id",
});
Transaction.belongsTo(Account, {
  as: "ReceiverAccount",
  foreignKey: "receiver_account_id",
});

// Relación 1:N (Moneda -> Transacciones)
Currency.hasMany(Transaction, { foreignKey: "currency_id" });
Transaction.belongsTo(Currency, { foreignKey: "currency_id" });

module.exports = {
  sequelize,
  User,
  Currency,
  Account,
  Transaction,
};
