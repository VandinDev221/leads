'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { SearchHistoryItem } from '@/types/business';
import { History, ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (data.success) {
          setHistory(data.data || []);
        }
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleReopenSearch = (item: SearchHistoryItem) => {
    // Redireciona para a home executando a busca com os mesmos parâmetros
    router.push(
      `/?category=${encodeURIComponent(item.category)}&location=${encodeURIComponent(
        item.location
      )}&radiusKm=${item.radiusKm}`
    );
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Histórico de Pesquisas"
        subtitle="Registro de todas as consultas efetuadas no LeadFinder"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <History className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">Nenhum histórico gravado.</p>
            <p className="text-xs text-slate-400">
              Realize buscas para visualizar o histórico de consultas aqui.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold">Pesquisas Recentes ({history.length})</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.radiusKm} km
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-800 block">
                        {item.resultsCount}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        resultados
                      </span>
                    </div>

                    <button
                      onClick={() => handleReopenSearch(item)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <span>Repetir Busca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
