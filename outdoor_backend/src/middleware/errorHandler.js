const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validação",
      details: err.errors,
    });
  }

  if (err.code === "23505") {
    // Erro de duplicação PostgreSQL
    return res.status(409).json({
      error: "Registro duplicado",
      message: "Este registro já existe no sistema",
    });
  }

  if (err.code === "23503") {
    // Erro de chave estrangeira PostgreSQL
    return res.status(400).json({
      error: "Erro de referência",
      message: "Referência inválida para outro registro",
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Algo deu errado",
  });
};

module.exports = { errorHandler };
