const express = require("express");
const router = express.Router();
const { validateDocument } = require("../middlewares/uploadMiddleware");
const documentController = require("../controllers/documentController");

// Primero valida el archivo y luego ejecuta el controlador
router.post("/upload", validateDocument, documentController.uploadDocument);

router.delete("/upload/:nombre", documentController.deleteDocument);

module.exports = router;
