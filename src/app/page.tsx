'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { SearchForm } from '@/components/search/search-form';
import { BusinessTable } from '@/components/business/business-table';
import { BusinessMap } from '@/components/map/business-map';
import { BusinessDetailsModal } from '@/components/business/business-details-modal';
import { Business, SearchBusinessesParams, ProspectStatus } from '@/types/business';
import { List, Map as MapIcon, Download, Sparkles, AlertCircle } from 'lucide-react';

export default function SearchPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Buscando empresas...');
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Alternância de visualização [Lista] | [Mapa]
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Modal de Detalhes
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Executar busca inicial padrão ao abrir (Exemplo de utilização do prompt: Barbearias, São Luís - MA, 10 km)
  useEffect(() => {
    handleSearch({
      category: 'Barbearia',
      location: 'São Luís - MA',
      radiusKm: 10,
    });
  }, []);

  const handleSearch = async (params: SearchBusinessesParams) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingMessage('Consultando estabelecimentos próximos...');

    const timer = setTimeout(() => {
      setLoadingMessage('Localizando dados de contato e endereço...');
    }, 2000);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      clearTimeout(timer);

      if (!res.ok) {
        throw new Error('Falha na resposta da API');
      }

      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data || []);
      } else {
        setErrorMessage(data.error || 'Não foi possível realizar a busca. Tente novamente.');
      }
    } catch (err) {
      clearTimeout(timer);
      setErrorMessage('Não foi possível realizar a busca. Tente novamente.');
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleUpdateStatus = async (business: Business, newStatus: ProspectStatus) => {
    // Atualizar estado local imediatamente para responsividade da UI
    const updated = businesses.map((b) =>
      b.externalId === business.externalId ? { ...b, prospectStatus: newStatus } : b
    );
    setBusinesses(updated);

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness({ ...selectedBusiness, prospectStatus: newStatus });
    }

    // Persistir no banco via API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          prospectStatus: newStatus,
        }),
      });
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err);
    }
  };

  const handleToggleFavorite = async (business: Business) => {
    const nextFavState = !business.isFavorite;

    const updated = businesses.map((b) =>
      b.externalId === business.externalId ? { ...b, isFavorite: nextFavState } : b
    );
    setBusinesses(updated);

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness({ ...selectedBusiness, isFavorite: nextFavState });
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          isFavorite: nextFavState,
        }),
      });
    } catch (err) {
      console.error('Erro ao favoritar lead:', err);
    }
  };

  const handleSaveNotes = async (
    business: Business,
    notes: string,
    nextContactAt?: string
  ) => {
    const updated = businesses.map((b) =>
      b.externalId === business.externalId ? { ...b, notes, nextContactAt } : b
    );
    setBusinesses(updated);

    if (selectedBusiness?.externalId === business.externalId) {
      setSelectedBusiness({ ...selectedBusiness, notes, nextContactAt });
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          notes,
          nextContactAt,
        }),
      });
    } catch (err) {
      console.error('Erro ao salvar observações:', err);
    }
  };

  const handleExportCSV = async () => {
    if (businesses.length === 0) {
      alert('Nenhum resultado para exportar.');
      return;
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businesses }),
      });

      if (!res.ok) throw new Error('Erro na exportação');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Erro ao gerar arquivo CSV.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Encontrar Empresas" subtitle="Localização e prospecção de clientes B2B" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Formulário de Busca */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Mensagem de Erro se houver */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Estado de Carregamento */}
        {isLoading && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">{loadingMessage}</p>
            <p className="text-xs text-slate-400">
              Procurando estabelecimentos e deduplicando resultados...
            </p>
          </div>
        )}

        {/* Resultados da Busca */}
        {!isLoading && hasSearched && (
          <div className="space-y-4">
            {/* Header da Lista de Resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">
                  {businesses.length}{' '}
                  {businesses.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Alternador Lista / Mapa */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>Lista</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'map'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    <span>Mapa</span>
                  </button>
                </div>

                {/* Botão Exportar CSV */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Conteúdo: Se Vazio */}
            {businesses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <p className="text-sm font-bold text-slate-700">
                  Nenhuma empresa encontrada dentro dos filtros selecionados.
                </p>
                <p className="text-xs text-slate-400">
                  Tente expandir o raio de busca ou selecionar outra localização.
                </p>
              </div>
            ) : viewMode === 'list' ? (
              <BusinessTable
                businesses={businesses}
                onSelectBusiness={(b) => setSelectedBusiness(b)}
                onUpdateStatus={handleUpdateStatus}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <BusinessMap
                businesses={businesses}
                onSelectBusiness={(b) => setSelectedBusiness(b)}
              />
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalhes da Empresa */}
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
