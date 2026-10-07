const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");

const {
  processTransfer,
  processDeposit,
} = require("../controllers/walletController");

// Endpoints de la API protegidos por JWT
// router.post("/depositar", verificarToken, depositar);
router.post("/transfer", verificarToken, processTransfer);

router.post("/deposit", verificarToken, processDeposit);

module.exports = router;
