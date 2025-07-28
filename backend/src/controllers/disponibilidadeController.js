const Disponibilidade = require("../models/Disponibilidade");

class DisponibilidadeController {
  async getByPeriod(req, res) {
    try {
      const { mes, ano } = req.query;

      if (!mes || !ano) {
        return res.status(400).json({ error: "Mês e ano são obrigatórios" });
      }

      const disponibilidades = await Disponibilidade.findByPeriod(mes, ano);
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
      const { mes, ano } = req.query;

      if (!mes || !ano) {
        return res.status(400).json({ error: "Mês e ano são obrigatórios" });
      }

      const disponibilidade = await Disponibilidade.checkAvailability(
        outdoorId,
        mes,
        ano
      );
      const isAvailable =
        !disponibilidade || disponibilidade.status === "disponivel";

      res.json({
        disponivel: isAvailable,
        detalhes: disponibilidade,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar disponibilidade" });
    }
  }

  async createReservation(req, res) {
    try {
      const reserva = await Disponibilidade.createReservation(req.body);
      res.status(201).json(reserva);
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
      const { startMonth, startYear, endMonth, endYear } = req.query;

      const startM = startMonth || 1;
      const startY = startYear || new Date().getFullYear();
      const endM = endMonth || 12;
      const endY = endYear || new Date().getFullYear();

      const report = await Disponibilidade.getOccupancyReport(
        startM,
        startY,
        endM,
        endY
      );
      res.json({
        periodo: {
          inicio: { mes: startM, ano: startY },
          fim: { mes: endM, ano: endY },
        },
        relatorio: report,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar relatório de ocupação" });
    }
  }
}

module.exports = new DisponibilidadeController();
