const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { loginValidation } = require("../middleware/validation");

router.post("/login", loginValidation, authController.login);
router.post("/register", loginValidation, authController.register);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
