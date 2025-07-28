// components/admin/ReservaModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mes: number;
  ano: number;
}

interface Outdoor {
  id: number;
  nome: string;
  localizacao: string;
  preco_mensal: number;
}

export default function ReservaModal({
  isOpen,
  onClose,
  mes,
  ano,
}: ReservaModalProps) {
  const [formData, setFormData] = useState({
    outdoor_id: "",
    cliente_nome: "",
    cliente_contato: "",
    cliente_email: "",
    observacoes: "",
  });
  const [outdoors, setOutdoors] = useState<Outdoor[]>([]);
  const [outdoorsDisponiveis, setOutdoorsDisponiveis] = useState<Outdoor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchOutdoors();
    }
  }, [isOpen, mes, ano]);

  const fetchOutdoors = async () => {
    try {
      const token = localStorage.getItem("token");

      // Buscar todos os outdoors
      const outdoorsRes = await fetch(
        "http://localhost:3333/api/outdoors?ativo=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allOutdoors = await outdoorsRes.json();
      setOutdoors(allOutdoors);

      // Buscar disponibilidades do mês
      const disponibilidadeRes = await fetch(
        `http://localhost:3333/api/disponibilidade?mes=${mes}&ano=${ano}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const disponibilidades = await disponibilidadeRes.json();

      // Filtrar outdoors disponíveis
      const ocupadosIds = disponibilidades
        .filter((d: any) => d.status === "ocupado")
        .map((d: any) => d.outdoor_id);

      const disponiveis = allOutdoors.filter(
        (o: Outdoor) => !ocupadosIds.includes(o.id)
      );
      setOutdoorsDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao buscar outdoors:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
            mes,
            ano,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar reserva");
      }

      // Resetar formulário
      setFormData({
        outdoor_id: "",
        cliente_nome: "",
        cliente_contato: "",
        cliente_email: "",
        observacoes: "",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao criar reserva");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Nova Reserva - {meses[mes - 1]}/{ano}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Outdoor
                </label>
                <select
                  required
                  value={formData.outdoor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, outdoor_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Selecione um outdoor</option>
                  {outdoorsDisponiveis.map((outdoor) => (
                    <option key={outdoor.id} value={outdoor.id}>
                      {outdoor.nome} - {outdoor.localizacao} (R${" "}
                      {outdoor.preco_mensal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      )
                    </option>
                  ))}
                </select>
                {outdoorsDisponiveis.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    Todos os outdoors já estão reservados para este período
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  required
                  value={formData.cliente_nome}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente_nome: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contato
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-mail
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="Informações adicionais sobre a reserva..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || outdoorsDisponiveis.length === 0}
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
