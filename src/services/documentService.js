const path = require("path");

// Servicio para manejar la lógica de almacenamiento de documentos
const saveLocalDocument = async (file) => {
  // Limpiamos el nombre original reemplazando espacios
  const cleanFileName = file.name.replace(/\s+/g, "_");

  // Evitar nombres repetidos agregando Timestamp
  const uniqueName = `${Date.now()}-${cleanFileName}`;

  // Ruta física de destino
  const uploadPath = path.join(__dirname, "../uploads", uniqueName);

  // Mover archivo usando express-fileupload (.mv)
  await file.mv(uploadPath);

  return {
    originalName: file.name,
    savedAs: uniqueName,
    size: file.size,
    url: `/uploads/${uniqueName}`,
  };
};

module.exports = {
  saveLocalDocument,
};
