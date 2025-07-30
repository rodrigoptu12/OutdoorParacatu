const Disponibilidade = require("../models/Disponibilidade");

class DisponibilidadeController {
  async getByPeriod(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: "Data inicial e final são obrigatórias" });
      }

      const disponibilidades = await Disponibilidade.findByPeriod(data_inicio, data_fim);
      res.json(disponibilidades);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar disponibilidades" });
    }
  }

  async getByOutdoor(req, res) {
    try {
      const { outdoorId } = req.params;
      const disponibilidades = await Disponibilidade.findByOutdoor(outdoorId);
      res.json(disponibilidades);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar disponibilidades do outdoor" });
    }
  }

  async checkAvailability(req, res) {
    try {
      const { outdoorId } = req.params;
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: "Data inicial e final são obrigatórias" });
      }

      const conflitos = await Disponibilidade.checkAvailability(
        outdoorId,
        data_inicio,
        data_fim
      );
      const isAvailable = conflitos.length === 0;

      res.json({
        disponivel: isAvailable,
        conflitos: conflitos,
        mensagem: isAvailable 
          ? "Outdoor disponível para o período selecionado" 
          : "Outdoor já reservado para o período selecionado"
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar disponibilidade" });
    }
  }

  async createReservation(req, res) {
    try {
      const reserva = await Disponibilidade.createReservation(req.body);
      res.status(201).json({
        message: "Reserva criada com sucesso",
        reserva
      });
    } catch (error) {
      if (error.message === "Outdoor já está reservado para este período") {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro ao criar reserva" });
    }
  }

  async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const reserva = await Disponibilidade.cancelReservation(id);

      if (!reserva) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      res.json({ message: "Reserva cancelada com sucesso", reserva });
    } catch (error) {
      res.status(500).json({ error: "Erro ao cancelar reserva" });
    }
  }

  async getOccupancyReport(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      const startDate = data_inicio || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
      const endDate = data_fim || new Date().toISOString().split('T')[0];

      const report = await Disponibilidade.getOccupancyReport(startDate, endDate);
      res.json({
        periodo: {
          inicio: startDate,
          fim: endDate
        },
        ...report
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar relatório de ocupação" });
    }
  }
}

module.exports = new DisponibilidadeController();
