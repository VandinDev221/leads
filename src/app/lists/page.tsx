'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Layers, Plus, FolderKanban, Users } from 'lucide-react';

export default function ListsPage() {
  const [lists, setLists] = useState([
    {
      id: 'l1',
      name: 'Oficinas para oferecer Sistema de OS',
      description: 'Oficinas mecânicas sem sistema de gestão aparente',
      count: 14,
    },
    {
      id: 'l2',
      name: 'Barbearias para Agendamento SaaS',
      description: 'Barbearias de médio e alto ticket com alto volume de avaliações',
      count: 22,
    },
    {
      id: 'l3',
      name: 'Clínicas para Redesign de Website',
      description: 'Consultórios sem site próprio ou com perfil gratuito',
      count: 9,
    },
  ]);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title="Segmentação & Listas" subtitle="Organização de leads em listas personalizadas de prospecção" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Listas Personalizadas</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lists.map((l) => (
            <div
              key={l.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{l.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{l.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> {l.count} leads salvos
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
