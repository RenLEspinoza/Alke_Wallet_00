const express = require("express");
const router = express.Router();

const {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
} = require("../controllers/usersControllerORM");

const { validateLogin } = require("../middlewares/validateInput");
const { login } = require("../controllers/userController");
//===========================================================================================
// RUTAS DE USUARIOS (ORM - Sequelize)
//===========================================================================================
// Ruta Users usando ORM (Sequelize)
router.get("/orm-users", obtenerUsuariosORM);

// Ruta para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
router.get("/orm-users/:id", obtenerUsuarioConRelaciones);

// Ruta para crear un usuario junto con sus relaciones (perfil, cuenta y pedidos)
router.post("/users", crearUsuarioCompletoORM);

// Ruta POST para login de usuario
router.post("/login", validateLogin, login);

//===========================================================================================
// RUTAS DE VISTAS (Renderizado de Páginas)
//===========================================================================================

// Rutas GET (Renderizado de Vistas)
router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

module.exports = router;
