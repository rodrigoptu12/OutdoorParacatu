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
  body("mes")
    .isInt({ min: 1, max: 12 })
    .withMessage("Mês deve estar entre 1 e 12"),
  body("ano")
    .isInt({ min: 2024 })
    .withMessage("Ano deve ser 2024 ou posterior"),
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
  query("mes")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Mês inválido"),
  query("ano").optional().isInt({ min: 2024 }).withMessage("Ano inválido"),
  handleValidationErrors,
];

module.exports = {
  outdoorValidation,
  reservationValidation,
  loginValidation,
  periodValidation,
};
