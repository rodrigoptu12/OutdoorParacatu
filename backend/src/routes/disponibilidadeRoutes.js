const express = require("express");
const router = express.Router();
const disponibilidadeController = require("../controllers/disponibilidadeController");
const authMiddleware = require("../middleware/auth");
const {
  reservationValidation,
  periodValidation,
} = require("../middleware/validation");
// Todas as rotas de disponibilidade requerem autenticação
router.use(authMiddleware);

router.get("/", periodValidation, disponibilidadeController.getByPeriod);
router.get("/outdoor/:outdoorId", disponibilidadeController.getByOutdoor);
router.get(
  "/check/:outdoorId",
  periodValidation,
  disponibilidadeController.checkAvailability
);
router.post(
  "/reservar",
  reservationValidation,
  disponibilidadeController.createReservation
);
router.delete("/cancelar/:id", disponibilidadeController.cancelReservation);
router.get(
  "/relatorio",
  periodValidation,
  disponibilidadeController.getOccupancyReport
);

module.exports = router;
