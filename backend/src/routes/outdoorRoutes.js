const express = require("express");
const router = express.Router();
const outdoorController = require("../controllers/outdoorController");
const authMiddleware = require("../middleware/auth");
const { outdoorValidation } = require("../middleware/validation");

// Todas as rotas de outdoor requerem autenticação
router.use(authMiddleware);

router.get("/", outdoorController.index);
router.get("/:id", outdoorController.show);
router.get("/:id/disponibilidade", outdoorController.getAvailableDates);
router.post("/", outdoorValidation, outdoorController.create);
router.put("/:id", outdoorValidation, outdoorController.update);
router.delete("/:id", outdoorController.delete);

module.exports = router;
