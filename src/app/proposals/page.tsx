'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Proposal, ProposalStatus } from '@/types/business';
import { DollarSign, Building, Calendar, Plus, FileText, CheckCircle2 } from 'lucide-react';

const STATUS_LABELS: Record<ProposalStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700' },
  SENT: { label: 'Enviada', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  VIEWED: { label: 'Visualizada', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ACCEPTED: { label: 'Aceita', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  REJECTED: { label: 'Recusada', color: 'bg-red-50 text-red-700 border-red-200' },
  EXPIRED: { label: 'Expirada', color: 'bg-slate-100 text-slate-500' },
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (data.success) {
        setProposals(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar propostas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const totalValue = proposals.reduce((acc, p) => acc + (p.estimatedValue || 0), 0);
  const acceptedValue = proposals
    .filter((p) => p.status === 'ACCEPTED')
    .reduce((acc, p) => acc + (p.estimatedValue || 0), 0);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Propostas Comerciais" subtitle="Acompanhamento financeiro de propostas enviadas" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Banner com Totais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total em Pipeline de Propostas
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Propostas Fechadas / Aceitas
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                R$ {acceptedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tabela de Propostas */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando propostas...</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">Nenhuma proposta registrada.</p>
            <p className="text-xs text-slate-400">
              Abra o perfil de um lead para registrar uma nova proposta comercial.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Lead / Cliente</th>
                  <th className="py-3.5 px-4">Serviço Oferecido</th>
                  <th className="py-3.5 px-4">Valor Estimado</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data Envio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {proposals.map((p) => {
                  const statusInfo = STATUS_LABELS[p.status] || STATUS_LABELS.DRAFT;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        {p.lead ? (
                          <Link
                            href={`/leads/${p.lead.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            {p.lead.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Lead removido</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">{p.serviceName}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        R$ {p.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
