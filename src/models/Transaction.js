const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("deposit", "withdraw", "transfer"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Claves foráneas
    sender_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null para depósitos desde fuera
      field: "sender_account_id",
      references: {
        model: "accounts",
        key: "account_id",
      },
    },
    receiver_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null para retiros hacia fuera
      field: "receiver_account_id",
      references: {
        model: "accounts",
        key: "account_id",
      },
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "currency_id",
      references: {
        model: "currencies",
        key: "currency_id",
      },
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  },
);

module.exports = Transaction;
