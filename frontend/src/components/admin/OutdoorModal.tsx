// components/admin/OutdoorModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Outdoor {
  id: number;
  nome: string;
  localizacao: string;
  dimensoes: string;
  preco_mensal: number;
  foto_url: string;
  descricao: string;
  ativo: boolean;
}

interface OutdoorModalProps {
  isOpen: boolean;
  onClose: () => void;
  outdoor: Outdoor | null;
}

export default function OutdoorModal({
  isOpen,
  onClose,
  outdoor,
}: OutdoorModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
    dimensoes: "",
    preco_mensal: "",
    foto_url: "",
    descricao: "",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (outdoor) {
      setFormData({
        nome: outdoor.nome,
        localizacao: outdoor.localizacao,
        dimensoes: outdoor.dimensoes,
        preco_mensal: outdoor.preco_mensal.toString(),
        foto_url: outdoor.foto_url || "",
        descricao: outdoor.descricao || "",
        ativo: outdoor.ativo,
      });
    } else {
      setFormData({
        nome: "",
        localizacao: "",
        dimensoes: "",
        preco_mensal: "",
        foto_url: "",
        descricao: "",
        ativo: true,
      });
    }
    setError("");
  }, [outdoor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = outdoor
        ? `http://localhost:3333/api/outdoors/${outdoor.id}`
        : "http://localhost:3333/api/outdoors";
      const method = outdoor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          preco_mensal: parseFloat(formData.preco_mensal),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar outdoor");
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar outdoor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              {outdoor ? "Editar Outdoor" : "Novo Outdoor"}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Outdoor
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Localização
                </label>
                <input
                  type="text"
                  required
                  value={formData.localizacao}
                  onChange={(e) =>
                    setFormData({ ...formData, localizacao: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dimensões
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 9x3 metros"
                  value={formData.dimensoes}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensoes: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço Mensal (R$)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.preco_mensal}
                  onChange={(e) =>
                    setFormData({ ...formData, preco_mensal: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  URL da Foto
                </label>
                <input
                  type="url"
                  value={formData.foto_url}
                  onChange={(e) =>
                    setFormData({ ...formData, foto_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Outdoor ativo
                  </span>
                </label>
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
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
