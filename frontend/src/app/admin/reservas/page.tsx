// app/admin/reservas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus, X, Search, Filter } from "lucide-react";
import ReservaModal from "@/components/admin/ReservaModal";

interface Reserva {
  id: number;
  outdoor_id: number;
  outdoor_nome: string;
  localizacao: string;
  mes: number;
  ano: number;
  status: string;
  cliente_nome: string;
  cliente_contato: string;
  cliente_email: string;
  data_reserva: string;
  observacoes: string;
}

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMes, setFilterMes] = useState<number>(new Date().getMonth() + 1);
  const [filterAno, setFilterAno] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchReservas();
  }, [filterMes, filterAno]);

  useEffect(() => {
    filterReservas();
  }, [reservas, searchTerm]);

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3333/api/disponibilidade?mes=${filterMes}&ano=${filterAno}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservas = () => {
    let filtered = reservas;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.outdoor_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReservas(filtered);
  };

  const handleCancelReserva = async (id: number) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3333/api/disponibilidade/cancelar/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchReservas();
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const handleAdd = () => {
    setSelectedReserva(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedReserva(null);
    fetchReservas();
  };

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  const reservasOcupadas = filteredReservas.filter(
    (r) => r.status === "ocupado"
  );

  return (
    <div>
      {/* Header com filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Gerenciar Reservas
            </h1>
            <p className="text-gray-600 mt-1">
              {reservasOcupadas.length} reservas ativas em{" "}
              {meses[filterMes - 1]}/{filterAno}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Reserva
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou outdoor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={filterMes}
            onChange={(e) => setFilterMes(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index + 1}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={filterAno}
            onChange={(e) => setFilterAno(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {[2024, 2025, 2026].map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Reservas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReservas.map((reserva) => (
          <div
            key={reserva.id}
            className={`bg-white rounded-lg shadow p-4 ${
              reserva.status === "ocupado"
                ? "border-l-4 border-green-500"
                : "border-l-4 border-gray-300"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">
                {reserva.outdoor_nome}
              </h3>
              {reserva.status === "ocupado" && (
                <button
                  onClick={() => handleCancelReserva(reserva.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Cancelar reserva"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Localização:</span>{" "}
                {reserva.localizacao}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Período:</span>{" "}
                {meses[reserva.mes - 1]}/{reserva.ano}
              </p>

              {reserva.status === "ocupado" ? (
                <>
                  <p className="text-gray-600">
                    <span className="font-medium">Cliente:</span>{" "}
                    {reserva.cliente_nome}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Contato:</span>{" "}
                    {reserva.cliente_contato}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${reserva.cliente_email}`}
                      className="text-green-600 hover:underline"
                    >
                      {reserva.cliente_email}
                    </a>
                  </p>
                  {reserva.observacoes && (
                    <p className="text-gray-600">
                      <span className="font-medium">Obs:</span>{" "}
                      {reserva.observacoes}
                    </p>
                  )}
                </>
              ) : (
                <div className="pt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Disponível
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReservas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma reserva encontrada para este período
        </div>
      )}

      {/* Modal */}
      <ReservaModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mes={filterMes}
        ano={filterAno}
      />
    </div>
  );
}
