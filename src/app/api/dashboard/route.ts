import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateLeadScore } from '@/lib/scoring/lead-score';
import { analyzeLeadOpportunities } from '@/lib/opportunity/opportunity-analyzer';

export async function GET() {
  try {
    let allLeads: any[] = [];
    try {
      allLeads = await prisma.savedLead.findMany({
        orderBy: [{ leadScore: 'desc' }, { updatedAt: 'desc' }],
        include: {
          contacts: { where: { isPrimary: true }, take: 1 },
          followUps: { where: { isCompleted: false }, orderBy: { scheduledAt: 'asc' }, take: 3 },
        },
      });
    } catch (dbErr) {
      console.warn('Alerta DB no GET /api/dashboard:', dbErr);
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Funil de Conversão Real
    const totalFound = allLeads.length;
    const novos = allLeads.filter((l) => l.prospectStatus === 'NOVO').length;
    const qualificados = allLeads.filter((l) => l.prospectStatus === 'QUALIFICADO').length;
    const contatados = allLeads.filter((l) =>
      ['CONTATAR', 'CONTATADO', 'RESPONDEU', 'INTERESSADO', 'PROPOSTA', 'NEGOCIACAO', 'CLIENTE'].includes(
        l.prospectStatus
      )
    ).length;
    const responderam = allLeads.filter((l) =>
      ['RESPONDEU', 'INTERESSADO', 'PROPOSTA', 'NEGOCIACAO', 'CLIENTE'].includes(l.prospectStatus)
    ).length;
    const interessados = allLeads.filter((l) =>
      ['INTERESSADO', 'PROPOSTA', 'NEGOCIACAO', 'CLIENTE'].includes(l.prospectStatus)
    ).length;
    const propostas = allLeads.filter((l) =>
      ['PROPOSTA', 'NEGOCIACAO', 'CLIENTE'].includes(l.prospectStatus)
    ).length;
    const clientes = allLeads.filter((l) => l.prospectStatus === 'CLIENTE').length;
    const semInteresse = allLeads.filter((l) =>
      ['SEM_INTERESSE', 'PERDIDO'].includes(l.prospectStatus)
    ).length;

    // Taxas Comerciais
    const responseRate = contatados > 0 ? Number(((responderam / contatados) * 100).toFixed(1)) : 0;
    const conversionRate = totalFound > 0 ? Number(((clientes / totalFound) * 100).toFixed(1)) : 0;

    // 2. Follow-ups Atrasados e Hoje
    let overdueFollowUpsCount = 0;
    let todayFollowUpsCount = 0;
    try {
      overdueFollowUpsCount = await prisma.followUp.count({
        where: { isCompleted: false, scheduledAt: { lt: startOfToday } },
      });
      todayFollowUpsCount = await prisma.followUp.count({
        where: { isCompleted: false, scheduledAt: { gte: startOfToday, lte: endOfToday } },
      });
    } catch (e) {
      console.warn('Alerta contagem follow-ups:', e);
    }

    // 3. Próximos Melhores Leads (Ranking por LeadScore & Oportunidade)
    const topLeads = allLeads
      .filter((l) => !['CLIENTE', 'SEM_INTERESSE', 'PERDIDO'].includes(l.prospectStatus))
      .slice(0, 5)
      .map((lead) => {
        const scoreInfo = calculateLeadScore(lead);
        const opportunities = analyzeLeadOpportunities(lead);
        return {
          ...lead,
          scoreInfo,
          mainOpportunity: opportunities[0]?.suggestedService || 'Criação de Website Institucional',
        };
      });

    const statusChartData = [
      { name: 'Novos', val: novos, color: '#94a3b8' },
      { name: 'Qualificados', val: qualificados, color: '#64748b' },
      { name: 'Contatados', val: contatados, color: '#3b82f6' },
      { name: 'Respostas', val: responderam, color: '#6366f1' },
      { name: 'Interessados', val: interessados, color: '#a855f7' },
      { name: 'Propostas', val: propostas, color: '#eab308' },
      { name: 'Clientes', val: clientes, color: '#22c55e' },
      { name: 'Perdidos', val: semInteresse, color: '#ef4444' },
    ];

    return NextResponse.json({
      success: true,
      metrics: {
        totalFound,
        novos,
        qualificados,
        contatados,
        responderam,
        interessados,
        propostas,
        clientes,
        semInteresse,
        responseRate,
        conversionRate,
        overdueFollowUpsCount,
        todayFollowUpsCount,
      },
      statusChartData,
      topLeads,
    });
  } catch (error) {
    console.error('Erro no GET /api/dashboard:', error);
    return NextResponse.json({ error: 'Falha ao buscar métricas.' }, { status: 500 });
  }
}
