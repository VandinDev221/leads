'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { FileText, Copy, Check, MessageCircle, Plus } from 'lucide-react';

interface TemplateItem {
  id?: string;
  title: string;
  channel: string;
  content: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('WHATSAPP');
  const [newContent, setNewContent] = useState('');

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          channel: newChannel,
          content: newContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTemplates();
        setNewTitle('');
        setNewContent('');
        setShowForm(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar
        title="Templates de Abordagem"
        subtitle="Biblioteca de mensagens comerciais com substituição dinâmica de variáveis"
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Modelos de Mensagem</h3>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Template
          </button>
        </div>

        {/* Variáveis Disponíveis */}
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1">
          <span className="text-xs font-bold uppercase text-blue-700">Variáveis Suportadas:</span>
          <p className="text-xs text-blue-900 font-medium">
            Use <code className="bg-white px-1.5 py-0.5 rounded border font-mono">{"{{nome}}"}</code>,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border font-mono">{"{{empresa}}"}</code>,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border font-mono">{"{{cidade}}"}</code>,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border font-mono">{"{{categoria}}"}</code>,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border font-mono">{"{{servico}}"}</code> no texto para substituição automática no WhatsApp.
          </p>
        </div>

        {/* Criar Template */}
        {showForm && (
          <form
            onSubmit={handleCreateTemplate}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-fadeIn"
          >
            <h4 className="text-xs font-bold uppercase text-slate-500">Novo Template de Abordagem</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Título do template (ex: Primeiro Contato - Redesign Web)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              />
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="WHATSAPP">💬 WhatsApp</option>
                <option value="EMAIL">✉️ Email</option>
                <option value="INSTAGRAM">📸 Instagram</option>
              </select>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Conteúdo da mensagem..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Salvar Template
              </button>
            </div>
          </form>
        )}

        {/* Lista de Templates */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            <p className="text-sm font-semibold text-slate-600">Carregando templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl, idx) => {
              const tmplId = tmpl.id || `tmpl-${idx}`;
              return (
                <div
                  key={tmplId}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{tmpl.title}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tmpl.channel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                      {tmpl.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCopy(tmpl.content, tmplId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === tmplId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar Mensagem
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
