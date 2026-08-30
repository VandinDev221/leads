import { Business, LeadScoreInfo } from '@/types/business';

const STRATEGIC_CATEGORIES = [
  'barbearia',
  'salão de beleza',
  'clínica odontológica',
  'consultório médico',
  'clínica médica',
  'oficina mecânica',
  'autopeças',
  'restaurante',
  'academia',
  'pet shop',
  'imobiliária',
  'contabilidade',
  'advocacia',
  'hotel',
  'pousada',
  'escola',
];

export function calculateLeadScore(business: Partial<Business>): LeadScoreInfo {
  let presenceScore = 0;
  let opportunityScore = 0;
  const factors: Array<{ name: string; score: number }> = [];

  // 1. Presença Digital
  if (business.phone) {
    presenceScore += 20;
    factors.push({ name: 'Possui telefone fixo/celular', score: 20 });
  }

  if (business.whatsapp) {
    presenceScore += 10;
    factors.push({ name: 'Possui WhatsApp de contato', score: 10 });
  }

  if (business.instagram) {
    presenceScore += 10;
    factors.push({ name: 'Presença no Instagram', score: 10 });
  }

  if (business.rating && business.rating >= 4.5) {
    presenceScore += 10;
    factors.push({ name: 'Avaliação excelente (>= 4.5)', score: 10 });
  }

  if (business.reviewCount && business.reviewCount >= 50) {
    presenceScore += 10;
    factors.push({ name: 'Alto volume de avaliações (>= 50)', score: 10 });
  }

  const catLower = (business.category || '').toLowerCase();
  if (STRATEGIC_CATEGORIES.some((c) => catLower.includes(c))) {
    presenceScore += 15;
    factors.push({ name: 'Categoria de alto ticket B2B', score: 15 });
  }

  // 2. Pontuação de Oportunidade Comercial (Serviços de TI / Sites / Automações)
  if (!business.website) {
    opportunityScore += 30;
    factors.push({ name: 'Sem Website (Oportunidade Dev Web)', score: 30 });
  } else if (
    business.website.includes('facebook.com') ||
    business.website.includes('instagram.com') ||
    business.website.includes('wixsite') ||
    business.website.includes('wordpress') ||
    business.website.length < 12
  ) {
    opportunityScore += 20;
    factors.push({ name: 'Website antigo ou perfil genérico (Oportunidade Redesign)', score: 20 });
  } else {
    presenceScore += 15;
    factors.push({ name: 'Possui website institucional', score: 15 });
  }

  if (!business.whatsapp && business.phone) {
    opportunityScore += 20;
    factors.push({ name: 'Sem WhatsApp configurado (Oportunidade Automação)', score: 20 });
  }

  if (!business.instagram && !business.facebook) {
    opportunityScore += 15;
    factors.push({ name: 'Presença digital limitada', score: 15 });
  }

  const totalScore = presenceScore + opportunityScore;

  let badge: 'HIGH_OPPORTUNITY' | 'MEDIUM_OPPORTUNITY' | 'LOW_OPPORTUNITY' = 'LOW_OPPORTUNITY';
  let label = '⚪ Baixa oportunidade';
  let color = 'text-slate-600 bg-slate-100 border-slate-300';

  if (opportunityScore >= 35) {
    badge = 'HIGH_OPPORTUNITY';
    label = '🔥 Alta oportunidade';
    color = 'text-amber-700 bg-amber-50 border-amber-300';
  } else if (opportunityScore >= 20) {
    badge = 'MEDIUM_OPPORTUNITY';
    label = '🟡 Média oportunidade';
    color = 'text-blue-700 bg-blue-50 border-blue-300';
  }

  return {
    totalScore,
    opportunityScore,
    badge,
    label,
    color,
    factors,
  };
}
