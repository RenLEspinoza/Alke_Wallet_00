const express = require("express");
const router = express.Router();
const {
  validateAvatar,
  validateDocument,
} = require("../middlewares/uploadMiddleware");
const documentController = require("../controllers/documentController");

// Primero valida el archivo y luego ejecuta el controlador

// Rutas para la carga de documento
router.post("/upload", validateDocument, documentController.uploadDocument);

// Rutas para la carga de avatar
router.post(
  "/upload/avatar",
  validateAvatar,
  documentController.uploadProfilePicture,
);

// Ruta para eliminar documento o avatar por nombre
router.delete("/upload/:nombre", documentController.deleteDocument);

module.exports = router;
