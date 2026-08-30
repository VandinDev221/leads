'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { ProspectStatusBadge } from '@/components/business/prospect-status-badge';
import { LeadScoreBadge } from '@/components/business/lead-score-badge';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import { Business, ProspectStatus } from '@/types/business';
import { Kanban, MapPin, Phone, MessageCircle, ExternalLink, ArrowRightLeft } from 'lucide-react';

const STAGE_LABELS: Record<ProspectStatus, string> = {
  NOVO: '1. Novos',
  QUALIFICADO: '2. Qualificados',
  CONTATAR: '3. A Contatar',
  CONTATADO: '4. Contatados',
  RESPONDEU: '5. Responderam',
  INTERESSADO: '6. Interessados',
  PROPOSTA: '7. Proposta',
  NEGOCIACAO: '8. Negociação',
  CLIENTE: '9. Clientes',
  SEM_INTERESSE: '10. Sem Interesse',
  PERDIDO: '11. Perdidos',
};

const STAGE_COLORS: Record<ProspectStatus, string> = {
  NOVO: 'border-t-slate-400 bg-slate-50/50',
  QUALIFICADO: 'border-t-blue-400 bg-blue-50/30',
  CONTATAR: 'border-t-amber-400 bg-amber-50/30',
  CONTATADO: 'border-t-indigo-400 bg-indigo-50/30',
  RESPONDEU: 'border-t-purple-400 bg-purple-50/30',
  INTERESSADO: 'border-t-pink-400 bg-pink-50/30',
  PROPOSTA: 'border-t-yellow-500 bg-yellow-50/30',
  NEGOCIACAO: 'border-t-orange-500 bg-orange-50/30',
  CLIENTE: 'border-t-emerald-500 bg-emerald-50/30',
  SEM_INTERESSE: 'border-t-red-400 bg-red-50/30',
  PERDIDO: 'border-t-red-600 bg-red-100/30',
};

export default function PipelinePage() {
  const [pipelineData, setPipelineData] = useState<Record<string, Business[]>>({});
  const [stages, setStages] = useState<ProspectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);

  const fetchPipeline = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pipeline');
      const data = await res.json();
      if (data.success) {
        setPipelineData(data.data || {});
        setStages(data.stages || []);
      }
    } catch (err) {
      console.error('Erro ao buscar pipeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleMoveStage = async (lead: Business, newStage: ProspectStatus) => {
    if (lead.prospectStatus === newStage) return;
    setMovingLeadId(lead.id);

    // Atualizar localmente a estrutura do Kanban
    const oldStage = lead.prospectStatus || 'NOVO';
    const updatedOld = (pipelineData[oldStage] || []).filter((l) => l.id !== lead.id);
    const updatedNew = [{ ...lead, prospectStatus: newStage }, ...(pipelineData[newStage] || [])];

    setPipelineData({
      ...pipelineData,
      [oldStage]: updatedOld,
      [newStage]: updatedNew,
    });

    try {
      await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          newStatus: newStage,
        }),
      });
    } catch (err) {
      console.error('Erro ao mover lead:', err);
    } finally {
      setMovingLeadId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Pipeline Kanban" subtitle="Visualização em quadro do funil de vendas B2B" />

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Quadro de Prospecção</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Selecione o novo estágio no card para mover o lead com histórico automático
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando pipeline Kanban...</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6">
            {stages.map((stage) => {
              const leadsInStage = pipelineData[stage] || [];

              return (
                <div
                  key={stage}
                  className={`w-72 shrink-0 rounded-2xl border border-slate-200 p-3 space-y-3 border-t-4 ${STAGE_COLORS[stage]}`}
                >
                  {/* Header da Coluna */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-extrabold text-xs text-slate-800">
                      {STAGE_LABELS[stage] || stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                      {leadsInStage.length}
                    </span>
                  </div>

                  {/* Cards da Coluna */}
                  <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                    {leadsInStage.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        Nenhum lead neste estágio.
                      </div>
                    ) : (
                      leadsInStage.map((lead) => {
                        const waUrl = formatWhatsappUrl(lead.whatsapp || lead.phone);

                        return (
                          <div
                            key={lead.id}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2.5 group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 line-clamp-1">
                                  {lead.category}
                                </span>
                                <LeadScoreBadge scoreInfo={lead.scoreInfo} size="sm" />
                              </div>

                              <Link
                                href={`/leads/${lead.id}`}
                                className="font-bold text-xs text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                              >
                                {lead.name}
                              </Link>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 line-clamp-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {lead.city || 'Não informado'}
                              </span>
                            </div>

                            {/* Seletor Rápido de Movimentação de Estágio */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                {lead.phone && (
                                  <a
                                    href={`tel:${lead.phone}`}
                                    title="Ligar"
                                    className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {waUrl && (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp"
                                    className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <select
                                  value={stage}
                                  onChange={(e) =>
                                    handleMoveStage(lead, e.target.value as ProspectStatus)
                                  }
                                  className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700"
                                >
                                  {stages.map((s) => (
                                    <option key={s} value={s}>
                                      Mover para: {STAGE_LABELS[s]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
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
