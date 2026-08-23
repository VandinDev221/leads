'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { BusinessTable } from '@/components/business/business-table';
import { BusinessDetailsModal } from '@/components/business/business-details-modal';
import { Business, ProspectStatus } from '@/types/business';
import { BookmarkCheck, Download, Search } from 'lucide-react';

export default function MyLeadsPage() {
  const [leads, setLeads] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let url = '/api/leads?favorite=true';
      if (selectedStatus) url += `&status=${selectedStatus}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar leads salvos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

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
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...business, prospectStatus: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (business: Business) => {
    // Se estiver desmarcando da lista de favoritos, remove da tela local
    const nextFavState = !business.isFavorite;
    setLeads(leads.filter((l) => l.externalId !== business.externalId));

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness(null);
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...business, isFavorite: nextFavState }),
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

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness({ ...selectedBusiness, notes, nextContactAt });
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...business, notes, nextContactAt }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    if (leads.length === 0) {
      alert('Nenhum lead salvo para exportar.');
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
      a.download = `meus_leads_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Erro na exportação para CSV.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Meus Leads"
        subtitle="Sua carteira de potenciais clientes salvos e favoritados"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Painel de Filtros em Meus Leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por nome, categoria ou cidade..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              Filtrar
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">Todos os status</option>
              <option value="NOVO">Novo</option>
              <option value="CONTATAR">Contatar</option>
              <option value="CONTATADO">Contatado</option>
              <option value="RESPONDEU">Respondeu</option>
              <option value="INTERESSADO">Interessado</option>
              <option value="SEM_INTERESSE">Sem interesse</option>
              <option value="CLIENTE">Cliente</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando seus leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">Nenhum lead salvo encontrado.</p>
            <p className="text-xs text-slate-400">
              Faça buscas na aba &quot;Buscar Leads&quot; e clique no ícone de favorito para adicionar empresas à sua carteira.
            </p>
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
