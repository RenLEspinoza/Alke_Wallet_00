const { User, Account } = require("../models"); // Importa los modelos de Sequelize

// Función para obtener todos los usuarios usando Sequelize ORM
const obtenerUsuariosORM = async (req, res) => {
  try {
    // Uso del método nativo del ORM
    const usuarios = await users.findAll({
      attributes: { exclude: ["password"] }, // Excluye campos sensibles directamente desde la BD
    });

    res.status(200).json({
      exito: true,
      mensaje: "Usuarios obtenidos usando Sequelize ORM",
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener usuarios con ORM",
      error: error.message,
    });
  }
};

// función para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
const obtenerUsuarioConRelaciones = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["password", "telefono"] }, // Excluye campos sensibles directamente desde la BD
      include: [
        { model: Pedido, as: "pedidos" },
        { model: Perfil, as: "perfil" },
        { model: Cuenta, as: "cuenta" },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    console.log("Usuario con relaciones:", usuario.toJSON());
    return res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario con relaciones:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para crear un usuario junto con sus relaciones usando Sequelize ORM
const crearUsuarioCompletoORM = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validación de requerimientos mínimos
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios.",
      });
    }

    // 1. Crear el usuario y sus registros asociados
    // Opciones de 'include': si no definiste un 'as' en User.hasOne(Account), usa solo [Account]
    const nuevoUsuario = await User.create(req.body, {
      include: [Account],
    });

    // 2. Convertir la instancia de Sequelize a un objeto JSON plano para manipularlo
    const usuarioJSON = nuevoUsuario.toJSON();

    // 3. Excluir el password para los logs en consola
    const {
      password: _,
      Account: datosCuenta,
      ...datosUsuarioSinPassword
    } = usuarioJSON;

    // 4. Mostrar la información desglosada y limpia en consola
    console.log(
      "\n=================== NUEVO USUARIO CREADO ===================",
    );
    console.table([datosUsuarioSinPassword]);

    if (datosCuenta) {
      console.log("--- CUENTA BANCARIA ---");
      console.table([datosCuenta]);
    }

    // 5. Responder al cliente
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    // Capturar si el email o número de cuenta ya existe
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        mensaje: "El email o número de cuenta ya se encuentra registrado.",
        error: error.errors.map((e) => e.message),
      });
    }

    // Capturar errores de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación en los datos enviados.",
        errores: error.errors.map((e) => e.message),
      });
    }

    console.error("Error al crear usuario completo:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
};
