const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_super_segura";

const verificarToken = (req, res, next) => {
  // Obtener el token desde el encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "Token no proporcionado",
    });
  }

  // Si existe el authHeader, lo dividimos en partes
  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      status: "error",
      message: "Formato de autorización invalido",
    });
  }

  // Ahora sí declaramos token antes de usarlo
  const token = partes[1];

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        status: "error",
        message: "Token invalido o expirado",
      });
    }

    req.usuario = decoded;
    next();
  });
};

module.exports = { verificarToken };
