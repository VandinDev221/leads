'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Building, Phone, MapPin, ExternalLink, Command } from 'lucide-react';
import { Business } from '@/types/business';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K ou Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Esc para fechar
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leads?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data || []);
        }
      } catch (err) {
        console.error('Erro na busca global:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
        {/* Header de Busca */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por empresa, telefone, cidade ou categoria... (Ctrl + K)"
            className="w-full text-sm font-medium text-slate-800 focus:outline-none bg-transparent placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {isLoading && (
            <div className="p-6 text-center text-xs font-semibold text-slate-500">
              Buscando na carteira de leads...
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              Nenhum lead encontrado com esse termo.
            </div>
          )}

          {!isLoading &&
            results.map((lead) => (
              <div
                key={lead.id}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/leads/${lead.id}`);
                }}
                className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lead.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600">{lead.category}</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {lead.city || 'Não informado'}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-0.5">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {lead.prospectStatus || 'NOVO'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                </div>
              </div>
            ))}

          {!query && (
            <div className="p-4 text-center space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-center gap-1 font-bold text-slate-500">
                <Command className="w-4 h-4 text-blue-600" /> Atalho Rápido de Teclado
              </div>
              <p>Digite para buscar empresas, telefones ou cidades salvas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
