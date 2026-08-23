'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalFound: 0,
    novos: 0,
    contatados: 0,
    interessados: 0,
    clientes: 0,
    semInteresse: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
          setChartData(data.statusChartData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Dashboard de Prospecção"
        subtitle="Visão geral e progresso das abordagens comerciais"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando métricas...</p>
          </div>
        ) : (
          <DashboardMetrics metrics={metrics} chartData={chartData} />
        )}
      </main>
    </div>
  );
}
