import { Business, OpportunityInfo } from '@/types/business';

export function analyzeLeadOpportunities(business: Partial<Business>): OpportunityInfo[] {
  const opportunities: OpportunityInfo[] = [];
  const catLower = (business.category || '').toLowerCase();

  // 1. Oportunidade de Desenvolvimento Web / Website Institucional
  if (!business.website) {
    opportunities.push({
      id: 'opp-website-missing',
      title: 'Desenvolvimento de Website Institucional',
      category: 'WEB',
      confidence: 'HIGH',
      description: 'Website oficial não identificado na busca. Oportunidade para criação de site responsivo moderno com otimização SEO.',
      suggestedService: 'Criação de Website Institucional & Landing Page',
    });
  } else if (
    business.website.includes('facebook.com') ||
    business.website.includes('instagram.com') ||
    business.website.includes('wixsite')
  ) {
    opportunities.push({
      id: 'opp-website-redesign',
      title: 'Redesign e Domínio Próprio',
      category: 'WEB',
      confidence: 'MEDIUM',
      description: 'Estabelecimento utilizando perfil social ou plataforma gratuita como site principal. Vale verificar proposta de portal próprio.',
      suggestedService: 'Redesign Web com Domínio Próprio',
    });
  }

  // 2. Oportunidade por Categoria Específica (SaaS / Automação / Sistemas)
  if (catLower.includes('barbearia') || catLower.includes('salão') || catLower.includes('estética')) {
    opportunities.push({
      id: 'opp-booking-system',
      title: 'Sistema de Agendamento Online & Notificações',
      category: 'SYSTEM',
      confidence: 'HIGH',
      description: 'Possível oportunidade para implementar agenda digital com confirmação automática de horários via WhatsApp.',
      suggestedService: 'Sistema SaaS de Agendamento & Atendimento',
    });
  } else if (catLower.includes('oficina') || catLower.includes('autopeças') || catLower.includes('mecânica')) {
    opportunities.push({
      id: 'opp-erp-os',
      title: 'Sistema de Gestão de Ordens de Serviço & Estoque',
      category: 'SYSTEM',
      confidence: 'HIGH',
      description: 'Possível oportunidade para sistema web de emissão de OS, controle de peças e financeiro para oficina.',
      suggestedService: 'Sistema Web de Gestão de OS & Financeiro',
    });
  } else if (catLower.includes('clínica') || catLower.includes('dentista') || catLower.includes('médic')) {
    opportunities.push({
      id: 'opp-clinic-portal',
      title: 'Portal do Paciente & Agendamento de Consultas',
      category: 'SYSTEM',
      confidence: 'HIGH',
      description: 'Possível oportunidade para captação de pacientes e formulários de pré-anamnese online.',
      suggestedService: 'Desenvolvimento de Portal de Agendamento Clínico',
    });
  } else if (catLower.includes('restaurante') || catLower.includes('lanchonete') || catLower.includes('pizzaria')) {
    opportunities.push({
      id: 'opp-digital-menu',
      title: 'Cardápio Digital & Automação de Pedidos',
      category: 'AUTOMATION',
      confidence: 'HIGH',
      description: 'Possível oportunidade para sistema de cardápio interativo e integração direta de pedidos no WhatsApp.',
      suggestedService: 'Cardápio Digital & Sistema de Pedidos',
    });
  } else if (catLower.includes('imobiliária') || catLower.includes('corretor')) {
    opportunities.push({
      id: 'opp-realestate-portal',
      title: 'Portal Imobiliário com Filtros & CRM',
      category: 'SYSTEM',
      confidence: 'HIGH',
      description: 'Possível oportunidade para catálogo web de imóveis com busca por bairro e formulário de leads.',
      suggestedService: 'Portal Imobiliário Web & Captação',
    });
  }

  // 3. Automação de Atendimento via WhatsApp
  if (!business.whatsapp && business.phone) {
    opportunities.push({
      id: 'opp-whatsapp-bot',
      title: 'Automação de Atendimento Comercial',
      category: 'AUTOMATION',
      confidence: 'MEDIUM',
      description: 'WhatsApp direto não identificado no cadastro. Oportunidade para implantação de chatbot de triagem de clientes.',
      suggestedService: 'Automação de Atendimento & WhatsApp API',
    });
  }

  // 4. Otimização SEO & Presença Local
  if (business.rating && business.reviewCount && business.reviewCount >= 30) {
    opportunities.push({
      id: 'opp-seo-local',
      title: 'Otimização SEO Local & Captação de Avaliações',
      category: 'SEO',
      confidence: 'MEDIUM',
      description: 'Empresa com bom volume de avaliações. Vale verificar serviços de SEO técnico e landing page com provas sociais.',
      suggestedService: 'SEO Técnico & Otimização de Perfil Local',
    });
  }

  return opportunities;
}
