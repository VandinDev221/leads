'use client';

import {
  Building2,
  Sparkles,
  PhoneCall,
  Flame,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DashboardMetricsProps {
  metrics: {
    totalFound: number;
    novos: number;
    contatados: number;
    interessados: number;
    clientes: number;
    semInteresse: number;
  };
  chartData: Array<{ name: string; val: number; color: string }>;
}

export function DashboardMetrics({ metrics, chartData }: DashboardMetricsProps) {
  const cards = [
    {
      title: 'Total Encontrados',
      value: metrics.totalFound,
      icon: Building2,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Leads Novos',
      value: metrics.novos,
      icon: Sparkles,
      color: 'bg-slate-500',
      textColor: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      title: 'Em Abordagem',
      value: metrics.contatados,
      icon: PhoneCall,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Interessados',
      value: metrics.interessados,
      icon: Flame,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Clientes Conquistados',
      value: metrics.clientes,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico Simples de Prospecção */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Funil de Prospecção
            </h3>
            <p className="text-xs text-slate-500">
              Distribuição dos estabelecimentos salvos por estágio comercial.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
