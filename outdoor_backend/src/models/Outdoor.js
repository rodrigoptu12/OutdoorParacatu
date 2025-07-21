const pool = require("../config/database");

class Outdoor {
  static async findAll(filters = {}) {
    try {
      let query = "SELECT * FROM outdoors WHERE 1=1";
      const values = [];
      let paramCount = 1;

      if (filters.ativo !== undefined) {
        query += ` AND ativo = $${paramCount}`;
        values.push(filters.ativo);
        paramCount++;
      }

      query += " ORDER BY nome ASC";

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = "SELECT * FROM outdoors WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const {
        nome,
        localizacao,
        dimensoes,
        preco_mensal,
        foto_url,
        descricao,
      } = data;
      const query = `
        INSERT INTO outdoors (nome, localizacao, dimensoes, preco_mensal, foto_url, descricao)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [
        nome,
        localizacao,
        dimensoes,
        preco_mensal,
        foto_url,
        descricao,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const {
        nome,
        localizacao,
        dimensoes,
        preco_mensal,
        foto_url,
        descricao,
        ativo,
      } = data;
      const query = `
        UPDATE outdoors 
        SET nome = $1, localizacao = $2, dimensoes = $3, preco_mensal = $4, 
            foto_url = $5, descricao = $6, ativo = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      const values = [
        nome,
        localizacao,
        dimensoes,
        preco_mensal,
        foto_url,
        descricao,
        ativo,
        id,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = "DELETE FROM outdoors WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getWithAvailability(mes, ano) {
    try {
      const query = `
        SELECT 
          o.*,
          COALESCE(d.status, 'disponivel') as status,
          d.cliente_nome,
          d.cliente_contato,
          d.cliente_email
        FROM outdoors o
        LEFT JOIN disponibilidade d 
          ON o.id = d.outdoor_id 
          AND d.mes = $1 
          AND d.ano = $2
        WHERE o.ativo = true
        ORDER BY o.nome ASC
      `;
      const result = await pool.query(query, [mes, ano]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Outdoor;
