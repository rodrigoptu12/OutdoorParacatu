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
      const { mes, ano } = req.query;

      const mesAtual = mes || new Date().getMonth() + 1;
      const anoAtual = ano || new Date().getFullYear();

      const outdoors = await Outdoor.getWithAvailability(mesAtual, anoAtual);
      res.json({
        periodo: { mes: mesAtual, ano: anoAtual },
        outdoors,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar disponibilidade" });
    }
  }
}

module.exports = new OutdoorController();
