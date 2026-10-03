const path = require("path");

// Middleware para validar la carga de documentos

const validateDocument = (req, res, next) => {
  // 1. Verificar si realmente se envió un archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.avatar) {
    return res
      .status(400)
      .json({ message: "No se ha seleccionado ningún archivo." });
  }

  const file = req.files.avatar;

  // 2. Solo permitimos formatos de imagen para la foto de perfil
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.name).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      message: `Formato no permitido. Solo se aceptan: ${allowedExtensions.join(", ")}`,
    });
  }

  next(); // Todo bien, pasa al controlador
};

module.exports = {
  validateDocument,
};
