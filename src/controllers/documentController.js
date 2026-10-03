const documentService = require("../services/documentService");
const fs = require("fs").promises; // Usamos la API de Promesas de FS
const path = require("path");

// Subir documento
const uploadDocument = async (req, res, next) => {
  try {
    const file = req.files.avatar;

    const fileData = await documentService.saveLocalDocument(file); // Guardar el archivo en el servidor

    return res.status(201).json({
      message: "Archivo guardado correctamente en el servidor.",
      data: fileData,
    });
  } catch (error) {
    next(error); // Pasa el error al manejador global de Express
  }
};

// Eliminar documento
const deleteDocument = async (req, res, next) => {
  try {
    const nombreArchivo = req.params.nombre;

    // Segregación básica para evitar navegaciones hacia carpetas superiores (Path Traversal)
    const safeFileName = path.basename(nombreArchivo);
    const ruta = path.join(__dirname, "../uploads", safeFileName);

    // Verificar si existe el archivo
    try {
      await fs.access(ruta);
    } catch {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }

    // Eliminar físicamente
    await fs.unlink(ruta);

    return res.status(200).json({ mensaje: "Archivo eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  deleteDocument,
};
