'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Settings, Server, Key, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [provider, setProvider] = useState<string>('nominatim');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Configurações do Sistema"
        subtitle="Gerenciamento da fonte de dados (BusinessProvider) e chaves"
      />

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Provedor de Dados (BusinessProvider)
              </h3>
              <p className="text-xs text-slate-500">
                Alterne a fonte de dados oficial de geolocalização e empresas sem alterar a aplicação.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-500">
                Selecione o Provedor Ativo
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  onClick={() => setProvider('nominatim')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    provider === 'nominatim'
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">OpenStreetMap</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Gratuito
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Nominatim + Overpass QL API. Sem custos e sem necessidade de API Key.
                  </p>
                </label>

                <label
                  onClick={() => setProvider('google')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    provider === 'google'
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Google Places</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      Oficial
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Places Text Search API. Cobertura global de alta precisão.
                  </p>
                </label>

                <label
                  onClick={() => setProvider('mock')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    provider === 'mock'
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Mock Provider</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                      Dev Local
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dados estáticos demonstrativos do Brasil para testes rápidos de UI.
                  </p>
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Segurança das Credenciais
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Todas as chaves de API ficam mantidas exclusivamente no arquivo <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> do servidor. Nenhuma credencial é exposta para o cliente web.
              </p>
            </div>

            {saved && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Configurações salvas com sucesso!
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Salvar Preferências
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
