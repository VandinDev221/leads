import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateLeadScore } from '@/lib/scoring/lead-score';
import { analyzeLeadOpportunities } from '@/lib/opportunity/opportunity-analyzer';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.savedLead.findUnique({
      where: { id: params.id },
      include: {
        contacts: { orderBy: { isPrimary: 'desc' } },
        interactions: { orderBy: { createdAt: 'desc' } },
        followUps: { orderBy: { scheduledAt: 'asc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
        proposals: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    const scoreInfo = calculateLeadScore(lead as any);
    const opportunities = analyzeLeadOpportunities(lead as any);

    return NextResponse.json({
      success: true,
      data: {
        ...lead,
        scoreInfo,
        opportunities,
      },
    });
  } catch (error) {
    console.error('Erro no GET /api/leads/[id]:', error);
    return NextResponse.json({ error: 'Falha ao buscar detalhes do lead.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      prospectStatus,
      priority,
      notes,
      nextContactAt,
      lastContactedAt,
      salesPotential,
      isFavorite,
    } = body;

    const existingLead = await prisma.savedLead.findUnique({
      where: { id: params.id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    const updatedLead = await prisma.savedLead.update({
      where: { id: params.id },
      data: {
        prospectStatus: prospectStatus || undefined,
        priority: priority || undefined,
        notes: notes !== undefined ? notes : undefined,
        nextContactAt: nextContactAt ? new Date(nextContactAt) : undefined,
        lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
        salesPotential: salesPotential || undefined,
        isFavorite: isFavorite !== undefined ? isFavorite : undefined,
      },
    });

    // Se o status mudou, registrar automaticamente na timeline de interações
    if (prospectStatus && prospectStatus !== existingLead.prospectStatus) {
      await prisma.interaction.create({
        data: {
          leadId: params.id,
          type: 'STATUS_CHANGE',
          description: `Status alterado de ${existingLead.prospectStatus} para ${prospectStatus}`,
        },
      });
    }

    const scoreInfo = calculateLeadScore(updatedLead as any);
    const opportunities = analyzeLeadOpportunities(updatedLead as any);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedLead,
        scoreInfo,
        opportunities,
      },
    });
  } catch (error) {
    console.error('Erro no PATCH /api/leads/[id]:', error);
    return NextResponse.json({ error: 'Falha ao atualizar lead.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.savedLead.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Lead removido com sucesso.' });
  } catch (error) {
    console.error('Erro no DELETE /api/leads/[id]:', error);
    return NextResponse.json({ error: 'Falha ao remover lead.' }, { status: 500 });
  }
}
