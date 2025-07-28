// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Map, Calendar, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalOutdoors: number;
  outdoorsAtivos: number;
  reservasAtivas: number;
  taxaOcupacao: number;
  receitaMensal: number;
  proximasReservas: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalOutdoors: 0,
    outdoorsAtivos: 0,
    reservasAtivas: 0,
    taxaOcupacao: 0,
    receitaMensal: 0,
    proximasReservas: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Buscar outdoors
      const outdoorsRes = await fetch("http://localhost:3333/api/outdoors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const outdoors = await outdoorsRes.json();

      // Buscar disponibilidades do mês atual
      const disponibilidadeRes = await fetch(
        `http://localhost:3333/api/disponibilidade?mes=${currentMonth}&ano=${currentYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const disponibilidades = await disponibilidadeRes.json();

      // Calcular estatísticas
      const totalOutdoors = outdoors.length;
      const outdoorsAtivos = outdoors.filter((o: any) => o.ativo).length;
      const reservasAtivas = disponibilidades.filter(
        (d: any) => d.status === "ocupado"
      ).length;
      const taxaOcupacao =
        outdoorsAtivos > 0
          ? Math.round((reservasAtivas / outdoorsAtivos) * 100)
          : 0;

      // Calcular receita mensal
      const receitaMensal = disponibilidades
        .filter((d: any) => d.status === "ocupado")
        .reduce((total: number, d: any) => {
          const outdoor = outdoors.find((o: any) => o.id === d.outdoor_id);
          return total + (outdoor?.preco_mensal || 0);
        }, 0);

      setData({
        totalOutdoors,
        outdoorsAtivos,
        reservasAtivas,
        taxaOcupacao,
        receitaMensal,
        proximasReservas: disponibilidades
          .filter((d: any) => d.status === "ocupado")
          .slice(0, 5),
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  const stats = [
    {
      name: "Total de Outdoors",
      value: data.totalOutdoors,
      icon: Map,
      color: "bg-blue-500",
      href: "/admin/outdoors",
    },
    {
      name: "Outdoors Ativos",
      value: data.outdoorsAtivos,
      icon: TrendingUp,
      color: "bg-green-500",
      href: "/admin/outdoors",
    },
    {
      name: "Reservas Ativas",
      value: data.reservasAtivas,
      icon: Calendar,
      color: "bg-purple-500",
      href: "/admin/reservas",
    },
    {
      name: "Taxa de Ocupação",
      value: `${data.taxaOcupacao}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      href: "/admin/reservas",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bem-vindo ao Painel Administrativo
        </h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de outdoors</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Receita Mensal
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Receita Mensal Estimada
            </h3>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-3xl font-bold text-green-600">
            R${" "}
            {data.receitaMensal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Baseado nas reservas ativas do mês atual
          </p>
        </div>
      </div> */}

      {/* Próximas Reservas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Reservas Ativas</h3>
        </div>
        <div className="px-6 py-4">
          {data.proximasReservas.length > 0 ? (
            <div className="space-y-3">
              {data.proximasReservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reserva.outdoor_nome}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cliente: {reserva.cliente_nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {reserva.mes}/{reserva.ano}
                    </p>
                    <p className="text-xs text-gray-500">
                      {reserva.localizacao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhuma reserva ativa no momento
            </p>
          )}
        </div>
        <div className="px-6 py-3 bg-gray-50 text-right">
          <Link
            href="/admin/reservas"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Ver todas as reservas →
          </Link>
        </div>
      </div>
    </div>
  );
}
