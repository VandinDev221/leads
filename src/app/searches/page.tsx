'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Bookmark, ArrowRight, MapPin, Search } from 'lucide-react';

export default function SavedSearchesPage() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState([
    {
      id: 's1',
      name: 'Barbearias São Luís (10km)',
      category: 'Barbearia',
      location: 'São Luís - MA',
      radiusKm: 10,
    },
    {
      id: 's2',
      name: 'Oficinas Mecânicas São Paulo (20km)',
      category: 'Oficina mecânica',
      location: 'São Paulo - SP',
      radiusKm: 20,
    },
    {
      id: 's3',
      name: 'Clínicas Odontológicas Curitiba (15km)',
      category: 'Clínica odontológica',
      location: 'Curitiba - PR',
      radiusKm: 15,
    },
  ]);

  const handleReopen = (s: typeof savedSearches[0]) => {
    router.push(
      `/?category=${encodeURIComponent(s.category)}&location=${encodeURIComponent(
        s.location
      )}&radiusKm=${s.radiusKm}`
    );
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Buscas Salvas" subtitle="Consultas frequentes salvas para execução imediata" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Minhas Consultas Salvas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedSearches.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {s.category}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">{s.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.location}
                  </span>
                  <span>• {s.radiusKm} km</span>
                </div>
              </div>

              <button
                onClick={() => handleReopen(s)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Search className="w-3.5 h-3.5" /> Executar Novamente
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
