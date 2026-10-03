const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_super_segura";

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization; // Obtenemos el authHeader desde req.headers

  if (!token) {
    // Si no existe el token, retorna error y mensaje.
    return res.status(401).json({
      status: "error",
      message: "Token no proporcionado",
    });
  }

  if (!authHeader) {
    // Si no existe el authHeader, retorna error y mensaje.
    return res.status(401).json({
      status: "error",
      message: "Token no proporcionado",
    });
  }

  // Si existe el authHeader, entonces lo dividimos en partes.
  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    // Si el resultado no es igual a 2 o la parte 0 es distinto a'bearer' retorna error de formato.
    return res.status(401).json({
      status: "error",
      message: "formato de autorización invalido",
    });
  }

  const token = partes[1]; // La parte 1 es nuestra Clave secreta

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
}

module.exports = { verificarToken };
