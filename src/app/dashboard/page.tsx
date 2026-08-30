'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { LeadScoreBadge } from '@/components/business/lead-score-badge';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import {
  Users,
  Building2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  DollarSign,
  Award,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics || {});
          setChartData(data.statusChartData || []);
          setTopLeads(data.topLeads || []);
        }
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar title="Dashboard Comercial" subtitle="Métricas e funil de conversão B2B" />
        <div className="p-12 text-center">
          <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
          <p className="text-sm font-semibold text-slate-600">Carregando métricas de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Dashboard Comercial" subtitle="Métricas de prospecção, acompanhamento e conversão B2B" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Banner de Ações Rápidas & Resumo */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">Máquina de Prospecção Comercial</h2>
            <p className="text-xs text-slate-400">
              Taxa de Resposta: <span className="text-blue-400 font-bold">{metrics?.responseRate || 0}%</span> | 
              Taxa de Conversão em Clientes: <span className="text-emerald-400 font-bold">{metrics?.conversionRate || 0}%</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/prospecting"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-4 h-4" /> Iniciar Modo Prospecção
            </Link>
          </div>
        </div>

        {/* Cards de Métricas Reais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Leads Encontrados</span>
            <p className="text-xl font-extrabold text-slate-900">{metrics?.totalFound || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Leads Novos</span>
            <p className="text-xl font-extrabold text-slate-600">{metrics?.novos || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Contatados</span>
            <p className="text-xl font-extrabold text-blue-600">{metrics?.contatados || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Interessados</span>
            <p className="text-xl font-extrabold text-purple-600">{metrics?.interessados || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Propostas</span>
            <p className="text-xl font-extrabold text-amber-600">{metrics?.propostas || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Clientes</span>
            <p className="text-xl font-extrabold text-emerald-600">{metrics?.clientes || 0}</p>
          </div>
        </div>

        {/* Seção PRÓXIMAS AÇÕES (Acionável) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/follow-ups?timeframe=OVERDUE"
            className="p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-center justify-between hover:bg-red-100/80 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-red-900 uppercase">Follow-ups Atrasados</h4>
                <p className="text-lg font-black text-red-700">{metrics?.overdueFollowUpsCount || 0} pendentes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/follow-ups?timeframe=TODAY"
            className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between hover:bg-blue-100/80 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-blue-900 uppercase">Follow-ups Para Hoje</h4>
                <p className="text-lg font-black text-blue-700">{metrics?.todayFollowUpsCount || 0} agendados</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/prospecting"
            className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-center justify-between hover:bg-purple-100/80 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-purple-900 uppercase">Fila de Prospecção</h4>
                <p className="text-lg font-black text-purple-700">{metrics?.novos || 0} não abordados</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gráfico do Funil & Ranking de Melhores Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funil Visual de Conversão */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Funil de Conversão Comercial (Estágios)
            </h3>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking PRÓXIMOS MELHORES LEADS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> Próximos Melhores Leads
                </h3>
              </div>

              <div className="space-y-3 divide-y divide-slate-100">
                {topLeads.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum lead pendente.</p>
                ) : (
                  topLeads.map((lead, idx) => (
                    <div key={lead.id} className="pt-2 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                          <Link
                            href={`/leads/${lead.id}`}
                            className="font-bold text-xs text-slate-900 hover:text-blue-600 line-clamp-1"
                          >
                            {lead.name}
                          </Link>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Oportunidade: {lead.mainOpportunity}
                        </p>
                      </div>

                      <LeadScoreBadge scoreInfo={lead.scoreInfo} size="sm" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/prospecting"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 text-center block transition-all"
            >
              Abordar Próximo Lead Agora
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
