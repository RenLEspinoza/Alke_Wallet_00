const express = require("express");
const router = express.Router();

const {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
  obtenerBalance,
  actualizarEmailUsuario,
  actualizarNombreApellidoUsuario,
  eliminarUsuario,
} = require("../controllers/usersControllerORM");

const { verificarToken } = require("../middlewares/authMiddleware");
const { validateLogin } = require("../middlewares/validateInput");
const { login } = require("../controllers/userController");
//===========================================================================================
// RUTAS DE USUARIOS (ORM - Sequelize)
//===========================================================================================

// Ruta para obtener todos los usuarios
router.get("/orm-users", obtenerUsuariosORM);

// Ruta para obtener un usuario por su ID junto con su o sus relaciones (Por ahora solo account, eventualmente transacciones y contactos)
router.get("/orm-users/:id", obtenerUsuarioConRelaciones);

// Ruta GET para obtener el saldo (balance) de la cuenta (account) del usuario.
router.get("/balance/:id", obtenerBalance);

// Ruta para crear un user completo
router.post("/users", crearUsuarioCompletoORM);

// Ruta POST para login de usuario (incluye validacion básica de email y password)
router.post("/login", validateLogin, login);

// Ruta PUT para actualizar el email del usuario
router.put("/users/:id/email", verificarToken, actualizarEmailUsuario);

// Ruta PUT para actualizar el nombre y apellido de un usuario
router.put("/users/:id/name", verificarToken, actualizarNombreApellidoUsuario);

// Ruta DELETE para eliminar un usuario
router.delete("/users/:id", verificarToken, eliminarUsuario);

module.exports = router;
