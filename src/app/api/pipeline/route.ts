import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ProspectStatus } from '@/types/business';
import { calculateLeadScore } from '@/lib/scoring/lead-score';

const PIPELINE_STAGES: ProspectStatus[] = [
  'NOVO',
  'QUALIFICADO',
  'CONTATAR',
  'CONTATADO',
  'RESPONDEU',
  'INTERESSADO',
  'PROPOSTA',
  'NEGOCIACAO',
  'CLIENTE',
  'SEM_INTERESSE',
  'PERDIDO',
];

export async function GET() {
  try {
    const leads = await prisma.savedLead.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        contacts: { where: { isPrimary: true }, take: 1 },
      },
    });

    const pipeline: Record<string, any[]> = {};
    PIPELINE_STAGES.forEach((stage) => {
      pipeline[stage] = [];
    });

    leads.forEach((lead) => {
      const scoreInfo = calculateLeadScore(lead as any);
      const stage = lead.prospectStatus || 'NOVO';
      if (!pipeline[stage]) pipeline[stage] = [];
      pipeline[stage].push({
        ...lead,
        scoreInfo,
      });
    });

    return NextResponse.json({ success: true, data: pipeline, stages: PIPELINE_STAGES });
  } catch (error) {
    console.error('Erro no GET /api/pipeline:', error);
    return NextResponse.json({ success: true, data: {}, stages: PIPELINE_STAGES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, newStatus } = body;

    if (!leadId || !newStatus) {
      return NextResponse.json(
        { error: 'Lead ID e novo status são obrigatórios.' },
        { status: 400 }
      );
    }

    const existingLead = await prisma.savedLead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    const oldStatus = existingLead.prospectStatus;

    const updated = await prisma.savedLead.update({
      where: { id: leadId },
      data: { prospectStatus: newStatus as ProspectStatus },
    });

    // Registrar histórico da movimentação automaticamente
    await prisma.interaction.create({
      data: {
        leadId,
        type: 'STATUS_CHANGE',
        description: `Lead movido de ${oldStatus} para ${newStatus} no Kanban`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro no POST /api/pipeline:', error);
    return NextResponse.json({ error: 'Falha ao mover estágio do lead.' }, { status: 500 });
  }
}
