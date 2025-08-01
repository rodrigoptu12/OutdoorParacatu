// app/admin/reservas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus, X, Search, Filter, Eye } from "lucide-react";
import ReservaModal from "@/components/admin/ReservaModal";

interface Reserva {
  id: number;
  outdoor_id: number;
  outdoor_nome?: string;
  localizacao?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  cliente_nome: string;
  cliente_contato: string;
  cliente_email: string;
  valor_total: number;
  data_reserva: string;
  observacoes: string;
  dias?: number;
  valor_diario?: number;
}

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterDataFim, setFilterDataFim] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  });
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    fetchReservas();
  }, [filterDataInicio, filterDataFim]);

  useEffect(() => {
    filterReservas();
  }, [reservas, searchTerm]);

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3333/api/disponibilidade?data_inicio=${filterDataInicio}&data_fim=${filterDataFim}`,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const calculateDays = (inicio: string, fim: string) => {
    const start = new Date(inicio);
    const end = new Date(fim);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

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
              {reservasOcupadas.length} reservas ativas no período selecionado
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              {viewMode === "grid" ? "Tabela" : "Grid"}
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </button>
          </div>
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
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">De:</label>
            <input
              type="date"
              value={filterDataInicio}
              onChange={(e) => setFilterDataInicio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Até:</label>
            <input
              type="date"
              value={filterDataFim}
              onChange={(e) => setFilterDataFim(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Visualização em Grid */}
      {viewMode === "grid" ? (
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
                  {formatDate(reserva.data_inicio)} até{" "}
                  {formatDate(reserva.data_fim)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Dias:</span>{" "}
                  {calculateDays(reserva.data_inicio, reserva.data_fim)} dias
                </p>

                {reserva.status === "ocupado" && (
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
                      <span className="font-medium">Valor Total:</span> R${" "}
                      {reserva.valor_total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    {reserva.observacoes && (
                      <p className="text-gray-600">
                        <span className="font-medium">Obs:</span>{" "}
                        {reserva.observacoes}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visualização em Tabela */
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outdoor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservas.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reserva.outdoor_nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reserva.localizacao}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(reserva.data_inicio)} -{" "}
                      {formatDate(reserva.data_fim)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {calculateDays(reserva.data_inicio, reserva.data_fim)}{" "}
                      dias
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {reserva.cliente_nome}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reserva.cliente_contato}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R${" "}
                      {reserva.valor_total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reserva.status === "ocupado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reserva.status === "ocupado"
                        ? "Reservado"
                        : "Disponível"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {reserva.status === "ocupado" && (
                      <button
                        onClick={() => handleCancelReserva(reserva.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredReservas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma reserva encontrada para este período
        </div>
      )}

      {/* Modal */}
      <ReservaModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        dataInicio={filterDataInicio}
        dataFim={filterDataFim}
      />
    </div>
  );
}
