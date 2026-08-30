'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { BusinessTable } from '@/components/business/business-table';
import { BusinessDetailsModal } from '@/components/business/business-details-modal';
import { Business, ProspectStatus, Priority } from '@/types/business';
import { Search, Filter, Download, Building, Plus } from 'lucide-react';

export default function AllLeadsPage() {
  const [leads, setLeads] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let url = '/api/leads?';
      if (selectedStatus) url += `status=${selectedStatus}&`;
      if (selectedPriority) url += `priority=${selectedPriority}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus, selectedPriority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleUpdateStatus = async (business: Business, newStatus: ProspectStatus) => {
    setLeads(
      leads.map((l) =>
        l.externalId === business.externalId ? { ...l, prospectStatus: newStatus } : l
      )
    );

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness({ ...selectedBusiness, prospectStatus: newStatus });
    }

    try {
      await fetch(`/api/leads/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectStatus: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (business: Business) => {
    const nextFavState = !business.isFavorite;
    setLeads(
      leads.map((l) =>
        l.externalId === business.externalId ? { ...l, isFavorite: nextFavState } : l
      )
    );

    try {
      await fetch(`/api/leads/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: nextFavState }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (
    business: Business,
    notes: string,
    nextContactAt?: string
  ) => {
    setLeads(
      leads.map((l) =>
        l.externalId === business.externalId ? { ...l, notes, nextContactAt } : l
      )
    );

    try {
      await fetch(`/api/leads/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, nextContactAt }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    if (leads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businesses: leads }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_todos_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Erro ao exportar CSV.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Todos os Leads"
        subtitle="Gerenciamento e organização da sua base inteira de contatos comerciais"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Painel de Busca e Filtros Avançados */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, empresa, categoria, cidade ou telefone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">Todos os Estágios</option>
                <option value="NOVO">Novo</option>
                <option value="QUALIFICADO">Qualificado</option>
                <option value="CONTATAR">Contatar</option>
                <option value="CONTATADO">Contatado</option>
                <option value="RESPONDEU">Respondeu</option>
                <option value="INTERESSADO">Interessado</option>
                <option value="PROPOSTA">Proposta</option>
                <option value="NEGOCIACAO">Negociação</option>
                <option value="CLIENTE">Cliente</option>
                <option value="SEM_INTERESSE">Sem Interesse</option>
                <option value="PERDIDO">Perdido</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">Todas as Prioridades</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
              >
                Filtrar
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span>{leads.length} leads cadastrados</span>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Tabela de Leads */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando base de leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Building className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">Nenhum lead encontrado na base.</p>
            <p className="text-xs text-slate-400">
              Utilize a tela &quot;Encontrar Leads&quot; para pesquisar empresas na sua região e salvá-las na sua carteira.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Buscar Novos Leads
            </Link>
          </div>
        ) : (
          <BusinessTable
            businesses={leads}
            onSelectBusiness={(b) => setSelectedBusiness(b)}
            onUpdateStatus={handleUpdateStatus}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      <BusinessDetailsModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onUpdateStatus={handleUpdateStatus}
        onToggleFavorite={handleToggleFavorite}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
}
