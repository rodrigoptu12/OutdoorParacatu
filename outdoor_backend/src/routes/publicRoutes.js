const express = require("express");
const router = express.Router();
const outdoorController = require("../controllers/outdoorController");
const { periodValidation } = require("../middleware/validation");

// Rotas públicas (sem autenticação)
router.get(
  "/outdoors",
  periodValidation,
  outdoorController.getWithAvailability
);

module.exports = router;
