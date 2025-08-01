"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";
import DatePickerWithOccupancy from "./DatePickerWithOccupancy";

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

interface PeriodoOcupado {
  data_inicio: string;
  data_fim: string;
  cliente_nome?: string;
}

interface ReservaState {
  loading: boolean;
  error: string;
  outdoors: Outdoor[];
  periodosOcupados: PeriodoOcupado[];
  disponivel: boolean;
  valorEstimado: number | null;
  diasReserva: number;
}

const API_BASE = "http://localhost:3333/api";

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

  const [state, setState] = useState<ReservaState>({
    loading: false,
    error: "",
    outdoors: [],
    periodosOcupados: [],
    disponivel: true,
    valorEstimado: null,
    diasReserva: 0,
  });

  // Utility functions
  const getToken = () => localStorage.getItem("token");
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const parseDate = (dateStr: string) => new Date(dateStr);
  
  const calculateDays = (inicio: string, fim: string) => {
    const start = parseDate(inicio);
    const end = parseDate(fim);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateValue = (outdoor: Outdoor, days: number) => {
    return (outdoor.preco_mensal / 30) * days;
  };

  const isDateOccupied = useCallback((dateString: string) => {
    const date = parseDate(dateString);
    return state.periodosOcupados.some((periodo) => {
      const inicio = parseDate(periodo.data_inicio);
      const fim = parseDate(periodo.data_fim);
      return date >= inicio && date <= fim;
    });
  }, [state.periodosOcupados]);

  const getOccupiedDatesForInput = useCallback(() => {
    const occupiedDates: string[] = [];
    
    state.periodosOcupados.forEach((periodo) => {
      const inicio = parseDate(periodo.data_inicio);
      const fim = parseDate(periodo.data_fim);
      
      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        occupiedDates.push(formatDate(d));
      }
    });
    
    return occupiedDates;
  }, [state.periodosOcupados]);

  // API calls
  const fetchOutdoors = async () => {
    try {
      const response = await fetch(`${API_BASE}/outdoors?ativo=true`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      setState(prev => ({ ...prev, outdoors: data, error: "" }));
    } catch (error) {
      setState(prev => ({ ...prev, error: "Erro ao carregar outdoors" }));
    }
  };

  const fetchPeriodosOcupados = async (outdoorId: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const hoje = new Date();
      const seisMesesDepois = new Date();
      seisMesesDepois.setMonth(seisMesesDepois.getMonth() + 6);
      
      const response = await fetch(
        `${API_BASE}/disponibilidade?outdoor_id=${outdoorId}&data_inicio=${formatDate(hoje)}&data_fim=${formatDate(seisMesesDepois)}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      const data = await response.json();
      const ocupados = data
        .filter((d: any) => d.status === "ocupado" && d.outdoor_id === parseInt(outdoorId))
        .map((d: any) => ({
          data_inicio: d.data_inicio,
          data_fim: d.data_fim,
          cliente_nome: d.cliente_nome,
        }));
        
      setState(prev => ({ ...prev, periodosOcupados: ocupados, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: "Erro ao carregar períodos ocupados", 
        loading: false 
      }));
    }
  };

  const checkAvailability = async () => {
    if (!formData.outdoor_id || !formData.data_inicio || !formData.data_fim) return;

    try {
      const response = await fetch(
        `${API_BASE}/disponibilidade/check/${formData.outdoor_id}?data_inicio=${formData.data_inicio}&data_fim=${formData.data_fim}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      const { disponivel } = await response.json();
      setState(prev => ({ ...prev, disponivel }));
    } catch (error) {
      setState(prev => ({ ...prev, disponivel: false }));
    }
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      fetchOutdoors();
      setFormData({
        outdoor_id: "",
        data_inicio: dataInicio || formatDate(new Date()),
        data_fim: dataFim || formatDate(new Date()),
        cliente_nome: "",
        cliente_contato: "",
        cliente_email: "",
        observacoes: "",
      });
      setState({
        loading: false,
        error: "",
        outdoors: [],
        periodosOcupados: [],
        disponivel: true,
        valorEstimado: null,
        diasReserva: 0,
      });
    }
  }, [isOpen, dataInicio, dataFim]);

  useEffect(() => {
    if (formData.outdoor_id) {
      fetchPeriodosOcupados(formData.outdoor_id);
    } else {
      setState(prev => ({ ...prev, periodosOcupados: [] }));
    }
  }, [formData.outdoor_id]);

  useEffect(() => {
    if (formData.data_inicio && formData.data_fim && formData.outdoor_id) {
      const outdoor = state.outdoors.find(o => o.id === parseInt(formData.outdoor_id));
      if (outdoor) {
        const dias = calculateDays(formData.data_inicio, formData.data_fim);
        const valor = dias > 0 ? calculateValue(outdoor, dias) : null;
        
        setState(prev => ({ 
          ...prev, 
          diasReserva: dias, 
          valorEstimado: valor 
        }));
        
        if (dias > 0) checkAvailability();
      }
    }
  }, [formData.data_inicio, formData.data_fim, formData.outdoor_id, state.outdoors]);

  // Handlers
  const handleDateChange = (field: 'data_inicio' | 'data_fim', dateString: string) => {
    if (!dateString) return;
    
    if (formData.outdoor_id && isDateOccupied(dateString)) {
      setState(prev => ({ ...prev, error: "Esta data está ocupada! Escolha outra data." }));
      return;
    }
    
    setState(prev => ({ ...prev, error: "" }));
    setFormData(prev => ({ ...prev, [field]: dateString }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseDate(formData.data_fim) < parseDate(formData.data_inicio)) {
      setState(prev => ({ ...prev, error: "A data final deve ser maior ou igual à data inicial" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch(`${API_BASE}/disponibilidade/reservar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...formData,
          outdoor_id: parseInt(formData.outdoor_id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar reserva");
      }

      onClose();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Erro ao criar reserva" }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  if (!isOpen) return null;

  const selectedOutdoor = state.outdoors.find(o => o.id === parseInt(formData.outdoor_id));
  const hasOccupiedPeriods = state.periodosOcupados.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Nova Reserva</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {state.error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm" role="alert">
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              {/* Outdoor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outdoor *
                </label>
                <select
                  required
                  value={formData.outdoor_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, outdoor_id: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  aria-label="Selecionar outdoor"
                >
                  <option value="">Selecione um outdoor</option>
                  {state.outdoors.map((outdoor) => (
                    <option key={outdoor.id} value={outdoor.id}>
                      {outdoor.nome} - {outdoor.localizacao} (R$ {outdoor.preco_mensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês)
                    </option>
                  ))}
                </select>
              </div>

              {/* Occupied Periods Warning */}
              {formData.outdoor_id && hasOccupiedPeriods && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Períodos já reservados:
                      </p>
                      <ul className="mt-1 text-xs text-red-700 space-y-1">
                        {state.periodosOcupados.slice(0, 3).map((periodo, index) => (
                          <li key={index}>
                            {parseDate(periodo.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                            {parseDate(periodo.data_fim).toLocaleDateString("pt-BR")}
                            {periodo.cliente_nome && ` - ${periodo.cliente_nome}`}
                          </li>
                        ))}
                        {state.periodosOcupados.length > 3 && (
                          <li className="text-red-600 font-medium">
                            e mais {state.periodosOcupados.length - 3} períodos...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePickerWithOccupancy
                  label="Data Inicial *"
                  value={formData.data_inicio}
                  onChange={(dateString) => handleDateChange('data_inicio', dateString)}
                  required
                  occupiedDates={getOccupiedDatesForInput()}
                />
                <DatePickerWithOccupancy
                  label="Data Final *"
                  value={formData.data_fim}
                  onChange={(dateString) => handleDateChange('data_fim', dateString)}
                  required
                  occupiedDates={getOccupiedDatesForInput()}
                />
              </div>

              {/* Availability Warning */}
              {!state.disponivel && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <p className="text-sm font-medium text-red-800">
                      Período não disponível - escolha outras datas
                    </p>
                  </div>
                </div>
              )}

              {/* Reservation Summary */}
              {selectedOutdoor && state.disponivel && state.diasReserva > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Período:</span>
                    <span className="text-sm font-medium">{state.diasReserva} dias</span>
                  </div>
                  {state.valorEstimado && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor estimado:</span>
                      <span className="text-sm font-medium text-green-600">
                        R$ {state.valorEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Client Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cliente_nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, cliente_nome: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(38) 99999-9999"
                    value={formData.cliente_contato}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente_contato: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente_email: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  placeholder="Informações adicionais sobre a reserva..."
                />
              </div>
            </div>

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
                disabled={state.loading || !state.disponivel}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? "Criando..." : "Criar Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}