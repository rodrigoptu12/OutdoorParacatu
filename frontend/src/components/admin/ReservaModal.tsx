// components/admin/ReservaModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataInicio?: string;
  dataFim?: string;
}

interface Outdoor {
  id: number;
  nome: string;
  localizacao: string;
  preco_mensal: number;
  ativo: boolean;
}

interface ConflitosInfo {
  disponivel: boolean;
  conflitos: any[];
  mensagem: string;
}

export default function ReservaModal({
  isOpen,
  onClose,
  dataInicio,
  dataFim,
}: ReservaModalProps) {
  const [formData, setFormData] = useState({
    outdoor_id: "",
    data_inicio: dataInicio || "",
    data_fim: dataFim || "",
    cliente_nome: "",
    cliente_contato: "",
    cliente_email: "",
    observacoes: "",
  });

  const [outdoors, setOutdoors] = useState<Outdoor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOutdoors, setLoadingOutdoors] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState("");
  const [valorEstimado, setValorEstimado] = useState<number | null>(null);
  const [diasReserva, setDiasReserva] = useState<number>(0);
  const [disponibilidade, setDisponibilidade] = useState<ConflitosInfo | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      fetchOutdoors();
      // Reset form when modal opens
      setFormData({
        outdoor_id: "",
        data_inicio: dataInicio || new Date().toISOString().split("T")[0],
        data_fim: dataFim || new Date().toISOString().split("T")[0],
        cliente_nome: "",
        cliente_contato: "",
        cliente_email: "",
        observacoes: "",
      });
      setError("");
      setValorEstimado(null);
      setDisponibilidade(null);
    }
  }, [isOpen, dataInicio, dataFim]);

  useEffect(() => {
    // Calcular dias e valor estimado quando mudar datas ou outdoor
    if (formData.data_inicio && formData.data_fim && formData.outdoor_id) {
      const outdoor = outdoors.find(
        (o) => o.id === parseInt(formData.outdoor_id)
      );
      if (outdoor) {
        const inicio = new Date(formData.data_inicio);
        const fim = new Date(formData.data_fim);
        const dias =
          Math.ceil(
            (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        setDiasReserva(dias);

        if (dias > 0) {
          const valorDiario = outdoor.preco_mensal / 30;
          setValorEstimado(valorDiario * dias);
          checkAvailability();
        } else {
          setValorEstimado(null);
          setDiasReserva(0);
        }
      }
    }
  }, [formData.data_inicio, formData.data_fim, formData.outdoor_id, outdoors]);

  const fetchOutdoors = async () => {
    setLoadingOutdoors(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3333/api/outdoors?ativo=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOutdoors(data);
    } catch (error) {
      console.error("Erro ao buscar outdoors:", error);
      setError("Erro ao carregar outdoors");
    } finally {
      setLoadingOutdoors(false);
    }
  };

  const checkAvailability = async () => {
    if (!formData.outdoor_id || !formData.data_inicio || !formData.data_fim)
      return;

    setCheckingAvailability(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3333/api/disponibilidade/check/${formData.outdoor_id}?data_inicio=${formData.data_inicio}&data_fim=${formData.data_fim}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setDisponibilidade(data);
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validar datas
    if (new Date(formData.data_fim) < new Date(formData.data_inicio)) {
      setError("A data final deve ser maior ou igual à data inicial");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3333/api/disponibilidade/reservar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            outdoor_id: parseInt(formData.outdoor_id),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar reserva");
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao criar reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Spacer for centering */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Nova Reserva</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {loadingOutdoors ? (
              <div className="flex items-center justify-center py-8">
                <div className="loader"></div>
                <span className="ml-2 text-gray-500">
                  Carregando outdoors...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Seleção de Outdoor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outdoor *
                  </label>
                  <select
                    required
                    value={formData.outdoor_id}
                    onChange={(e) =>
                      setFormData({ ...formData, outdoor_id: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="">Selecione um outdoor</option>
                    {outdoors.map((outdoor) => (
                      <option key={outdoor.id} value={outdoor.id}>
                        {outdoor.nome} - {outdoor.localizacao} (R${" "}
                        {outdoor.preco_mensal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                        /mês)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Inicial *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          data_inicio: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Final *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_fim}
                      onChange={(e) =>
                        setFormData({ ...formData, data_fim: e.target.value })
                      }
                      min={
                        formData.data_inicio ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                </div>

                {/* Informações de disponibilidade e valor */}
                {formData.outdoor_id &&
                  formData.data_inicio &&
                  formData.data_fim && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Período:</span>
                        <span className="text-sm font-medium">
                          {diasReserva} dias
                        </span>
                      </div>
                      {valorEstimado && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Valor estimado:
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            R${" "}
                            {valorEstimado.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                {/* Dados do Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cliente_nome}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente_nome: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contato *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(38) 99999-9999"
                      value={formData.cliente_contato}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cliente_contato: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.cliente_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cliente_email: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                    placeholder="Informações adicionais sobre a reserva..."
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  loadingOutdoors ||
                  !!(disponibilidade && !disponibilidade.disponivel)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
