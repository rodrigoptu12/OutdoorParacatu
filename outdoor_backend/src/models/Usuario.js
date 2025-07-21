const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class Usuario {
  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM usuarios WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = "SELECT id, email, nome, ativo FROM usuarios WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const { email, senha, nome } = data;
      const hashedPassword = await bcrypt.hash(senha, 10);

      const query = `
        INSERT INTO usuarios (email, senha, nome)
        VALUES ($1, $2, $3)
        RETURNING id, email, nome, ativo
      `;
      const values = [email, hashedPassword, nome];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(senha, hashedPassword) {
    return bcrypt.compare(senha, hashedPassword);
  }
}

module.exports = Usuario;
