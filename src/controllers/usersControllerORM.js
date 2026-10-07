const { User, Account, Transaction } = require("../models"); // Importa los modelos de Sequelize
const bcrypt = require("bcryptjs"); // Llamamos a bcryptjs para el hashing de contraseñas

// Función para obtener todos los usuarios usando Sequelize ORM
const obtenerUsuariosORM = async (req, res) => {
  try {
    // Uso del método nativo del ORM
    const usuarios = await User.findAll({
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

// Función para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
const obtenerUsuarioConRelaciones = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Asegúrate de que esté dentro de un objeto
      include: [{ model: Account, as: "Account" }],
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 1. Crear el usuario y sus registros asociados
    // Opciones de 'include': si no definiste un 'as' en User.hasOne(Account), usa solo [Account]
    const nuevoUsuario = await User.create(
      {
        ...req.body,
        password: hashedPassword,
        Account: {
          account_number: `ACC-${Date.now()}`,
          balance: 0,
          currency_id: 1, // Asegúrate de pasar el ID de la moneda existente
        },
      },
      {
        include: [{ model: Account, as: "Account" }],
      },
    );

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

// Función para actualizar email de un usuario
const actualizarEmailUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado.",
      });
    }

    user.email = email;
    await user.save();

    return res.status(200).json({
      mensaje: "Email actualizado correctamente.",
      usuario: user,
    });
  } catch (error) {
    console.error("Error al actualizar el email del usuario:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para cambiar el nombre y apellido de un usuario
const actualizarNombreApellidoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado.",
      });
    }

    user.first_name = first_name;
    user.last_name = last_name;
    await user.save();

    return res.status(200).json({
      mensaje: "Nombre y apellido actualizados correctamente.",
      usuario: user,
    });
  } catch (error) {
    console.error(
      "Error al actualizar el nombre y apellido del usuario:",
      error,
    );
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para obtener el saldo (balance) del usuario autenticado
const obtenerBalance = async (req, res) => {
  try {
    // const userId = req.usuario.userId; // Obtenemos el ID del usuario desde el token decodificado
    const { id } = req.params; // desde params para pruebas
    // Buscar el usuario con su cuenta asociada
    const user = await User.findByPk(id, {
      include: [{ model: Account, as: "Account" }],
    });

    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado.",
      });
    }

    // Devolver el saldo del usuario
    return res.status(200).json({
      balance: user.Account.balance,
    });
  } catch (error) {
    console.error("Error al obtener el saldo:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        mensaje: "Usuario no encontrado.",
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: "success",
      mensaje: "Usuario eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
  obtenerBalance,
  actualizarEmailUsuario,
  actualizarNombreApellidoUsuario,
  eliminarUsuario,
};
