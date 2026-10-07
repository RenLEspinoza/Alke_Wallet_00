const path = require("path");

// Middleware para validar la carga de documentos

const validateAvatar = (req, res, next) => {
  // 1. Verificar si realmente se envió un archivo
  console.log("Archivos recibidos en la solicitud:", req.files); // Para depuración
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res
      .status(400)
      .json({ message: "No se ha seleccionado ningún archivo." });
  }

  const file = req.files.archivo;

  // 2. Solo permitimos formatos de imagen para la foto de perfil
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.name).toLowerCase();
  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return res.status(400).json({
      message: "El archivo excede el tamaño máximo permitido de 5 MB.",
    });
  }
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      message: `Formato no permitido. Solo se aceptan: ${allowedExtensions.join(", ")}`,
    });
  }

  next(); // Todo bien, pasa al controlador
};

const validateDocument = (req, res, next) => {
  // 1. Verificar si realmente se envió un archivo
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files.document
  ) {
    return res
      .status(400)
      .json({ message: "No se ha seleccionado ningún archivo." });
  }

  const file = req.files.document;

  // 2. Solo permitimos formatos de documentos
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const fileExtension = path.extname(file.name).toLowerCase();
  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return res.status(400).json({
      message: "El archivo excede el tamaño máximo permitido de 5 MB.",
    });
  }
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      message: `Formato no permitido. Solo se aceptan: ${allowedExtensions.join(", ")}`,
    });
  }

  next(); // Todo bien, pasa al controlador
};

module.exports = {
  validateAvatar,
  validateDocument,
};
