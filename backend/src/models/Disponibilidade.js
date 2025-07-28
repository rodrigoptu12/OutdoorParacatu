const pool = require("../config/database");

class Disponibilidade {
  static async findByPeriod(mes, ano) {
    try {
      const query = `
        SELECT d.*, o.nome as outdoor_nome, o.localizacao 
        FROM disponibilidade d
        JOIN outdoors o ON d.outdoor_id = o.id
        WHERE d.mes = $1 AND d.ano = $2
        ORDER BY o.nome ASC
      `;
      const result = await pool.query(query, [mes, ano]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByOutdoor(outdoorId) {
    try {
      const query = `
        SELECT * FROM disponibilidade 
        WHERE outdoor_id = $1 
        ORDER BY ano DESC, mes DESC
      `;
      const result = await pool.query(query, [outdoorId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async checkAvailability(outdoorId, mes, ano) {
    try {
      const query = `
        SELECT * FROM disponibilidade 
        WHERE outdoor_id = $1 AND mes = $2 AND ano = $3
      `;
      const result = await pool.query(query, [outdoorId, mes, ano]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createReservation(data) {
    try {
      const {
        outdoor_id,
        mes,
        ano,
        cliente_nome,
        cliente_contato,
        cliente_email,
        observacoes,
      } = data;

      // Verificar se já existe reserva
      const existing = await this.checkAvailability(outdoor_id, mes, ano);
      if (existing && existing.status === "ocupado") {
        throw new Error("Outdoor já está reservado para este período");
      }

      const query = `
        INSERT INTO disponibilidade 
        (outdoor_id, mes, ano, status, cliente_nome, cliente_contato, cliente_email, observacoes, data_reserva)
        VALUES ($1, $2, $3, 'ocupado', $4, $5, $6, $7, CURRENT_TIMESTAMP)
        ON CONFLICT (outdoor_id, mes, ano) 
        DO UPDATE SET 
          status = 'ocupado',
          cliente_nome = $4,
          cliente_contato = $5,
          cliente_email = $6,
          observacoes = $7,
          data_reserva = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      const values = [
        outdoor_id,
        mes,
        ano,
        cliente_nome,
        cliente_contato,
        cliente_email,
        observacoes,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async cancelReservation(id) {
    try {
      const query = `
        UPDATE disponibilidade 
        SET status = 'disponivel', 
            cliente_nome = NULL,
            cliente_contato = NULL,
            cliente_email = NULL,
            observacoes = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getOccupancyReport(startMonth, startYear, endMonth, endYear) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT o.id) as total_outdoors,
          COUNT(d.id) FILTER (WHERE d.status = 'ocupado') as total_ocupados,
          COUNT(d.id) FILTER (WHERE d.status = 'disponivel' OR d.id IS NULL) as total_disponiveis,
          ROUND(
            (COUNT(d.id) FILTER (WHERE d.status = 'ocupado')::numeric / 
            COUNT(DISTINCT o.id)::numeric) * 100, 2
          ) as taxa_ocupacao
        FROM outdoors o
        LEFT JOIN disponibilidade d ON o.id = d.outdoor_id
          AND ((d.ano > $1) OR (d.ano = $1 AND d.mes >= $2))
          AND ((d.ano < $3) OR (d.ano = $3 AND d.mes <= $4))
        WHERE o.ativo = true
      `;
      const result = await pool.query(query, [
        startYear,
        startMonth,
        endYear,
        endMonth,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Disponibilidade;
