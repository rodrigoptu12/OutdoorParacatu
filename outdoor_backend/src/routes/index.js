const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const outdoorRoutes = require("./outdoorRoutes");
const disponibilidadeRoutes = require("./disponibilidadeRoutes");
const publicRoutes = require("./publicRoutes");

// Rotas públicas
router.use("/public", publicRoutes);

// Rotas de autenticação
router.use("/auth", authRoutes);

// Rotas protegidas
router.use("/outdoors", outdoorRoutes);
router.use("/disponibilidade", disponibilidadeRoutes);

// Rota de health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

module.exports = router;
