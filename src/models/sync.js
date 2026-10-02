const { sequelize } = require("./index");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión con PostgreSQL verificada con éxito.");

    // Sincroniza tablas e índices en PostgreSQL
    await sequelize.sync({ alter: true });
    console.log(" Tablas de AlkeWallet sincronizadas en PostgreSQL.");
  } catch (error) {
    console.error(" Error al sincronizar con PostgreSQL:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
