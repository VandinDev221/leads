import { Business } from '@/types/business';

export function generateBusinessesCSV(businesses: Business[]): string {
  const headers = [
    'Nome',
    'Categoria',
    'Endereço',
    'Cidade',
    'Estado',
    'Telefone',
    'WhatsApp',
    'Site',
    'Instagram',
    'Avaliação',
    'Número de Avaliações',
    'Google Maps',
    'Status de Prospecção',
    'Observações',
    'Último Contato',
  ];

  const escapeCSV = (str?: string | number | null) => {
    if (str === undefined || str === null) return '""';
    const val = String(str).replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = businesses.map((b) => [
    escapeCSV(b.name),
    escapeCSV(b.category),
    escapeCSV(b.address),
    escapeCSV(b.city || 'Não informado'),
    escapeCSV(b.state || 'Não informado'),
    escapeCSV(b.phone || 'Não informado'),
    escapeCSV(b.whatsapp || 'Não informado'),
    escapeCSV(b.website || 'Não informado'),
    escapeCSV(b.instagram || 'Não informado'),
    escapeCSV(b.rating !== undefined ? b.rating : 'Não informado'),
    escapeCSV(b.reviewCount !== undefined ? b.reviewCount : 'Não informado'),
    escapeCSV(b.mapsUrl),
    escapeCSV(b.prospectStatus || 'NOVO'),
    escapeCSV(b.notes || ''),
    escapeCSV(b.lastContactedAt ? new Date(b.lastContactedAt).toLocaleDateString('pt-BR') : ''),
  ]);

  // Inclui o BOM UTF-8 (\uFEFF) para garantir acentuação correta no Microsoft Excel
  return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}
