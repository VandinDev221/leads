'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { FollowUp } from '@/types/business';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import { Clock, CheckCircle2, MessageCircle, Phone, Calendar, AlertTriangle, Building } from 'lucide-react';

export default function FollowUpsPage() {
  const [timeframe, setTimeframe] = useState<'OVERDUE' | 'TODAY' | 'TOMORROW' | 'NEXT_7_DAYS'>('TODAY');
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFollowUps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/followups?timeframe=${timeframe}`);
      const data = await res.json();
      if (data.success) {
        setFollowUps(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar follow-ups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [timeframe]);

  const handleComplete = async (id: string) => {
    setFollowUps(followUps.filter((f) => f.id !== id));
    try {
      await fetch('/api/followups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: true }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Central de Follow-ups"
        subtitle="Acompanhamento rigoroso de contatos agendados e próximos passos"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Abas de Navegação Temporal */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <button
            onClick={() => setTimeframe('OVERDUE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'OVERDUE'
                ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>ATRASADOS</span>
          </button>

          <button
            onClick={() => setTimeframe('TODAY')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'TODAY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>HOJE</span>
          </button>

          <button
            onClick={() => setTimeframe('TOMORROW')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'TOMORROW'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>AMANHÃ</span>
          </button>

          <button
            onClick={() => setTimeframe('NEXT_7_DAYS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'NEXT_7_DAYS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>PRÓXIMOS 7 DIAS</span>
          </button>
        </div>

        {/* Lista de Follow-ups */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando agendamentos...</p>
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-base font-bold text-slate-800">
              Nenhum follow-up pendente nesta categoria!
            </p>
            <p className="text-xs text-slate-400">
              Todos os contatos agendados para este período foram concluídos.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {followUps.map((item) => {
              const waUrl = formatWhatsappUrl(item.lead?.whatsapp || item.lead?.phone);

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/leads/${item.leadId}`}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors"
                        >
                          {item.lead?.name || 'Lead sem nome'}
                        </Link>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.lead?.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {item.notes || 'Sem observações cadastradas'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Agendado: {new Date(item.scheduledAt).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(item.scheduledAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>Canal: {item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}

                    {item.lead?.phone && (
                      <a
                        href={`tel:${item.lead.phone}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Ligar
                      </a>
                    )}

                    <button
                      onClick={() => handleComplete(item.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Concluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
