const { body, param, query, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const outdoorValidation = [
  body("nome").notEmpty().trim().withMessage("Nome é obrigatório"),
  body("localizacao")
    .notEmpty()
    .trim()
    .withMessage("Localização é obrigatória"),
  body("dimensoes").notEmpty().trim().withMessage("Dimensões são obrigatórias"),
  body("preco_mensal")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo"),
  handleValidationErrors,
];

const reservationValidation = [
  body("outdoor_id").isInt().withMessage("ID do outdoor inválido"),
  body("data_inicio")
    .isISO8601()
    .toDate()
    .withMessage("Data inicial inválida"),
  body("data_fim")
    .isISO8601()
    .toDate()
    .withMessage("Data final inválida")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.data_inicio)) {
        throw new Error("Data final deve ser maior ou igual à data inicial");
      }
      return true;
    }),
  body("cliente_nome")
    .notEmpty()
    .trim()
    .withMessage("Nome do cliente é obrigatório"),
  body("cliente_contato")
    .notEmpty()
    .trim()
    .withMessage("Contato do cliente é obrigatório"),
  body("cliente_email").isEmail().withMessage("Email inválido"),
  handleValidationErrors,
];

const loginValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("senha").notEmpty().withMessage("Senha é obrigatória"),
  handleValidationErrors,
];

const periodValidation = [
  query("data_inicio")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Data inicial inválida"),
  query("data_fim")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Data final inválida")
    .custom((value, { req }) => {
      if (req.query.data_inicio && new Date(value) < new Date(req.query.data_inicio)) {
        throw new Error("Data final deve ser maior ou igual à data inicial");
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  outdoorValidation,
  reservationValidation,
  loginValidation,
  periodValidation,
};
