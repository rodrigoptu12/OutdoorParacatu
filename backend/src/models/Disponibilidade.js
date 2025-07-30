const pool = require("../config/database");

class Disponibilidade {
  static async findByPeriod(dataInicio, dataFim) {
    try {
      const query = `
        SELECT d.*, o.nome as outdoor_nome, o.localizacao, o.preco_mensal
        FROM disponibilidade d
        JOIN outdoors o ON d.outdoor_id = o.id
        WHERE (d.data_inicio <= $2 AND d.data_fim >= $1)
        ORDER BY d.data_inicio ASC, o.nome ASC
      `;
      const result = await pool.query(query, [dataInicio, dataFim]);
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
        ORDER BY data_inicio DESC
      `;
      const result = await pool.query(query, [outdoorId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async checkAvailability(outdoorId, dataInicio, dataFim) {
    try {
      const query = `
        SELECT * FROM disponibilidade 
        WHERE outdoor_id = $1 
        AND (
          (data_inicio <= $2 AND data_fim >= $2) OR
          (data_inicio <= $3 AND data_fim >= $3) OR
          (data_inicio >= $2 AND data_fim <= $3)
        )
        AND status = 'ocupado'
      `;
      const result = await pool.query(query, [outdoorId, dataInicio, dataFim]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createReservation(data) {
    try {
      const {
        outdoor_id,
        data_inicio,
        data_fim,
        cliente_nome,
        cliente_contato,
        cliente_email,
        observacoes,
      } = data;

      // Verificar se já existe reserva no período
      const conflitos = await this.checkAvailability(outdoor_id, data_inicio, data_fim);
      if (conflitos.length > 0) {
        throw new Error("Outdoor já está reservado para este período");
      }

      // Buscar preço do outdoor para calcular valor total
      const outdoorQuery = `SELECT preco_mensal FROM outdoors WHERE id = $1`;
      const outdoorResult = await pool.query(outdoorQuery, [outdoor_id]);
      const outdoor = outdoorResult.rows[0];
      
      if (!outdoor) {
        throw new Error("Outdoor não encontrado");
      }

      // Calcular número de dias e valor total
      const inicio = new Date(data_inicio);
      const fim = new Date(data_fim);
      const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
      const valorDiario = outdoor.preco_mensal / 30;
      const valorTotal = valorDiario * dias;

      const query = `
        INSERT INTO disponibilidade 
        (outdoor_id, data_inicio, data_fim, status, cliente_nome, cliente_contato, 
         cliente_email, observacoes, valor_total)
        VALUES ($1, $2, $3, 'ocupado', $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        outdoor_id,
        data_inicio,
        data_fim,
        cliente_nome,
        cliente_contato,
        cliente_email,
        observacoes,
        valorTotal
      ];
      const result = await pool.query(query, values);
      return { ...result.rows[0], dias, valor_diario: valorDiario };
    } catch (error) {
      throw error;
    }
  }

  static async cancelReservation(id) {
    try {
      const query = `
        DELETE FROM disponibilidade 
        WHERE id = $1
        RETURNING *
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getOccupancyReport(startDate, endDate) {
    try {
      const query = `
        WITH periodo AS (
          SELECT 
            $1::date as data_inicio,
            $2::date as data_fim,
            ($2::date - $1::date + 1) as dias_periodo
        ),
        ocupacao_por_outdoor AS (
          SELECT 
            o.id,
            o.nome,
            COALESCE(SUM(
              CASE 
                WHEN d.data_inicio <= p.data_fim AND d.data_fim >= p.data_inicio THEN
                  LEAST(d.data_fim, p.data_fim)::date - 
                  GREATEST(d.data_inicio, p.data_inicio)::date + 1
                ELSE 0
              END
            ), 0) as dias_ocupados
          FROM outdoors o
          CROSS JOIN periodo p
          LEFT JOIN disponibilidade d ON o.id = d.outdoor_id 
            AND d.status = 'ocupado'
            AND d.data_inicio <= p.data_fim 
            AND d.data_fim >= p.data_inicio
          WHERE o.ativo = true
          GROUP BY o.id, o.nome, p.dias_periodo
        )
        SELECT 
          COUNT(*) as total_outdoors,
          SUM(dias_ocupados) as total_dias_ocupados,
          SUM(dias_periodo - dias_ocupados) as total_dias_disponiveis,
          ROUND(AVG(dias_ocupados::numeric / dias_periodo * 100), 2) as taxa_ocupacao_media,
          json_agg(
            json_build_object(
              'outdoor_id', id,
              'outdoor_nome', nome,
              'dias_ocupados', dias_ocupados,
              'taxa_ocupacao', ROUND(dias_ocupados::numeric / dias_periodo * 100, 2)
            )
          ) as detalhes_por_outdoor
        FROM ocupacao_por_outdoor, periodo;
      `;
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Disponibilidade;
