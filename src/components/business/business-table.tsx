'use client';

import { Business, ProspectStatus } from '@/types/business';
import { ProspectStatusBadge } from './prospect-status-badge';
import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Bookmark,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface BusinessTableProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onUpdateStatus: (business: Business, newStatus: ProspectStatus) => void;
  onToggleFavorite: (business: Business) => void;
}

export function BusinessTable({
  businesses,
  onSelectBusiness,
  onUpdateStatus,
  onToggleFavorite,
}: BusinessTableProps) {
  if (businesses.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Empresa</th>
              <th className="py-3.5 px-4">Categoria</th>
              <th className="py-3.5 px-4 text-center">Distância</th>
              <th className="py-3.5 px-4">Telefone</th>
              <th className="py-3.5 px-4">Avaliação</th>
              <th className="py-3.5 px-4">Status Prospecção</th>
              <th className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {businesses.map((b) => {
              const whatsappNumber =
                b.whatsapp || (b.phone ? b.phone.replace(/\D/g, '') : '');

              return (
                <tr
                  key={b.id || b.externalId}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Nome e Endereço */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleFavorite(b)}
                        title={b.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                        className="text-slate-300 hover:text-amber-500 transition-colors shrink-0"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            b.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                          }`}
                        />
                      </button>
                      <div>
                        <button
                          onClick={() => onSelectBusiness(b)}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left line-clamp-1"
                        >
                          {b.name}
                        </button>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 line-clamp-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {b.address}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      {b.category}
                    </span>
                  </td>

                  {/* Distância */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-700">
                      {b.distanceKm !== undefined ? `${b.distanceKm} km` : '—'}
                    </span>
                  </td>

                  {/* Telefone */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {b.phone ? (
                      <a
                        href={`tel:${b.phone}`}
                        className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Não informado</span>
                    )}
                  </td>

                  {/* Avaliação */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {b.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-800">
                          {b.rating}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({b.reviewCount || 0})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Não informado</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ProspectStatusBadge
                      status={b.prospectStatus || 'NOVO'}
                      onChangeStatus={(newStatus) => onUpdateStatus(b, newStatus)}
                      size="sm"
                    />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Ligar */}
                      {b.phone && (
                        <a
                          href={`tel:${b.phone}`}
                          title="Ligar"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}

                      {/* WhatsApp */}
                      {whatsappNumber && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir no WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}

                      {/* Site */}
                      {b.website && (
                        <a
                          href={
                            b.website.startsWith('http') ? b.website : `https://${b.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir site"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}

                      {/* Maps */}
                      <a
                        href={b.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Ver no Google Maps"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Detalhes */}
                      <button
                        onClick={() => onSelectBusiness(b)}
                        title="Ver detalhes completos"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalhes</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
