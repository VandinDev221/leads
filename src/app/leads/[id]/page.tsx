'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { ProspectStatusBadge } from '@/components/business/prospect-status-badge';
import { LeadScoreBadge } from '@/components/business/lead-score-badge';
import { OpportunityCard } from '@/components/business/opportunity-card';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import { Business, ProspectStatus, Priority, Interaction, LeadContact } from '@/types/business';
import {
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Clock,
  Calendar,
  FileText,
  UserCheck,
  Plus,
  Send,
  ArrowLeft,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export default function LeadProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [lead, setLead] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contacts, setContacts] = useState<LeadContact[]>([]);

  // Formulário de Nova Interação
  const [newInteractionType, setNewInteractionType] = useState<string>('WHATSAPP');
  const [newInteractionText, setNewInteractionText] = useState('');
  const [isSubmittingInteraction, setIsSubmittingInteraction] = useState(false);

  // Formulário de Novo Contato
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Formulário de Observações e Próximo Contato
  const [notes, setNotes] = useState('');
  const [nextContactAt, setNextContactAt] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    async function loadLeadProfile() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leads/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setLead(data.data);
          setNotes(data.data.notes || '');
          setNextContactAt(
            data.data.nextContactAt
              ? new Date(data.data.nextContactAt).toISOString().split('T')[0]
              : ''
          );
          setInteractions(data.data.interactions || []);
          setContacts(data.data.contacts || []);
        }
      } catch (err) {
        console.error('Erro ao carregar perfil do lead:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadLeadProfile();
  }, [id]);

  const handleUpdateStatus = async (newStatus: ProspectStatus) => {
    if (!lead) return;
    setLead({ ...lead, prospectStatus: newStatus });
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectStatus: newStatus }),
      });
      // Recarregar interações para refletir o log de mudança de status
      const resInt = await fetch(`/api/leads/${id}/interactions`);
      const dataInt = await resInt.json();
      if (dataInt.success) setInteractions(dataInt.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePriority = async (newPriority: Priority) => {
    if (!lead) return;
    setLead({ ...lead, priority: newPriority });
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteractionText.trim()) return;

    setIsSubmittingInteraction(true);
    try {
      const res = await fetch(`/api/leads/${id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newInteractionType,
          description: newInteractionText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInteractions([data.data, ...interactions]);
        setNewInteractionText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingInteraction(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    try {
      const res = await fetch(`/api/leads/${id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContactName.trim(),
          role: newContactRole.trim() || undefined,
          phone: newContactPhone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setContacts([...contacts, data.data]);
        setNewContactName('');
        setNewContactRole('');
        setNewContactPhone('');
        setShowAddContact(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, nextContactAt }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!confirm('Deseja realmente remover este lead da sua carteira?')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      router.push('/leads');
    } catch (e) {
      alert('Erro ao remover lead.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar title="Perfil do Lead" />
        <div className="p-12 text-center">
          <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
          <p className="text-sm font-semibold text-slate-600">Carregando perfil do lead...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar title="Perfil do Lead" />
        <div className="p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">Lead não encontrado.</p>
          <button
            onClick={() => router.push('/leads')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  const waUrl = formatWhatsappUrl(lead.whatsapp || lead.phone);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Navbar title={lead.name} subtitle={`${lead.category} — ${lead.city || 'Não informado'}`} />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header do Lead com Botão Voltar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          <button
            onClick={handleDeleteLead}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Excluir Lead
          </button>
        </div>

        {/* Card Principal de Resumo e Qualificação */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    {lead.category}
                  </span>
                  <LeadScoreBadge scoreInfo={lead.scoreInfo} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {lead.name}
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {lead.address} — {lead.city} {lead.state}
                </p>
              </div>
            </div>

            {/* Ações de Contato Rápido */}
            <div className="flex flex-wrap items-center gap-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4" /> Ligar
                </a>
              )}

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}

              {lead.website && (
                <a
                  href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Globe className="w-4 h-4" /> Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Grid de Informações de Prospecção */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Estágio de Prospecção
              </span>
              <div className="pt-1">
                <ProspectStatusBadge
                  status={lead.prospectStatus || 'NOVO'}
                  onChangeStatus={handleUpdateStatus}
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Prioridade</span>
              <select
                value={lead.priority || 'MEDIUM'}
                onChange={(e) => handleUpdatePriority(e.target.value as Priority)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800"
              >
                <option value="LOW">🔵 Baixa</option>
                <option value="MEDIUM">🟡 Média</option>
                <option value="HIGH">🟠 Alta</option>
                <option value="URGENT">🔴 Urgente</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Último Contato
              </span>
              <p className="text-xs font-bold text-slate-800 pt-1">
                {lead.lastContactedAt
                  ? new Date(lead.lastContactedAt).toLocaleDateString('pt-BR')
                  : 'Nunca contatado'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Avaliações Google
              </span>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1 pt-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {lead.rating ? `${lead.rating} (${lead.reviewCount || 0} avaliações)` : 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        {/* Layout em 2 Colunas (Oportunidades & Linha do Tempo) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Oportunidades & Contatos */}
          <div className="space-y-6">
            {/* Oportunidades Comerciais Detectadas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Oportunidades Detectadas
              </h3>
              <OpportunityCard opportunities={lead.opportunities || []} />
            </div>

            {/* Tomadores de Decisão / Contatos Adicionais */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" /> Tomadores de Decisão ({contacts.length})
                </h3>
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>

              {showAddContact && (
                <form onSubmit={handleAddContact} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Nome do contato (ex: Carlos)"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Cargo (ex: Sócio Proprietário)"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Telefone/WhatsApp"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                    >
                      Salvar Contato
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum contato direto cadastrado.</p>
                ) : (
                  contacts.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{c.name}</span>
                        {c.role && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                            {c.role}
                          </span>
                        )}
                      </div>
                      {c.phone && <p className="text-xs text-slate-600 font-medium">📞 {c.phone}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notas e Agendamento */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Observações & Próximo Contato
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Agendar Próximo Contato
                  </label>
                  <input
                    type="date"
                    value={nextContactAt}
                    onChange={(e) => setNextContactAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Anotações Comerciais
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Histórico livre de negociações, objeções e detalhes do cliente..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium"
                  />
                </div>

                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {isSavingNotes ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Linha do Tempo de Interações */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Histórico de Interações (Timeline)
            </h3>

            {/* Formulário de Registro de Nova Abordagem */}
            <form onSubmit={handleAddInteraction} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="block text-xs font-bold uppercase text-slate-500">
                Registrar Nova Abordagem / Contato
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={newInteractionType}
                  onChange={(e) => setNewInteractionType(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="WHATSAPP">💬 WhatsApp</option>
                  <option value="CALL">📞 Ligação</option>
                  <option value="EMAIL">✉️ Email</option>
                  <option value="MEETING">🤝 Reunião</option>
                  <option value="PROPOSAL">📄 Proposta</option>
                  <option value="NOTE">📝 Anotação</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Ex: Falei com o proprietário no WhatsApp, enviou retorno positivo..."
                  value={newInteractionText}
                  onChange={(e) => setNewInteractionText(e.target.value)}
                  className="flex-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />

                <button
                  type="submit"
                  disabled={isSubmittingInteraction}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Registrar
                </button>
              </div>
            </form>

            {/* Lista da Timeline */}
            <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {interactions.length === 0 ? (
                <p className="text-xs text-slate-400 italic pl-8">Nenhuma interação registrada ainda.</p>
              ) : (
                interactions.map((item) => (
                  <div key={item.id} className="relative pl-8 space-y-1">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {item.type === 'STATUS_CHANGE'
                          ? '🔄 Mudança de Estágio'
                          : item.type === 'WHATSAPP'
                          ? '💬 Contato WhatsApp'
                          : item.type === 'CALL'
                          ? '📞 Ligação Telefônica'
                          : item.type === 'MEETING'
                          ? '🤝 Reunião'
                          : item.type === 'PROPOSAL'
                          ? '📄 Envio de Proposta'
                          : '📝 Anotação'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
