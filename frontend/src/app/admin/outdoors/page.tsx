// src/app/admin/outdoors/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";
import OutdoorModal from "@/components/admin/OutdoorModal";

interface Outdoor {
  id: number;
  nome: string;
  localizacao: string;
  dimensoes: string;
  preco_mensal: number;
  foto_url: string;
  descricao: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminOutdoors() {
  const [outdoors, setOutdoors] = useState<Outdoor[]>([]);
  const [filteredOutdoors, setFilteredOutdoors] = useState<Outdoor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOutdoor, setSelectedOutdoor] = useState<Outdoor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAtivo, setFilterAtivo] = useState<
    "todos" | "ativos" | "inativos"
  >("todos");

  useEffect(() => {
    fetchOutdoors();
  }, []);

  useEffect(() => {
    filterOutdoors();
  }, [outdoors, searchTerm, filterAtivo]);

  const fetchOutdoors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/api/outdoors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOutdoors(data);
    } catch (error) {
      console.error("Erro ao buscar outdoors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOutdoors = () => {
    let filtered = outdoors;

    // Filtro por status
    if (filterAtivo === "ativos") {
      filtered = filtered.filter((o) => o.ativo);
    } else if (filterAtivo === "inativos") {
      filtered = filtered.filter((o) => !o.ativo);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOutdoors(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este outdoor?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/api/outdoors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchOutdoors();
      }
    } catch (error) {
      console.error("Erro ao excluir outdoor:", error);
    }
  };

  const handleToggleStatus = async (outdoor: Outdoor) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3333/api/outdoors/${outdoor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...outdoor,
            ativo: !outdoor.ativo,
          }),
        }
      );

      if (response.ok) {
        fetchOutdoors();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleEdit = (outdoor: Outdoor) => {
    setSelectedOutdoor(outdoor);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedOutdoor(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOutdoor(null);
    fetchOutdoors();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header com filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Gerenciar Outdoors
            </h1>
            <p className="text-gray-600 mt-1">
              Total de {filteredOutdoors.length} outdoors
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Outdoor
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={filterAtivo}
            onChange={(e) => setFilterAtivo(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Outdoors */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outdoor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dimensões
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Mensal
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
            {filteredOutdoors.map((outdoor) => (
              <tr key={outdoor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {outdoor.foto_url && (
                      <img
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        src={outdoor.foto_url}
                        alt={outdoor.nome}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {outdoor.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {outdoor.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {outdoor.localizacao}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {outdoor.dimensoes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    R${" "}
                    {outdoor.preco_mensal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(outdoor)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      outdoor.ativo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {outdoor.ativo ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inativo
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(outdoor)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(outdoor.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOutdoors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum outdoor encontrado
          </div>
        )}
      </div>

      {/* Modal */}
      <OutdoorModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        outdoor={selectedOutdoor}
      />
    </div>
  );
}
