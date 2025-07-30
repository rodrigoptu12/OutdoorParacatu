const Outdoor = require("../models/Outdoor");

class OutdoorController {
  async index(req, res) {
    try {
      const { ativo } = req.query;
      const filters = {};

      if (ativo !== undefined) {
        filters.ativo = ativo === "true";
      }

      const outdoors = await Outdoor.findAll(filters);
      res.json(outdoors);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar outdoors" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const outdoor = await Outdoor.findById(id);

      if (!outdoor) {
        return res.status(404).json({ error: "Outdoor não encontrado" });
      }

      res.json(outdoor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar outdoor" });
    }
  }

  async create(req, res) {
    try {
      const outdoor = await Outdoor.create(req.body);
      res.status(201).json(outdoor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar outdoor" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const outdoor = await Outdoor.update(id, req.body);

      if (!outdoor) {
        return res.status(404).json({ error: "Outdoor não encontrado" });
      }

      res.json(outdoor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar outdoor" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const outdoor = await Outdoor.delete(id);

      if (!outdoor) {
        return res.status(404).json({ error: "Outdoor não encontrado" });
      }

      res.json({ message: "Outdoor excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir outdoor" });
    }
  }

  async getWithAvailability(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      // Se não fornecer datas, usar próximos 30 dias
      const hoje = new Date();
      const dataInicio = data_inicio || hoje.toISOString().split('T')[0];
      const dataFimDefault = new Date(hoje);
      dataFimDefault.setDate(dataFimDefault.getDate() + 30);
      const dataFim = data_fim || dataFimDefault.toISOString().split('T')[0];

      const outdoors = await Outdoor.getWithAvailability(dataInicio, dataFim);
      res.json({
        periodo: { 
          data_inicio: dataInicio, 
          data_fim: dataFim 
        },
        outdoors,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar disponibilidade" });
    }
  }

  async getAvailableDates(req, res) {
    try {
      const { id } = req.params;
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: "Data inicial e final são obrigatórias" });
      }

      const disponibilidade = await Outdoor.getAvailableDates(id, data_inicio, data_fim);
      res.json(disponibilidade);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar datas disponíveis" });
    }
  }
}

module.exports = new OutdoorController();
