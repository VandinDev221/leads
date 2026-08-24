'use client';

import { useState } from 'react';
import { Business, ProspectStatus } from '@/types/business';
import { ProspectStatusBadge } from './prospect-status-badge';
import { formatWhatsappUrl } from '@/lib/utils/formatters';
import {
  X,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Clock,
  Bookmark,
  Calendar,
  FileText,
  ExternalLink,
  Building,
} from 'lucide-react';

interface BusinessDetailsModalProps {
  business: Business | null;
  onClose: () => void;
  onUpdateStatus: (business: Business, newStatus: ProspectStatus) => void;
  onToggleFavorite: (business: Business) => void;
  onSaveNotes: (business: Business, notes: string, nextContactAt?: string) => void;
}

export function BusinessDetailsModal({
  business,
  onClose,
  onUpdateStatus,
  onToggleFavorite,
  onSaveNotes,
}: BusinessDetailsModalProps) {
  if (!business) return null;

  const [notes, setNotes] = useState(business.notes || '');
  const [nextContactAt, setNextContactAt] = useState(
    business.nextContactAt
      ? new Date(business.nextContactAt).toISOString().split('T')[0]
      : ''
  );
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await onSaveNotes(business, notes, nextContactAt);
    setIsSavingNotes(false);
  };

  const waUrl = formatWhatsappUrl(business.whatsapp || business.phone);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                {business.category}
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">
                {business.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {business.address}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status e Ações de Contato Rápidas */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Status de Prospecção
              </span>
              <ProspectStatusBadge
                status={business.prospectStatus || 'NOVO'}
                onChangeStatus={(newStatus) => onUpdateStatus(business, newStatus)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(business)}
                className={`p-2.5 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  business.isFavorite
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    business.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                  }`}
                />
                <span>{business.isFavorite ? 'Salvo' : 'Salvar'}</span>
              </button>

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="p-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                >
                  <Phone className="w-4 h-4" /> Ligar
                </a>
              )}

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Grid de Informações Detalhadas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefone
              </span>
              <p className="text-sm font-medium text-slate-800">
                {business.phone || 'Não informado'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website
              </span>
              {business.website ? (
                <a
                  href={
                    business.website.startsWith('http')
                      ? business.website
                      : `https://${business.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 truncate"
                >
                  {business.website} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <p className="text-sm font-medium text-slate-400">Não informado</p>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Avaliação
              </span>
              <p className="text-sm font-medium text-slate-800">
                {business.rating ? (
                  <>
                    <strong className="text-slate-900">{business.rating}</strong> (
                    {business.reviewCount || 0} avaliações)
                  </>
                ) : (
                  'Não informado'
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Horário de Funcionamento
              </span>
              <p className="text-sm font-medium text-slate-800">
                {business.openingHours || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Endereço e Google Maps */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-500">
                Localização & Mapa
              </span>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Abrir no Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-slate-700 font-medium">
              {business.address} - {business.city || ''} {business.state || ''}
            </p>
            {business.distanceKm !== undefined && (
              <p className="text-xs text-slate-500">
                Distância estimada: <strong>{business.distanceKm} km</strong> do ponto selecionado.
              </p>
            )}
          </div>

          {/* Área de Observações e Agendamento */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Notas Comerciais & Próximo Contato
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Agendar próximo contato
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={nextContactAt}
                    onChange={(e) => setNextContactAt(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Fonte dos dados
                </label>
                <div className="py-2 text-xs font-semibold text-slate-600">
                  {business.source}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Observações da abordagem
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Falei com o gerente Carlos, demonstraram interesse em novo site SaaS..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {isSavingNotes ? 'Salvando...' : 'Salvar Observações'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
