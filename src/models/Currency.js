const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Currency = sequelize.define(
  "Currency",
  {
    currency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: 1,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true, // Ej: 'CLP', 'USD', 'EUR'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      defaultValue: 1.0,
    },
  },
  {
    tableName: "currencies",
    timestamps: true,
  },
);

module.exports = Currency;
