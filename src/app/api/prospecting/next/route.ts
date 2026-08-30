import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateLeadScore } from '@/lib/scoring/lead-score';
import { analyzeLeadOpportunities } from '@/lib/opportunity/opportunity-analyzer';

export async function GET() {
  try {
    // Busca os melhores leads ainda não convertidos nem desqualificados
    const leads = await prisma.savedLead.findMany({
      where: {
        prospectStatus: {
          in: ['NOVO', 'QUALIFICADO', 'CONTATAR', 'CONTATADO', 'RESPONDEU', 'INTERESSADO'],
        },
      },
      orderBy: [{ priority: 'desc' }, { leadScore: 'desc' }, { updatedAt: 'desc' }],
      take: 10,
    });

    if (leads.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    // Selecionar o primeiro lead da fila ranqueada
    const nextLead = leads[0];
    const scoreInfo = calculateLeadScore(nextLead as any);
    const opportunities = analyzeLeadOpportunities(nextLead as any);

    return NextResponse.json({
      success: true,
      data: {
        ...nextLead,
        scoreInfo,
        opportunities,
      },
    });
  } catch (error) {
    console.error('Erro no GET /api/prospecting/next:', error);
    return NextResponse.json({ success: true, data: null });
  }
}
