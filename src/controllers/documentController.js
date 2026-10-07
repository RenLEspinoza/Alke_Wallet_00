const fs = require("fs").promises; // Usamos la API de Promesas de FS
const path = require("path");
const { User } = require("../models"); // Necesario para acceder al modelo User y actualizar el avatar_url
const documentService = require("../services/documentService");

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

const uploadProfilePicture = async (req, res) => {
  try {
    // 1. Obtener el ID del usuario desde el formulario
    const { user_id } = req.body;

    // Validar que tengamos el ID del usuario y el archivo
    if (!user_id) {
      return res.status(400).send("Error: No se recibió el ID del usuario.");
    }

    if (!req.files || !req.files.archivo) {
      return res
        .status(400)
        .send("Error: No se subió ningún archivo de imagen.");
    }

    const file = req.files.archivo;

    // Crear nombre único para el archivo (ejemplo: avatar-2-1728000000.jpg)
    const ext = path.extname(file.name);
    const fileName = `avatar-${user_id}-${Date.now()}${ext}`;
    const uploadPath = path.join(__dirname, "../uploads", fileName);

    // Guardar la imagen física en el servidor
    await file.mv(uploadPath);

    // Actualizar la base de datos solo para el usuario con ese ID
    await User.update(
      { avatar_url: fileName },
      { where: { user_id: user_id } },
    );

    // Redirigir al dashboard de ESE usuario específico
    return res.redirect(`/dashboard?user_id=${user_id}`);
  } catch (error) {
    console.error("Error al subir la imagen de perfil:", error);
    return res
      .status(500)
      .send("Error interno al procesar la imagen de perfil.");
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
  uploadProfilePicture,
  deleteDocument,
};
