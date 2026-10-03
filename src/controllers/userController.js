const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_super_segura";

//======================================================================================
// Lógica para manejar el inicio de sesión de usuarios
//======================================================================================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Obtenemos el email y password desde el body

    // 1. Busca el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Credenciales inválidas (email no encontrado)",
      });
    }

    // 2. Verifica la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Credenciales inválidas (contraseña incorrecta)",
      });
    }

    // 3. Genera el Token JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }, // Duración del token
    );

    res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
