const express = require("express");
const router = express.Router();

const {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
} = require("../controllers/usersControllerORM");

//===========================================================================================
// RUTAS DE USUARIOS (ORM - Sequelize)
//===========================================================================================
// Ruta Users usando ORM (Sequelize)
router.get("/orm-users", obtenerUsuariosORM);

// Ruta para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
router.get("/orm-users/:id", obtenerUsuarioConRelaciones);

// Ruta para crear un usuario junto con sus relaciones (perfil, cuenta y pedidos)
router.post("/users", crearUsuarioCompletoORM);

//===========================================================================================
// RUTAS DE VISTAS (Renderizado de Páginas)
//===========================================================================================

// Rutas GET (Renderizado de Vistas)
router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

module.exports = router;
