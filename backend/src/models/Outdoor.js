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

  static async getWithAvailability(dataInicio, dataFim) {
    try {
      const query = `
        SELECT 
          o.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', d.id,
                'data_inicio', d.data_inicio,
                'data_fim', d.data_fim,
                'cliente_nome', d.cliente_nome,
                'valor_total', d.valor_total
              ) ORDER BY d.data_inicio
            ) FILTER (WHERE d.id IS NOT NULL), 
            '[]'::json
          ) as reservas_periodo,
          CASE 
            WHEN COUNT(d.id) = 0 THEN true
            ELSE false
          END as totalmente_disponivel
        FROM outdoors o
        LEFT JOIN disponibilidade d 
          ON o.id = d.outdoor_id 
          AND d.status = 'ocupado'
          AND d.data_inicio <= $2::date
          AND d.data_fim >= $1::date
        WHERE o.ativo = true
        GROUP BY o.id
        ORDER BY o.nome ASC
      `;
      const result = await pool.query(query, [dataInicio, dataFim]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAvailableDates(outdoorId, startDate, endDate) {
    try {
      // Busca todas as reservas do outdoor no período expandido
      const query = `
        SELECT data_inicio, data_fim 
        FROM disponibilidade 
        WHERE outdoor_id = $1 
          AND status = 'ocupado'
          AND data_fim >= $2::date
          AND data_inicio <= $3::date
        ORDER BY data_inicio
      `;
      const result = await pool.query(query, [outdoorId, startDate, endDate]);
      
      const reservas = result.rows;
      const diasDisponiveis = [];
      const diasOcupados = [];
      
      // Gerar array com todas as datas do período
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        const dataStr = current.toISOString().split('T')[0];
        let ocupado = false;
        
        // Verificar se a data está dentro de alguma reserva
        for (const reserva of reservas) {
          const inicioReserva = new Date(reserva.data_inicio);
          const fimReserva = new Date(reserva.data_fim);
          
          if (current >= inicioReserva && current <= fimReserva) {
            ocupado = true;
            break;
          }
        }
        
        if (ocupado) {
          diasOcupados.push(dataStr);
        } else {
          diasDisponiveis.push(dataStr);
        }
        
        current.setDate(current.getDate() + 1);
      }
      
      return {
        dias_disponiveis: diasDisponiveis,
        dias_ocupados: diasOcupados,
        total_dias: diasDisponiveis.length + diasOcupados.length,
        total_disponivel: diasDisponiveis.length,
        total_ocupado: diasOcupados.length
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Outdoor;
