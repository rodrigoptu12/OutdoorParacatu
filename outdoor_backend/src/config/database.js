const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao conectar ao banco:", err.stack);
  }
  console.log("✅ Conectado ao banco de dados PostgreSQL");
  release();
});

module.exports = pool;
