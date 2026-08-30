'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { LeadScoreBadge } from '@/components/business/lead-score-badge';
import { OpportunityCard } from '@/components/business/opportunity-card';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import { Business, ProspectStatus } from '@/types/business';
import {
  Zap,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Copy,
  Check,
} from 'lucide-react';

export default function ProspectingModePage() {
  const [currentLead, setCurrentLead] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const fetchNextLead = async () => {
    setIsLoading(true);
    setCopiedMessage(false);
    try {
      const res = await fetch('/api/prospecting/next');
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentLead(data.data);
      } else {
        setCurrentLead(null);
      }
    } catch (err) {
      console.error('Erro ao buscar próximo lead:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextLead();
  }, []);

  const handleUpdateStatus = async (status: ProspectStatus) => {
    if (!currentLead) return;

    try {
      await fetch(`/api/leads/${currentLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectStatus: status }),
      });
      // Carregar automaticamente o próximo lead
      fetchNextLead();
    } catch (err) {
      console.error(err);
    }
  };

  const generatedMessage = currentLead
    ? `Olá, tudo bem? Vi o perfil da ${currentLead.name} em ${
        currentLead.city || 'sua região'
      } e notei que vocês têm ótimas avaliações! Trabalho com desenvolvimento de websites profissionais e automações. Gostaria de enviar um modelo de site para vocês darem uma olhada sem compromisso?`
    : '';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar title="Modo Prospecção" subtitle="Foco de alta velocidade em 1 lead por vez" />
        <div className="p-12 text-center">
          <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
          <p className="text-sm font-semibold text-slate-600">Localizando o próximo melhor lead...</p>
        </div>
      </div>
    );
  }

  if (!currentLead) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar title="Modo Prospecção" subtitle="Foco de alta velocidade em 1 lead por vez" />
        <div className="p-12 max-w-xl mx-auto text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">Fila de Prospecção Concluída!</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Não há novos leads pendentes na fila ranqueada de abordagem. Faça novas buscas ou altere os filtros de prospectos.
          </p>
        </div>
      </div>
    );
  }

  const waUrl = formatWhatsappUrl(currentLead.whatsapp || currentLead.phone);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Modo Prospecção" subtitle="Foco de alta velocidade em 1 lead por vez" />

      <main className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Banner do Lead Atual */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                  {currentLead.category}
                </span>
                <LeadScoreBadge scoreInfo={currentLead.scoreInfo} />
              </div>
              <h1 className="text-2xl font-extrabold text-white leading-tight">
                {currentLead.name}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentLead.address} — {currentLead.city}
              </p>
            </div>

            {/* Ações de Abertura Imediata */}
            <div className="flex items-center gap-2">
              {currentLead.phone && (
                <a
                  href={`tel:${currentLead.phone}`}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4" /> Ligar
                </a>
              )}

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}

              {currentLead.website && (
                <a
                  href={
                    currentLead.website.startsWith('http')
                      ? currentLead.website
                      : `https://${currentLead.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" /> Site
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Abordagem Sugerida & Oportunidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mensagem de Abordagem Personalizada */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" /> Mensagem Sugerida
              </h3>
              <button
                onClick={handleCopyMessage}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Texto
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed italic">
              &quot;{generatedMessage}&quot;
            </div>
          </div>

          {/* Oportunidades Detectadas */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" /> Oportunidades Comerciais
            </h3>
            <OpportunityCard opportunities={currentLead.opportunities || []} />
          </div>
        </div>

        {/* Barra de Ação Comercial Rápidas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Definir Resultado da Abordagem:
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleUpdateStatus('CONTATADO')}
              className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Contatado
            </button>

            <button
              onClick={() => handleUpdateStatus('INTERESSADO')}
              className="px-4 py-2.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-600" /> Interessado
            </button>

            <button
              onClick={() => handleUpdateStatus('SEM_INTERESSE')}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <XCircle className="w-4 h-4 text-slate-500" /> Sem Interesse
            </button>

            <button
              onClick={() => fetchNextLead()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Próximo Lead</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
